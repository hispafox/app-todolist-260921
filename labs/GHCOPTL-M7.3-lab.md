---
submódulo: M7.3
tipo: lab
tipo-lab: construcción
título: "Lab M7.3 — El molde, no la copia"
base: "temario/GHCOPTL-M7.3-el-circulo-virtuoso.md"
rama-referencia: "submodulo-7.3/circulo-virtuoso"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M7.3 — El molde, no la copia

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M7.3 — El círculo virtuoso](../temario/GHCOPTL-M7.3-el-circulo-virtuoso.md)

En el capítulo leíste que un fallo repetido en varios ficheros del mismo skill es, en realidad, un solo fallo: el del molde que los fabricó. Aquí le das a tu auditor la capacidad de verlo así, y usas lo que encuentra para corregir ese molde de verdad.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Dale al auditor el dato que le faltaba
- **Ejercicio 2** — Arregla el molde
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — busca tu propio patrón
- **Lo que has practicado + puente al Lab 7.4**

---

## Overview

Al terminar este lab sabrás **ampliar un agente ya construido con una capacidad nueva**, que correlacione cada hallazgo con el skill que lo generó, y **usar esa correlación para corregir el molde**: el `SKILL.md` que fabrica el código.

El detalle conceptual está en la base del capítulo: por qué un fallo repetido señala el molde de origen, qué es un poka-yoke, y por qué corregir el molde no borra el trabajo de arreglar lo ya construido. Este lab amplía el agente y aplica la corrección real.

> ⏱️ Tiempo estimado: 30-40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Del lab 7.2 te traes el auditor ya montado y su informe en `docs/auditoria-<fecha>.md`, con al menos un hallazgo repetido en varios ficheros de la misma capa. Si seguiste el lab tal cual, el candidato natural es el `AsNoTracking` que falta en tu `logica-negocio`. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Dale al auditor el dato que le faltaba

*El auditor de 7.2 ya encontraba fallos, pero no los cruzaba con el molde que los produjo. Esa capacidad se la das aquí, con el mismo encargo que se hizo en clase.*

### Tarea 1.1 — Encárgale la nueva capacidad

1. En modo agente, pídeselo tal como se pidió en clase:

   > **«Dado que el desarrollo parte de un plan en el que se indican los skills a utilizar, si el resultado no es aceptable por parte del auditor de calidad, incluir qué cambios habría que realizar en los skills para que el resultado fuera consistente. Modifica el agente auditor para incorporar este análisis. De paso, audita los skills y agrega esta parte al informe final.»**

   → **Qué esperar:** GitHub Copilot abre tu `auditor-calidad.agent.md` y le añade una sección nueva de proceso (la que en la demo del curso se numera §9.5, «análisis de origen»): busca tus ficheros `docs/plan-*.md`, identifica qué skill generó cada capa, y correlaciona cada hallazgo del informe con el skill responsable. De paso, es probable que ya audite tus skills actuales y añada esa sección al informe.

   🔎 **Por qué este encargo.** Le pides que **cruce** lo que ya sabe (los hallazgos de 7.2) con un dato que ya tenía delante y no usaba: qué plan usó qué skill. La mejora está en conectar dos cosas que ya tenías por separado, más que en auditar de nuevo.

### Tarea 1.2 — Verifica el cruce, y súbelo

2. Comprueba con la misma pregunta real de aquella sesión:

   > **«En el informe se ha detectado lo del AsNoTracking. ¿El agente auditor cruza esto con el skill que lo crea para agregarlo al skill? ¿Lo has verificado?»**

   → **Qué esperar:** GitHub Copilot te confirma (o corrige, si algo quedó a medias) que el hallazgo del `AsNoTracking` aparece en el informe etiquetado con su skill responsable: `logica-negocio`.

3. Sube el resultado:

   > **«Sube los cambios.»**

---

## Ejercicio 2 — Arregla el molde

*Aquí tocas el `SKILL.md` que generó todos los ficheros con el fallo, de una sola vez.*

### Tarea 2.1 — Pregunta qué cambios propone

1. Pídele que te lo explique en claro:

   > **«¿Me dices qué cambios has hecho en los skills?»**

   → **Qué esperar:** aunque la pregunta suena a algo ya hecho, el auditor todavía no ha tocado ningún `SKILL.md`; te devuelve un resumen de las reglas que **recomienda**, a la espera de tu aprobación: típicamente en `logica-negocio` (la regla de `AsNoTracking()`), y si tu implementación repite el hueco de 6.4-7.2 sobre las FKs, también en `validaciones` y `dto`.

### Tarea 2.2 — Aplica el cambio al molde

2. Dale luz verde y súbelo:

   > **«Sí, aplica los cambios y sube a GitHub.»**

   → **Qué esperar:** tu `.github/skills/logica-negocio/SKILL.md` gana una regla concreta: dónde va `AsNoTracking()` y en qué métodos no. Nada de notas vagas. Ábrelo y compáralo con el de la demo:

   ```diff
   + - **`AsNoTracking()` en consultas de solo lectura**: añadir `.AsNoTracking()`
   +   inmediatamente después del `DbSet<T>` en los métodos que solo leen datos.
   +   No añadirlo en `CrearAsync`, `ActualizarAsync` ni `EliminarAsync`.
   ```

   💡 **Pista.** Si tu auditor también marcó las FKs sin validar o los DTOs sin anotaciones, pídele el mismo tratamiento para `validaciones` y `dto`. Son los otros dos skills que se corrigieron en la demo, a raíz de exactamente los mismos hallazgos que ya viste en el lab 7.2.

### Tarea 2.3 — Regenera con el molde corregido, y compruébalo

3. Pídele a GitHub Copilot que use el skill `logica-negocio` ya corregido para regenerar (o repasar) uno de tus métodos de solo lectura.

   → **Qué esperar:** el método sale ya con `AsNoTracking()` puesto, sin que se lo pidas aparte:

   ```csharp
   public async Task<IEnumerable<Categoria>> ObtenerTodosAsync()
       => await _contexto.Categorias.AsNoTracking().ToListAsync();
   ```

   🔎 **Esto es la prueba de que el círculo se cerró.** Corregiste el molde, y el molde ya produce bien el método. Audita ese fichero otra vez si quieres verlo confirmado en el informe: el hallazgo que antes salía debería haber desaparecido.

---

## Definition of Done

Este capítulo entrega una mejora al agente y una corrección al skill. Lo has terminado cuando:

- [ ] Tu auditor tiene la capacidad de correlacionar cada hallazgo con el skill que lo generó, leyendo tus planes `docs/plan-*.md`.
- [ ] Tu `SKILL.md` de `logica-negocio` (y, si aplica, `validaciones`/`dto`) tiene la regla nueva que corrige el patrón que el auditor encontró.
- [ ] Has regenerado o revisado un método con el skill corregido, y sale ya bien de fábrica.
- [ ] Sabes que esa corrección no repara sola los métodos que ya tenías construidos con el mismo hueco (`UsuarioAsignadoLogica`, `PlantillaLogica`, `TodoLogica`...): esos los repasas tú, aparte, aunque sea con la regla nueva delante para saber justo qué falta.
- [ ] Sabes explicar la diferencia entre arreglar un fichero y arreglar el skill que lo genera.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-7.3/circulo-virtuoso`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-7.3/circulo-virtuoso
```

Abre sus tres `SKILL.md` corregidos (`logica-negocio`, `validaciones`, `dto`) y ponlos al lado de los tuyos. No hace falta que la redacción coincida palabra por palabra, pero la regla de fondo sí: `AsNoTracking()` en los métodos de solo lectura, validación de existencia para cada FK nueva, y anotaciones automáticas en los DTOs de entrada.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — busca tu propio patrón

Abre tu informe de auditoría completo y revisa si hay algún otro hallazgo que se repita en varios ficheros del mismo skill; no tiene por qué ser de los tres que viste aquí. Si lo encuentras, decide tú la regla que le falta al molde, pídesela a GitHub Copilot para ese skill, y regenera algo con él para comprobar que sale ya corregido.

---

## Lo que has practicado

Le has dado a tu auditor una capacidad que no tenía: cruzar cada hallazgo con el molde que lo produjo. Y has usado esa capacidad para cerrar el bucle entero: detectar el patrón, corregir el skill, regenerar y comprobar que el fallo ya no sale. Los skills que montaste en M04 no se quedan quietos: cada auditoría los deja un poco mejor que antes.

**Puente al Lab 7.4.** Fíjate en cuánto de este trabajo ha sido ir llamando tú a un agente detrás de otro: el planificador, el desarrollador, el verificador, el auditor, y ahora tú mismo, corrigiendo el skill. Cada uno hace bien su parte, pero coordinarlos ha sido cosa tuya en cada paso. En el Lab 7.4 montas al **orquestador**, el agente cuyo trabajo es precisamente ese: llamar a los demás en el orden correcto, sin que tengas que hacerlo tú.
