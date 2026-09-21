---
submódulo: M1.1
tipo: lab
título: "Lab M1.1 — Contexto, setup y las reglas de la casa"
base: "temario/GHCOPTL-M1.1-contexto-setup-instructions.md"
rama-referencia: "submodulo-1.1/setup"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-02
---

# 🧪 Lab M1.1 — Contexto, setup y las reglas de la casa

> **Lab versión 1 · Última actualización 2026-07-02 · Base:** [M1.1 — Contexto, setup y las reglas de la casa](../temario/GHCOPTL-M1.1-contexto-setup-instructions.md)

## En este lab

- **Resumen** — qué construyes y qué practicas
- **Antes de empezar** — lo que necesitas instalado
- **Punto de partida** — clonar el repositorio y situarte
- **Ejercicio 1** — los primeros intentos: del fichero genérico al fichero del curso
- **Ejercicio 2** — el commit de una palabra: afina las instrucciones
- **Ejercicio 3** — publícalo en GitHub, pero que lo haga él
- **Ejercicio 4** — el mensaje de commit, y la pregunta que abre el próximo capítulo
- **Compara con la solución de referencia**
- **Hecho cuando** — cómo sabes que has terminado
- **Reto opcional**
- **Lo que has practicado + puente al lab siguiente**

## Resumen

Aquí haces, con tus manos, lo primero que hace todo el curso: darle a GitHub Copilot el contexto que de fábrica no tiene. En concreto, su **primera capa** —las reglas de tu proyecto— escrita en un fichero, `.github/copilot-instructions.md`, que GitHub Copilot incorpora a cada petición sin que lo invoques.

Pero no vas a hacer un ejercicio de laboratorio abstracto. Vas a **revivir, paso a paso, la sesión real** en la que este fichero nació: los primeros intentos que salieron regular, el que sí encajó, el afinado de una sola palabra que lo cambió todo, la publicación del repositorio, y hasta la pregunta con la que terminó esa mañana —la que abre el capítulo siguiente—. Tecleas lo mismo que se tecleó en directo, y ves la historia desplegarse en tu pantalla.

Y nada de esto lo escribes a mano. Lo **diriges**: se lo encargas a GitHub Copilot desde el chat, ves qué te devuelve, y lo afinas donde no encaje. Ese gesto —encargar, revisar, comparar— es el que repites en cada capítulo. Aquí lo estrenas.

Al terminar tendrás el fichero funcionando: le pides a GitHub Copilot algo genérico, una clase cualquiera, y responde con tus convenciones —el castellano, las capas, lo que no quieres— sin que se las hayas repetido en el prompt. Ahí sabrás que la capa está puesta.

> **El porqué está en la base.** Este lab es la práctica. Si en algún paso quieres el fundamento —por qué capas y no un prompt gigante, qué corrección a mano te ahorra cada bloque del fichero— lo tienes desarrollado en la [base del capítulo](../temario/GHCOPTL-M1.1-contexto-setup-instructions.md).

## Antes de empezar

Necesitas el banco de trabajo montado. Es el mismo para todo el curso, así que esto lo haces una vez:

- **VS Code** con la **extensión de GitHub Copilot** instalada.
- Una cuenta de GitHub Copilot con acceso al **modo agente** —el que ejecuta tareas, no solo el que sugiere líneas mientras tecleas—. Cualquier plan que te lo dé sirve; no necesitas el más caro. Si ya usas GitHub Copilot en el trabajo, casi seguro lo tienes. *(El modo agente consume de tu plan: a julio de 2026 hay un plan gratuito y varios de pago, y el consumo por encima de lo incluido se factura aparte. Comprueba tus límites antes de lanzar muchas tareas seguidas.)*
- El **SDK de .NET 10**, **Node.js** y **Git**.
- La **GitHub CLI** (`gh`) —la herramienta de línea de comandos de GitHub—, con la que publicarás tu repositorio.

> **💡 Deja `gh` lista (una vez).** Instálala desde [cli.github.com](https://cli.github.com) (o con el gestor de tu sistema: `winget install GitHub.cli`, `brew install gh`…) y autentícala:
>
> ```bash
> gh auth login
> ```
>
> Elige **GitHub.com**, protocolo **HTTPS**, y completa el paso en el navegador. Comprueba que quedó lista con `gh auth status`. Con esto, GitHub Copilot puede crear tu repositorio desde el terminal, sin que salgas del editor. *(¿Prefieres no instalar nada? Crea el repositorio a mano en github.com y súbelo con `git push`; el resto del ejercicio es igual.)*

> **💡 Comprueba que lo tienes todo (una vez).** En un terminal, lanza `dotnet --version` (debe decir `10.x`), `node --version`, `git --version`, `gh --version` y `gh auth status` (que confirme que estás autenticado). Si algo de esto falla, arréglalo antes de empezar; te ahorra atascarte a mitad de ejercicio.

> **💡 Cómo saber si tienes el modo agente.** Abre el panel de chat de GitHub Copilot en VS Code y busca el selector de modo (arriba del cuadro de texto). Si entre las opciones aparece **Agent**, lo tienes. Es donde transcurre el curso entero.
>
> 📸 *(Captura: el panel de chat de GitHub Copilot con el selector de modo desplegado, señalando la opción **Agent**.)*

## Punto de partida

En este lab **trabajas en tu propio repositorio** —el de un proyecto tuyo, o uno nuevo que crees para practicar—. Ahí vas a crear tu `copilot-instructions.md`, afinarlo y publicarlo. Todo **en una sola rama**: en tu repositorio no vas a crear ramas, para no liarte.

Si arrancas de cero, monta la carpeta y el repositorio:

```bash
mkdir mi-proyecto
cd mi-proyecto
git init
```

Y te damos una **referencia para comprobar que vas bien**: el repositorio de la demo del curso, **`AppTodoList-curso`** —el mismo proyecto que se construyó en clase—. Lo clonas **una sola vez** (en otra carpeta, aparte de la tuya) y lo usas durante todo el curso solo para mirar:

```bash
git clone https://github.com/hispafox/AppTodoList-curso.git
```

La demo tiene **una rama por capítulo**. Para ver cómo quedó **este**, te sitúas en su rama —solo para leer, no tocas nada—:

```bash
cd AppTodoList-curso
git checkout submodulo-1.1/setup
```

Ahí tienes el `copilot-instructions.md` tal como quedó al terminar el capítulo 1.1. En el 2.1 harás `git checkout submodulo-2.1/commit-message`, y así en cada capítulo.

> **📌 Dos repositorios, dos papeles.** **El tuyo:** donde construyes, en una sola rama. **La demo `AppTodoList-curso`:** la clonas una vez y solo la consultas —cambiando a la rama del capítulo— para comparar tu trabajo con la solución. Nunca trabajas dentro de la demo.

## Ejercicio 1: Los primeros intentos — del fichero genérico al fichero del curso

El objetivo del ejercicio es tener un `.github/copilot-instructions.md` con las reglas de este proyecto, **creado dirigiendo a GitHub Copilot**, no tecleándolo tú. ¿Por qué así, si podrías copiar y pegar un fichero? Porque el fichero es lo de menos: lo que practicas es el gesto de **encargar y afinar**, que es lo que harás con todo a partir de ahora. El fichero saldrá; lo que se te tiene que quedar es cómo lo sacaste.

Y una cosa desde ya: **experimenta a tu aire**. Los prompts de abajo son los que se escribieron de verdad en clase, pero no hay uno canónico. Cambia el enunciado, pide más detalle, quítalo. Ver cómo cambia la respuesta según cómo pides es, en el fondo, de lo que va el curso.

### Tarea 1: El primer intento (el que salió regular)

Antes del fichero bueno hubo varios que no lo eran. Vamos a reproducir ese primer tanteo a propósito, porque enseña algo que de otra forma no se ve.

1. Abre el **panel de chat** de GitHub Copilot en VS Code y ponlo en **modo agente** (el selector de arriba, en **Agent**).

   📸 *(Captura: el panel de chat en modo Agent, cuadro de prompt vacío, sobre la carpeta de tu proyecto —`mi-proyecto`— abierta. No sobre la demo.)*

2. Pídele las instrucciones para el proyecto, tal como se pidió en el primer intento real —con una decisión de stack que, sin saberlo aún, luego cambiaría—:

   > **Crea un `copilot-instructions` típico para un proyecto de lista de tareas en ASP.NET Core 10 con páginas Razor. Usaremos SQLite y Entity Framework para acceder a los datos.**

   **→ Qué esperar.** Sale un fichero perfectamente razonable… para el proyecto que le has descrito: uno con **páginas Razor**. GitHub Copilot toma esa decisión que le diste y la reparte por todo el fichero, del frontend a la estructura.

   > **🔎 Qué acabas de ver.** No es ningún fallo: GitHub Copilot hizo justo lo que le pediste. El detalle está en lo que pasó después en el proyecto de verdad —aquel arranque con **Razor** no cuajó, y terminó siendo una **API con controladores y React**—. De ahí van a salir unos fósiles que reconocerás enseguida: esos «según decisión del curso». Quédate con la idea de fondo: la primera decisión no siempre es la definitiva, y el fichero tendrá que afinarse. Antes de seguir, **borra este primer intento** (o guárdalo aparte con otro nombre), para que el fichero bueno no se mezcle con el tanteo.

### Tarea 2: El fichero del curso

1. Ahora encárgale las instrucciones **encuadrando el proyecto** —es, casi tal cual, el prompt con el que nació el fichero de verdad—:

   > **Quiero crear un `copilot-instructions` para la aplicación de lista de tareas en ASP.NET Core que vamos a construir como demo del curso.**

   **→ Qué esperar.** GitHub Copilot no te suelta el fichero de golpe: primero mira lo que hay en tu proyecto —si ya tiene estructura, la lee; si arrancas de un repositorio vacío, se guía por tu prompt— y luego crea `.github/copilot-instructions.md` con las secciones que se esperan de un fichero así. En el mismo orden en que lo recorres en el vídeo, bloque a bloque. Primero, el **stack**:

   ```markdown
   ## Stack
   - **Backend**: ASP.NET Core Minimal API o Controllers (según decisión del curso)
   - **Base de datos**: SQLite con Entity Framework Core
   - **Frontend**: Razor Pages o React + Vite (según decisión del curso)
   - **Tests**: xUnit + Moq
   ```

   Después, un bloque de **arquitectura** —la estructura de carpetas y el flujo `Controller → DTO → Service → …`—, y a continuación las **convenciones de código**:

   ```markdown
   ## Convenciones de código
   - Idioma del código: **inglés** (nombres de clases, métodos, variables).
   - Siempre inyectar dependencias por constructor, nunca `new` directo de servicios.
   - Usar `async/await` en todos los métodos que accedan a base de datos.
   - Prefijo `I` para interfaces: `ITodoService`.
   - Los controladores solo orquestan — sin lógica de negocio dentro.
   ```

   Y por último, el **modelo de partida**. Ojo con este último:

   ```csharp
   public class TodoItem
   {
       public int Id { get; set; }
       public string Title { get; set; } = string.Empty;
       public bool IsCompleted { get; set; }
       public DateTime CreatedAt { get; set; }
   }
   ```

   > **📌 De dónde sale ese `TodoItem`.** No es una clase que exista en tu proyecto —en tu repositorio no hay una sola línea de código todavía—. Es un **ejemplo dentro del fichero de instrucciones**: el punto de partida y el estilo que le das a GitHub Copilot para cuando construyas el modelo de verdad, más adelante. Cuatro campos, ninguna validación, ninguna relación. Crecerá; hoy arranca así de pequeño.

   > **🔎 Por qué este prompt.** Le dices tres cosas en una frase: **qué** es (una lista de tareas), **en qué** está hecho (ASP.NET Core) y **para qué** (una demo de curso). Con eso GitHub Copilot orienta todo lo que genera. Fíjate en lo que **no** le dices: no le dictas las secciones del fichero. Se las sabe. Tu trabajo no es redactar el documento, es encuadrar el proyecto.

2. **Comprueba** que el fichero está donde tiene que estar: en `.github/copilot-instructions.md`, en la raíz del repositorio. Si GitHub Copilot lo creó en otro sitio, pídele que lo mueva ahí —es la ruta donde lo lee sin que lo invoques—.

3. Guárdalo en su primer commit, para tener un punto de partida al que volver:

   ```bash
   git add .github/copilot-instructions.md
   git commit -m "añadir instrucciones iniciales del proyecto"
   ```

   > **🔎 Por qué guardarlo ya.** A partir de aquí vas a **afinar** el fichero, y afinar con red significa comparar cada cambio con un estado anterior. Este primer commit es ese estado de partida: sin él, el retoque del próximo ejercicio se mezclaría con la creación entera y no se vería como lo que es —un cambio de una línea—.

> **⚠️ Lo que probablemente veas (y está bien).** También el fichero bueno nace con fósiles: esos «según decisión del curso» del stack son de cuando aún no estaba decidido si Razor o React, y el **idioma del código**, que salió en inglés. No los arregles todavía: el del idioma es, justo, el próximo ejercicio —el commit más famoso del capítulo—.

---

## Ejercicio 2: El commit de una palabra — afina las instrucciones

En el capítulo insistimos en una idea: un `copilot-instructions.md` no se escribe una vez y se da por cerrado. Se afina sobre la marcha, según ves qué código genera GitHub Copilot con él. Aquí vas a vivir ese afinado con el ejemplo más pequeño que existe —una sola palabra— y, de paso, montas la red que hace que afinar no dé ningún miedo: el control de versiones.

Como antes: el prompt es tuyo, y puedes tocar el fichero a mano cuando el cambio es tan pequeño como este. Lo que importa aquí es el gesto: ver el efecto de un cambio mínimo y dejarlo guardado.

### Tarea 1: Cambia una palabra, y mira la consecuencia

1. Abre `.github/copilot-instructions.md` y busca, dentro de «Convenciones de código», la línea del **idioma del código**. La tienes en **inglés** —así salió en el ejercicio anterior, y así se quedó en tu primer commit—:

   ```markdown
   - Idioma del código: **inglés** (nombres de clases, métodos, variables).
   ```

   Ese fue el punto de partida real: el fichero empezó diciendo que el código iba en inglés.

   > **📌 ¿A ti te salió en castellano?** GitHub Copilot no siempre elige lo mismo. Si tu fichero ya venía en castellano, ponlo un momento en inglés y haz un commit rápido; así reproduces el punto de partida real antes de corregirlo.

2. Ahora déjala como tiene que estar en este proyecto, cambiando **una sola palabra**:

   ```markdown
   - Idioma del código: **castellano** (nombres de clases, métodos, variables).
   ```

   > **🔎 Por qué una palabra pesa tanto aquí.** Ese fichero se lee en **cada** petición. La línea del idioma no describe un detalle: gobierna cómo se van a llamar todas las clases, métodos y variables que GitHub Copilot genere de aquí en adelante. Cambiar «inglés» por «castellano» reorienta, de golpe, todo lo que viene después. Por eso una corrección minúscula en las instrucciones vale más que reescribir a mano diez ficheros ya generados.

### Tarea 2: Guárdalo en su propio commit

Este es el gesto que convierte «tocar un fichero» en «afinar con red». Cada cambio de las instrucciones va a su propio commit, con un mensaje que dice qué cambiaste.

1. Desde el terminal integrado de VS Code, guarda el cambio en su commit:

   ```bash
   git add .github/copilot-instructions.md
   git commit -m "corregir idioma de código a castellano"
   ```

   > **💡 El control de versiones es tu red de seguridad.** Con cada afinado en su commit, siempre puedes ver qué cambiaste, cuándo y por qué —y volver atrás si una regla nueva empeora el resultado en vez de mejorarlo—. Afinar deja de dar miedo cuando sabes que ningún cambio es definitivo: todos se pueden deshacer.

   > **🔎 Qué acabas de practicar.** No es «hacer un commit» por hacerlo. Es tratar las instrucciones como lo que son: un documento vivo que evoluciona con el proyecto, con su propia historia de cambios. La misma disciplina que aplicas al código, aplicada a las reglas que dirigen a GitHub Copilot.

---

## Ejercicio 3: Publícalo en GitHub, pero que lo haga él

Tu fichero, por ahora, solo está en tu máquina —en tu repositorio—. Para trabajar como lo harías en equipo hace falta un paso más: publicarlo en GitHub, para que quien se incorpore se traiga el mismo contexto versionado. Y no vas a salir a la web a crearlo a mano: se lo pides a GitHub Copilot, y lo crea él con `gh` desde el terminal.

### Tarea 1: Pídele que cree el repositorio remoto

1. En el panel de chat, en **modo agente**, pídeselo:

   > **Créame un repositorio remoto en GitHub para publicar este código, y súbelo.**

   **→ Qué esperar.** GitHub Copilot usa `gh` en el terminal: crea el repositorio en tu cuenta —con algo parecido a `gh repo create <nombre> --public --source=. --push`—, lo enlaza como `origin` y sube tu código. Te pedirá **confirmación** antes de ejecutar comandos que tocan tu cuenta —crear un repositorio no es cualquier cosa—; ahí decides tú.

   > **⚠️ Elige la visibilidad a conciencia.** Ese `--public` publica el repositorio **en abierto**, a la vista de cualquiera. Para practicar con la lista de tareas va bien. Pero el día que hagas esto con código de tu trabajo, usa `--private` y asegúrate de no subir secretos —claves, cadenas de conexión, ficheros `.env`—. Cuando GitHub Copilot te proponga el comando, revísalo entero, incluida la visibilidad, antes de confirmar.

   > **⚠️ Si el paso se atasca.** Casi siempre es que `gh` no está autenticado. Vuelve a «Antes de empezar» y ejecuta `gh auth login`. (Y si prefieres no usar `gh`, crea el repositorio en github.com y súbelo tú: `git remote add origin <url>` y `git push -u origin` con tu rama.)

   > **🔎 El gancho de lo que viene.** Fíjate en lo que acaba de pasar: le has pedido en lenguaje natural algo que toca un servicio externo al editor, y lo ha hecho por ti. Hoy, ejecutando `gh` desde tu ordenador. En el último capítulo darás el salto —con **MCP** conectado, GitHub Copilot hablará con GitHub directamente, sin programa de por medio—. Acabas de rozar **MCP** sin darte cuenta.

2. **Comprueba** que quedó enlazado:

   ```bash
   git remote -v
   ```

   Verás tu repositorio recién creado, enlazado como `origin`.

### Tarea 2: Un cambio más, y que GitHub Copilot escriba el mensaje

1. Haz un retoque más en `.github/copilot-instructions.md` —añade una regla que te venga bien, una línea— y, sin guardarlo tú en un commit, encárgaselo a GitHub Copilot pidiéndole de paso el mensaje:

   > **Sube los cambios pendientes y, al subirlos, detalla completamente en el mensaje del commit todo lo que se ha cambiado.**

   **→ Qué esperar.** GitHub Copilot prepara el cambio, redacta un mensaje **largo y detallado** —punto por punto de lo que toca— y hace el `push` a tu repositorio. Fíjate en ese mensaje: lo vas a reescribir de otras formas en el ejercicio siguiente.

### Tarea 3: Local y remoto no son el mismo sitio

Aquí aparece un tropiezo clásico, y merece la pena vivirlo con calma, porque le pasa a todo el mundo. En aquella sesión, después de publicar, se afinó otra vez el fichero en local… y el remoto seguía mostrando la versión anterior. La sensación de «pero si ya lo cambié» es muy típica.

1. Haz un afinado más en `.github/copilot-instructions.md` —el que quieras, una regla nueva de una línea— y guárdalo en su commit, como en el ejercicio 2. **No hagas `push` todavía.**

2. Abre el repositorio en GitHub y mira el fichero. Verás la versión **de antes**: tu cambio no está ahí. Ahora pídele a GitHub Copilot que te lo aclare, tal como se preguntó en clase:

   > **En remoto no aparece el último cambio y en local sí. Compruébalo.**

   **→ Qué esperar.** GitHub Copilot mira el estado de git y te lo confirma: el commit está en tu máquina, pero **aún no se ha empujado** al remoto. En cuanto haces `push`, GitHub se pone al día.

   > **🔎 La idea que te llevas.** Tu máquina y GitHub son **dos sitios distintos**. Un commit guarda el cambio en local; el `push` es el que lo lleva al remoto. Entre uno y otro hay un hueco, y ese hueco es la causa de casi todos los «pero si yo ya lo había cambiado». Verlo una vez, a propósito, te ahorra el susto cuando pase de verdad.

---

## Ejercicio 4: El mensaje de commit, y la pregunta que abre el próximo capítulo

Ya tienes el hábito de guardar cada afinado en su commit. Falta la otra mitad: **qué escribes** en cada mensaje. En clase se le dio varias vueltas a esto, y de esas vueltas salió, sin buscarlo, el tema del capítulo siguiente. Vamos a recorrerlas.

### Tarea 1: El mismo cambio, tres mensajes distintos

Al subir en el ejercicio anterior, GitHub Copilot te dio un mensaje **detallado**. Vamos a pedirle el mismo cambio contado de otras dos formas, para que veas que el registro se dirige.

1. Pídele que lo apriete:

   > **¿Puedes ser un poco más específico con el mensaje de commit?**

   **→ Qué esperar.** Devuelve un mensaje más ceñido: menos relato, más «qué y por qué», centrado en lo que de verdad importa del cambio.

2. Y ahora al extremo contrario:

   > **El mensaje de commit, más escueto.**

   **→ Qué esperar.** Una línea, directa. Suficiente para saber qué pasó de un vistazo.

   > **🔎 Qué acabas de ver.** El mismo cambio, tres mensajes: detallado, específico, escueto. Ninguno es «el correcto» a secas; dependen de para qué escribes. Pero fíjate en el trabajo que te está costando: **se lo estás pidiendo a mano cada vez**, y cada vez sale con un criterio distinto. Guarda esa incomodidad, que es la que resuelve el capítulo siguiente.

### Tarea 2: Pon por escrito lo aprendido

1. Antes de cerrar, pídele que destile la lección, como se hizo en clase:

   > **Según lo que hemos comentado del commit, ¿qué hemos aprendido? Ponme el resumen aquí.**

   **→ Qué esperar.** Un texto corto con los criterios de un buen mensaje de commit: qué cambió, por qué, y en un formato consistente. Léelo pensando en lo siguiente.

### Tarea 3: La pregunta que lo cambia todo

1. Si esos criterios son siempre los mismos, lo natural es querer que se apliquen **solos**, sin repetirlos cada vez. Pregúntaselo:

   > **Si quisiera sistematizar la escritura de los mensajes de commit para que salgan siempre con estas características, ¿qué me recomiendas?**

2. Y llega la pregunta con la que terminó, de verdad, aquella mañana —quédatela—:

   > **¿No sería esto para un skill propio?**

   > **🔎 Aquí termina el capítulo, y empieza el siguiente.** Fíjate en lo que acaba de pasar. Las instrucciones son estupendas para lo que vale para **todo** el proyecto —el idioma, las capas, lo que no quieres—, pero no son el sitio para el detalle de **una** tarea concreta hecha siempre igual de bien. El mensaje de commit es justo esa tarea. Y la salida no es meterlo a empujones en las reglas generales: es empaquetar ese saber hacer en su propia herramienta. Eso es un **skill**, y montar el tuyo —`commit-message`— es lo primero que haces en el capítulo siguiente.

---

## Compara con la solución de referencia

No has trabajado en el vacío: la demo `AppTodoList-curso` que clonaste al principio es tu solución de referencia. Ahora la usas para revisar lo tuyo.

1. Ve a la carpeta de la demo y sitúate en la rama de este capítulo —solo para leer, no tocas nada—:

   ```bash
   cd AppTodoList-curso
   git checkout submodulo-1.1/setup
   ```

2. Abre el `.github/copilot-instructions.md` de la demo y ponlo al lado del tuyo. No busques que sean idénticos —cada quien dirige a GitHub Copilot con sus palabras, y el fichero sale algo distinto cada vez—; busca que **las decisiones de fondo coincidan**: el stack, las capas, el castellano, las reglas de contención.

   > **📌 Las dos tablas del final.** Verás que el fichero de la demo incluye, al cierre, dos tablas: **«Skills disponibles»** y **«Agentes disponibles»**. Están casi vacías a propósito. Son el **índice del sistema** que vas a construir en el resto del curso: cada capítulo irá rellenando una fila. No las necesitas hoy; te las señalo para que, cuando vuelvas aquí más adelante, veas cuánto has levantado desde este punto de partida.

   > **⚠️ Verás fósiles, y está bien.** En el fichero de la demo aparecen las mismas huellas del arranque que ya conoces: los «según decisión del curso» del stack, de cuando aún no estaba decidido si Razor o React. Es el documento tal como quedó, con su historia encima —no un descuido—. Lo que cuenta son las decisiones de fondo, no que cada palabra coincida con la tuya.

---

## Hecho cuando

Has terminado el lab cuando puedes marcar todo esto:

- [ ] El fichero `.github/copilot-instructions.md` existe en la raíz del repositorio, con sus bloques de stack, arquitectura, convenciones, modelo y reglas de contención.
- [ ] Le pides a GitHub Copilot algo genérico —una clase, un endpoint— y responde con **tus convenciones** (castellano, las capas, sin extras que no pediste) **sin que se las repitas en el prompt**. Esa es la prueba de que el fichero está trabajando.
- [ ] Has afinado el fichero al menos una vez (el idioma) y lo has dejado en su propio commit, y sabrías volver atrás.
- [ ] Has creado el repositorio remoto de tu proyecto con `gh` —o por la vía manual— y visto tus cambios llegar a GitHub.
- [ ] Sabes explicar, bloque a bloque, qué corrección a mano te ahorra cada parte del fichero.

## Reto opcional

Sal de la lista de tareas y ve a **tu proyecto real**, el de tu trabajo. De lo que corriges a GitHub Copilot un día tras otro, ¿qué **tres reglas** meterías hoy en un `copilot-instructions.md` para que dejara de proponerte eso que siempre acabas arreglando a mano? Escríbelas, créalas en un `.github/copilot-instructions.md` de tu repositorio, y comprueba el efecto: pídele una clase cualquiera y mira si sale ya con tu estilo. Si te salen tres reglas, tienes medio escrito el primer fichero de instrucciones de tu proyecto de verdad.

## Lo que has practicado + puente al lab siguiente

Mira lo que llevas hecho: dirigiste a GitHub Copilot para crear las reglas de tu casa, las afinaste con la seguridad del control de versiones, publicaste el repositorio en GitHub con `gh`, y dejaste el código donde el equipo lo comparte. La capa uno, montada con tus manos y funcionando.

Y te vas con una incomodidad en el bolsillo, la del ejercicio 4: pedir el mensaje de commit a mano, una y otra vez, y que salga distinto cada vez. Esa fricción no se arregla con las instrucciones —son demasiado generales para el detalle de una tarea—. Se arregla empaquetando ese saber hacer en una herramienta que se cargue justo cuando toca. En el **lab 2.1** montas la tuya: tu primer **skill**, `commit-message`. La segunda capa empieza ahí.
