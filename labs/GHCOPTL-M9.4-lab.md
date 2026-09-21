---
submódulo: M9.4
tipo: lab
tipo-lab: construcción
título: "Lab M9.4 — Las capturas del manual, como código que se regenera"
base: "temario/GHCOPTL-M9.4-las-capturas-como-codigo.md"
rama-referencia: "submodulo-9.4/capturas-playwright"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-10
---

# 🧪 Lab M9.4 — Las capturas del manual, como código que se regenera

> **Lab versión 1 · Última actualización 2026-07-10 · Base:** [M9.4 — Las capturas como código](../temario/GHCOPTL-M9.4-las-capturas-como-codigo.md)

En el capítulo viste por qué rellenar a mano los 28 huecos de captura del manual de 9.3 lo condena a envejecer. Y viste cómo salir de ahí: un script de Playwright que GitHub Copilot escribe y mantiene, para que las capturas se regeneren con un comando cada vez que cambie la interfaz. Aquí lo montas tú. Conectas Playwright, exploras tu aplicación hablando, pides el script reproducible, lo lanzas, y rellenas uno de los huecos reales del manual con la imagen que sale.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Conecta Playwright y explora hablando
- **Ejercicio 2** — Pide el script reproducible
- **Ejercicio 3** — Lánzalo y rellena un hueco del manual
- **Ejercicio 4** — Comprueba que ya no envejece
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — la versión en modo oscuro
- **Lo que has practicado + puente al M10**

---

## Overview

Al terminar este lab sabrás conectar el servidor MCP de Playwright a tu proyecto, usar el modo conversacional para explorar tu aplicación en un navegador, pedirle a GitHub Copilot un script `.spec.ts` que capture todas las pantallas con calidad de manual, y sustituir un `[PLACEHOLDER]` del manual de 9.3 por la imagen generada.

> ⏱️ Tiempo estimado: 35–45 min.

---

## Punto de partida

**Requisitos** (los de todo el curso, más dos propios de este lab): VS Code con la extensión de GitHub Copilot en modo agente, tu repositorio de siempre publicado en GitHub, y además:

- **Node.js instalado.** Lo necesita el servidor MCP de Playwright y el `npx` que lanza los scripts. Si trabajas en .NET puro puede que no lo tengas; instalarlo no toca nada de tu proyecto .NET.
- **Tu aplicación en marcha.** El script captura pantallas de verdad, así que necesita la interfaz accesible en algún sitio. Levanta el frontend como en 8.2: queda en `http://localhost:5173`.

Sigues en el mismo proyecto, en tu única rama. Tienes el manual de 9.3 en `docs/manual-usuario.md`, con sus huecos `[PLACEHOLDER: Captura…]` y el comentario que describe cada uno. Ese manual es el que vas a empezar a rellenar aquí.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Conecta Playwright y explora hablando

*Antes de pedir un script que recorra la aplicación entera, te interesa ver a Playwright moverse por tu app en un navegador real. El modo conversacional, con el servidor MCP, es justo para eso: exploras hablando y confirmas que los selectores existen antes de escribir una línea de código.*

### Tarea 1.1 — Declara el servidor en `.vscode/mcp.json`

1. Abre (o crea) el fichero `.vscode/mcp.json` en la raíz de tu proyecto —el mismo sitio donde declaraste servidores MCP allá en 1.1— y añade la entrada de Playwright:

   ```json
   {
     "servers": {
       "playwright": {
         "command": "npx",
         "args": ["-y", "@playwright/mcp@latest"]
       }
     }
   }
   ```

   ⚠️ **Error común.** VS Code usa la clave `servers`, no `mcpServers` como algún otro cliente MCP. Si la pones mal, el servidor no aparece y GitHub Copilot no encuentra el navegador. Es el fallo que más despista aquí.

2. Guarda, recarga VS Code y abre el chat de GitHub Copilot en modo agente. La primera vez, VS Code te pedirá confirmar que confías en el servidor —la misma cautela que aplicaste en 2.2 al instalar skills de terceros—.

### Tarea 1.2 — Pídele una captura de prueba

3. Comprueba que el servidor responde con una petición sencilla, en lenguaje natural:

   > **«Abre una sesión de navegador, navega a la lista de tareas en `http://localhost:5173` y hazme una captura.»**

   → **Qué esperar:** GitHub Copilot arranca un navegador, abre tu pantalla de Tareas y te devuelve la imagen en el chat. Si la ves, el MCP está funcionando.

   🔎 **Por qué explorar antes de producir.** El MCP no mira la página como píxeles, sino por su árbol de accesibilidad: los roles y los textos de cada elemento. Eso le deja descubrir qué selector estable tiene cada botón y comprobar, sobre el navegador, que las pantallas cargan como esperas. Cuando le pidas el script del Ejercicio 2, partirá de selectores que ya ha probado en pantalla.

   💡 **Pista.** Aprovecha para explorar un poco más: pídele que despliegue el menú de categorías o que abra el formulario de nueva tarea. Cada cosa que confirmes hablando es una cosa menos que corregir en el script.

---

## Ejercicio 2 — Pide el script reproducible

*El modo conversacional sirve para explorar, pero sus capturas se quedan en la conversación. El manual necesita otra cosa: un script que resida en tu repositorio, versionado en Git, que produzca las mismas imágenes cada vez que lo lances. Ese es el modo script.*

### Tarea 2.1 — Instala Playwright en el proyecto

1. Añade Playwright como dependencia de desarrollo:

   ```bash
   npm init playwright@latest
   # o, si ya tienes proyecto:
   npm i -D @playwright/test && npx playwright install
   ```

### Tarea 2.2 — Pídele el script con un prompt concreto

2. En modo agente, pídele el script. Cuanto más exacto el prompt, menos corriges después: dile qué pantallas, con qué URL, y con qué requisitos de tamaño y nombre. Para las cuatro pantallas de AppTodoList:

   > **Crea un script de Playwright (`manual-screenshots.spec.ts`) que recorra estas pantallas de AppTodoList en `http://localhost:5173` y guarde una captura de cada una en `docs/manual/img/`:**
   > **1. Tareas, la pantalla principal (`/`)**
   > **2. Categorías (`/categorias`)**
   > **3. Plantillas (`/plantillas`)**
   > **4. Usuarios asignados (`/usuarios`)**
   >
   > **Requisitos: viewport 1440×900, `deviceScaleFactor: 2` para que se vean nítidas, espera a que la red esté inactiva antes de capturar, desactiva animaciones, y nombra los ficheros `01-tareas.png`, `02-categorias.png`, etc.**

   → **Qué esperar:** GitHub Copilot te devuelve un `.spec.ts` con un bloque `test.use` de configuración común y un recorrido pantalla por pantalla. Si tenías el MCP conectado del Ejercicio 1, habrá verificado en el navegador que esos selectores y rutas existen antes de escribirlo.

   🔎 **Lee el `test.use` despacio: ahí está casi toda la calidad.** Cada línea resuelve un problema real de manuales:

   ```typescript
   test.use({
     viewport: { width: 1440, height: 900 },
     deviceScaleFactor: 2,        // capturas nitidas en pantallas de alta densidad
     colorScheme: 'light',
     locale: 'es-ES',
     timezoneId: 'Europe/Madrid',
   });
   ```

   El `viewport` fijo hace que todas las capturas salgan al mismo ancho, y el manual no parezca un collage. El `deviceScaleFactor: 2` las genera a doble densidad: es lo que evita que el texto se vea borroso cuando el lector abre el PDF, y el ajuste que más gente olvida. El `colorScheme`, el `locale` y el `timezoneId` congelan tema, idioma y zona horaria, para que la captura no cambie según la máquina donde se ejecute.

   ⚠️ **Error común.** Falta la espera. Si el script dispara la captura mientras la pantalla todavía carga, pillas un menú a medio abrir o un *spinner* a media vuelta. Confirma que cada captura lleva `await page.waitForLoadState('networkidle')` delante y que el bloque de opciones incluye `animations: 'disabled'`.

---

## Ejercicio 3 — Lánzalo y rellena un hueco del manual

*Con el script escrito, el resto es mecánico: lanzarlo puebla la carpeta de imágenes, y cada `[PLACEHOLDER]` del manual pasa a ser un enlace de Markdown.*

### Tarea 3.1 — Genera las imágenes

1. Lanza el script:

   ```bash
   npx playwright test manual-screenshots.spec.ts
   ```

   → **Qué esperar:** se puebla `docs/manual/img/` con `01-tareas.png`, `02-categorias.png` y las demás, todas al mismo tamaño y con el mismo estilo, sin recortar ni renombrar nada.

### Tarea 3.2 — Sustituye un `[PLACEHOLDER]` real

2. Abre `docs/manual-usuario.md`, busca uno de los huecos de captura —por ejemplo el de la pantalla de Tareas— y sustituye la marca por un enlace a la imagen que acabas de generar:

   ```markdown
   ![Pantalla de tareas](manual/img/01-tareas.png)
   ```

   🔎 **Por qué el comentario HTML de 9.3 te sirve ahora.** Debajo de cada `[PLACEHOLDER]`, el agente de 9.3 dejó una nota de qué debía mostrar esa captura —qué campos, qué estado—. Esa nota te dice qué pantalla y qué estado capturar para que la imagen encaje con el texto de al lado. Aquí 9.4 cierra lo que 9.3 dejó abierto: 9.3 escribió la instrucción, 9.4 la ejecuta.

---

## Ejercicio 4 — Comprueba que ya no envejece

*Aquí se ve para qué sirve todo el montaje. Un cambio en la interfaz, un comando, y la captura se pone al día sola.*

### Tarea 4.1 — Cambia algo y vuelve a lanzar

1. Haz un cambio visible en una pantalla —mueve el botón «Nueva Tarea», cambia un título, lo que sea— y vuelve a lanzar el script:

   ```bash
   npx playwright test manual-screenshots.spec.ts
   ```

   → **Qué esperar:** la imagen correspondiente en `docs/manual/img/` se regenera con el cambio, sin que toques el manual ni rehagas nada a mano. El enlace del Markdown ya apunta a la imagen nueva.

   🔎 **Esto es lo que perseguías.** Con las capturas hechas a mano, ese mismo cambio te habría costado reabrir la pantalla, recapturar, recortar y renombrar. Ahora cuesta un comando y veinte segundos. Cuantas más capturas tenga tu manual —y el de 9.3 tiene 28—, más se nota.

---

## Definition of Done

Este lab no toca código de la aplicación: monta el pipeline de capturas y rellena parte del manual. Lo has terminado cuando:

- [ ] `.vscode/mcp.json` tiene la entrada `playwright` bajo la clave `servers`, y GitHub Copilot te devolvió una captura de prueba en el chat.
- [ ] Existe `manual-screenshots.spec.ts` con el bloque `test.use` (viewport, `deviceScaleFactor: 2`, `colorScheme`) y la espera a red inactiva antes de cada captura.
- [ ] Al lanzar el script se puebla `docs/manual/img/` con una imagen por pantalla.
- [ ] Al menos un `[PLACEHOLDER]` del manual de 9.3 está sustituido por un enlace `![...](manual/img/...)` a una imagen generada.
- [ ] Cambiaste algo de la interfaz, relanzaste el script y la captura se actualizó sola.
- [ ] Tu resultado coincide con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-9.4/capturas-playwright`.

```bash
cd AppTodoList-curso
git checkout submodulo-9.4/capturas-playwright
```

Abre su `manual-screenshots.spec.ts` y ponlo al lado del tuyo: mismo bloque `test.use`, misma espera a red inactiva antes de capturar, mismos nombres de fichero. Fíjate menos en que cada línea sea idéntica y más en que la configuración que da calidad a las capturas —el `deviceScaleFactor`, el `viewport` fijo, la espera— esté toda presente.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — la versión en modo oscuro

Si tu aplicación tiene modo claro y modo oscuro, tienes las dos versiones del manual casi gratis. Duplica el script cambiando `colorScheme` a `'dark'` y guardando las imágenes en otra carpeta —`docs/manual/img-dark/`—, y lánzalo. Con eso tienes el manual entero en los dos temas sin recapturar nada a mano. Y si te animas con la protección de datos, prueba la opción `mask` de Playwright en la pantalla de Usuarios, para tapar con un recuadro los nombres antes de que la captura llegue al manual.

---

## Lo que has practicado

Montaste un pipeline que trata la parte visual de un manual como código versionado: conectaste el MCP de Playwright para explorar tu aplicación hablando, pediste un script reproducible que captura todas las pantallas con calidad de manual, y comprobaste con un cambio real que las imágenes se regeneran con un comando y ya no envejecen a mano. Y cerraste el círculo que 9.3 dejó abierto, sustituyendo un `[PLACEHOLDER]` por la imagen que el comentario de 9.3 te dijo exactamente cómo capturar.

**Puente al M10.** Toda la documentación de M09 la generaste trabajando tú solo, en tu repositorio local. La idea que el capítulo dejó apuntada —meter el script en un CI que vigile los cambios— es la punta de algo más grande: en M10 el trabajo pasa a hacerse dentro de GitHub como un equipo, donde un hallazgo se vuelve un *issue*, el *issue* una rama, la rama un *pull request* que otro revisa, y la integración continua ejecuta las pruebas en cada cambio antes de dejar que nada se fusione.
