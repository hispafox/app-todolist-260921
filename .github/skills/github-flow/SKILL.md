# Skill: github-flow

Encapsula operaciones del flujo Issue → Branch → PR en este repositorio (TaskFlow).

## Cuándo usar

- El orquestador lo invoca automáticamente en Modo Issue
- También puedes invocarlo directamente para operaciones GitHub aisladas

## Funcionalidades

### 1. Leer issue

```
@github-flow leer-issue <número>
```

**Devuelve:**
- Título
- Descripción (body)
- Estado (open/closed)
- Labels
- Assignees

**Implementación:**
Usa `mcp_github_mcp_se_issue_read` con método `"get"`.

---

### 2. Crear rama feature

```
@github-flow crear-rama <issue-number> <slug>
```

**Efecto:**
1. Ejecuta `git remote -v` y extrae `owner`/`repo` de la URL del remoto `origin` — **nunca asumir ni codificar un owner/repo fijo**, el nombre del repositorio puede cambiar (renombrados, forks, clones).
2. Verifica que estás en `main` con `git branch --show-current`
3. Crea rama `feature/issue-<N>-<slug>` con `mcp_github_mcp_se_create_branch` desde `main`
4. Ejecuta `git checkout feature/issue-<N>-<slug>`

**Devuelve:**
- Nombre de la rama creada
- Confirmación de checkout

---

### 3. Crear Pull Request

```
@github-flow crear-pr <issue-number> <branch-name> <plan-path> [draft]
```

**Parámetros:**
- `issue-number`: Número del issue a vincular
- `branch-name`: Nombre de la rama feature (ej. `feature/issue-15-indices-fks`)
- `plan-path`: Ruta al plan de implementación (ej. `docs/plan-indices-fks.md`)
- `draft`: (opcional) `true` si debe ser PR en borrador

**Efecto:**
1. Lee el issue para obtener el título
2. Ejecuta `git diff main...<branch-name> --name-only` para listar ficheros modificados
3. Crea PR con `mcp_github_mcp_se_create_pull_request`:
   - `title`: Título del issue
   - `body`: Template con referencia al issue, plan, y lista de ficheros
   - `head`: `<branch-name>`
   - `base`: `main`
   - `draft`: según parámetro

**Devuelve:**
- Número del PR creado
- URL del PR

---

### 4. Comentar en issue

```
@github-flow comentar-issue <número> <mensaje>
```

**Efecto:**
Usa `mcp_github_mcp_se_add_issue_comment` para añadir un comentario en el issue.

**Devuelve:**
- Confirmación de comentario publicado

---

## Detección de owner/repo

El skill **nunca** asume ni codifica el owner o el nombre del repositorio. Antes de cualquier llamada al MCP de GitHub, ejecuta `git remote -v` y extrae ambos valores del remoto `origin`:

**Formato esperado:**
```
origin  git@github.com:<owner>/<repo>.git (fetch)
```

O:
```
origin  https://github.com/<owner>/<repo>.git (fetch)
```

Si `git remote -v` falla o no devuelve un remoto `origin` reconocible, **detener la operación e informar al usuario** en vez de asumir un valor por defecto.

---

## Ejemplo completo

```bash
# Verificar el remoto antes de cualquier operación
git remote -v
# → origin  https://github.com/<owner>/<repo>.git (fetch)

# Leer issue
@github-flow leer-issue 15
# → Devuelve: "Añadir Índices en Foreign Keys"

# Crear rama
@github-flow crear-rama 15 indices-fks
# → Crea feature/issue-15-indices-fks y hace checkout

# ... (implementar código) ...

# Crear PR
@github-flow crear-pr 15 feature/issue-15-indices-fks docs/plan-indices-fks.md
# → Devuelve: PR creado en https://github.com/<owner>/<repo>/pull/<N>

# Comentar
@github-flow comentar-issue 15 "✅ PR creado: #<N>"
# → Añade comentario en issue #15
```

---

## Dependencias

- **MCP GitHub:** Las herramientas `mcp_github_mcp_se_*` deben estar disponibles
- **Git configurado:** Debes tener acceso al repositorio remoto
- **Rama main existente:** La rama base debe existir

---

## Notas

- El skill NO hace commit ni push — eso lo hace el orquestador
- El skill NO invoca al planificador/desarrollador/verificador — solo maneja GitHub
- Todas las operaciones validan el owner/repo con `git remote -v` antes de llamar a MCP; si el MCP de GitHub no está disponible en la sesión, el skill lo informa como bloqueo sin asumir el repositorio.
