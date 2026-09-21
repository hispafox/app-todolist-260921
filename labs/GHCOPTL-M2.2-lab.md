# 🧪 Lab M2.2 — Ecosistema y seguridad de los skills

**Lab versión 1 · Última actualización: 2026-07-05 · Base:** `temario/GHCOPTL-M2.2-ecosistema-y-seguridad-skills.md`

En el capítulo has visto, sobre el papel, que el `SKILL.md` es un estándar abierto con un ecosistema entero de skills ya hechos, y que traerse uno de fuera es una decisión de seguridad. Ahora lo haces con tus manos: buscas un skill que le venga bien a tu proyecto, lo **inspeccionas antes de instalar** —el reflejo de todo el capítulo—, lo instalas, compruebas que se activa cuando toca, y guardas el cambio con tu propio skill de commits. Al final comparas con la rama de referencia del capítulo, en la demo del curso.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Explora el ecosistema y elige un skill
- **Ejercicio 2** — Inspecciónalo antes de instalar (el corazón del lab)
- **Ejercicio 3** — Instálalo, compruébalo y guárdalo con `commit-message`
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — audita un skill que ya usas
- **Lo que has practicado + puente al Lab 3.1**

---

## Overview

Al terminar este lab sabrás **moverte por el ecosistema de skills con criterio**: encontrar uno en las fuentes fiables, **leerlo con ojo de auditor antes de instalarlo** (qué dice ser, qué pide hacer, qué toca), instalarlo con herramienta y confirmar que se activa. No hay un entregable de código compilable: lo que practicas es un **criterio de seguridad**, el que separa instalar a ciegas de instalar sabiendo qué autorizas.

El detalle conceptual (el estándar abierto, el mapa de fuentes, las rutas, la regla de oro) está en la base del capítulo; este lab es la parte de tus manos.

> ⏱️ Tiempo estimado: 25–35 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`) —ya la dejaste lista y autenticada en los labs anteriores—.
- Para el instalador de GitHub, `gh skill`, necesitas **GitHub CLI 2.90 o posterior**. Compruébalo con `gh --version` y actualiza si vas por debajo.

**Trabajas en tu propio repositorio**, el mismo de los capítulos anteriores, en una sola rama. Sigues donde lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa (del 1.1) y tu skill `commit-message` (del 2.1). Ese skill lo vas a reutilizar al final para guardar el cambio.

> 💡 **Tu red de seguridad: la demo del curso.** La rama de referencia de este capítulo está en la demo `AppTodoList-curso`, que clonaste una vez al principio. Trae la hoja de recursos `docs/repositorios-skills.md` con el mapa de fuentes completo. Cuando termines, te asomas a ella para comparar —solo para mirar, nunca trabajas dentro de la demo—.

---

## Ejercicio 1 — Explora el ecosistema y elige un skill

*Antes de instalar nada, hay que encontrar algo que merezca la pena. Vas a moverte por las fuentes fiables del capítulo y a elegir un skill que le venga bien a tu proyecto de verdad. Experimenta a tu aire: cuanto más husmees, antes distingues lo bueno de lo genérico.*

### Tarea 1.1 — Busca en una fuente fiable

1. Empieza por lo oficial. Abre en el navegador la colección de GitHub, `github/awesome-copilot`, y date una vuelta por los skills que trae. Es la fuente pensada para funcionar con GitHub Copilot directamente, así que es el punto de partida natural.

2. Si prefieres buscar desde la terminal, el instalador abierto `npx skills` trae un buscador interactivo:

   ```bash
   npx skills find documentacion
   ```

   - → **Qué esperar:** te lista skills que encajan con la búsqueda, de distintos repositorios, para que compares antes de decidir.

   🔎 **Por qué empezar por lo oficial.** Del capítulo te llevas tres señales para juzgar una fuente: quién la mantiene, si está curada o generada en masa, y cuánta gente la usa. La colección de GitHub las cumple las tres. No es la única fuente buena, pero es donde menos te la juegas para tu primer skill de fuera.

### Tarea 1.2 — Elige uno que te sirva

3. Escoge **un** skill que le venga bien a tu lista de tareas: uno de documentación, uno de revisión de código, uno de estilo… El que sea, con una condición: que sea pequeño y entendible, porque en el ejercicio siguiente te lo vas a leer entero. Anota su repositorio y su nombre; los necesitas para inspeccionarlo.

> 💡 **Pista.** No busques el skill más impresionante. Busca uno cuyo trabajo entiendas de un vistazo. Hoy practicas un reflejo —leerlo antes de dejarlo entrar—, y para eso el skill tiene que ser lo bastante sencillo como para leértelo entero.

---

## Ejercicio 2 — Inspecciónalo antes de instalar

*Un skill es un conjunto de instrucciones que tu agente va a obedecer, y nadie las verifica por ti. Así que antes de instalar, se lee. Este ejercicio es ese hábito, hecho una vez con las manos para que se te quede.*

### Tarea 2.1 — Ábrelo con `preview`

1. Usa el verbo que trae de serie el instalador de GitHub, el que inspecciona sin tocar nada de tu proyecto:

   ```bash
   gh skill preview <owner/repo> <nombre-del-skill>
   ```

   Por ejemplo, para un skill de la colección oficial:

   ```bash
   gh skill preview github/awesome-copilot documentation-writer
   ```

   - → **Qué esperar:** `gh skill preview` te muestra la lista de ficheros que trae el skill y te deja abrir cada uno para leerlo, todo **antes** de instalar. Si prefieres, el camino más directo es el mismo que da la hoja del proyecto: buscar el `SKILL.md` en el repositorio y leerlo en el navegador.

### Tarea 2.2 — Léelo con las cuatro preguntas

2. Ahora recórrelo con las cuatro preguntas del capítulo, en este orden:

   - **¿Casa lo que dice ser con lo que pide hacer?** La `description` promete una cosa; el procedimiento debería hacer esa misma cosa y no otra. Un skill que se presenta como formateador de commits no tiene por qué querer leer tus variables de entorno.
   - **¿Qué ficheros toca y qué comandos ejecuta?** Atención especial si trae scripts: un script es código que se ejecuta en tu máquina, con el mismo riesgo que un paquete de NuGet o npm.
   - **¿Alguna instrucción huele rara?** Peticiones de red que no pintan nada, un «ignora las reglas anteriores», rutas que apuntan fuera del proyecto.
   - **¿Lo entiendes?** Si no entiendes lo que hace, no lo uses. A ciegas no sabes qué acabas de autorizar.

   🔎 **Por qué esta comprobación.** Es el problema de la cadena de suministro, el mismo que ya gestionas con los paquetes de NuGet o npm, con un matiz a tu favor: un skill es texto legible, Markdown, y se lee en dos minutos. Con esa facilidad, saltarte la lectura es dejar la puerta abierta por pura pereza.

> ⚠️ **Error común.** Instalar primero «para probar» y leerlo después. En cuanto instalas, el skill ya está disponible para que tu agente lo cargue y lo obedezca. El orden correcto es al revés, siempre: primero lees, luego decides, luego instalas. Si un skill te obliga a instalarlo para poder verlo, ya es motivo para desconfiar.

---

## Ejercicio 3 — Instálalo, compruébalo y guárdalo con `commit-message`

*Le has dado el visto bueno leyéndolo. Ahora lo instalas de verdad, confirmas que se activa cuando toca, y guardas el cambio reutilizando el skill que montaste en el capítulo anterior. Dos de tus herramientas, trabajando juntas.*

### Tarea 3.1 — Instálalo con herramienta

1. Instálalo con el gestor que prefieras. Con la GitHub CLI:

   ```bash
   gh skill install <owner/repo> <nombre-del-skill>
   ```

   O con el instalador abierto, que detecta qué agentes tienes y deja cada fichero en su ruta:

   ```bash
   npx skills add <owner/repo>
   ```

   - → **Qué esperar:** el skill queda instalado en la ruta que le corresponde. Si es del proyecto, en `.github/skills/`; si lo instalaste como personal, en tu carpeta de usuario. Comprueba con `gh skill list` o `npx skills list` que aparece entre los instalados.

### Tarea 3.2 — Comprueba que se activa

2. Pídele a GitHub Copilot algo que debería disparar el skill que acabas de instalar, y mira si lo usa. Si el skill es de documentación, pídele que documente algo; si es de revisión, que revise un fragmento.

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea encaja con la `description` del skill y lo aplica, en vez de darte una respuesta genérica.

   💡 **Pista.** Si no se activa, el diagnóstico es el mismo que aprendiste en 2.1 con los tuyos: la `description` es el interruptor. Ábrela, mira si nombra la situación que tú le has pedido, y ajusta tu petición. Otra razón más por la que haberlo leído antes te ahorra tiempo ahora.

### Tarea 3.3 — Guarda el cambio con tu skill de commits

3. Instalar un skill de proyecto deja un cambio en tu repositorio. Súbelo reutilizando lo que montaste en el capítulo 2:

   > **«Sube los cambios. Ya sabes qué skill utilizar para el mensaje de commit, ¿verdad?»**

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea encaja con `commit-message`, genera el mensaje con él —algo como `chore(skills): instalar skill documentation-writer del ecosistema`—, y tras tu visto bueno hace el commit y el `push`.

   💡 **Pista.** Esto es la carga progresiva en acción: no has nombrado el skill de commits, pero su `description` encaja con «hacer un commit», así que GitHub Copilot lo trae solo. Dos skills tuyos trabajando juntos, uno que escribiste y otro que trajiste de fuera.

---

## Definition of Done

Este capítulo entrega un **criterio ejercido**, el de leer antes de instalar. Lo has terminado cuando:

- [ ] Has elegido un skill de una **fuente fiable** del ecosistema y anotado su repositorio y su nombre.
- [ ] Lo has **inspeccionado antes de instalar** —con `gh skill preview` o leyendo su `SKILL.md`— y lo has pasado por las **cuatro preguntas** (dice ser / pide hacer / huele raro / lo entiendo).
- [ ] Lo has **instalado** con herramienta y comprobado que **se activa** cuando le pides algo que encaja con su `description`.
- [ ] Has guardado el cambio dejando que **`commit-message` genere el mensaje**, validado y subido.
- [ ] Sabes explicar, con el skill que elegiste, **por qué** un `SKILL.md` se lee antes de instalarse: son instrucciones que tu agente obedecerá y nadie las verifica por ti.

---

## Comparar con la referencia

La rama de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-2.2/ecosistema`. La usas solo para mirar —nunca trabajas dentro de la demo—.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-2.2/ecosistema
```

Abre su `docs/repositorios-skills.md`: es la hoja de recursos completa que se recorrió en el capítulo, con todas las fuentes, las rutas y la regla de oro escrita en negrita. Tu skill instalado será distinto del que elija otra persona, así que no busques calcarla: esta hoja es el **mapa** de referencia. Ponla al lado de lo que has hecho y comprueba que el criterio que seguiste —fuente fiable, inspección antes de instalar— es el que ella recomienda.

Cuando termines de mirar, vuelve a tu proyecto (la otra carpeta) y sigue con lo tuyo.

---

## Reto opcional — audita un skill que ya usas

Coge un skill que ya tengas instalado, de este curso o de tu trabajo real, y léetelo con las cuatro preguntas como si lo fueras a instalar hoy. ¿Sabrías explicar qué hace, qué ficheros toca, por qué está redactada así su `description`? Muchas veces, el ejercicio de auditar algo que dabas por bueno destapa que nunca lo miraste de verdad. Y si de camino encuentras un skill del ecosistema que le venga bien a un proyecto tuyo de verdad, ya sabes el método para dejarlo entrar con criterio.

---

## Lo que has practicado

Has recorrido el ecosistema, has elegido un skill de una fuente fiable, lo has leído con ojo de auditor antes de tocar tu proyecto, lo has instalado con herramienta y lo has visto activarse —y has guardado el cambio con tu propio skill de commits—. Eso es servirte del ecosistema con criterio: no instalar lo que brilla, sino lo que has entendido. El reflejo de inspeccionar antes de instalar, ejercido una vez, ya es tuyo.

**Puente al Lab 3.1.** Todo lo que has instalado hoy tiene algo en común: es genérico, funciona en cualquier proyecto porque no sabe nada del tuyo. Pero el siguiente paso del curso es empezar a construir tu aplicación de verdad, y para eso hacen falta skills que sí sepan qué es tu proyecto: sus entidades, sus endpoints. Ese conocimiento tiene que estar escrito en algún sitio antes de que un skill pueda usarlo. En el Lab 3.1 montas ese sitio: el documento de análisis, la única fuente de verdad de la que beberá todo lo que construyas después.
