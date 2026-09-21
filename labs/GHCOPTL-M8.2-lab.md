---
submódulo: M8.2
tipo: lab
tipo-lab: construcción
título: "Lab M8.2 — La pantalla que le faltaba a tu API"
base: "temario/GHCOPTL-M8.2-el-frontend-dirigido-frontend-react.md"
rama-referencia: "submodulo-8.2/frontend-react"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M8.2 — La pantalla que le faltaba a tu API

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M8.2 — El frontend dirigido: frontend-react](../temario/GHCOPTL-M8.2-el-frontend-dirigido-frontend-react.md)

En el capítulo viste a GitHub Copilot fabricarse el skill que le faltaba y usarlo para levantar un frontend entero, y viste dos bugs de proxy que dejan clara la misma lección: mirar el `launchSettings.json` real antes de adivinar un puerto. Aquí haces las tres cosas con tus manos: fabricas ese mismo skill en tu proyecto, construyes con él tu frontend, y diagnosticas tu propio proxy contra tus propios puertos, no contra los de la demo.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Fabrica el skill que te falta
- **Ejercicio 2** — Levanta el frontend completo
- **Ejercicio 3** — El proxy: comprueba antes de adivinar
- **Ejercicio 4** — Prueba el CRUD desde el navegador
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — un campo que no avisa
- **Lo que has practicado + puente al Lab 8.3**

---

## Overview

Al terminar este lab habrás fabricado con GitHub Copilot un skill de proyecto que no existía (`frontend-react`), lo habrás cableado en todo tu equipo de agentes, y habrás construido con él un frontend React que habla de verdad con tu API, a través de un proxy que tú mismo habrás verificado contra tus propios puertos.

> ⏱️ Tiempo estimado: 45-60 min. El frontend completo genera bastantes ficheros de golpe; dale su tiempo.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto y en la misma rama de siempre. Tu API de tareas, categorías, plantillas y usuarios asignados (M04-M07) ya funciona, y desde 8.1 ya sabe explicarse sola en `/scalar`. En este lab no le tocas ni el modelo ni la lógica: le construyes al lado la pantalla que le faltaba.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Fabrica el skill que te falta

*Antes de pedir una sola línea de React, haz lo mismo que se hizo en clase: dile a tu agente lo que falta, no lo que quieres que construya directamente. Experimenta a tu aire con la redacción exacta; lo que importa es el diagnóstico, no la frase literal.*

### Tarea 1.1 — Pide el skill, no el código

1. Pídeselo a tu agente orquestador, con el mismo encargo real del capítulo:

   > **«Ahora vamos a crear el front, pero no tenemos un skill específico para desarrollar el front con react + vite (TypeScript)»**

   → **Qué esperar:** GitHub Copilot no se pone a escribir componentes. Primero repasa cómo son los skills que ya tienes en `.github/skills/` y prepara uno nuevo con esa misma anatomía.

2. Sé explícito sobre dónde debe residir, con el mismo matiz que se marcó en clase:

   > **«lo quiero para este proyecto nada más, no lo hagas en mi cuenta de usuarios»**

   → **Qué esperar:** un `SKILL.md` nuevo en `.github/skills/frontend-react/`, con su frontmatter (`name`, `description`, `argument-hint`), sus prerrequisitos (leer `docs/analisis-diseño.md` y los `Dtos/*.cs` reales antes de generar nada), la arquitectura de carpetas del frontend, y las cinco reglas de diseño: un servicio por recurso, funciones sueltas en vez de clases, componentes que reciben los datos por props en vez de llamar ellos mismos a la API, páginas que orquestan sin mezclar llamadas con presentación, y el idioma partido —interfaz en español, ficheros y funciones en inglés—.

   💡 **Pista.** Repasa la `description` que te genera. Es el texto por el que GitHub Copilot decide, sin que se lo digas explícitamente, cuándo activar este skill; si no menciona «crear el proyecto frontend» ni «configurar el proxy», puede no dispararse solo la próxima vez que se lo pidas de forma indirecta.

   ⚠️ **Error común.** Si el skill aparece fuera de `.github/skills/` —por ejemplo a nivel de tu cuenta de usuario—, bórralo y repite el encargo remarcando «solo para este proyecto». Un skill de proyecto que se cuela a nivel personal termina apareciendo en tus otros repositorios, donde no pinta nada.

### Tarea 1.2 — No lo des por cerrado: cabléalo

*Un skill que nadie más conoce es papel mojado. En clase, la sesión no se cerró al crear el `SKILL.md`: siguió hasta comprobar que el resto del equipo de agentes ya lo tenía cableado.*

1. Pregúntale, con el mismo tono de repaso de clase:

   > **«este skill esta integrado en todo el proceso de desarrollo, en los agentes adecuados, en las instrucciones de copilot? revisalo por favor»**

   → **Qué esperar:** GitHub Copilot revisa `nueva-feature`, el `planificador` y el `desarrollador`, y añade lo que falte: un paso condicional en `nueva-feature` que solo se activa si existe la carpeta `frontend/`, una fuente de contexto nueva en el `planificador` (leer los tipos y servicios existentes antes de planificar), y una línea nueva en la lista de skills del `desarrollador`.

2. Insiste en el punto que en clase no se dejó pasar:

   > **«y en el agente verificador???»**

   → **Qué esperar:** un apartado nuevo en el `verificador`, equivalente al §4.7 que viste en la base, que comprueba —cuando el plan toca el frontend— que los tipos TypeScript siguen siendo un espejo fiel de los DTOs y que los servicios existen para los endpoints nuevos.

   🔎 **Por qué insistir en el verificador.** Un skill sin verificación es una promesa que nadie llega a comprobar: el resto del equipo puede dar el visto bueno a una funcionalidad con el backend impecable y el frontend sin tocar, y nadie se entera hasta que alguien abre la pantalla y no encuentra el campo nuevo.

3. Comprueba: abre `nueva-feature`, el `planificador`, el `desarrollador` y el `verificador` y confirma que los cuatro mencionan `frontend-react` en algún punto.

---

## Ejercicio 2 — Levanta el frontend completo

*Con el skill listo y cableado, toca usarlo de verdad, con el mismo ciclo del orquestador que ya conoces desde M06 y M07: planificador, desarrollador, verificador, el bucle completo.*

### Tarea 2.1 — El encargo completo

1. Pídeselo a tu agente orquestador, con el mismo encargo real de clase:

   > **«Vamos a implementar el front completamente con todo el sistema de gestión de tareas»**

   → **Qué esperar:** el ciclo completo se pone en marcha y, en una sola tanda, genera de golpe unos 35 ficheros nuevos: el `App.tsx` con las rutas, cuatro páginas —tareas, categorías, plantillas, usuarios—, sus servicios y sus tipos, más un `plan-frontend-completo.md` con los criterios de aceptación que respaldan todo lo anterior.

   💡 **Pista.** Si tu agente se detiene a preguntarte por el alcance —¿todas las entidades?, ¿todas las operaciones?—, respóndele igual que en clase: el sistema de gestión de tareas completo, sin recortar.

2. Comprueba:

   ```bash
   cd frontend
   npm install
   npm run build
   ```

   → sin errores.

---

## Ejercicio 3 — El proxy: comprueba antes de adivinar

*Aquí es donde en clase algo se rompió al lanzarlo, y la lección de fondo no es «usa HTTPS» ni «usa HTTP»: es mirar antes de escribir.*

### Tarea 3.1 — Localiza tus puertos reales

1. Abre tu `Properties/launchSettings.json` y localiza el perfil que usas para desarrollar —normalmente `https`—. Apunta qué `applicationUrl` expone: puede traer un único puerto HTTPS, o, como en el proyecto de clase, dos a la vez: uno HTTPS y otro HTTP puro, cada uno hablando solo su propio protocolo.

   🔎 **Por qué este paso va primero.** En clase, el `vite.config.ts` recién generado apuntaba a un puerto de plantilla (`5001`) que no era el del proyecto; el primer arreglo fue apuntar al puerto real. El segundo, más fino, fue caer en que ese puerto solo hablaba HTTP: el navegador intentaba un saludo TLS contra un servidor que respondía en texto plano, y esa conversación no llegaba a ningún sitio. Los dos fallos comparten el mismo origen: nadie miró el `launchSettings.json` real antes de escribir el proxy.

### Tarea 3.2 — Ajusta tu `vite.config.ts` a lo que has visto

2. Abre `frontend/vite.config.ts` y compara el `target` del proxy `/api` con lo que apuntaste en la Tarea 3.1: mismo puerto, mismo esquema.

   ⚠️ **Error común.** Si tu perfil expone HTTPS y HTTP en puertos distintos, comprueba que apuntas al puerto que de verdad responde en el esquema que has escrito. `secure: false` solo te salva del certificado autofirmado cuando el puerto de destino atiende por HTTPS; no arregla un desajuste de esquema.

3. Corrige si hace falta, y comprueba: arranca el frontend (`npm run dev`) con tu backend levantado por tu lado, y confirma que la consola del navegador no marca ningún error de conexión.

   💡 **Pista.** Si ves un error de certificado o de conexión rechazada, vuelve a la Tarea 3.1: casi siempre es que el puerto o el esquema no coinciden, no un problema del propio Vite.

---

## Ejercicio 4 — Prueba el CRUD desde el navegador

*Compilar no basta. La prueba de que la pantalla funciona de verdad es que la usas, sin tocar `/scalar` para nada.*

### Tarea 4.1 — Crea, completa, borra

1. Con el frontend y el backend arrancados, entra en tu aplicación y crea una tarea nueva desde el formulario.

   → **Qué esperar:** la tarea aparece en la lista, sin que hayas escrito un solo JSON a mano.

2. Márcala como completada desde la interfaz.

   → **Qué esperar:** el `POST /api/tareas/{id}/completar` que ya conoces del capítulo, ahora disparado por un clic en vez de por un botón «Try it».

3. Bórrala.

   → **Qué esperar:** la lista se actualiza sin que la aplicación se rompa; el `204 No Content` que devuelve el borrado no deja ningún error a la vista.

---

## Definition of Done

Este lab añade una capa entera al proyecto. Lo has terminado cuando:

- [ ] `.github/skills/frontend-react/SKILL.md` existe **en el proyecto**, no en tu cuenta de usuario.
- [ ] `nueva-feature`, el `planificador`, el `desarrollador` y el `verificador` mencionan `frontend-react`.
- [ ] `frontend/` compila (`npm run build` sin errores).
- [ ] El `target` del proxy en `vite.config.ts` coincide con el puerto y el esquema reales de tu `launchSettings.json`.
- [ ] Puedes crear, completar y borrar una tarea desde el navegador, sin pasar por `/scalar`.
- [ ] Tu diff coincide, en lo esencial, con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-8.2/frontend-react`.

```bash
cd AppTodoList-curso
git checkout submodulo-8.2/frontend-react
```

Abre su `SKILL.md`, su `frontend/vite.config.ts` y su `Program.cs` —por la política CORS—, y ponlos al lado de los tuyos. Lo esencial que debe coincidir: el skill con sus cinco reglas de diseño, la tabla de tipos DTO→TypeScript, la capa de servicio con un fichero por recurso, y el proxy apuntando al puerto y esquema que de verdad sirve tu backend. El número exacto de puerto puede variar entre tu proyecto y el de referencia; lo que importa es que coincida con tu propio `launchSettings.json`, no con el de la demo.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — un campo que no avisa

Añade un campo nuevo a `CrearTareaDto` en el backend —por ejemplo, una prioridad— y no toques la interfaz TypeScript correspondiente en `frontend/src/types/index.ts`. Compila los dos lados y prueba a crear una tarea desde el formulario. Vas a ver que nada truena: el frontend ignora sin más el campo que no conoce, porque TypeScript solo sabe de las formas que tú le has escrito. Ese silencio es justo el caso que la FAQ del capítulo explicaba: sin el §4.7 del verificador vigilando, un desajuste así puede pasar semanas sin que nadie lo note.

---

## Lo que has practicado

La próxima vez que te falte una pieza del stack —no solo un frontend— ya sabes pedir primero la herramienta que la construye, no el resultado final directamente. Y sabes que un fallo de conexión casi nunca se arregla probando puertos al azar: se arregla mirando qué hay de verdad al otro lado, como acabas de hacer con tu propio `launchSettings.json`.

**Puente al Lab 8.3.** Tu pantalla ya funciona, y funciona rápido: un skill nuevo en una sesión, un frontend completo en la siguiente. En el próximo capítulo pones a prueba esa misma velocidad con un caso real —un skill de terceros que promete resolver el diseño de la interfaz por ti— y la pregunta que toca hacerte antes de dejarlo tocar tu proyecto.
