---
name: plan-pruebas-manuales
description: 'Genera una hoja de cálculo Excel con el plan de pruebas manuales de la aplicación: conjuntos de pruebas (casos) organizados por módulo y trazados a las historias de usuario del PRD, donde cada paso a ejecutar y su resultado esperado ocupan una fila propia dentro del caso. Incluye hoja de resumen con contadores por estado, prioridad y módulo, y columnas de seguimiento (Estado, Observaciones, Probado por, Fecha) para que una persona pueda ejecutar las pruebas paso a paso y marcar el resultado. Úsalo cuando el usuario quiera crear, actualizar o ampliar un plan de pruebas manual, una hoja de casos de prueba, o un documento para que QA o el propio equipo valide la aplicación a mano.'
argument-hint: 'Módulo o alcance de las pruebas (opcional, por defecto: todo el PRD) y nombre del fichero de salida (opcional, por defecto: docs/plan-pruebas.xlsx)'
---

# Skill: Plan de Pruebas Manuales — Hoja de Cálculo

## Cuándo usar este skill

- El usuario pide "un plan de pruebas", "una hoja de casos de prueba", "un Excel para probar la app a mano"
- Se ha completado una funcionalidad y hay que preparar su validación manual antes de entregar
- Se quiere dar a alguien (QA, cliente, el propio desarrollador) una lista ejecutable de acciones y resultados esperados
- Se necesita ampliar un plan de pruebas existente con los casos de una nueva feature

Este skill genera pruebas **manuales** (ejecutadas por una persona, con seguimiento de Pasa/Falla), no tests automatizados. Para tests automatizados usar el skill `tests-unitarios` o las suites de xUnit/Vitest/Playwright del proyecto.

---

## Procedimiento

### Paso 1 — Leer el contexto funcional

Leer, en este orden, para extraer los casos de prueba:

1. [`docs/PRD-TaskFlow-Completo.md`](../../docs/PRD-TaskFlow-Completo.md) — sección **6. Historias de Usuario** (cada HU-XXX con sus Criterios de Aceptación es la fuente principal de casos), sección **7. Requisitos Funcionales**, sección **10. API REST** y sección **11. Requisitos No Funcionales**.
2. [`docs/analisis-diseño.md`](../../docs/analisis-diseño.md) — sección **4. Modelo de datos** (reglas de negocio y validaciones a probar) y sección **5. Endpoints API REST**.
3. [`.github/copilot-instructions.md`](../copilot-instructions.md) — comportamientos transversales a probar siempre: búsqueda/filtros sin recarga, estados de carga/error/vacío, confirmación antes de eliminar, accesibilidad básica, responsive.

Si el usuario indica un módulo o feature concreta (p. ej. "pruebas para la asignación de usuarios"), limitar el plan a esa historia/feature y a sus reglas de negocio asociadas. Si no indica nada, cubrir **todas** las historias de usuario vigentes del PRD.

### Paso 2 — Verificar dependencia Python

```bash
C:\Users\hispa\AppData\Local\Python\bin\python.exe -c "import openpyxl; print(openpyxl.__version__)"
```

Si falla: `pip install openpyxl`

### Paso 3 — Diseñar los conjuntos de pruebas antes de escribir el script

Por cada historia de usuario / requisito funcional relevante, derivar **conjuntos de pruebas** (casos) que cubran:

- **Caso feliz**: el flujo principal descrito en el criterio de aceptación.
- **Validación**: campos obligatorios vacíos, formatos inválidos, límites de longitud.
- **Negativo / borde**: IDs inexistentes, valores límite (fecha de vencimiento pasada, prioridad no válida), acciones repetidas (completar una tarea ya completada).
- **Transversal** (una sola vez por módulo, no por historia): estado vacío, estado de carga, estado de error de red, confirmación de eliminación, accesibilidad por teclado, comportamiento responsive.

Cada conjunto de pruebas se descompone en **pasos secuenciales** (normalmente 2 a 5). Cada paso debe tener su propio resultado esperado observable — no agrupar varios pasos bajo un único resultado final. Un paso típico es: una acción concreta + lo que debe verse o suceder inmediatamente después de ejecutarla. El último paso suele contener la verificación funcional principal del caso, pero los pasos intermedios (abrir formulario, rellenar campo, aplicar filtro) también deben declarar qué se espera ver en ese momento.

No inventar funcionalidad que no esté en el PRD ni añadir casos fuera del alcance documentado (p. ej. no crear casos de login si el PRD excluye autenticación).

### Paso 4 — Generar el script `docs/generar_plan_pruebas.py`

Crear (o sobreescribir si ya existe) el script siguiendo la **Sección: Estructura del Excel**. Ejecutarlo al terminar:

```bash
C:\Users\hispa\AppData\Local\Python\bin\python.exe docs/generar_plan_pruebas.py
```

El fichero de salida por defecto es `docs/plan-pruebas.xlsx`. Si el usuario pidió ampliar un plan existente, cargar el fichero con `openpyxl.load_workbook` y añadir filas nuevas a continuación de las existentes en vez de regenerar todo el libro desde cero (conservar los IDs y estados ya registrados).

---

## Estructura del Excel

El workbook tiene **2 hojas**, en este orden:

### Hoja 1 — `Resumen`

**Propósito:** vista rápida del estado de ejecución del plan.

**Contenido:**
- Fila 1: título "Plan de Pruebas — TaskFlow" (merge A1:F1, fondo `#1E2761`, texto blanco, 18pt bold)
- Fila 2: subtítulo con fecha de generación y versión del PRD referenciada
- Bloque de **contadores por estado** (tarjetas 22pt bold, colores semáforo), con fórmulas `COUNTIF` contra la columna Estado de la hoja `Casos de Prueba`. Como el Estado está fusionado a nivel de caso (una sola celda con valor por cada conjunto de pruebas, el resto de filas de pasos quedan vacías por el merge), `COUNTIF`/`COUNTA` sobre esa columna cuentan casos, no pasos:
  - Total de casos → `=COUNTA('Casos de Prueba'!A5:A9999)` contando solo las celdas de ID no vacías (una por caso, gracias al merge)
  - Pendientes → `=COUNTIF('Casos de Prueba'!L:L,"Pendiente")`
  - Aprobados → `=COUNTIF('Casos de Prueba'!L:L,"Aprobado")` en verde
  - Fallidos → `=COUNTIF('Casos de Prueba'!L:L,"Fallido")` en rojo
  - Bloqueados → `=COUNTIF('Casos de Prueba'!L:L,"Bloqueado")` en naranja
  - % completado → `=(Aprobados+Fallidos)/Total` formato `0.0%`
- Tabla de **conteo por módulo**: Módulo | Nº de casos | Aprobados | Fallidos | Pendientes (fórmulas `COUNTIFS` combinando columna Módulo y Estado; al estar fusionadas a nivel de caso, cuentan casos y no pasos)
- Leyenda de colores de Estado y Prioridad

**Reglas de diseño:**
- `ws.sheet_view.showGridLines = False`
- Fuente Arial en todo el libro

---

### Hoja 2 — `Casos de Prueba`

**Propósito:** listado ejecutable de **conjuntos de pruebas**, agrupados por módulo con una fila de sección antes de cada grupo. A diferencia de un listado plano, **cada conjunto de pruebas ocupa varias filas — una por paso** — y cada paso tiene su propio resultado esperado en la misma fila. Las columnas que son propiedades del caso completo (no de un paso concreto) se fusionan verticalmente (`merge_cells`) a lo largo de todas las filas de pasos de ese caso.

**Columnas (en orden):**

| Col | Cabecera | Nivel | Contenido |
|-----|----------|-------|-----------|
| A | ID Caso | Caso (fusionada) | `TC-<MÓDULO>-001`, correlativo por módulo |
| B | Módulo | Caso (fusionada) | Área funcional (Tareas, Usuarios, Búsqueda y Filtros, Transversal…) |
| C | Historia / Requisito | Caso (fusionada) | Referencia a HU-XXX o al requisito funcional del PRD |
| D | Escenario | Caso (fusionada) | Título corto del caso (una frase) |
| E | Precondiciones | Caso (fusionada) | Estado previo necesario (p. ej. "Existe al menos una tarea completada") |
| F | Nº Paso | Paso | Correlativo dentro del caso: 1, 2, 3… |
| G | Acción | Paso | Una única acción concreta a ejecutar en ese paso |
| H | Datos de prueba | Paso | Valores concretos a usar en ese paso, si aplica (puede quedar vacío) |
| I | Resultado esperado | Paso | Lo que debe observarse inmediatamente después de ejecutar ese paso, sin ambigüedad |
| J | Prioridad | Caso (fusionada) | `Alta` / `Media` / `Baja` — texto con color semáforo (rojo/ámbar/gris) |
| K | Tipo | Caso (fusionada) | `Funcional` / `Validación` / `Negativo` / `Transversal` |
| L | Estado | Caso (fusionada) | `Pendiente` (por defecto) / `Aprobado` / `Fallido` / `Bloqueado` / `No aplica` — con `DataValidation` (lista desplegable) y relleno de color según valor. Es el resultado global del caso, se marca una vez ejecutados todos sus pasos |
| M | Observaciones | Caso (fusionada) | Vacío, para que QA anote incidencias o el nº de bug |
| N | Probado por | Caso (fusionada) | Vacío |
| O | Fecha | Caso (fusionada) | Vacío, formato de fecha |

**Cabecera (fila 4):** fondo `#2E75B6`, texto blanco, bold. `freeze_panes = "A5"`.

**Fila de sección por módulo** (antes de cada grupo, merge A:O): fondo `#404040`, texto blanco, bold, con el nombre del módulo.

**Fusión vertical de columnas a nivel de caso:** para cada conjunto de pruebas con N pasos (N filas), fusionar con `ws.merge_cells(start_row=fila_inicio, end_row=fila_inicio+N-1, start_column=c, end_column=c)` las columnas A, B, C, D, E, J, K, L, M, N, O. Escribir el valor una sola vez en la celda superior de cada rango fusionado (openpyxl exige escribir solo en la celda top-left). Aplicar borde y relleno a **todas** las celdas del rango fusionado, no solo a la superior, para que el recuadro se vea completo.

**Formato condicional / relleno fijo de la columna Estado (L):**
- `Pendiente` → fondo `#F4F4F4`, texto negro
- `Aprobado` → fondo `#00B050`, texto blanco
- `Fallido` → fondo `#C00000`, texto blanco
- `Bloqueado` → fondo `#FF8C00`, texto negro
- `No aplica` → fondo `#D9D9D9`, texto negro, itálica

Aplicar esto con una `DataValidation` de tipo lista (`formula1='"Pendiente,Aprobado,Fallido,Bloqueado,No aplica"'`) sobre la celda superior (fusionada) de la columna L de cada caso, dejando el valor por defecto `Pendiente`. El color de fondo debe fijarse en el momento de escribir la fila (no requiere formato condicional dinámico, ya que el estado inicial siempre es "Pendiente"); si se quiere que el color cambie al editar manualmente en Excel, añadir además `ConditionalFormatting` con reglas `CellIsRule` por cada valor.

**Prioridad (columna J):** texto en color, sin relleno — `Alta`=`#C00000` bold, `Media`=`#FF8C00`, `Baja`=`#808080`.

**Otras reglas:**
- Filas alternas **por caso completo** (todas las filas de pasos de un mismo caso comparten el mismo color de fondo): `#EBF3FB` / `#FFFFFF`, alternando caso a caso dentro de cada módulo
- Altura de fila normal (no hace falta ampliarla mucho, ya que cada fila contiene un solo paso, no una lista completa)
- Ancho de columnas orientativo: ID Caso=14, Módulo=16, Historia=16, Escenario=26, Precondiciones=24, Nº Paso=8, Acción=36, Datos de prueba=22, Resultado esperado=32, Prioridad=10, Tipo=12, Estado=12, Observaciones=22, Probado por=14, Fecha=12
- Bordes finos `Side(style="thin", color="CCCCCC")` en todas las celdas de datos, incluidas las fusionadas

---

## Paleta de colores

```python
C_AZUL_OSC  = "1E2761"   # Título principal
C_AZUL_MED  = "2E75B6"   # Cabecera de tabla
C_AZUL_PAL  = "EBF3FB"   # Filas alternas
C_GRIS_SEC  = "404040"   # Fila de sección por módulo
C_VERDE     = "00B050"   # Aprobado / prioridad baja
C_NARANJA   = "FF8C00"   # Bloqueado / prioridad media
C_ROJO      = "C00000"   # Fallido / prioridad alta
C_GRIS_CLAR = "F4F4F4"   # Pendiente / fondos neutros
C_GRIS_NA   = "D9D9D9"   # No aplica
C_BLANCO    = "FFFFFF"
```

---

## Fichero de salida

```
docs/plan-pruebas.xlsx
```

Si el fichero ya existe y el usuario pide **añadir** casos de una nueva feature, cargarlo y añadir filas conservando el resto del contenido. Si el usuario pide **regenerar** el plan completo, sobreescribirlo tras confirmar que no se perderá seguimiento de ejecución ya registrado (columnas Estado/Observaciones/Probado por/Fecha con datos).

---

## Ejemplo de invocación

- "genera el plan de pruebas manuales de TaskFlow"
- "crea una hoja de casos de prueba para la asignación de usuarios"
- "amplía el plan de pruebas con los casos de la nueva feature de recordatorios"
- "quiero un Excel para que alguien pruebe la app a mano y marque qué falla"
