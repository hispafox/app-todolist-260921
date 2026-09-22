"""Genera docs/plan-pruebas.xlsx: plan de pruebas manuales de TaskFlow.

Cada conjunto de pruebas (caso) ocupa varias filas -una por paso-, con las
columnas propias del caso (ID, módulo, prioridad, tipo, estado...) fusionadas
verticalmente. Fuente de los casos: docs/PRD-TaskFlow-Completo.md
(HU-001..HU-007, RF-001..RF-010, requisitos no funcionales) y
docs/analisis-diseño.md (modelo AppUser/asignación, endpoints, reglas de
negocio). Ejecutar con:

    C:\\Users\\hispa\\AppData\\Local\\Python\\bin\\python.exe docs/generar_plan_pruebas.py
"""

from datetime import date
from pathlib import Path

from openpyxl import Workbook
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

OUTPUT_PATH = Path(__file__).parent / "plan-pruebas.xlsx"

# --- Paleta ---------------------------------------------------------------
C_AZUL_OSC = "1E2761"
C_AZUL_MED = "2E75B6"
C_AZUL_PAL = "EBF3FB"
C_GRIS_SEC = "404040"
C_VERDE = "00B050"
C_NARANJA = "FF8C00"
C_ROJO = "C00000"
C_GRIS_CLAR = "F4F4F4"
C_GRIS_NA = "D9D9D9"
C_BLANCO = "FFFFFF"

FONT_NAME = "Arial"
THIN = Side(style="thin", color="CCCCCC")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)

ESTADOS = ["Pendiente", "Aprobado", "Fallido", "Bloqueado", "No aplica"]
ESTADO_COLORS = {
    "Pendiente": (C_GRIS_CLAR, "000000", False),
    "Aprobado": (C_VERDE, C_BLANCO, False),
    "Fallido": (C_ROJO, C_BLANCO, False),
    "Bloqueado": (C_NARANJA, "000000", False),
    "No aplica": (C_GRIS_NA, "000000", True),
}
PRIORIDAD_COLORS = {
    "Alta": C_ROJO,
    "Media": C_NARANJA,
    "Baja": "808080",
}

# Columnas de la hoja "Casos de Prueba"
# (cabecera, ancho, nivel) — nivel "caso" se fusiona verticalmente, "paso" es por fila
COLUMNS = [
    ("ID Caso", 14, "caso"),
    ("Módulo", 16, "caso"),
    ("Historia / Requisito", 16, "caso"),
    ("Escenario", 26, "caso"),
    ("Precondiciones", 24, "caso"),
    ("Nº Paso", 8, "paso"),
    ("Acción", 36, "paso"),
    ("Datos de prueba", 22, "paso"),
    ("Resultado esperado", 32, "paso"),
    ("Prioridad", 10, "caso"),
    ("Tipo", 12, "caso"),
    ("Estado", 12, "caso"),
    ("Observaciones", 22, "caso"),
    ("Probado por", 14, "caso"),
    ("Fecha", 12, "caso"),
]
COL_ID, COL_MODULO, COL_HISTORIA, COL_ESCENARIO, COL_PRECOND = 1, 2, 3, 4, 5
COL_NPASO, COL_ACCION, COL_DATOS, COL_RESULTADO = 6, 7, 8, 9
COL_PRIORIDAD, COL_TIPO, COL_ESTADO, COL_OBS, COL_PROBADO, COL_FECHA = 10, 11, 12, 13, 14, 15
CASO_COLS = [COL_ID, COL_MODULO, COL_HISTORIA, COL_ESCENARIO, COL_PRECOND,
             COL_PRIORIDAD, COL_TIPO, COL_ESTADO, COL_OBS, COL_PROBADO, COL_FECHA]

# --- Conjuntos de pruebas, agrupados por módulo ---------------------------
# Cada caso: (escenario, historia, precondiciones, prioridad, tipo, pasos)
# Cada paso: (accion, datos_de_prueba, resultado_esperado)
MODULOS = [
    ("Gestión de tareas — Crear", [
        (
            "Crear tarea solo con título obligatorio", "HU-001 / RF-001",
            "La aplicación está abierta con la lista de tareas visible.", "Alta", "Funcional",
            [
                ("Abrir el formulario de nueva tarea.", "—",
                 "El formulario se muestra con el campo título vacío, listo para escribir."),
                ("Escribir el título sin rellenar el resto de campos.", "Título: 'Revisar informe mensual'",
                 "El campo título muestra el texto introducido; el formulario permite guardar sin el resto de campos."),
                ("Guardar la tarea.", "—",
                 "La tarea se crea, aparece inmediatamente en la lista sin recargar la página y sigue presente tras refrescar (persistida en SQLite)."),
            ],
        ),
        (
            "Crear tarea con todos los campos", "HU-001 / RF-001",
            "La aplicación está abierta con la lista de tareas visible.", "Alta", "Funcional",
            [
                ("Abrir el formulario de nueva tarea.", "—",
                 "El formulario muestra todos los campos disponibles: título, descripción, prioridad, categoría, vencimiento y usuario asignado."),
                ("Rellenar título, descripción, prioridad, categoría, fecha de vencimiento y usuario asignado.",
                 "Título: 'Preparar demo'; Prioridad: Alta; Categoría: 'Formación'; Vencimiento: fecha futura; Asignado: usuario existente",
                 "Todos los campos aceptan y muestran los valores introducidos sin errores de validación."),
                ("Guardar la tarea.", "—",
                 "La tarea se crea y aparece en la lista con las etiquetas visibles de prioridad, categoría, vencimiento y usuario asignado."),
            ],
        ),
        (
            "Intentar crear tarea sin título", "HU-001 / RF-001 / RF-010",
            "La aplicación está abierta con el formulario de nueva tarea.", "Alta", "Validación",
            [
                ("Dejar el campo título vacío.", "Título: '' (vacío)",
                 "El campo título aparece vacío; el resto de campos son opcionales."),
                ("Intentar guardar sin escribir ningún título.", "—",
                 "El formulario muestra un error de validación indicando que el título es obligatorio; no se crea la tarea ni se llama a la API."),
            ],
        ),
        (
            "Intentar crear tarea con título solo espacios", "HU-001 / Reglas de negocio del modelo",
            "La aplicación está abierta con el formulario de nueva tarea.", "Media", "Validación",
            [
                ("Escribir únicamente espacios en el campo título.", "Título: '   '",
                 "El campo admite la entrada de espacios sin mostrar error inmediato."),
                ("Intentar guardar la tarea.", "—",
                 "El formulario rechaza el título por considerarlo vacío (solo espacios); no se crea la tarea."),
            ],
        ),
    ]),
    ("Gestión de tareas — Editar", [
        (
            "Editar todos los campos de una tarea existente", "HU-002 / RF-002",
            "Existe al menos una tarea creada.", "Alta", "Funcional",
            [
                ("Abrir una tarea existente para editar.", "—",
                 "El formulario de edición se muestra precargado con los valores actuales de la tarea."),
                ("Cambiar título, descripción, prioridad, categoría, fecha de vencimiento y usuario asignado.",
                 "Nuevos valores distintos a los originales en cada campo",
                 "Cada campo modificado muestra el nuevo valor introducido sin errores de validación."),
                ("Guardar los cambios.", "—",
                 "Los cambios se guardan, se reflejan inmediatamente en la lista y persisten tras recargar la página."),
            ],
        ),
        (
            "Editar tarea dejando el título vacío", "HU-002 / RF-010",
            "Existe al menos una tarea creada.", "Alta", "Validación",
            [
                ("Abrir una tarea existente para editar.", "—",
                 "El formulario muestra el título actual de la tarea."),
                ("Borrar completamente el contenido del campo título.", "Título: '' (vacío)",
                 "El campo título queda vacío."),
                ("Intentar guardar los cambios.", "—",
                 "El formulario muestra un error de validación y no guarda el cambio; la tarea conserva su título anterior al recargar."),
            ],
        ),
        (
            "Editar tarea con Id inexistente (acceso directo)", "RF-002",
            "Se conoce un Id de tarea que no existe (por ejemplo, uno ya eliminado).", "Media", "Negativo",
            [
                ("Intentar consultar o editar una tarea usando un Id que no existe (por API o navegación directa).",
                 "Id inexistente, p. ej. 999999",
                 "La operación no permite cargar datos de una tarea inexistente."),
                ("Comprobar la respuesta de la aplicación/API.", "—",
                 "La API devuelve 404 y la interfaz muestra un mensaje de 'tarea no encontrada' sin romper la aplicación."),
            ],
        ),
    ]),
    ("Gestión de tareas — Completar y reabrir", [
        (
            "Marcar una tarea pendiente como completada", "HU-003 / RF-004",
            "Existe una tarea pendiente.", "Alta", "Funcional",
            [
                ("Localizar una tarea pendiente en la lista.", "—",
                 "La tarea se muestra con estado pendiente y la acción de completar disponible."),
                ("Marcar la tarea como completada.", "—",
                 "El estado cambia a completado, la tarea se muestra tachada/con menor contraste y el cambio persiste tras recargar."),
            ],
        ),
        (
            "Reabrir una tarea completada", "HU-004 / RF-005",
            "Existe una tarea completada.", "Alta", "Funcional",
            [
                ("Localizar una tarea completada.", "—",
                 "La tarea se muestra tachada/con menor contraste y con la acción de reabrir disponible."),
                ("Reabrir la tarea.", "—",
                 "El estado vuelve a pendiente, la tarea deja de mostrarse tachada y el cambio persiste tras recargar."),
            ],
        ),
        (
            "Completar una tarea ya completada", "HU-003",
            "Existe una tarea ya marcada como completada.", "Baja", "Negativo",
            [
                ("Localizar una tarea ya marcada como completada.", "—",
                 "La tarea se muestra como completada."),
                ("Intentar volver a marcarla como completada.", "—",
                 "La operación no produce error visible ni duplica el efecto; la tarea permanece completada."),
            ],
        ),
    ]),
    ("Gestión de tareas — Eliminar", [
        (
            "Eliminar una tarea con confirmación", "HU-005 / RF-003",
            "Existe al menos una tarea creada.", "Alta", "Funcional",
            [
                ("Pulsar eliminar sobre una tarea.", "—",
                 "La aplicación muestra un diálogo de confirmación antes de eliminar."),
                ("Confirmar la eliminación en el diálogo.", "—",
                 "La tarea desaparece de la lista y de la base de datos; no reaparece al recargar."),
            ],
        ),
        (
            "Cancelar la eliminación de una tarea", "HU-005 / RF-003",
            "Existe al menos una tarea creada.", "Media", "Funcional",
            [
                ("Pulsar eliminar sobre una tarea.", "—",
                 "Se muestra el diálogo de confirmación de eliminación."),
                ("Cancelar el diálogo de confirmación.", "—",
                 "La tarea NO se elimina y sigue visible en la lista tal cual estaba."),
            ],
        ),
        (
            "Eliminar tarea con Id inexistente", "RF-003",
            "Se conoce un Id de tarea que ya no existe.", "Baja", "Negativo",
            [
                ("Intentar eliminar una tarea con un Id inexistente (vía API o repitiendo el borrado dos veces rápido).",
                 "Id inexistente", "La operación se envía contra un recurso que ya no existe."),
                ("Comprobar la respuesta.", "—",
                 "La API devuelve 404 y la interfaz no rompe ni muestra un error genérico no controlado."),
            ],
        ),
    ]),
    ("Organización — Prioridad, categoría y vencimiento", [
        (
            "Asignar cada nivel de prioridad", "Alcance V1 — Organización",
            "Existe al menos una tarea.", "Media", "Funcional",
            [
                ("Editar una tarea y asignar prioridad Baja, guardar.", "Prioridad: Low",
                 "El cambio se guarda y la etiqueta de prioridad Baja se muestra correctamente."),
                ("Editar la misma tarea y asignar prioridad Media, guardar.", "Prioridad: Medium",
                 "El cambio se guarda y la etiqueta de prioridad Media se muestra correctamente."),
                ("Editar la misma tarea y asignar prioridad Alta, guardar.", "Prioridad: High",
                 "El cambio se guarda y la etiqueta de prioridad Alta se muestra correctamente."),
            ],
        ),
        (
            "Crear y asignar una categoría personalizada", "Alcance V1 — Organización",
            "Existe al menos una tarea.", "Media", "Funcional",
            [
                ("Crear o editar una tarea.", "—",
                 "El formulario permite escribir libremente una categoría."),
                ("Escribir una categoría nueva no usada antes y guardar.", "Categoría: 'Formación interna'",
                 "La tarea queda asociada a la categoría escrita."),
                ("Abrir el filtro de categoría.", "—",
                 "La nueva categoría aparece disponible para filtrar junto con el resto."),
            ],
        ),
        (
            "Establecer fecha de vencimiento y ver alerta de atraso", "Alcance V1 — Organización",
            "Existe una tarea pendiente.", "Media", "Funcional",
            [
                ("Editar la tarea y asignar una fecha de vencimiento en el pasado.", "Vencimiento: ayer",
                 "El campo acepta la fecha pasada sin bloquear el guardado."),
                ("Guardar los cambios.", "—",
                 "La tarea muestra una alerta visual de vencimiento atrasado (color coral) sin romper el resto de la interfaz."),
            ],
        ),
        (
            "Crear tarea sin fecha de vencimiento", "Alcance V1 — Organización",
            "La aplicación está abierta con el formulario de nueva tarea.", "Baja", "Funcional",
            [
                ("Crear una tarea dejando el campo de vencimiento vacío.", "DueDate: (vacío)",
                 "La tarea se crea correctamente sin fecha de vencimiento."),
                ("Comprobar la tarea en la lista.", "—",
                 "La tarea aparece en la lista sin ninguna etiqueta de fecha ni alerta de vencimiento."),
            ],
        ),
    ]),
    ("Búsqueda y filtros", [
        (
            "Buscar por texto en el título", "HU-007 / RF-006",
            "Existen varias tareas con títulos distintos.", "Alta", "Funcional",
            [
                ("Escribir en el buscador un texto contenido en el título de una tarea.",
                 "Texto: fragmento del título de una tarea existente",
                 "La lista se actualiza inmediatamente y sin recargar, mostrando solo las tareas cuyo título contiene el texto."),
                ("Borrar el texto de búsqueda.", "—",
                 "La lista vuelve a mostrar todas las tareas sin recargar la página."),
            ],
        ),
        (
            "Buscar por texto contenido solo en la descripción", "HU-007 / RF-006",
            "Existe una tarea cuya descripción contiene una palabra que no está en el título.", "Media", "Funcional",
            [
                ("Escribir en el buscador una palabra que solo aparece en la descripción de una tarea.",
                 "Texto: palabra exclusiva de una descripción",
                 "La tarea aparece en los resultados aunque el texto no esté en el título."),
                ("Comprobar que las tareas sin esa palabra no aparecen en los resultados.", "—",
                 "Solo se muestran las tareas cuya descripción o título contienen el texto buscado."),
            ],
        ),
        (
            "Filtrar por estado (pendientes / completadas / todas)", "HU-006 / RF-007",
            "Existen tareas pendientes y completadas.", "Alta", "Funcional",
            [
                ("Seleccionar el filtro 'Pendientes'.", "—", "Solo se muestran las tareas pendientes."),
                ("Cambiar a 'Completadas'.", "—", "Solo se muestran las tareas completadas."),
                ("Cambiar a 'Todas'.", "—", "Se muestran tanto las tareas pendientes como las completadas."),
            ],
        ),
        (
            "Filtrar por prioridad", "HU-006 / RF-007",
            "Existen tareas con distintas prioridades.", "Media", "Funcional",
            [
                ("Aplicar el filtro de prioridad Alta.", "—", "Solo se muestran las tareas con prioridad Alta."),
                ("Cambiar el filtro a Media.", "—", "Solo se muestran las tareas con prioridad Media."),
                ("Cambiar el filtro a Baja.", "—", "Solo se muestran las tareas con prioridad Baja."),
            ],
        ),
        (
            "Filtrar por categoría", "HU-006 / RF-007",
            "Existen tareas con distintas categorías.", "Media", "Funcional",
            [
                ("Aplicar el filtro por una categoría concreta existente.", "Categoría: una ya usada en alguna tarea",
                 "Solo se muestran las tareas de esa categoría."),
                ("Quitar el filtro de categoría.", "—",
                 "Vuelven a mostrarse las tareas de todas las categorías."),
            ],
        ),
        (
            "Combinar búsqueda de texto con filtros de estado, prioridad y categoría", "HU-006 / HU-007",
            "Existen tareas variadas en estado, prioridad y categoría.", "Media", "Funcional",
            [
                ("Escribir un texto de búsqueda.", "—", "La lista se filtra por el texto introducido."),
                ("Añadir un filtro de estado.", "—",
                 "La lista respeta simultáneamente el texto y el filtro de estado."),
                ("Añadir un filtro de prioridad y/o categoría.", "Combinación de texto + filtros conocida",
                 "El resultado final respeta todas las condiciones combinadas a la vez (texto Y filtros)."),
            ],
        ),
        (
            "Buscar/filtrar sin resultados", "HU-006 / HU-007",
            "La aplicación está abierta con tareas existentes.", "Media", "Funcional",
            [
                ("Escribir un texto de búsqueda que no coincide con ninguna tarea.", "Texto: 'xyzxyz-no-existe'",
                 "Se muestra un estado vacío útil (mensaje claro), no un error ni una pantalla en blanco."),
                ("Borrar el texto de búsqueda.", "—",
                 "La lista completa de tareas vuelve a mostrarse con normalidad."),
            ],
        ),
    ]),
    ("Usuarios — Catálogo y asignación", [
        (
            "Crear un usuario del catálogo", "AppUser / analisis-diseño 4",
            "La aplicación está abierta en la gestión de usuarios.", "Media", "Funcional",
            [
                ("Abrir el gestor de usuarios.", "—",
                 "Se muestra el catálogo de usuarios existentes y el formulario de alta."),
                ("Crear un usuario con nombre, email y color.",
                 "Name: 'Ana Pérez'; Email: 'ana.perez@example.com'; Color: '#2F6F62'",
                 "El usuario se crea y aparece en el catálogo, disponible para asignar en el selector de tareas."),
            ],
        ),
        (
            "Crear usuario con email duplicado", "Reglas de negocio de la asignación (409)",
            "Ya existe un usuario con un email conocido.", "Media", "Negativo",
            [
                ("Comprobar que ya existe un usuario con un email conocido.", "—",
                 "El usuario existente aparece en el catálogo."),
                ("Intentar crear un nuevo usuario usando ese mismo email.", "Email: el mismo de un usuario existente",
                 "La API responde 409 Conflict y la interfaz muestra un aviso de email en uso; no se crea el duplicado."),
            ],
        ),
        (
            "Crear usuario sin nombre o sin email", "Reglas de negocio de la asignación",
            "La aplicación está abierta en la gestión de usuarios.", "Media", "Validación",
            [
                ("Intentar crear un usuario dejando el nombre vacío.", "Name: ''",
                 "El formulario muestra un error de validación y no se crea el usuario."),
                ("Intentar crear un usuario dejando el email vacío.", "Email: ''",
                 "El formulario muestra un error de validación y no se crea el usuario."),
            ],
        ),
        (
            "Asignar una tarea a un usuario existente", "PATCH /api/tasks/{id}/assign",
            "Existe una tarea y al menos un usuario en el catálogo.", "Media", "Funcional",
            [
                ("Editar o asignar directamente una tarea.", "—",
                 "El selector 'Asignada a' muestra el catálogo de usuarios disponibles."),
                ("Seleccionar un usuario del catálogo y guardar.", "Usuario existente del catálogo",
                 "La tarea muestra la insignia del usuario asignado (nombre/color) y el cambio persiste tras recargar."),
            ],
        ),
        (
            "Desasignar una tarea (quitar usuario asignado)", "PATCH /api/tasks/{id}/assign con userId null",
            "Existe una tarea con un usuario asignado.", "Baja", "Funcional",
            [
                ("Editar una tarea que tiene un usuario asignado.", "—",
                 "El formulario muestra el usuario actualmente asignado."),
                ("Quitar el usuario asignado (dejar sin asignar) y guardar.", "AssignedUserId: null",
                 "La tarea deja de mostrar la insignia de usuario asignado y el cambio persiste tras recargar."),
            ],
        ),
        (
            "Asignar una tarea a un usuario inexistente", "Reglas de negocio de la asignación (404)",
            "Se conoce un Id de usuario que no existe.", "Baja", "Negativo",
            [
                ("Intentar asignar una tarea a un Id de usuario inexistente (vía API si la UI no lo permite).",
                 "UserId inexistente, p. ej. 999999", "La API responde 404 Not Found."),
                ("Comprobar el estado de la tarea.", "—",
                 "La tarea no queda asignada a un usuario inválido; conserva su asignación anterior."),
            ],
        ),
        (
            "Eliminar un usuario que tiene tareas asignadas", "ON DELETE SET NULL",
            "Existe un usuario con al menos una tarea asignada.", "Media", "Funcional",
            [
                ("Comprobar que el usuario tiene al menos una tarea asignada.", "—",
                 "La tarea muestra la insignia del usuario antes de eliminarlo."),
                ("Eliminar el usuario desde el gestor de usuarios.", "—",
                 "El usuario se elimina del catálogo."),
                ("Comprobar las tareas que tenía asignadas.", "—",
                 "Las tareas pasan a estar sin asignar; no se eliminan las tareas."),
            ],
        ),
    ]),
    ("Transversal — UX y accesibilidad", [
        (
            "Estado de carga inicial de la lista de tareas", "Requisitos no funcionales — Usabilidad",
            "La aplicación se abre por primera vez en la sesión.", "Baja", "Transversal",
            [
                ("Cargar la aplicación con la red ralentizada (throttling) o justo al arrancar.", "—",
                 "Se muestra un indicador de carga claro mientras se obtienen las tareas, sin contenido roto ni parpadeos."),
                ("Esperar a que termine la carga.", "—",
                 "El indicador de carga desaparece y se muestra la lista de tareas completa."),
            ],
        ),
        (
            "Estado de error al fallar la API", "Requisitos no funcionales — Usabilidad",
            "El backend no está disponible o responde con error.", "Media", "Transversal",
            [
                ("Detener temporalmente el backend o simular un error de red.", "—",
                 "Las siguientes peticiones a la API fallan."),
                ("Intentar cargar o guardar una tarea.", "—",
                 "La interfaz muestra un mensaje de error comprensible en vez de quedarse en blanco o romperse."),
            ],
        ),
        (
            "Estado vacío sin tareas", "Requisitos no funcionales — Usabilidad",
            "No existe ninguna tarea creada (o los filtros no devuelven resultados).", "Baja", "Transversal",
            [
                ("Eliminar todas las tareas o aplicar un filtro sin coincidencias.", "—",
                 "La lista queda sin elementos que mostrar."),
                ("Observar el área de la lista.", "—",
                 "Se muestra un mensaje de estado vacío útil, con indicación de cómo crear la primera tarea o limpiar el filtro."),
            ],
        ),
        (
            "Navegación completa por teclado", "Accesibilidad básica — copilot-instructions",
            "La aplicación está abierta con al menos una tarea.", "Media", "Transversal",
            [
                ("Sin usar el ratón, recorrer con Tab el formulario de alta, los filtros y las acciones de una tarea.",
                 "—", "Todos los controles son alcanzables por teclado, con foco visible en cada elemento."),
                ("Ejecutar una acción (p. ej. completar) usando solo el teclado.", "—",
                 "La acción se ejecuta correctamente igual que con el ratón."),
            ],
        ),
        (
            "Nombre accesible en botones iconográficos", "Accesibilidad básica — copilot-instructions",
            "La aplicación está abierta con al menos una tarea.", "Baja", "Transversal",
            [
                ("Inspeccionar con un lector de pantalla o el árbol de accesibilidad los botones de icono (editar, eliminar, completar).",
                 "—", "Cada botón iconográfico expone un nombre accesible (aria-label o texto oculto) coherente con su acción."),
                ("Pasar el ratón sobre cada botón sin pulsarlo.", "—",
                 "Se muestra un tooltip visual coherente con la acción del botón."),
            ],
        ),
        (
            "Comportamiento responsive en pantalla estrecha", "Requisitos no funcionales — Usabilidad",
            "La aplicación está abierta.", "Media", "Transversal",
            [
                ("Reducir el ancho de la ventana/viewport a un tamaño de móvil.", "Viewport: ~375px de ancho",
                 "El formulario y la lista se apilan en una columna."),
                ("Repetir las acciones de crear, filtrar y completar una tarea en ese ancho.", "—",
                 "Los controles siguen siendo usables y accesibles por teclado, sin overflow horizontal."),
            ],
        ),
    ]),
]


def set_cell(ws, row, col, value, *, bold=False, italic=False, size=11,
             color="000000", fill=None, align="left", valign="top",
             wrap=True, border=True):
    cell = ws.cell(row=row, column=col, value=value)
    cell.font = Font(name=FONT_NAME, bold=bold, italic=italic, size=size, color=color)
    if fill:
        cell.fill = PatternFill("solid", start_color=fill, end_color=fill)
    cell.alignment = Alignment(horizontal=align, vertical=valign, wrap_text=wrap)
    if border:
        cell.border = BORDER
    return cell


def style_only(ws, row, col, *, fill=None, border=True):
    """Aplica relleno/borde a una celda vacía que forma parte de un rango fusionado."""
    cell = ws.cell(row=row, column=col)
    if fill:
        cell.fill = PatternFill("solid", start_color=fill, end_color=fill)
    if border:
        cell.border = BORDER


def build_resumen(wb, modulos_nombres):
    ws = wb.create_sheet("Resumen")
    ws.sheet_view.showGridLines = False
    for col, width in zip("ABCDEF", [22, 18, 18, 18, 18, 18]):
        ws.column_dimensions[col].width = width

    ws.merge_cells("A1:F1")
    set_cell(ws, 1, 1, "Plan de Pruebas Manuales — TaskFlow", bold=True, size=18,
             color=C_BLANCO, fill=C_AZUL_OSC, align="center", border=False)
    ws.row_dimensions[1].height = 30

    ws.merge_cells("A2:F2")
    set_cell(ws, 2, 1,
             f"Generado el {date.today().isoformat()} — trazado a docs/PRD-TaskFlow-Completo.md y docs/analisis-diseño.md",
             italic=True, size=11, color=C_BLANCO, fill=C_AZUL_MED, align="center", border=False)
    ws.row_dimensions[2].height = 20

    # Tarjetas de contadores (fila 4-5). Estado vive en la columna L (fusionada por caso).
    labels = ["Total de casos", "Pendientes", "Aprobados", "Fallidos", "Bloqueados", "% completado"]
    formulas = [
        "=COUNTA('Casos de Prueba'!A5:A9999)",
        "=COUNTIF('Casos de Prueba'!L:L,\"Pendiente\")",
        "=COUNTIF('Casos de Prueba'!L:L,\"Aprobado\")",
        "=COUNTIF('Casos de Prueba'!L:L,\"Fallido\")",
        "=COUNTIF('Casos de Prueba'!L:L,\"Bloqueado\")",
        "=(C5+D5)/A5",
    ]
    colors = [C_AZUL_OSC, "808080", C_VERDE, C_ROJO, C_NARANJA, C_AZUL_MED]
    for idx, (label, formula, color) in enumerate(zip(labels, formulas, colors)):
        col = idx + 1
        set_cell(ws, 4, col, label, bold=True, size=11, color=C_BLANCO, fill=color, align="center")
        cell = set_cell(ws, 5, col, formula, bold=True, size=20, color=color, align="center", fill=C_GRIS_CLAR)
        if label == "% completado":
            cell.number_format = "0.0%"
    ws.row_dimensions[5].height = 34

    # Tabla por módulo (Módulo vive en la columna B, fusionada por caso).
    header_row = 7
    set_cell(ws, header_row, 1, "Conteo por módulo", bold=True, size=13, color=C_BLANCO, fill=C_GRIS_SEC)
    ws.merge_cells(start_row=header_row, start_column=1, end_row=header_row, end_column=6)

    cols = ["Módulo", "Nº casos", "Aprobados", "Fallidos", "Pendientes", "Bloqueados"]
    for c, name in enumerate(cols, start=1):
        set_cell(ws, header_row + 1, c, name, bold=True, color=C_BLANCO, fill=C_AZUL_MED, align="center")

    row = header_row + 2
    for modulo in modulos_nombres:
        set_cell(ws, row, 1, modulo, align="left")
        set_cell(ws, row, 2, f"=COUNTIF('Casos de Prueba'!B:B,\"{modulo}\")", align="center")
        set_cell(ws, row, 3, f"=COUNTIFS('Casos de Prueba'!B:B,\"{modulo}\",'Casos de Prueba'!L:L,\"Aprobado\")", align="center")
        set_cell(ws, row, 4, f"=COUNTIFS('Casos de Prueba'!B:B,\"{modulo}\",'Casos de Prueba'!L:L,\"Fallido\")", align="center")
        set_cell(ws, row, 5, f"=COUNTIFS('Casos de Prueba'!B:B,\"{modulo}\",'Casos de Prueba'!L:L,\"Pendiente\")", align="center")
        set_cell(ws, row, 6, f"=COUNTIFS('Casos de Prueba'!B:B,\"{modulo}\",'Casos de Prueba'!L:L,\"Bloqueado\")", align="center")
        fill = C_AZUL_PAL if (row - header_row) % 2 == 0 else C_BLANCO
        for c in range(1, 7):
            ws.cell(row=row, column=c).fill = PatternFill("solid", start_color=fill, end_color=fill)
        row += 1

    # Leyenda
    legend_row = row + 1
    set_cell(ws, legend_row, 1,
             "Estado — Pendiente: gris | Aprobado: verde | Fallido: rojo | Bloqueado: naranja | No aplica: gris claro. "
             "Prioridad — Alta: rojo | Media: naranja | Baja: gris. Cada caso ocupa una fila por paso; "
             "las columnas de caso (ID, módulo, prioridad, tipo, estado...) están fusionadas verticalmente.",
             italic=True, size=10, border=False, align="left")
    ws.merge_cells(start_row=legend_row, start_column=1, end_row=legend_row, end_column=6)
    ws.row_dimensions[legend_row].height = 40


def build_casos(wb):
    ws = wb.create_sheet("Casos de Prueba")
    ws.sheet_view.showGridLines = False

    ws.merge_cells(f"A1:{get_column_letter(len(COLUMNS))}1")
    set_cell(ws, 1, 1, "Plan de Pruebas Manuales — TaskFlow", bold=True, size=16,
             color=C_BLANCO, fill=C_AZUL_OSC, align="center", border=False)
    ws.row_dimensions[1].height = 26

    ws.merge_cells(f"A2:{get_column_letter(len(COLUMNS))}2")
    set_cell(ws, 2, 1,
             "Cada conjunto de pruebas ocupa una fila por paso. Marcar el Estado (una vez por caso) tras ejecutar todos sus pasos: "
             "Pendiente, Aprobado, Fallido, Bloqueado o No aplica.",
             italic=True, size=10, color=C_BLANCO, fill=C_AZUL_MED, align="center", border=False)
    ws.row_dimensions[2].height = 18

    ws.row_dimensions[3].height = 6  # separador

    header_row = 4
    for col, (name, width, _level) in enumerate(COLUMNS, start=1):
        letter = get_column_letter(col)
        ws.column_dimensions[letter].width = width
        set_cell(ws, header_row, col, name, bold=True, color=C_BLANCO, fill=C_AZUL_MED, align="center")
    ws.freeze_panes = "A5"

    dv = DataValidation(type="list", formula1='"' + ",".join(ESTADOS) + '"', allow_blank=False)
    ws.add_data_validation(dv)

    row = header_row + 1
    modulos_nombres = []
    for modulo, casos in MODULOS:
        modulos_nombres.append(modulo)
        set_cell(ws, row, 1, modulo, bold=True, size=12, color=C_BLANCO, fill=C_GRIS_SEC, align="left")
        ws.merge_cells(start_row=row, start_column=1, end_row=row, end_column=len(COLUMNS))
        ws.row_dimensions[row].height = 20
        row += 1

        prefix = "".join(w[0] for w in modulo.upper().split() if w[0].isalpha())[:4]
        for i, (escenario, historia, precond, prioridad, tipo, pasos) in enumerate(casos, start=1):
            case_id = f"TC-{prefix}-{i:03d}"
            fill = C_AZUL_PAL if i % 2 == 0 else C_BLANCO
            start_row = row
            n_steps = len(pasos)

            for step_idx, (accion, datos, resultado) in enumerate(pasos, start=1):
                r = start_row + step_idx - 1
                set_cell(ws, r, COL_NPASO, step_idx, fill=fill, align="center")
                set_cell(ws, r, COL_ACCION, accion, fill=fill)
                set_cell(ws, r, COL_DATOS, datos, fill=fill)
                set_cell(ws, r, COL_RESULTADO, resultado, fill=fill)
                ws.row_dimensions[r].height = 46

            # Valores de caso: se escriben solo en la primera fila (openpyxl exige
            # escribir únicamente en la celda superior izquierda de un rango fusionado).
            set_cell(ws, start_row, COL_ID, case_id, fill=fill, align="center")
            set_cell(ws, start_row, COL_MODULO, modulo, fill=fill)
            set_cell(ws, start_row, COL_HISTORIA, historia, fill=fill)
            set_cell(ws, start_row, COL_ESCENARIO, escenario, fill=fill)
            set_cell(ws, start_row, COL_PRECOND, precond, fill=fill)

            prio_color = PRIORIDAD_COLORS.get(prioridad, "000000")
            set_cell(ws, start_row, COL_PRIORIDAD, prioridad, bold=True, color=prio_color, fill=fill, align="center")
            set_cell(ws, start_row, COL_TIPO, tipo, fill=fill, align="center")

            estado_fill, estado_color, estado_italic = ESTADO_COLORS["Pendiente"]
            set_cell(ws, start_row, COL_ESTADO, "Pendiente", bold=True, italic=estado_italic,
                      color=estado_color, fill=estado_fill, align="center")
            dv.add(ws.cell(row=start_row, column=COL_ESTADO))

            set_cell(ws, start_row, COL_OBS, "", fill=fill)
            set_cell(ws, start_row, COL_PROBADO, "", fill=fill, align="center")
            set_cell(ws, start_row, COL_FECHA, "", fill=fill, align="center")

            end_row = start_row + n_steps - 1
            if n_steps > 1:
                for c in CASO_COLS:
                    for r in range(start_row + 1, end_row + 1):
                        col_fill = estado_fill if c == COL_ESTADO else fill
                        style_only(ws, r, c, fill=col_fill)
                    ws.merge_cells(start_row=start_row, start_column=c, end_row=end_row, end_column=c)

            row = end_row + 1

    return modulos_nombres


def main():
    wb = Workbook()
    wb.remove(wb.active)

    modulos_nombres = build_casos(wb)
    build_resumen(wb, modulos_nombres)

    wb.move_sheet("Resumen", offset=-len(wb.sheetnames))

    wb.save(OUTPUT_PATH)
    print(f"Generado: {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
