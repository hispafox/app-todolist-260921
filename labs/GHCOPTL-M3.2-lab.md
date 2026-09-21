# 🧪 Lab M3.2 — Del documento al código: el modelo

**Lab versión 1 · Última actualización: 2026-07-05 · Base:** `temario/GHCOPTL-M3.2-del-documento-al-codigo-el-modelo.md`

En el capítulo has visto, sobre el papel, cómo se construye la primera capa de código a partir del contrato —el modelo— con un skill de dominio que lee las entidades del documento de análisis en vez de guardarlas dentro. Ahora lo haces tú, y con una vuelta de tuerca: vas a **caer en la trampa a propósito**, dejando el skill con las entidades escritas dentro, para luego desmontarla tú mismo. Así se te queda la lección de haberla vivido. Al final generas tu modelo, compruebas que compila, verificas que el código sigue al documento, y comparas con la rama de referencia del capítulo.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — Encárgale a GitHub Copilot el skill `modelo` (y cae en la trampa)
- **Ejercicio 2** — Desmonta la trampa: que el skill lea del análisis
- **Ejercicio 3** — Genera el modelo y verifica la lección
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — cambia el diseño y observa cómo el código lo sigue
- **Lo que has practicado + puente al Módulo 4**

---

## Overview

Al terminar este lab sabrás **fabricar un skill de dominio** que genera tu modelo de datos, **corregir el error de escribir las entidades a mano dentro del skill** para que las lea de la fuente de verdad, y **verificar** que el mecanismo funciona: cambias el diseño en el documento, regeneras, y el código lo sigue. El entregable es un `Models/` real en tu repositorio —`TodoItem`, `PlantillaTarea`, `TipoRecurrencia`— generado a partir de tu análisis.

El detalle conceptual (skill genérico vs de dominio, DRY hecho mecanismo, las reglas de generación) está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 35–45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`) —ya lista de los labs anteriores—.

**Trabajas en tu propio repositorio**, el mismo de los capítulos anteriores, en una sola rama. Sigues donde lo dejaste: ya tienes tu `.github/copilot-instructions.md` con las reglas de la casa (del 1.1) y tu `docs/analisis-diseño.md`, el documento de análisis con sus siete secciones (del 3.1). Ese documento es la parte clave de hoy: de él va a leer el skill del modelo.

> 💡 **Si no tienes el análisis a mano.** El skill `modelo` se niega a trabajar sin `docs/analisis-diseño.md` —lo verás—. Si te falta, vuelve un momento al capítulo 3.1 y genéralo con el skill `diseño-analisis`; necesitas su **sección 4**, la del modelo de datos, para este lab.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, te asomas a su rama de este capítulo para comparar —solo para mirar, nunca trabajas dentro de la demo—.

---

## Ejercicio 1 — Encárgale a GitHub Copilot el skill `modelo` (y cae en la trampa)

*El modelo no se escribe a mano: le encargas a GitHub Copilot un skill de dominio que lo genera leyendo tu análisis. Y aquí, a propósito, vas a dejar que el skill salga con el error del capítulo —las entidades escritas dentro— para vivir el problema antes de arreglarlo. Prueba a tu aire distintas formas de describir el encargo.*

### Tarea 1.1 — Descríbele el skill

1. En el **modo agente**, encárgale el skill dándole el objetivo y de dónde sacar la información, como en clase:

   > **«Me gustaría crear un skill para este proyecto, almacenado en este proyecto, cuyo objetivo sea crear y actualizar el modelo de la aplicación; léete el readme y el análisis de la aplicación para poder crear ese skill.»**

   - → **Qué esperar:** GitHub Copilot lee tu análisis y te propone un `SKILL.md` para `.github/skills/modelo/`, con su frontmatter y un procedimiento para generar las entidades.

2. Afínalo con un par de precisiones, las mismas de la sesión:

   > **«El skill permite actualizar el modelo y los elementos relacionados si hay cambios. Si no hay elementos relacionados, solo crea o actualiza el modelo. Las clases de modelo suelen estar en carpetas determinadas.»**

   🔎 **Por qué este encargo.** Fíjate en que desde el primer momento le dices «léete el análisis»: le estás señalando la fuente de verdad. Y con lo de «los elementos relacionados solo si hay cambios» le pides que no se meta a construir capas que aún no existen —tu proyecto todavía no tiene controladores ni base de datos configurada—.

### Tarea 1.2 — Déjalo caer en la trampa

3. Cuando el planteamiento te encaje, dale vía libre para que lo cree, y **ábrelo para mirar por dentro la sección de entidades**:

   > **«Adelante, créalo.»**

   - → **Qué esperar:** GitHub Copilot crea `.github/skills/modelo/SKILL.md`. Ábrelo y busca la sección que dice qué entidades generar. Con mucha probabilidad, GitHub Copilot habrá hecho lo más servicial: **listar tus entidades una a una, con todos sus campos**, dentro del propio skill.

4. 🔎 **Mira lo que acabas de crear.** Tienes el modelo escrito **dos veces**: una en `docs/analisis-diseño.md` (la fuente de verdad) y otra aquí, a mano, dentro del skill. Parece un detalle de calidad —el skill sabe exactamente qué generar—, y es justo lo que la hace peligrosa. Guarda esa sensación: en el ejercicio siguiente la desmontas.

> ⚠️ **Error común.** Si tu GitHub Copilot ha sido más listo y **ya ha escrito el skill para que lea del análisis**, sin listar las entidades dentro, enhorabuena: tienes un buen modelo mental. Aun así, haz el ejercicio 2 leyéndolo con ojo crítico, porque el objetivo es que **tú** reconozcas la diferencia entre un skill que copia y uno que lee.

---

## Ejercicio 2 — Desmonta la trampa: que el skill lea del análisis

*Le vas a decir a GitHub Copilot exactamente lo que se dijo en clase, y vas a ver el skill transformarse ante tus ojos: de guardar las entidades dentro a leerlas de la fuente de verdad. Esto es lo que de verdad importa del capítulo.*

### Tarea 2.1 — Nómbrale el problema

1. Dile lo que un desarrollador con experiencia vería, tal cual salió en la sesión:

   > **«En el skill no deberían estar las entidades actuales, porque si cambian habrá que cambiar el skill constantemente.»**

   - → **Qué esperar:** GitHub Copilot entiende el problema y **reescribe la sección de entidades**: quita la lista escrita a mano y la sustituye por una instrucción para leer la sección 4 del análisis en el momento de generar —«esa sección es la única fuente de verdad; no inferir ni añadir campos que no estén ahí»—. Puede que incluso quite los nombres de entidad de la `description` del frontmatter, por la misma razón.

2. 🔎 **Compara el antes y el después.** Antes, el skill llevaba tus entidades dentro; ahora no nombra ninguna: todas las lee del documento. Eso es DRY hecho mecanismo. La regla que te llevas, y que vale para todos los skills de dominio que construyas: **un skill de dominio no guarda el conocimiento del proyecto, lo lee de la fuente de verdad**.

### Tarea 2.2 — Guárdalo con tu skill de commits

3. Ya tienes un cambio pendiente —el skill nuevo, ya corregido—. Súbelo con lo que montaste en el capítulo 2:

   > **«Sube los cambios con un buen mensaje de commit.»**

   - → **Qué esperar:** GitHub Copilot reconoce que la tarea encaja con `commit-message`, genera el mensaje —algo como `feat(skills): añadir skill modelo que lee las entidades del análisis`—, y tras tu visto bueno hace el commit y el `push`.

---

## Ejercicio 3 — Genera el modelo y verifica la lección

*El skill ya lee de la fuente de verdad. Ahora lo usas para lo que lo hiciste —generar tus entidades— y luego haces la prueba que demuestra que el mecanismo funciona: cambias el diseño en el documento y observas cómo el código lo sigue.*

### Tarea 3.1 — Invócalo y genera las entidades

1. Llama al skill por su nombre, dándole el nombre de tu proyecto como en clase:

   > **«/modelo — me gustaría crear el modelo de la aplicación. El nombre del proyecto es AppTodoList.»**

   - → **Qué esperar:** GitHub Copilot lee la sección 4 del análisis y crea las clases en `Models/`, en el orden por dependencias: primero el enum `TipoRecurrencia`, luego `PlantillaTarea`, por último `TodoItem`. Abre `TodoItem` y comprueba las reglas hechas código: el namespace `AppTodoList.Models`, los cuatro campos ingleses (`Id`, `Title`, `IsCompleted`, `CreatedAt`), los valores por defecto puestos, ni una anotación de datos, ni un método.

2. Comprueba que compila:

   ```bash
   dotnet build
   ```

   - → **Qué esperar:** compila sin errores. Si te avisa de nullability en alguna propiedad de texto, revisa que el skill puso los valores por defecto (`= string.Empty`); ese es justo el ruido que las reglas de generación evitan.

### Tarea 3.2 — La prueba de fuego: cambia el diseño en el documento

3. Aquí verificas la lección con tus ojos. Pídele que amplíe el modelo **cambiando primero el documento**, y luego regenerando:

   > **«Añade al diseño una entidad Categoria, con Id, Nombre y Color. Actualiza el documento de análisis con el skill adecuado, y luego regenera el modelo.»**

   - → **Qué esperar:** GitHub Copilot actualiza `docs/analisis-diseño.md` (con `diseño-analisis`) y después regenera el modelo (con `modelo`), que **relee** el documento y crea la nueva clase `Categoria` en `Models/`. Fíjate en el orden: primero el documento, después el código que se deriva de él.

4. 🔎 **Fíjate en lo que ha pasado.** No has tocado el skill `modelo` para nada. Le has añadido una entidad y el skill la ha generado, porque lee la lista del análisis cada vez. Si las entidades hubieran seguido escritas dentro del skill —la trampa del ejercicio 1—, habrías tenido que editarlo a mano. Esa es la diferencia, y acabas de verla funcionar.

---

## Definition of Done

Este capítulo entrega código —el modelo— más el skill que lo genera. Lo has terminado cuando:

- [ ] Existe el skill `.github/skills/modelo/SKILL.md`, y su sección de entidades **lee de la sección 4 del análisis**, sin listar entidades a mano.
- [ ] Existe la carpeta `Models/` con `TipoRecurrencia`, `PlantillaTarea` y `TodoItem`, generados con el skill.
- [ ] `dotnet build` **compila sin errores**.
- [ ] Has ampliado el diseño (la entidad `Categoria`) **cambiando el documento y regenerando**, sin editar el skill a mano.
- [ ] Sabes explicar, con el ejemplo de esa entidad nueva, **por qué** un skill de dominio lee de la fuente de verdad en lugar de guardar su propia copia.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-3.2/modelo`. La usas solo para mirar —nunca trabajas dentro de la demo—.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-3.2/modelo
```

Abre su `.github/skills/modelo/SKILL.md` y su carpeta `Models/`, y ponlos al lado de los tuyos. No busques que sean idénticos palabra por palabra —tu encargo influye—; busca que **las decisiones de fondo coincidan**: que el skill lea las entidades del análisis en vez de listarlas dentro, que las clases estén en el orden por dependencias, con el namespace y las reglas de estilo. Si a lo tuyo le falta algo, pídele a GitHub Copilot que lo complete.

Cuando termines de mirar, vuelve a tu proyecto (la otra carpeta) y sigue con lo tuyo.

---

## Reto opcional — cambia el diseño y observa cómo el código lo sigue

Coge una de tus entidades y añádele un campo en el documento de análisis —a `TodoItem`, por ejemplo, un campo de prioridad—. Regenera el modelo con el skill y comprueba que el campo aparece en la clase, sin que tú lo hayas tocado a mano. Repítelo un par de veces con cambios distintos. Cada vez que el código sigue al documento sin que lo edites, se te graba un poco más la lección: la fuente de verdad manda, y el código se deriva de ella.

---

## Lo que has practicado

Has fabricado tu primer skill de dominio para el modelo, has caído en la trampa de escribir las entidades a mano dentro del skill y la has desmontado tú mismo, has generado tu modelo a partir del análisis, y has verificado la lección de la mejor manera: cambiando el diseño en el documento y comprobando que el código lo sigue. Eso es tener un skill de dominio que lee de la fuente de verdad, y saber por qué importa: es lo que hace que el sistema crezca sin pudrirse.

**Puente al Módulo 4.** Ya tienes el modelo, la capa de más abajo. Pero un modelo solo no es una aplicación: encima van el controlador que recibe las peticiones, los DTOs que definen qué entra y qué sale, el servicio que orquesta. En el módulo 4 construyes esas capas —y cada una es otro skill de dominio, con el mismo reflejo que acabas de aprender aquí: leer del documento en lugar de copiarlo—. Ahí descubres, además, cómo esos skills empiezan a encajar entre sí. El primer ladrillo ya está puesto.
