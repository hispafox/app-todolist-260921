# 🧪 Lab M2.1 — Tu primer skill: `commit-message`

**Lab versión 2 · Última actualización: 2026-07-03 · Base:** `temario/GHCOPTL-M2.1-tu-primer-skill-commit-message.md`

En el capítulo has visto, sobre el papel, qué es un `SKILL.md`, por qué su `description` decide cuándo se carga, y cómo es por dentro el skill de los commits. Ahora lo construyes tú: le encargas a GitHub Copilot el skill `commit-message`, lo afinas hasta que salta cuando debe y el formato sale como quieres, y lo usas para generar el mensaje de un commit real, validándolo antes de confirmarlo. Al final comparas lo tuyo con la rama de referencia del capítulo, en la demo del curso.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Encárgale a GitHub Copilot el skill `commit-message`
- **Ejercicio 2** — Afínalo: que la `description` dispare y el formato sea sólido
- **Ejercicio 3** — Úsalo de verdad: genera un commit y valídalo antes de confirmar
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — tu segundo skill
- **Lo que has practicado + puente al Lab 2.2**

---

## Overview

Al terminar este lab sabrás **crear un skill desde cero encargándoselo a GitHub Copilot**, **afinarlo** hasta que su `description` lo active en el momento correcto, y **usarlo** para que genere mensajes de commit con tu formato, revisándolos antes de confirmar. El entregable es un `SKILL.md` real en tu repositorio: tu primera parte de la capa 2.

El detalle conceptual (anatomía del `SKILL.md`, carga progresiva, Conventional Commits) está en la base del capítulo; este lab es la parte de tus manos.

> ⏱️ Tiempo estimado: 30–40 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`) —ya la dejaste lista y autenticada en el lab anterior—.

**Trabajas en tu propio repositorio**, el mismo del capítulo anterior. Sigues donde lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa, y el repositorio publicado en GitHub. Todo en una sola rama, como siempre: aquí no creas ramas.

Ese es justo el estado en el que surgió la pregunta que abre este capítulo: los commits salían dispares. Vas a resolverla construyendo tu primer skill, encima de lo que ya tienes.

> 💡 **¿Empiezas el curso por aquí?** Necesitas un repositorio con un `.github/copilot-instructions.md`, como el que se montó en el 1.1. Puedes crear uno rápido dirigiendo a GitHub Copilot, o mirar cómo quedó en la demo: en tu clon de `AppTodoList-curso`, `git checkout submodulo-1.1/setup`, y replica ese punto de partida en tu repositorio antes de seguir.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste una vez en el lab anterior. Cuando termines, te asomas a su rama de este capítulo para comparar —solo para mirar, nunca trabajas dentro de la demo—. Así nunca estás sin red.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el skill `commit-message`

*Un skill no se escribe a mano de cero: se le describe la tarea a GitHub Copilot y él te da un primer `SKILL.md`. Aquí le encargas el de los mensajes de commit con las características que tú quieres. Experimenta a tu aire con la redacción del encargo; cuanto más claras las características, mejor sale el primer borrador.*

### Tarea 1.1 — Describe el skill que quieres

1. En el **modo agente**, pídele el skill describiendo dónde va y qué características tiene:

   > **«Quiero crear un skill en este proyecto, solo aquí para este proyecto, en la carpeta correspondiente, que suele ser `.github/skills`. El objetivo de este skill es crear los mensajes de commit cuando vayamos a commitear algo. Queremos estas características: 1) Sé específico con lo que cambió: no vale "actualizar fichero", di qué se tocó exactamente. 2) El cuerpo del commit es opcional pero valioso: la primera línea es el resumen (tipo: descripción corta), el cuerpo explica el detalle; si el cambio es trivial, una sola línea basta. 3) Escueto no es lo mismo que vago: "docs: cambiar idioma de código de inglés a castellano" es corto pero dice exactamente qué ocurrió; "actualizar instrucciones" no dice nada.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` con su frontmatter (`name`, `description`, `argument-hint`) y un cuerpo con el formato del mensaje, la tabla de tipos y las reglas que le has pedido. Todavía no lo ha creado; te lo muestra.

   🔎 **Por qué este prompt.** Fíjate en que le das tres cosas: **dónde** va (la carpeta `.github/skills`), **para qué** sirve (el disparador de la `description`), y **las reglas de calidad** (específico, cuerpo = porqué, escueto ≠ vago). Esas reglas son las que separan un commit útil de uno inútil, y quieres que queden dentro del skill, no en tu memoria.

### Tarea 1.2 — Que lo cree

2. Cuando el contenido te encaje, pídele que lo escriba:

   > **«Crea el skill de commit-message con el contenido que me mostraste.»**

   - → **Qué esperar:** GitHub Copilot crea el fichero en `.github/skills/commit-message/SKILL.md`.

3. Ábrelo y recórrelo por partes, como hicimos en el capítulo: el frontmatter arriba (`name`, `description`, `argument-hint`), y debajo el formato, la tabla de tipos y las reglas.

> ⚠️ **Error común.** Si GitHub Copilot te crea el fichero en otro sitio (por ejemplo suelto en la raíz o en una carpeta con otro nombre), muévelo a `.github/skills/commit-message/SKILL.md`: la carpeta con el nombre del skill es lo que hace que se reconozca. Y recuerda que, al estar en el repositorio, viajará con el código para quien lo clone.

---

## Ejercicio 2 — Afínalo: que la `description` dispare y el formato sea sólido

*Un skill es un documento vivo. El primer borrador rara vez es el definitivo: se prueba, se compara con lo que querías y se ajusta. Aquí afinas dos cosas: que la `description` enumere bien los disparadores y que el cuerpo del skill recoja las buenas prácticas del estándar.*

### Tarea 2.1 — Revisa la `description`, el interruptor

1. Lee la `description` que ha generado GitHub Copilot. Pregúntate: **¿enumera las situaciones en que quiero que salte?** Una buena `description` no dice solo «genera mensajes de commit»; nombra los disparadores: cuando vas a hacer un commit, cuando quieres redactar el mensaje, cuando preguntas cómo formular un commit.

2. Si la ves genérica, pídele que la mejore nombrando esas situaciones. Es la línea que decide si el skill se activa solo cuando toca.

   🔎 **Por qué.** La `description` es el interruptor. Un skill perfecto por dentro con una `description` vaga no entra cuando debería. Esta es la línea que más se piensa.

### Tarea 2.2 — Completa las buenas prácticas con una investigación

3. Pídele que verifique si al skill le falta alguna buena práctica del estándar:

   > **«¿Podemos hacer una investigación para comprobar si faltan buenas prácticas a la hora de redactar mensajes de commit en el skill?»**

   - → **Qué esperar:** GitHub Copilot repasa el estándar **Conventional Commits** y, si procede, completa el skill: el formato `tipo(ámbito): resumen`, la tabla de tipos (`feat`, `fix`, `docs`, `refactor`, `test`, `chore`…), el `BREAKING CHANGE` con `!` o footer, los footers como `Closes: #42`, y el procedimiento paso a paso.

4. 💡 **Pista.** Comprueba que el cuerpo del skill deja escrita la regla de oro: **el diff ya cuenta el cómo; el cuerpo del mensaje responde al porqué**. Y el par de ejemplos de «escueto ≠ vago». Son las dos reglas que hacen que los mensajes salgan útiles.

---

## Ejercicio 3 — Úsalo de verdad: genera un commit y valídalo antes de confirmar

*La prueba de que el skill sirve es verlo trabajar. Vas a subir tu primer cambio —el propio skill que acabas de crear— dejando que GitHub Copilot genere el mensaje con él, y pidiéndole que te lo enseñe antes de confirmar, para validarlo tú.*

### Tarea 3.1 — Que genere el mensaje y te lo muestre

1. Con el skill ya creado (ese es tu cambio pendiente), pídele:

   > **«Vamos a subir cambios, primero en local. Usa el nuevo skill de mensajes de commit para generar el mensaje del commit, y muéstramelo antes de hacer el commit para validarlo.»**

   - → **Qué esperar:** GitHub Copilot lee el skill, mira el cambio (`git status` / `git diff`), y te propone un mensaje con el formato del skill —algo como `feat(skills): añadir skill commit-message para mensajes de commit`— **sin confirmar todavía**. Te lo enseña para que lo valides.

2. 🔎 **Revisa el mensaje contra las reglas del skill, no contra que «suene bien».** ¿Tiene un tipo válido? ¿El resumen dice qué cambió sin que tengas que abrir el diff? ¿Está en imperativo y por debajo de los ~50 caracteres? Si el cambio lo merece, ¿el cuerpo explica el porqué?

### Tarea 3.2 — Aprueba, confirma y sube

3. Si el mensaje te convence, dale luz verde:

   > **«Ok, adelante con el commit.»**

   - → **Qué esperar:** GitHub Copilot hace el commit con el mensaje validado.

4. Y llévalo a tu repositorio remoto, como harías en equipo:

   > **«Sube los cambios también al remoto.»**

   - → **Qué esperar:** GitHub Copilot hace el `push` a tu repositorio de GitHub. Tu primer skill queda publicado, versionado junto al código.

> ⚠️ **Error común.** Si el mensaje sale genérico («update», «cambios»), casi siempre el problema está en la `description` o en las reglas del skill, no en este prompt. Vuelve al Ejercicio 2, afina el skill, y repite. Ese ciclo —probar, ver qué sale, ajustar el skill— es exactamente cómo se afina un skill en la vida real.

---

## Definition of Done

Este capítulo entrega un skill (un `SKILL.md`), no código compilable, así que su «hecho» es de **artefacto + comportamiento**. Lo has terminado cuando:

- [ ] Existe el fichero `.github/skills/commit-message/SKILL.md` con su frontmatter (`name`, `description`, `argument-hint`) y su cuerpo (formato, tipos, reglas, procedimiento).
- [ ] La `description` **enumera los disparadores** (no es un «ayuda con git» genérico).
- [ ] El cuerpo recoge **Conventional Commits** y las dos reglas de calidad (cuerpo = porqué; escueto ≠ vago).
- [ ] Le has pedido un commit y GitHub Copilot ha **generado el mensaje con el skill**, te lo ha mostrado para validar, y ha confirmado tras tu aprobación —y lo has subido a tu remoto—.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-2.1/commit-message`. La usas solo para mirar —nunca trabajas dentro de la demo—.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-2.1/commit-message
```

Abre su `.github/skills/commit-message/SKILL.md` y ponlo al lado del tuyo. No tiene por qué ser idéntico palabra por palabra —tu redacción del encargo influye—, pero la estructura y las reglas deben coincidir: el frontmatter, la tabla de tipos, las reglas de calidad y el procedimiento. Si a tu skill le falta alguna parte (por ejemplo el `BREAKING CHANGE` o los footers), añádela dirigiendo a GitHub Copilot.

Cuando termines de mirar, vuelve a tu proyecto (la otra carpeta) y sigue con lo tuyo.

---

## Reto opcional — tu segundo skill

Piensa en tu trabajo real. De las cosas que le pides a GitHub Copilot una y otra vez con las mismas reglas —el formato de un endpoint, la estructura de un test, un tipo de consulta—, elige una y **encárgale un segundo skill** para ella, con el mismo método: describe la tarea, revisa la `description`, afínala hasta que salte, y pruébala. Si te sale, ya tienes dos partes de tu capa 2.

---

## Lo que has practicado

Has creado tu primer skill desde cero encargándoselo a GitHub Copilot, lo has afinado hasta que su `description` lo activa cuando toca y su cuerpo recoge el estándar, y lo has usado para generar un mensaje de commit real que has validado antes de confirmar. Eso es la **capa 2**, funcionando con tus manos: conocimiento de una tarea, empaquetado y cargado bajo demanda.

**Puente al Lab 2.2.** Acabas de fabricar **un** skill a mano. Pero como el `SKILL.md` es un estándar abierto, hay un ecosistema entero de skills ya hechos, listos para instalar. Y en cuanto te traes uno que no escribiste tú, aparece una pregunta que no es menor: ¿qué estás metiendo, exactamente, en tu proyecto? En el Lab 2.2 exploras ese ecosistema y aprendes a inspeccionar un skill de fuera antes de confiar en él.
