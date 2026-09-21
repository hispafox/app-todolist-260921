---
name: mensajes-commit
description: "Genera mensajes de commit para este repositorio cuando el usuario solicita registrar, confirmar o enviar cambios. Sigue el formato tipo(ambito): descripción corta y solo añade cuerpo si aporta contexto real."
---

# Mensajes de commit

Usa este skill cuando el usuario pida hacer una subida, crear un commit, preparar un push o documentar cambios en Git.

Se activa en contextos de "sube los cambios", "haz commit", "envía cambios" o cuando haya que redactar un mensaje de Git con formato preciso y útil para el historial del repositorio.

## Reglas principales

- Escribe la primera línea como resumen breve en formato `tipo(ambito): descripción corta`.
- El texto debe estar en castellano y describir exactamente el cambio real.
- Sé específico: indica qué se tocó y cómo, no un resumen genérico.
- Si el cambio es trivial, una sola línea basta; no fuerces un cuerpo si no añade valor.
- Si el cambio necesita contexto, añade un cuerpo opcional con 1-3 líneas cortas que expliquen el detalle relevante.
- La primera línea es el resumen; el cuerpo explica el detalle, los motivos o el impacto.
- Mantén el estilo compacto y útil para el historial de git.

## Formato recomendado

```text
tipo(ambito): descripción corta

Cuerpo opcional:
- qué se cambió exactamente
- por qué era necesario
- qué impacto tiene o qué validación se hizo
```

## Tipos sugeridos

- `feat`: nueva funcionalidad
- `fix`: corrección de errores
- `docs`: documentación o textos del producto
- `refactor`: reorganización interna sin cambiar el comportamiento
- `test`: pruebas añadidas o ajustadas
- `chore`: mantenimiento menor, configuración o tareas rutinarias
- `style`: cambios visuales o formato sin alteración funcional
- `perf`: optimización de rendimiento
- `build`: cambios de compilación o dependencias

## Qué evitar

- No escribas mensajes vagos como: `actualizar fichero`, `arreglar problema`, `mejorar código`, `cambiar instrucciones`.
- No uses frases genéricas sin nombre de dominio ni comportamiento.
- No repitas el resumen en el cuerpo sin añadir detalle útil.
- No inventes cambios que no existan en el diff.
- No escribas mensajes largos ni narrativos si el cambio es simple.

## Ejemplos buenos

```text
docs: traducir PRD y guías de instrucción al castellano
```

```text
feat(api): añadir endpoint de listado de tareas con filtros por estado

- devolver tareas ordenadas por fecha de actualización
- aplicar filtros por prioridad y categoría en la consulta
- validar título obligatorio en la creación
```

```text
fix(frontend): corregir el cierre del diálogo de confirmación al eliminar tarea
```

```text
test(api): cubrir errores 400 y 404 en endpoints de tareas
```

## Principio clave

Un buen mensaje de commit dice exactamente qué cambió, sin adornos ni ambigüedad. Si el cambio es pequeño pero claro, debe seguir siendo corto; si es más complejo, el cuerpo debe aportar contexto útil sin convertir el mensaje en un ensayo.
