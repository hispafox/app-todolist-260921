# 🧪 Lab M3.1 — El documento de análisis

**Lab versión 1 · Última actualización: 2026-07-03 · Base:** `temario/GHCOPTL-M3.1-documento-de-analisis.md`

En el capítulo has visto, sobre el papel, por qué un proyecto necesita un documento de análisis como única fuente de verdad, qué lleva dentro y cómo se mantiene al día. Ahora lo montas tú: le encargas a GitHub Copilot el skill `diseño-analisis`, generas con él tu `docs/analisis-diseño.md`, y luego vives el momento que lo prueba todo —el diseño cambia, y lo cambias en el documento, no en el código—. Al final comparas lo tuyo con la rama de referencia del capítulo, en la demo del curso.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Encárgale a GitHub Copilot el skill `diseño-analisis`
- **Ejercicio 2** — Genera el documento y recórrelo por dentro
- **Ejercicio 3** — El diseño cambia: actualiza el documento, no el código
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — el análisis de tu proyecto real
- **Lo que has practicado + puente al Lab 3.2**

---

## Overview

Al terminar este lab sabrás **encargar un skill de dominio** que genera el análisis del proyecto, **generar** con él tu documento fuente de verdad, y **mantenerlo al día** cuando el diseño cambia —cambiándolo en el documento, con el mismo skill, en vez de lanzarte al código—. El entregable es un `docs/analisis-diseño.md` real en tu repositorio: el contrato del que beberá todo lo que construyas a partir de aquí.

El detalle conceptual (DRY, las 7 secciones, el documento como contrato) está en la base del capítulo; este lab es la parte de tus manos.

> ⏱️ Tiempo estimado: 35–45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`) —ya la dejaste lista en los labs anteriores—.

**Trabajas en tu propio repositorio**, el mismo de los capítulos anteriores, en una sola rama. Sigues donde lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa (del 1.1) y tu skill `commit-message` (del 2.1). Encima de eso construyes hoy.

> 💡 **Lo que el skill va a leer.** El skill `diseño-analisis` no inventa el diseño: antes de escribir nada, lee dos ficheros de tu proyecto —el `.github/copilot-instructions.md` (stack, convenciones, modelo) y un `readme.md` con el objetivo del proyecto—. El primero ya lo tienes; si no tienes un `readme.md`, créate uno de tres líneas que diga que esto es una lista de tareas en ASP.NET Core, o deja que GitHub Copilot se apoye en las instrucciones. El análisis nace de lo que ya has escrito, no de la nada.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste una vez al principio del curso. Cuando termines, te asomas a su rama de este capítulo para comparar —solo para mirar, nunca trabajas dentro de la demo—.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el skill `diseño-analisis`

*El documento de análisis no lo escribes a mano de una sentada: tiene una estructura que se repite proyecto a proyecto, justo lo que merece un skill. Así que lo primero es fabricar el skill que lo genera. Experimenta a tu aire con cómo describes el encargo; cuanto mejor le expliques qué quieres, mejor sale el primer borrador.*

### Tarea 1.1 — Dale contexto y descríbele el skill

1. En el **modo agente**, empieza dándole el contexto del proyecto, como se hizo en clase:

   > **«Léete el readme para tener un poco de contexto con lo que te voy a pedir.»**

   - → **Qué esperar:** GitHub Copilot lee tu `readme.md` (y, de camino, las instrucciones del proyecto) y te resume de qué va la aplicación y qué pasos tiene por delante. Ya está situado.

2. Ahora encárgale el skill, dejando claro **qué genera** y que es **solo para este proyecto**:

   > **«Quiero ir creando skills para cada apartado del proyecto, y empezamos por el primero: el de diseño-análisis, que va a crear un `.md` con el análisis de todo el proyecto. El skill lo quiero solo para este proyecto.»**

   - → **Qué esperar:** GitHub Copilot te propone un `SKILL.md` para `.github/skills/diseño-analisis/`, con su frontmatter (`name`, `description`, `argument-hint` con salida por defecto `docs/analisis-diseño.md`) y un cuerpo cuyo corazón es un procedimiento: **leer el contexto** (readme + instrucciones), **generar** el documento con sus secciones, y **confirmar** dónde quedó.

   🔎 **Por qué este prompt.** Fíjate en las dos cosas que le dejas claras: **qué produce** (un `.md` con el análisis completo) y **el alcance** (solo este proyecto, así que va en `.github/skills/` del repositorio, no en tu configuración global). Y fíjate en el detalle que hace bueno a este skill: le pides que **lea** el contexto antes de escribir. Un skill de dominio que se inventara el diseño no serviría de nada.

### Tarea 1.2 — Que lo cree

3. Cuando el planteamiento te encaje, dale vía libre para que lo escriba:

   > **«Adelante, créalo.»**

   - → **Qué esperar:** GitHub Copilot crea `.github/skills/diseño-analisis/SKILL.md`. Ábrelo y comprueba el procedimiento: que el **Paso 1** sea leer `readme.md` y `.github/copilot-instructions.md`. Ese «leer antes de escribir» es la idea que vas a ver repetirse en todos los skills de dominio del curso.

### Tarea 1.3 — Guárdalo con tu skill del capítulo anterior

4. Ya tienes un cambio pendiente —el skill nuevo—. Súbelo reutilizando lo que montaste en el capítulo 2, para verlo trabajar:

   > **«Sube los cambios. Ya sabes qué skill utilizar para el mensaje de commit, ¿verdad?»**

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea encaja con `commit-message`, genera el mensaje con él —algo como `feat(skills): añadir skill diseño-analisis`— y, tras tu visto bueno, hace el commit y el `push` a tu repositorio.

   💡 **Pista.** Esto es la carga progresiva en acción: no has nombrado el skill de commits, pero su `description` encaja con «hacer un commit», así que GitHub Copilot lo trae solo. Dos skills tuyos empezando a trabajar juntos.

---

## Ejercicio 2 — Genera el documento y recórrelo por dentro

*El skill ya existe; ahora lo usas para lo que lo hiciste. Vas a generar el documento de análisis del proyecto y a recorrerlo sección a sección, porque entender qué captura cada una es entender qué debe llevar un análisis que sirva.*

### Tarea 2.1 — Invócalo y genera el análisis

1. Llama al skill por su nombre para que genere el documento:

   > **«/diseño-analisis Realiza el análisis y documentación del proyecto.»**

   - → **Qué esperar:** GitHub Copilot lee el contexto (readme + instrucciones), y crea `docs/analisis-diseño.md` con siete secciones: objetivo, stack, arquitectura de capas, modelo de datos, endpoints, decisiones de diseño (cada una con su porqué) y pendientes. Al terminar te confirma la ruta y resume las decisiones principales.

### Tarea 2.2 — Recórrelo y comprueba que sirve

2. Abre `docs/analisis-diseño.md` y recórrelo sección a sección. No busques que sea idéntico al del vídeo —tu proyecto y tu encargo influyen—; busca que **cada sección responda a su pregunta**:

   - ¿El **objetivo** dice en dos frases qué hace la app?
   - ¿El **stack** dice el papel de cada tecnología, no solo su nombre?
   - ¿La **arquitectura** trae el árbol de carpetas y las reglas de diseño?
   - ¿El **modelo de datos** define cada entidad con sus campos y tipos exactos?
   - ¿Los **endpoints** dicen verbo, ruta y qué responde cada uno?
   - ¿Las **decisiones** llevan su **porqué**, y no solo el qué?
   - ¿Hay una sección honesta de **pendientes**?

   🔎 **Por qué esta comprobación.** La sección de decisiones «con su porqué» es la que más se agradece meses después: es la que contesta al «¿por qué esto está hecho así?» sin que nadie tenga que reconstruirlo de memoria. Si tu documento dice «usamos SQLite» a secas, pídele que añada el porqué. Un análisis sin porqués envejece mal.

---

## Ejercicio 3 — El diseño cambia: actualiza el documento, no el código

*Aquí está la prueba de fuego, la que separa un documento vivo de un bonito fósil inicial. Llega una petición nueva, y la tentación es ir directo al código. Vas a hacer justo lo contrario: cambiar primero la fuente de verdad.*

### Tarea 3.1 — Amplía el diseño desde el documento

1. Pídele que incorpore una función nueva **actualizando la documentación**, tal como se hizo en clase:

   > **«Sobre el diseño hecho, agregamos la posibilidad de tareas repetitivas y plantillas de tareas. Utiliza el skill adecuado para actualizar la documentación.»**

   - → **Qué esperar:** GitHub Copilot vuelve a entrar por `diseño-analisis`, relee el documento y lo **amplía** sin rehacerlo: a `TodoItem` le aparecen los campos `EsRepetitiva`, `Recurrencia` y `ProximaFecha`; nace la entidad `PlantillaTarea`; se añade el enum `TipoRecurrencia` (`Diaria`, `Semanal`, `Mensual`); y la tabla de endpoints crece con las operaciones de plantillas. El documento pasa a su siguiente versión sin dejar de ser **el** documento.

2. 🔎 **Fíjate en lo que NO ha pasado.** No has tocado una sola clase de código. Has cambiado el **diseño**, y lo has cambiado donde manda: en el documento. El código que construyas después partirá de esta versión nueva, no de la vieja. Ese es el reflejo que mantiene la fuente de verdad viva: *cuando el diseño cambia, se cambia en el documento, no en veinte sitios sueltos.*

> ⚠️ **Error común.** La tentación natural es abrir un editor y empezar a crear las clases `PlantillaTarea` y compañía a mano «para ir avanzando». Si lo haces, el código tendría cosas que el documento no menciona, y acabas con dos verdades que se contradicen —justo lo que DRY previene—. La regla es al revés: primero el documento, después el código que se deriva de él.

### Tarea 3.2 — Guarda la nueva versión

3. Sube el documento ampliado, otra vez con tu skill de commits:

   > **«Sube los cambios con un buen mensaje de commit.»**

   - → **Qué esperar:** GitHub Copilot genera el mensaje con `commit-message` —algo como `docs(analisis): añadir tareas repetitivas y plantillas al diseño`—, y tras tu visto bueno confirma y sube. La evolución del diseño queda registrada, versión a versión.

---

## Definition of Done

Este capítulo entrega un documento (y el skill que lo genera), no código compilable, así que su «hecho» es de **artefacto + comportamiento**. Lo has terminado cuando:

- [ ] Existe el skill `.github/skills/diseño-analisis/SKILL.md`, y su procedimiento **lee el contexto** (readme + instrucciones) antes de generar.
- [ ] Existe el documento `docs/analisis-diseño.md` con sus **siete secciones**, generado con el skill.
- [ ] Las **decisiones de diseño** llevan su **porqué**, no solo el qué.
- [ ] Has ampliado el diseño (repetitivas + plantillas) **actualizando el documento con el skill**, sin tocar código.
- [ ] Sabes explicar, con el ejemplo del campo que añadiste, **por qué** una sola fuente de verdad evita las «dos verdades» que describe DRY.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-3.1/analisis`. La usas solo para mirar —nunca trabajas dentro de la demo—.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-3.1/analisis
```

Abre su `docs/analisis-diseño.md` y su `.github/skills/diseño-analisis/SKILL.md` y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra; busca que **las decisiones de fondo coincidan**: las siete secciones, el modelo con sus campos, la tabla de endpoints, y que el skill lea el contexto antes de escribir. Si a lo tuyo le falta algo —una sección, el porqué de una decisión—, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto (la otra carpeta) y sigue con lo tuyo.

---

## Reto opcional — el análisis de tu proyecto real

Coge un proyecto tuyo de verdad, uno del trabajo. Encárgale a GitHub Copilot que le monte un `diseño-analisis` y genera su documento —o, si el proyecto es grande, solo la sección de **modelo de datos** o la de **endpoints**—. Léelo con ojo crítico: ¿captura de verdad cómo está montado el proyecto, o hay decisiones importantes que solo están en la cabeza de alguien? Muchas veces, el simple ejercicio de escribir el análisis destapa incoherencias que llevaban meses ahí sin que nadie las viera.

---

## Lo que has practicado

Has fabricado tu primer skill de dominio, `diseño-analisis`, lo has usado para generar el documento fuente de verdad de tu proyecto, y has vivido el momento que lo prueba: el diseño cambió, y lo cambiaste en el documento —con el skill— en lugar de lanzarte al código. Eso es tener una única fuente de verdad y saber mantenerla: la base ordenada sobre la que se construye todo lo demás.

**Puente al Lab 3.2.** Ya tienes el contrato escrito. Ahora toca construir la primera parte a partir de él: el modelo de datos. Y ahí te vas a topar con una tentación muy natural —copiar la definición de las entidades **dentro** del skill del modelo, para tenerla a mano—. Esa copia, que parece cómoda, es justo lo que rompe todo lo que has montado aquí: crea una segunda verdad que se desincroniza a la primera de cambio. En el Lab 3.2 construyes el modelo **haciendo que el skill lea del documento**, y ves por qué esa es la diferencia entre un proyecto que envejece bien y uno que no.
