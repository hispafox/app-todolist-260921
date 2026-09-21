---
submódulo: M10.1
tipo: lab
título: "Lab M10.1 — GitHub: del hallazgo al merge"
base: "temario/GHCOPTL-M10.1-del-hallazgo-al-merge.md"
rama-referencia: "submodulo-10.1/github-flow"
rama-partida: "submodulo-9.4/capturas-playwright"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-11
---

# 🧪 Lab M10.1 — GitHub: del hallazgo al merge

> **Lab versión 1 · Última actualización 2026-07-11 · Base:** [M10.1 — GitHub: del hallazgo al merge](../temario/GHCOPTL-M10.1-del-hallazgo-al-merge.md)

En el capítulo viste, sobre el papel, cómo tu sistema de agentes deja de trabajar a solas y pasa a operar dentro de GitHub: la puerta (el MCP), la llave (la herramienta `github`), el intérprete (el skill `github-flow`) y el Modo Issue que los une. Aquí lo montas con tus manos. Conectas el MCP de GitHub a tu repositorio, le das al orquestador su última herramienta, abres un *issue* pequeño y lo ves recorrer solo el camino del `#N` al *pull request* fusionado —sin que teclees un comando de `git`—.

## En este lab

- **Resumen** — qué montas y qué practicas
- **Antes de empezar** — de dónde parte tu proyecto
- **Punto de partida** — tu repositorio y la demo de referencia
- **Ejercicio 1** — la puerta: conecta el MCP de GitHub
- **Ejercicio 2** — la llave y el intérprete: el orquestador aprende el Modo Issue
- **Ejercicio 3** — del `#N` al *merge*: el flujo entero rodando
- **Compara con la solución de referencia**
- **Hecho cuando** — cómo sabes que has terminado
- **Reto opcional** — el círculo virtuoso con GitHub de por medio
- **Lo que has practicado + puente al lab siguiente**

## Resumen

En los labs de M06 y M07 construiste un sistema de agentes que cierra cada trabajo con un commit y un push a `main`, en tu máquina. Aquí lo sacas a GitHub. Al terminar, ese mismo sistema sabrá arrancar de un *issue*, aislar el trabajo en su propia rama, proponer un *pull request* trazable y cerrar el *issue* al fusionarlo.

Lo montas en tres tramos. Primero conectas la **puerta**: el servidor MCP de GitHub, para que GitHub Copilot pueda leer *issues* y abrir *pull requests* dentro de tu repositorio. Después le das al orquestador la **llave y el intérprete**: la herramienta `github` en su `.agent.md` y el skill `github-flow` que encapsula las operaciones, con lo que estrena el **Modo Issue**. Y por último lo ves rodar de punta a punta con un *issue* de verdad.

Como en todos los labs, no vas a teclear los ficheros a mano: lo **diriges**. Le encargas a GitHub Copilot que monte la fontanería, la revisas, y luego le pasas el trabajo. Y hay un gesto nuevo que quiero que veas bien: en el Modo Issue **aparecen ramas**, pero tú no creas ninguna. Sigues sin teclear un solo `git checkout -b`. Es el orquestador quien crea la rama por ti, como parte del flujo. Ese es justo el punto del capítulo.

> **El porqué está en la base.** Este lab es la práctica. Si en algún paso quieres el fundamento —por qué un *pull request* y no un push directo, por qué la herramienta se concede explícitamente, qué gana el equipo con la trazabilidad— lo tienes desarrollado en la [base del capítulo](../temario/GHCOPTL-M10.1-del-hallazgo-al-merge.md).

## Antes de empezar

Este lab da por hecho el proyecto que has ido levantando en los capítulos anteriores. En concreto, tu repositorio necesita ya:

- El **orquestador** que montaste en 7.4 (`@orquestador-apptodolist`), con su ciclo planificar → implementar → verificar, y los agentes que coordina.
- El **auditor de calidad** de 7.2 (`@auditor-calidad`), si quieres hacer el reto opcional del final.
- Tu repositorio **publicado en GitHub** —lo hiciste en el lab 1.1—, porque el Modo Issue trabaja contra el remoto: lee *issues*, crea ramas y abre *pull requests* allí.

Y necesitas el banco de trabajo de siempre: **VS Code** con GitHub Copilot en **modo agente**, el **SDK de .NET 10** y **Git**. Una novedad de versión para el MCP: la conexión de un clic pide **VS Code 1.101 o posterior**.

> **💡 Comprueba tu versión de VS Code (una vez).** En VS Code, menú **Ayuda → Acerca de** (o `Help → About`). Si es 1.101 o superior, tienes el botón de conectar el MCP de un clic. Si es anterior, actualiza VS Code antes de empezar; te evita el atasco del primer ejercicio.

## Punto de partida

Trabajas **en tu propio repositorio**, el que vienes construyendo desde el principio del curso. Llegas a este capítulo desde 9.4, así que tu proyecto ya tiene la documentación automática montada; ahora le añades la capa de GitHub.

Y tienes la **demo del curso como referencia**, `AppTodoList-curso`, que clonaste en el lab 1.1. La usas solo para mirar. Para ver dónde estaba el proyecto al terminar el capítulo anterior, sitúate en su rama —solo para leer, no tocas nada—:

```bash
cd AppTodoList-curso
git checkout submodulo-9.4/capturas-playwright
```

Al final del lab volverás a la demo para comparar tu trabajo con la rama de **este** capítulo, `submodulo-10.1/github-flow`.

> **📌 Dos repositorios, dos papeles.** **El tuyo:** donde montas la fontanería de GitHub y corres el Modo Issue, en tu única rama de trabajo. **La demo `AppTodoList-curso`:** la consultas —cambiando a la rama del capítulo— para comparar. Nunca trabajas dentro de la demo.

---

## Ejercicio 1: La puerta — conecta el MCP de GitHub

El objetivo es que GitHub Copilot pueda **hablar con GitHub** desde tu editor: leer los *issues* de tu repositorio, y más adelante crear ramas y *pull requests*. Para eso necesita una puerta, y esa puerta es el servidor MCP de GitHub. Antes de dársela al orquestador, la abres y compruebas que funciona.

Y como siempre: **experimenta a tu aire**. Los prompts de abajo son los que se escribieron en clase, pero no hay uno canónico. Pídele que liste otra cosa, que te diga cuántos *pull requests* hay abiertos. Fíjate en qué contesta según lo que le pides: así entiendes qué alcance le has dado.

### Tarea 1.1: Conéctate al servidor MCP de GitHub

El MCP de GitHub que vas a usar es el que **hospeda el propio GitHub en la nube**: un servidor remoto, en `https://api.githubcopilot.com/mcp/`, que no instalas ni ejecutas en tu máquina. Te conectas a él y te autenticas con tu cuenta de GitHub.

1. En VS Code, abre la **vista de MCP** y añade el servidor de GitHub con el botón de conectar. VS Code te lleva a una pantalla de GitHub para que autorices el acceso: es **OAuth**, el mismo mecanismo con el que entras en cualquier aplicación con tu cuenta. Apruebas una vez, y VS Code guarda esa conexión en tu **configuración de usuario**.

   > **📌 Un apunte de fecha.** A julio de 2026, ese servidor hospedado está en fase de **vista previa pública**. Si tu cuenta es de una organización, puede que necesites que tu administración lo habilite antes de poder conectarte. Si trabajas con una cuenta personal, no tienes que hacer nada especial.

2. Si prefieres dejar la conexión **versionada en el proyecto**, para que todo el equipo la tenga a mano, la declaras en el `.vscode/mcp.json` que ya conoces desde el capítulo 1.1, con una entrada `github` que apunta a la `url` del servidor:

   ```json
   {
     "servers": {
       "github": {
         "url": "https://api.githubcopilot.com/mcp/"
       }
     }
   }
   ```

   > **⚠️ Error común: la clave equivocada.** Es la misma trampa que fijamos en 9.4. VS Code usa la clave `servers`, no `mcpServers` como algún otro cliente MCP. Si te equivocas de clave, VS Code sencillamente no ve el servidor y no te da un error claro; te quedas mirando por qué no aparece. Revísalo si la conexión no sale a la primera.

   > **🔎 Por qué apunta a una `url`.** Fíjate en que la entrada no lanza ningún programa en tu equipo: apunta a una dirección en la nube de GitHub. No hay nada que instalar en local. Te enchufas a un servidor que ya está en marcha, y GitHub se encarga de mantenerlo.

### Tarea 1.2: Comprueba que la puerta está abierta

1. Abre el chat de GitHub Copilot en **modo agente** y pídele algo que solo pueda contestar mirando GitHub. En clase, la primera prueba fue de las más directas —conectarse y ver a quién reconocía—:

   > **intenta conectarte al mcp de github**

   **→ Qué esperar.** GitHub Copilot usa una herramienta del MCP para consultar quién es el usuario autenticado, y te responde con tu cuenta de GitHub —tu *login*, tu perfil, tus repositorios—. Si te reconoce, la conexión está viva.

2. Y la prueba que de verdad vas a usar todo el capítulo: que te enumere el trabajo pendiente de tu repositorio:

   > **que issues tengo abiertos ?**

   **→ Qué esperar.** GitHub Copilot lee el remoto de tu repositorio para saber a quién preguntar, y te lista los *issues* abiertos que tengas. Si tu repositorio aún no tiene ninguno, te dirá justo eso: que no hay *issues* abiertos. Da igual —en el ejercicio 3 abrirás el primero—.

   > **🔎 De dónde saca el repositorio.** No se lo has dicho tú. GitHub Copilot mira `git remote -v` para averiguar el `owner` y el `repo` antes de preguntar a GitHub. Es la misma regla de oro que este curso lleva repitiéndote desde el principio: nunca inventes el propietario de un repositorio, léelo de la fuente real. Aquí lo ves aplicado por debajo, sin que tú lo pidas.

   > **⚠️ Si te dice que no puede conectarse.** Casi siempre es la autorización de OAuth a medias. Vuelve a la vista de MCP, comprueba que el servidor de GitHub aparece conectado, y si hace falta reautoriza el acceso. Hasta que esta comprobación no te devuelva algo de GitHub, no sigas: el resto del lab depende de esta puerta.

---

## Ejercicio 2: La llave y el intérprete — el orquestador aprende el Modo Issue

Tener la puerta abierta no significa que el orquestador pueda cruzarla. Como viste en 6.1, un agente solo usa las herramientas que su `.agent.md` le autoriza, y esa lista de `tools` es un contrato de poder. Tu orquestador todavía no tiene `github` en esa lista, así que aunque el MCP esté conectado, no puede abrir un *pull request*. En este ejercicio le das la llave (la herramienta `github`) y el intérprete (el skill `github-flow`), y con ellos estrena el Modo Issue.

### Tarea 2.1: Encárgale que incorpore el flujo de GitHub al sistema

No vas a escribir el skill ni a editar el `.agent.md` a mano. Se lo describes a GitHub Copilot y deja que lo monte, igual que montaste cada capa del proyecto en los capítulos anteriores. Este es, casi tal cual, el prompt con el que se puso en marcha en clase:

1. En el chat, en modo agente, pídeselo:

   > **Ahora necesito incorporar a nuestro sistema de desarrollo del agente orquestador: si algo viene de un issue, crear una rama, implementar un PR, etc. Lo estudiamos y lo ponemos en marcha.**

   **→ Qué esperar.** GitHub Copilot estudia tu sistema de agentes y monta el andamiaje del Modo Issue. Suele hacer tres cosas: crea el skill `github-flow` con sus operaciones para hablar con GitHub, añade la herramienta `github` a la lista de `tools` del orquestador, y prepara una plantilla de *pull request* en `.github/PULL_REQUEST_TEMPLATE.md`. También enseña al orquestador a **detectar** que un encargo viene de un *issue* —el paso que separa el Modo Issue del Modo Normal—. Puede que primero te proponga un plan de lo que va a montar y espere tu visto bueno; si es así, dale el adelante para que lo construya.

   > **🔎 Por qué un skill y no llamar al MCP directamente.** El orquestador podría usar las herramientas del MCP a pelo, pero las envuelve en `github-flow` por la misma razón que envolviste cada procedimiento desde M02: un skill encapsula las reglas para que se ejecuten igual siempre. Aquí la regla que no quieres repetir a mano en cada operación es validar el repositorio —el `owner`/`repo` desde `git remote -v`— antes de tocar GitHub.

### Tarea 2.2: Comprueba que el contrato de poder cambió

Antes de confiarle un trabajo de verdad, verifica que las tres partes están puestas. Esto lo miras tú, a ojo, en los ficheros:

1. Abre el `.agent.md` de tu orquestador y busca la línea de `tools`. La herramienta `github` tiene que estar en la lista, junto a las que ya tenía:

   ```yaml
   tools: [read, search, edit, execute, agent, github]
   ```

   Ese `github` del final es la última herramienta del orquestador, y cierra una evolución que llevas siguiendo desde M06: en 6.1 lo conociste con un plano simplificado de sus poderes, en 7.4 viste que además tenía `edit`, y ahora entra `github`.

2. Abre el `SKILL.md` de `github-flow` y comprueba que define las operaciones del flujo —leer un *issue*, crear una rama, crear un *pull request*, comentar en el *issue*—. No necesita más: es un skill de una sola responsabilidad, hablar con GitHub.

3. Comprueba que existe `.github/PULL_REQUEST_TEMPLATE.md` y échale un ojo. Busca dos detalles que importan:

   ```markdown
   ## Issue relacionado
   Closes #<número>

   ## Verificación
   - [x] `dotnet build` sin errores
   - [x] Verificador aprobó en X/3 iteraciones
   - [ ] Tests pasan (cuando existan)
   ```

   > **📌 La casilla que se queda sin marcar.** Fíjate en «Tests pasan (cuando existan)», vacía a propósito. Tu proyecto todavía no tiene pruebas —eso llega en 10.2—, así que la plantilla ya reserva el sitio que ocuparán. Hoy solo la rozas; no la marques ni intentes montar tests aquí.

   > **💡 Si algo no está.** Si al orquestador le falta el `github`, o no ves el skill o la plantilla, díselo a GitHub Copilot pidiéndole que complete lo que falte. La demo de referencia (al final del lab) te sirve para comparar cómo quedó cada fichero.

---

## Ejercicio 3: Del `#N` al *merge* — el flujo entero rodando

Ahora lo pones a trabajar con un *issue* de verdad. En clase, el primer recorrido fue deliberadamente sencillo —un cambio mecánico— para ver el flujo limpio antes de meterle miga. Haz lo mismo: un *issue* pequeño, y a mirar cómo el orquestador lo lleva del `#N` al *pull request* fusionado.

### Tarea 3.1: Abre un *issue* pequeño en tu repositorio

1. Piensa en un cambio mecánico y acotado de tu proyecto. El de clase fue unificar una nomenclatura: unos métodos de listado se llamaban `ObtenerTodas` mientras el resto del proyecto usaba `ObtenerTodos`. Cualquier retoque parecido te vale —renombrar algo para que sea consistente, corregir un texto repetido—.

2. Abre el *issue* en tu repositorio. Puedes crearlo en la web de GitHub, o pedírselo a GitHub Copilot desde el chat, ahora que tiene el MCP conectado. Ponle un título claro y una descripción de una o dos frases. Apúntate el **número** que le asigne GitHub: lo necesitas en el paso siguiente.

   > **🔎 Por qué un cambio pequeño primero.** No estás practicando el cambio; estás practicando el **flujo**. Un *issue* mecánico te deja ver el recorrido entero —rama, ciclo, *pull request*, cierre— sin que el trabajo en sí te distraiga. Cuando el flujo te resulte natural, ya le confiarás cosas serias.

### Tarea 3.2: Pásaselo al orquestador en Modo Issue

El gesto central del capítulo es este: no cambias de herramienta ni de agente. Le hablas al mismo orquestador de siempre, pero mencionas un `#N`, y él entiende que el trabajo nace de un *issue*.

1. En el chat, en modo agente, encárgaselo tal como se hizo en clase —cambiando el número por el de tu *issue*—:

   > **Me gustaría implementar el issue #25**

   **→ Qué esperar.** El orquestador detecta el `#N` y entra en Modo Issue. Lo verás recorrer el camino solo: **lee** el *issue* para saber qué pide, **crea la rama** `feature/issue-<N>-<slug>` desde `main` y se cambia a ella, y **ejecuta el ciclo** de siempre —planificador, desarrollador, verificador en bucle hasta el visto bueno—. Luego cierra en GitHub: hace el **commit y el push** con un mensaje que incluye `Closes #<N>`. A la rama de trabajo, ojo, no a `main`. Después **abre el *pull request*** hacia `main` con la plantilla y **comenta en el *issue*** con el enlace. Todo enlazado, sin que hayas tecleado un comando de `git`.

   > **📌 Las ramas las crea él, no tú.** Fíjate en que ha aparecido una rama `feature/issue-<N>-...` y tú no has escrito ningún `git checkout -b`. Y esa es la idea: en tu trabajo del día a día no creas ramas a mano, que se lía; aquí el orquestador las crea y las gestiona dentro del flujo. Tú sigues dirigiendo desde el chat.

   > **⚠️ Si el orquestador no arranca en `main`.** El flujo exige salir de `main` para que la rama nueva nazca limpia. Si estás en otra rama a medias, el orquestador te avisa antes de moverse: dile que vuelva a `main` y repite el encargo. (Si lo prefieres, un `git checkout main` en el terminal te deja listo.)

2. Mientras trabaja, **acompáñalo**: abre el *pull request* que crea en la web de GitHub y mira su cuerpo. Reconocerás la plantilla —el `Closes #<N>`, las casillas de verificación, la de «Tests pasan» sin marcar—.

   > **🔎 Qué pasa si el verificador no aprueba.** Si tras tres vueltas el verificador seguía pidiendo cambios, el orquestador no fuerza el cierre: abre el *pull request* en modo **borrador** *(draft)* y deja un comentario diciendo qué quedó pendiente. El trabajo queda visible y enlazado, pero marcado como no listo para fusionar. Es la misma prudencia del bucle de 7.4, ahora reflejada en el estado del *pull request*.

### Tarea 3.3: Revisa, fusiona y mira cómo se cierra el *issue* solo

1. Revisa el *pull request* en GitHub como lo harías con el de un compañero: lee los cambios, comprueba que hacen lo que pedía el *issue*. Cuando te convenza, dale por bueno y díselo al orquestador para que cierre el ciclo —el prompt real de clase—:

   > **ya hemos validado el pull request**

   **→ Qué esperar.** El orquestador fusiona el *pull request* en `main`, vuelve a la rama `main` y trae los cambios con un `pull`. Y llega el remate: como el *pull request* llevaba `Closes #<N>`, GitHub **cierra el *issue* solo** al fusionar. No tienes que acordarte de cerrarlo a mano.

2. **Comprueba** que el círculo se cerró. Pídele el estado, tal como se hizo en clase:

   > **dime que issues hay pendientes**

   **→ Qué esperar.** El *issue* que acabas de resolver ya no aparece entre los abiertos. El trabajo quedó cosido de punta a punta: la ficha, la rama, el plan, el código, el *pull request* y la decisión de fusionarlo, todo enlazado y consultable.

   > **🔎 La idea que te llevas.** Has recorrido el flujo de equipo entero —issue → rama → *pull request* → merge— dirigiendo a un solo agente desde el chat. Ese `main` al que antes subías a ciegas ahora solo recibe lo que ha pasado por una propuesta revisable. Y el rastro de por qué se hizo cada cambio queda escrito para quien venga después.

---

## Compara con la solución de referencia

La demo `AppTodoList-curso` es tu solución de referencia. Ahora la usas para revisar cómo quedó el montaje.

1. Ve a la carpeta de la demo y sitúate en la rama de este capítulo —solo para leer—:

   ```bash
   cd AppTodoList-curso
   git checkout submodulo-10.1/github-flow
   ```

2. Abre estos tres ficheros y ponlos al lado de los tuyos. No busques que sean idénticos —cada quien dirige a GitHub Copilot con sus palabras—; busca que las **decisiones de fondo** coincidan:

   - El `.agent.md` del orquestador: que su lista de `tools` termine en `github`.
   - El `SKILL.md` de `github-flow`: que defina las operaciones del flujo y que valide el `owner`/`repo` antes de tocar GitHub, y que **no** haga commit ni push (de eso se encarga el orquestador).
   - El `.github/PULL_REQUEST_TEMPLATE.md`: el `Closes #<número>` y la casilla «Tests pasan (cuando existan)» sin marcar.

   > **⚠️ Verás detalles que en tu versión salieron distintos.** Los nombres de las operaciones, el orden de las secciones de la plantilla, alguna regla de más: es normal. Lo que cuenta es que las tres partes encajen igual —puerta, llave, intérprete— y que el reparto de responsabilidades sea el mismo: el skill habla con GitHub, el orquestador decide qué se integra.

---

## Hecho cuando

Has terminado el lab cuando puedes marcar todo esto:

- [ ] El MCP de GitHub está conectado y GitHub Copilot, en modo agente, te responde con datos de tu repositorio (tu usuario, tus *issues*).
- [ ] Tu orquestador tiene `github` en su lista de `tools`, y existen el skill `github-flow` y la plantilla `PULL_REQUEST_TEMPLATE.md`.
- [ ] Has abierto un *issue* pequeño y se lo has pasado al orquestador con «implementa el issue #N».
- [ ] Lo has visto recorrer el Modo Issue: crear la rama `feature/issue-N-slug`, ejecutar el ciclo, abrir el *pull request* con su `Closes #N` y comentar en el *issue*.
- [ ] Has revisado y fusionado el *pull request*, y comprobado que el *issue* se cerró solo.
- [ ] Sabes explicar por qué las ramas las crea el orquestador y no tú, y por qué la herramienta `github` se concede de forma explícita.

## Reto opcional

En clase, el flujo mecánico fue solo el primer tanteo. Lo que de verdad enseñó el capítulo llegó con un caso serio: un *issue* que destapaba un fallo de integridad referencial —se podía borrar un usuario que aún tenía tareas asignadas, dejando la base de datos incoherente—. Y ahí saltó la pregunta que cierra el curso.

Si tienes el auditor de calidad montado (7.2) y tiempo para una pasada más, reprodúcelo:

1. Pídele al auditor que revise tu proyecto y **abra un *issue* por cada hallazgo** en GitHub. Elige uno que apunte a un fallo real del código generado.

2. Resuélvelo con el Modo Issue, como en el ejercicio 3. Pero antes de darlo por cerrado, hazte —y hazle a GitHub Copilot— la pregunta que de verdad importa, la de clase:

   > **Este issue implica que el sistema de generación no ha funcionado, porque no tuvo en cuenta este tipo de fallo. ¿Sería posible crear un issue nuevo para investigar este problema?**

   La idea es esta: si el sistema de agentes generó código con ese fallo, **el fallo no está solo en el código; está en el sistema que lo generó**. La reparación de verdad va más allá de parchear el síntoma: abre un segundo *issue* que escala hasta el **skill** que fabricó el código, para que se le añada la regla que faltaba y el mismo defecto no reaparezca en ningún otro sitio. Es el **círculo virtuoso** que diseccionaste en 7.3, ahora con la trazabilidad de GitHub de por medio: el hallazgo fue un *issue*, su arreglo un *pull request*, la causa raíz otro *issue*, y la corrección del molde otro *pull request*. Todo escrito y enlazado. Un equipo que trabaja así no solo arregla fallos: deja constancia de por qué existían y de cómo cerró la puerta para que no volvieran.

## Lo que has practicado + puente al lab siguiente

Mira lo que llevas hecho: conectaste el MCP de GitHub como puerta, le diste al orquestador la herramienta `github` como llave y el skill `github-flow` como intérprete, y con esas tres partes lo viste estrenar el Modo Issue —del `#N` al *pull request* fusionado, con el *issue* cerrándose solo—. Tu sistema de agentes dejó de ser un trabajador solitario y pasó a operar dentro de GitHub, con todo anotado.

Y queda una casilla sin marcar en cada *pull request*: «Tests pasan, cuando existan». Ahora mismo, lo único que se interpone entre un cambio y `main` es el verificador y tu revisión. No hay una red automática que ejecute pruebas y diga si algo se rompió, porque esas pruebas todavía no existen. En el **lab 10.2** las construyes —la pirámide de tests unitarios que hoy le falta al proyecto—, y en 10.3 las pones a ejecutarse en integración continua, para que cada *pull request* pase por un guardián automático antes de que nadie lo fusione. La casilla vacía de hoy es la promesa de esos dos capítulos.
