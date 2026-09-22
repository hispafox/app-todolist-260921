# Auditoría de seguridad del skill `mensajes-commit`

**Fecha**: 2026-09-22
**Skill auditado**: `.github/skills/mensajes-commit/SKILL.md`
**Herramienta**: `skill-scanner` (escaneo estático + revisión manual)

## Resumen

| Campo | Valor |
|---|---|
| Findings | 0 |
| Nivel de riesgo | Limpio (Clean) |
| Estructura del skill | Solo `SKILL.md` (sin `references/` ni `scripts/`) |
| Solape descripción/cuerpo | 0.65 |

## Análisis por fases

### Frontmatter
- Campos requeridos presentes: `name` y `description`.
- `name: mensajes-commit` coincide con el nombre del directorio.
- Sin `allowed-tools`, sin override de modelo, sin Bash.

### Inyección de prompt
Ninguna detectada. El contenido solo describe reglas de formato de mensajes de commit (`tipo(ambito): descripción`). No hay marcadores de override, jailbreak ni comentarios HTML ocultos.

### Análisis conductual
- La descripción coincide con las instrucciones: el skill solo redacta el texto del mensaje.
- Sin envenenamiento de configuración/memoria: no toca `CLAUDE.md`, `settings.json`, `.mcp.json`, hooks ni directorios de agente.
- Sin scope creep ni recolección de información: no lee `~/.ssh`, variables de entorno, historial de git ni credenciales.
- Nota menor (no es riesgo): la descripción menciona "enviar cambios" (push), pero el skill **no** ejecuta comandos git — solo genera el mensaje. Es un skill puramente advisory.

### Scripts
No aplica; el skill no tiene directorio `scripts/`.

### Cadena de suministro
Sin URLs, sin dependencias, sin descargas remotas.

### Permisos
Riesgo bajo / mínimo privilegio. No declara herramientas y su cuerpo no realiza operaciones que requieran ninguna.

### Ataques estructurales
Sin symlinks, sin hooks en frontmatter, sin sintaxis `!`comando``, sin ficheros de test auto-ejecutables, sin metadatos de imagen ni Unicode invisible (tags/zero-width/RTL).

## Necesita verificación
Nada.

## Evaluación final

**Seguro para usar.** El skill es un archivo de instrucciones de texto puro que solo orienta el formato de mensajes de commit. No contiene código ejecutable, no solicita permisos, no accede a datos sensibles ni intenta persistir instrucciones. No se detectaron patrones maliciosos ni en el escaneo automático ni en la revisión manual.

> Nota operativa: el scanner asume la CLI `uv`; en este entorno no estaba instalada, por lo que se ejecutó con el intérprete Python del sistema (con `pyyaml` disponible), obteniendo el mismo resultado.
