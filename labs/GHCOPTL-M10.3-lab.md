---
submódulo: M10.3
tipo: lab
título: "Lab M10.3 — Integración continua"
base: "temario/GHCOPTL-M10.3-integracion-continua.md"
rama-referencia: "submodulo-10.3/ci"
rama-partida: "submodulo-10.2/tests"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-12
---

# 🧪 Lab M10.3 — Integración continua

> **Lab versión 1 · Última actualización 2026-07-12 · Base:** [M10.3 — Integración continua](../temario/GHCOPTL-M10.3-integracion-continua.md)

En el capítulo viste, sobre el papel, cómo la red de tests deja de depender de tu memoria: un *workflow* de GitHub Actions que se dispara en cada *push* y en cada *pull request*, la cobertura que te enseña dónde tiene agujeros esa red, y los *health checks* que vigilan la aplicación ya en marcha. Aquí lo montas con tus manos. Y por el camino harás lo más revelador del lab: romper un test a propósito, para ver al guardián hacer su trabajo.

## En este lab

- **Resumen** — qué montas y qué practicas
- **Antes de empezar** — de dónde parte tu proyecto
- **Punto de partida** — tu repositorio y la demo de referencia
- **Ejercicio 1** — el `ci.yml`: que la red se dispare sola
- **Ejercicio 2** — la cobertura: el informe, en el servidor y en tu máquina
- **Ejercicio 3** — el guardián en acción: rompe un test a propósito
- **Ejercicio 4** — vigilar la aplicación en marcha: el endpoint `/health`
- **Compara con la solución de referencia**
- **Hecho cuando** — cómo sabes que has terminado
- **Reto opcional** — que el guardián no solo avise
- **Lo que te llevas — y lo que queda**

## Resumen

En el lab anterior tejiste la red de tests, y la lanzabas tú, a mano, cuando te acordabas. Aquí eliminas ese «cuando te acuerdes». Al terminar, tu repositorio tendrá un *workflow* de integración continua que compila y prueba las dos mitades del proyecto en cada cambio, un informe de cobertura que puedes consultar por dos caminos, y un endpoint de salud que sabe decir si la aplicación sigue en condiciones de trabajar.

Lo montas en cuatro tramos. Empiezas pidiéndole a GitHub Copilot el `ci.yml` y viéndolo ejecutarse en la pestaña Actions. Después le añades la cobertura y resuelves la duda que salió en clase: dónde acaba ese informe y cómo lo miras desde tu máquina. Luego llega la prueba de fuego, que es romper un test aposta y comprobar que el *pull request* se marca en rojo. Y cierras dándole a tu aplicación una forma nueva de contar cómo se encuentra: el `/health`.

Como en todos los labs, no vas a escribir el YAML a mano. Se lo encargas a GitHub Copilot y luego lees lo que ha hecho.

> **El porqué está en la base.** Este lab es la práctica. Si en algún paso quieres el fundamento —por qué CI y no CD, por qué la cobertura no se persigue al cien por cien, por qué un 503 y no un 200— lo tienes desarrollado en la [base del capítulo](../temario/GHCOPTL-M10.3-integracion-continua.md).

## Antes de empezar

Este lab parte del proyecto que vienes levantando. En concreto, tu repositorio necesita ya:

- La **batería de tests** de 10.2. Es lo que el CI va a ejecutar; sin tests, el *workflow* compilaría y poco más.
- El proyecto **subido a GitHub** y el flujo de *issues* y *pull requests* de 10.1, porque la señal del CI aparece justo ahí, en el *pull request*.

Y el banco de trabajo de siempre: **VS Code** con GitHub Copilot en **modo agente**, el **SDK de .NET 10** y **Git**.

## Punto de partida

Trabajas **en tu propio repositorio**. Llegas desde 10.2, así que tu proyecto ya tiene su red de tests; ahora la vas a automatizar.

Y tienes la **demo del curso como referencia**, `AppTodoList-curso`, que clonaste en el lab 1.1. La usas solo para mirar. Para ver dónde estaba el proyecto al terminar el capítulo anterior, sitúate en su rama —solo para leer, no tocas nada—:

```bash
cd AppTodoList-curso
git checkout submodulo-10.2/tests
```

Al final del lab volverás a la demo para comparar tu trabajo con la rama de **este** capítulo, `submodulo-10.3/ci`.

> **📌 Dos repositorios, dos papeles.** **El tuyo:** donde montas el CI, la cobertura y el `/health`. **La demo `AppTodoList-curso`:** la consultas —cambiando a la rama del capítulo— para comparar. Nunca trabajas dentro de la demo.

> **📌 Las ramas las crea el orquestador, no tú.** Igual que en 10.1: cuando haga falta una rama para abrir un *pull request*, se la pides a GitHub Copilot y él la crea. Tú no tecleas `git checkout -b` en ningún momento de este lab.

---

## Ejercicio 1: El `ci.yml` — que la red se dispare sola

El objetivo es que tus tests dejen de depender de que alguien los lance. Vas a pedirle a GitHub Copilot el *workflow*, subirlo, y verlo ejecutarse solo en la nube de GitHub.

Y como siempre: **experimenta a tu aire**. El prompt de abajo es el que se escribió en clase, pero puedes describirlo con tus palabras. Lo que no debe faltar es la frontera: **integración continua, sin desplegar**.

### Tarea 1.1: Encárgale el *workflow* de integración continua

1. En el chat, en modo agente, pídeselo tal como se pidió en clase:

   > **necesito implementar el proceso de momento de integracion continua en github actions, sin subir a azure**

   **→ Qué esperar.** GitHub Copilot estudia tu proyecto —qué hay que compilar, dónde están los tests, si tienes frontend— y crea el fichero `.github/workflows/ci.yml`. Lo normal es que te salga un *workflow* con **dos *jobs***: uno para el backend de .NET (checkout, `setup-dotnet`, `restore`, compilación en modo Release y `dotnet test`) y otro para el frontend de React (Node, `npm ci`, linter y compilación). Y con los disparadores puestos en `push` y `pull_request` hacia `main` y `develop`.

   > **🔎 Por qué le dices «sin subir a Azure».** Esa coletilla es la frontera del capítulo. Sin ella, GitHub Copilot puede entender que quieres el lote entero y montarte también el despliegue —la CD—, con sus credenciales, su suscripción y sus riesgos. Tú hoy quieres la mitad de comprobación: que cada cambio se compile y se pruebe. Desplegar es otra conversación, y no toca.

2. Antes de subir nada, **abre el `ci.yml` y léelo**. Busca tres cosas que diseccionaste en el capítulo: el bloque `on` (los disparadores, el «cuándo»), el `runs-on: ubuntu-latest` (la máquina limpia que no es la tuya), y el paso del `dotnet test` (el mismo comando que lanzabas a mano).

   > **💡 Si te falta algún job.** Si GitHub Copilot solo te ha montado el backend, díselo: pídele que el *workflow* vigile también el frontend. El CI protege el proyecto entero, y una red que deja una mitad fuera no protege de verdad.

### Tarea 1.2: Súbelo y míralo ejecutarse

1. Pídele que suba el trabajo:

   > **sube los cambios**

   **→ Qué esperar.** Hace el *commit* y el *push* a tu repositorio. Y en cuanto ese *push* llega a GitHub, el *workflow* se dispara: nadie lo lanza, lo lanza el evento.

2. Ve a tu repositorio en GitHub y abre la pestaña **Actions**. Ahí está tu *workflow* ejecutándose en vivo. Entra en la ejecución y despliega los *jobs*: verás los pasos completándose uno a uno, con sus marcas verdes.

   > **⚠️ Si no lo ves.** Le pasó a media clase, y suele deberse a una de dos cosas: o el *push* fue a una rama que **no está en los disparadores** (el `ci.yml` escucha a `main` y `develop`), o el fichero no quedó en la ruta exacta `.github/workflows/`. Compruébalo. Y si aun así no aparece, díselo a GitHub Copilot con la misma naturalidad con la que se dijo en clase —«**activa tambien la integracion continua**»—: te explicará que en GitHub Actions no hay nada que activar a mano, porque los *workflows* se ejecutan solos según sus disparadores, y se pondrá a buscar dónde está el desajuste.

3. Cuando el *workflow* termine en verde, párate un segundo en lo que acabas de conseguir: **tu batería de tests se ha ejecutado sin que tú la lanzaras**, en una máquina limpia, al otro lado del mundo, porque hiciste un *push*.

---

## Ejercicio 2: La cobertura — el informe, en el servidor y en tu máquina

Ya tienes los tests ejecutándose solos. La pregunta siguiente es la que hizo saltar media clase: vale, ¿pero **cuánto** de mi código están cubriendo esos tests? ¿Y dónde acaba ese informe?

### Tarea 2.1: Pregunta si la cobertura está dentro

1. Antes de pedir nada, hazle la pregunta tal como se hizo en clase —que son tres preguntas en una, y las tres importan—:

   > **en el proceso de CI esta incorporado el tema de las pruebas unitarias ?? Generas el informe de resultado de cobertura sobre los tests ? Aqui en local , y no se si tambien lo dejas en remoto**

   **→ Qué esperar.** GitHub Copilot revisa tu `ci.yml` y te dirá que los tests sí se ejecutan, pero que la **cobertura no se está midiendo**. Y se pondrá a arreglarlo: añade el `--collect:"XPlat Code Coverage"` al `dotnet test`, instala **ReportGenerator** para convertir esos datos en HTML, y sube el resultado como *artifact* de la ejecución, para que no se pierda cuando GitHub descarte la máquina.

   > **🔎 Qué es ese `--collect`.** Es la instrucción que hace que, mientras se ejecutan los tests, se vaya anotando por qué líneas de tu código van pasando. El resultado en crudo es un XML ilegible; ReportGenerator es quien lo convierte en una página que puedes mirar.

2. Sube el trabajo, para que el *workflow* nuevo entre en vigor:

   > **sube los cambios a github**

   **→ Qué esperar.** El *push* dispara otra vez el CI, y esta ejecución ya mide la cobertura. En la pestaña Actions, al final de la ejecución, te aparecerá el informe descargable como *artifact*.

### Tarea 2.2: Trae el informe a tu máquina

Descargar un *artifact* a mano cada vez es incómodo, y en clase la pregunta llegó enseguida.

1. Pregúntaselo como se preguntó allí:

   > **como me aseguro que tras cada CI tenga los informes en local tambien , hago un pull cada vez ?**

   **→ Qué esperar.** GitHub Copilot te propondrá publicar el informe en una **rama dedicada** del repositorio, `coverage-reports`, para que se traiga con un `git pull` como cualquier otro contenido. Dile que sí y deja que lo monte: añadirá al `ci.yml` un paso de publicación condicionado a los *push* a `main`, y el `permissions: contents: write` en la cabecera —porque publicar en una rama es escribir en el repositorio—.

   > **🔎 Por qué solo en `main`.** Fíjate en la condición `if` de ese paso. No quieres un informe nuevo por cada propuesta en discusión, muchas de las cuales ni se van a fusionar. Solo te interesa la foto de lo que ya está integrado. Y por eso la rama `coverage-reports` no aparecerá hasta que este cambio llegue a `main`.

2. Pero para trabajar hay un camino mejor, y es el que se pidió a continuación:

   > **Necesito el informe html de cobertura en local para examinarlo**

   **→ Qué esperar.** GitHub Copilot te crea un script, `generar-informe-cobertura.ps1`, que hace en tu máquina lo mismo que el CI hace en la suya: lanza los tests con cobertura, genera el informe con ReportGenerator y te lo abre en el navegador.

3. Ejecútalo y mira el informe con tus ojos:

   ```powershell
   .\generar-informe-cobertura.ps1
   ```

   **→ Qué esperar.** Se te abre una página con el porcentaje global arriba y el desglose por clase debajo. Y como el informe local se genera **completo**, puedes entrar en una clase concreta y ver su código fuente con cada línea pintada: verde si algún test pasa por ella, roja si no la toca ninguna.

   > **🔎 Los dos informes no son el mismo, y casi nadie lo mira.** El que publica el CI es un **resumen** (`HtmlSummary`): el porcentaje global y el desglose por clase, que es la foto que le interesa al equipo. El que genera tu script es el **completo**, el que te deja bajar hasta la línea. Así que para saber cómo va el proyecto tiras del informe del servidor, y cuando vayas a tapar un hueco concreto, del tuyo.

4. Busca en el informe una clase que esté en rojo o casi. No corras a subir el número: hazte la pregunta correcta, que es si las reglas de esa clase merecen un test. Si es lógica de negocio sin proteger, pídele al agente `generador-tests-unitarios` que le genere las pruebas. Si es código trivial, déjalo en paz.

   > **⚠️ La trampa del cien por cien.** Recuerda el ejemplo del capítulo: un test que llama a un método y solo comprueba que no explota da un cien por cien de cobertura de esas líneas sin verificar nada útil. La cobertura mide por dónde pasan tus tests, no si comprueban lo correcto. Úsala para ver dónde falta protección, nunca como una nota que subir.

---

## Ejercicio 3: El guardián en acción — rompe un test a propósito

Todo esto que has montado promete protegerte. Toca comprobarlo. Una red de seguridad en la que nunca te has dejado caer no te da ninguna confianza, así que aquí te dejas caer aposta.

### Tarea 3.1: Rompe algo, a sabiendas

1. Abre uno de los tests que generaste en 10.2 —cualquiera de la lógica de negocio vale— y **estropéalo a mano**: cambia el valor esperado de un `Assert` por uno equivocado. Si el test comprobaba que el resultado es 4, ponle que espera 7.

2. Comprueba en tu propia máquina que, efectivamente, está roto:

   ```bash
   dotnet test
   ```

   **→ Qué esperar.** Un test en rojo, con su nombre bien visible en la salida. Ese nombre que sigue el patrón `Método_Escenario_Resultado` te está contando, sin abrir el fichero, exactamente qué se ha roto.

### Tarea 3.2: Súbelo y mira lo que hace el CI

1. Pídele a GitHub Copilot que lleve este cambio a un *pull request*. Recuerda que la rama la crea él, no tú:

   > **sube este cambio en una rama y ábreme un pull request**

   **→ Qué esperar.** Crea la rama, hace el *commit* y el *push*, y abre el *pull request* contra `main`. En cuanto el *pull request* existe, el *workflow* se dispara —acuérdate del bloque `on`: escucha los `pull_request`, no solo los `push`—.

2. Ve al *pull request* en GitHub y **quédate mirándolo**. En unos segundos aparecerá la comprobación del CI ejecutándose, y al poco se pondrá en **rojo**, ahí mismo, al lado del botón de fusionar, a la vista de cualquiera que abra ese *pull request*.

   **→ Qué esperar.** Una marca roja con el nombre del *job* que ha fallado. Si entras en los detalles, verás la salida completa de `dotnet test` con el test que has roto señalado.

   > **🔎 Lo que acabas de ver.** Nadie ha revisado tu código. Nadie ha lanzado nada. Has subido algo roto y el sistema lo ha detectado y lo ha marcado, solo, en menos de un minuto. Aquella casilla «Tests pasan, cuando existan» que rellenabas a mano en 10.1 ya tiene quien la conteste, y esta vez ha contestado que no pasan.

3. Y ahora fíjate en un detalle incómodo: **el botón de fusionar sigue disponible**. GitHub te avisa de que el CI está en rojo, pero no te impide fusionar si te empeñas. El guardián avisa, pero todavía no protege. Eso lo arreglas en el reto opcional.

4. Deshaz el estropicio: devuelve el `Assert` a su valor correcto, súbelo a la misma rama, y mira cómo la señal del *pull request* pasa a **verde**. Ahora sí puedes fusionarlo con tranquilidad —y al hacerlo, ese `ci.yml` con la cobertura llegará por fin a `main`, así que aprovecha para comprobar que aparece la rama `coverage-reports`—.

---

## Ejercicio 4: Vigilar la aplicación en marcha — el endpoint `/health`

El CI vigila tu código antes de integrarlo. Pero cuando la aplicación ya está funcionando en un servidor, ¿quién comprueba que sigue en pie? Aquí le das la capacidad de contar cómo se encuentra.

### Tarea 4.1: Pídele el *health check*

En clase esto se hizo con el **Modo Issue** que dominas desde 10.1: el trabajo estaba anotado como un *issue* del proyecto y se le encargó al orquestador con un prompt tan seco como **«implementar issue 22»**. Haz lo mismo en tu repositorio, con el número que te toque a ti.

1. Abre un *issue* en tu repositorio describiendo el trabajo: un endpoint `/health` que informe del estado de la aplicación y verifique que la base de datos responde.

2. Encárgaselo al orquestador con el patrón del Modo Issue:

   > **implementar issue N**

   **→ Qué esperar.** El orquestador arranca el ciclo completo que ya conoces: crea la rama, el planificador escribe el plan, el desarrollador implementa, el verificador comprueba, y el orquestador remata abriendo un *pull request*. Para el `/health` se apoyará en el middleware de health checks de ASP.NET Core: registra la comprobación de la base de datos y mapea el endpoint. No hay entidades nuevas ni migraciones —esto es infraestructura de diagnóstico, no datos que guardar—.

### Tarea 4.2: Compruébalo con las dos respuestas

1. Arranca la aplicación y llama al endpoint desde el navegador o desde tu fichero `.http`:

   ```http
   GET http://localhost:5104/health
   ```

   **→ Qué esperar.** Un **200** con un JSON pequeño y legible: un `status` general en `Healthy` y el desglose de lo que ha comprobado, con la entrada de la base de datos también en `Healthy`.

2. Y ahora la comprobación que de verdad importa, la que separa un *health check* útil de uno decorativo: **túmbale la base de datos**. Para y edita la cadena de conexión de tu `appsettings.json`, apuntándola a una **carpeta que no exista** —algo como `Data Source=C:/no-existe/tareas.db`—. Arranca de nuevo y vuelve a llamar al endpoint.

   **→ Qué esperar.** Un **503 Unhealthy**. La aplicación sigue en pie —te está contestando—, pero no puede hacer su trabajo, y lo dice con un código de estado que cualquier herramienta de monitorización entiende sin tener que leer el cuerpo del mensaje.

   > **⚠️ Por qué una carpeta inexistente y no borrar el fichero.** Si te limitas a borrar o renombrar el `.db`, tu aplicación te dará un `Healthy` tan tranquila y pensarás que el *health check* está roto. No lo está: al arrancar, el proyecto llama a `EnsureCreated()`, y SQLite simplemente **vuelve a crear** el fichero que falta. Por eso hay que llevar la conexión a un sitio al que no pueda llegar. Es un buen recordatorio de que un test que no ves fallar no te está protegiendo de nada.

   > **🔎 Por qué un 503 y no un 200 con un texto de aviso.** Porque el código de estado es el idioma con el que tu aplicación habla con las máquinas que la vigilan. Un monitor que recibe un 503 sabe, sin interpretar nada, que esa instancia está viva pero no está lista para recibir tráfico. Si le devolvieras siempre un 200 con un «estoy mal» escondido dentro del JSON, tendría que leer y entender el texto para enterarse. El 503 es la diferencia entre avisar y que te entiendan.

3. Devuelve la cadena de conexión a su sitio, comprueba que el endpoint vuelve al 200, y cierra el trabajo fusionando el *pull request*, como en 10.1 —el *issue* se cerrará solo—.

---

## Compara con la solución de referencia

La demo `AppTodoList-curso` es tu solución de referencia.

1. Ve a la carpeta de la demo y sitúate en la rama de este capítulo —solo para leer—:

```bash
cd AppTodoList-curso
git checkout submodulo-10.3/ci
```

2. Pon su `ci.yml` al lado del tuyo. No busques que sean idénticos —cada uno dirige a GitHub Copilot con sus palabras—; busca que las **decisiones de fondo** coincidan:

   - Los **disparadores**: `push` y `pull_request` sobre `main` y `develop`.
   - Los **dos *jobs***, backend y frontend, ejecutándose en paralelo.
   - El `dotnet test` con `--collect:"XPlat Code Coverage"` y el paso de **ReportGenerator**.
   - La **publicación** del informe: como *artifact* y en la rama `coverage-reports`, esta última condicionada a los *push* a `main`.
   - El `permissions: contents: write` en la cabecera, que es lo que hace posible esa publicación.
   - El script **`generar-informe-cobertura.ps1`** para el informe completo en local.
   - El endpoint **`/health`**, con sus dos respuestas: 200 Healthy y 503 Unhealthy.

   > **⚠️ Verás detalles distintos.** Las versiones exactas de las *actions*, el nombre de los *jobs*, el orden de algún paso: es normal. Lo que cuenta es que la forma sea la misma y que el *workflow* termine en verde.

---

## Hecho cuando

Has terminado el lab cuando puedes marcar todo esto:

- [ ] Existe `.github/workflows/ci.yml` en tu repositorio, con dos *jobs* y disparado por `push` y `pull_request`.
- [ ] Has visto el *workflow* ejecutarse en la pestaña **Actions** y terminar en verde.
- [ ] El `dotnet test` del CI mide la cobertura, y el informe se publica como *artifact* y en la rama `coverage-reports`.
- [ ] Has generado el informe **completo** en local con `generar-informe-cobertura.ps1` y sabes entrar hasta las líneas de una clase.
- [ ] Sabes explicar la diferencia entre el informe del servidor (resumen) y el tuyo (completo), y cuándo usar cada uno.
- [ ] Has roto un test a propósito y **has visto la comprobación del *pull request* ponerse en rojo** sin que nadie lo revisara.
- [ ] Tu aplicación responde en `/health` con un **200 Healthy**, y con un **503 Unhealthy** cuando su base de datos no está accesible.
- [ ] Sabes explicar por qué aquí se hace CI y no CD.

## Reto opcional

En el ejercicio 3 viste el punto flaco del guardián: te avisa en rojo, pero te deja fusionar igual. Ponle el candado.

1. En los **ajustes de tu repositorio**, en la sección de ramas, activa la **protección de rama** *(branch protection)* sobre `main` y marca la comprobación del CI como **obligatoria**.

2. Repite el ejercicio 3: rompe un test, súbelo en una rama, abre el *pull request*. Y ahora mira el botón de fusionar.

   **→ Qué esperar.** GitHub lo bloquea. La comprobación deja de ser una recomendación que puedes ignorar y pasa a ser un requisito para entrar. Solo entonces `main` deja de recibir cambios a ciegas.

## Lo que te llevas — y lo que queda

Mira lo que llevas hecho. Le pediste a GitHub Copilot el `ci.yml` con la frontera bien puesta —comprobar sí, desplegar no—, lo subiste y viste tus tests ejecutarse solos en una máquina que no es la tuya. Le añadiste la cobertura y aprendiste a leerla por sus dos caminos, el resumen del servidor y el informe completo de tu máquina. Rompiste un test aposta y viste la comprobación ponerse en rojo sin que nadie mirara nada. Y le enseñaste a tu aplicación a decir 503 cuando su base de datos cae.

Con esto, M10 está entero, y el sistema también: tienes agentes que planifican, que implementan, que documentan y que trabajan en GitHub como un equipo; una red de tests que se lanza sola en cada cambio; y una aplicación que sabe contar cómo se encuentra. Todo el camino, desde el repositorio vacío hasta el proyecto listo para producción.

Así que ya solo queda la pregunta que cierra cualquier proyecto de verdad, y que no es técnica sino de negocio. En **11.1**, el último capítulo, la respondes con números: cuántas horas ha costado esto, cuánto habría costado sin GitHub Copilot, y qué retorno tiene el sistema que acabas de construir. Has montado la máquina; toca demostrar lo que vale.
