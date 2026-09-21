---
submódulo: M10.2
tipo: lab
título: "Lab M10.2 — La pirámide de pruebas"
base: "temario/GHCOPTL-M10.2-la-piramide-de-pruebas.md"
rama-referencia: "submodulo-10.2/tests"
rama-partida: "submodulo-10.1/github-flow"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-11
---

# 🧪 Lab M10.2 — La pirámide de pruebas

> **Lab versión 1 · Última actualización 2026-07-11 · Base:** [M10.2 — La pirámide de pruebas](../temario/GHCOPTL-M10.2-la-piramide-de-pruebas.md)

En el capítulo viste, sobre el papel, cómo tu sistema aprende a tejer su propia red de seguridad: el skill `tests-unitarios`, el agente que lo ejecuta, el patrón AAA y los tests reales capa por capa. Aquí lo montas con tus manos. Le enseñas a GitHub Copilot a generar pruebas unitarias, lanzas la primera batería sobre tu proyecto y ves los tests ponerse en verde —incluido el que blinda aquel fallo del *issue* #2 del capítulo anterior—.

## En este lab

- **Resumen** — qué montas y qué practicas
- **Antes de empezar** — de dónde parte tu proyecto
- **Punto de partida** — tu repositorio y la demo de referencia
- **Ejercicio 1** — el agente: enséñale a GitHub Copilot a generar tests
- **Ejercicio 2** — la primera batería: genera y ejecuta los tests
- **Ejercicio 3** — lee lo que se ha escrito: AAA, aislamiento y el test del #2
- **Compara con la solución de referencia**
- **Hecho cuando** — cómo sabes que has terminado
- **Reto opcional** — tests de una capa a demanda
- **Lo que has practicado + puente al lab siguiente**

## Resumen

En el lab anterior sacaste tu sistema a GitHub, y cada *pull request* te dejaba una casilla puesta pero sin marcar: «Tests pasan, cuando existan». Aquí la llenas. Al terminar, tu proyecto tendrá su batería de pruebas: una veintena larga de tests unitarios repartidos entre las tres capas, y un agente que sabe generar más cuando se lo pidas.

Lo montas en dos tramos. Primero le das a tu sistema la capacidad: creas el agente `generador-tests-unitarios`, con su frontera bien puesta —solo el primer nivel de la pirámide, nada de integración ni de extremo a extremo—. Después lo pones a trabajar: le pides que genere los tests de toda la aplicación, y lo ves ejecutarlos él mismo hasta dejar la compilación en verde. Y al final abres los ficheros que ha escrito para reconocer en ellos lo que diseccionaste en el capítulo: el patrón AAA, el aislamiento por capa, y el test que atrapa para siempre el fallo de integridad referencial.

Como en todos los labs, no vas a teclear los tests a mano: lo **diriges**. Le encargas a GitHub Copilot que monte el agente y genere las pruebas, y luego revisas lo que ha hecho.

> **El porqué está en la base.** Este lab es la práctica. Si en algún paso quieres el fundamento —por qué solo unitarias hoy, por qué el agente lleva `execute`, por qué cada capa se testea distinto— lo tienes desarrollado en la [base del capítulo](../temario/GHCOPTL-M10.2-la-piramide-de-pruebas.md).

## Antes de empezar

Este lab da por hecho el proyecto que has ido levantando en los capítulos anteriores. En concreto, tu repositorio necesita ya:

- Las **tres capas** que construiste en M04: la lógica de negocio, los servicios y los controladores. Son lo que vas a testear, y cada una se prueba de una manera distinta, así que las necesitas las tres.
- El **sistema de agentes** de M06-M07 —al menos el orquestador y sus especialistas—, porque el agente de tests se suma a ese equipo con el mismo patrón que ya conoces.

Y necesitas el banco de trabajo de siempre: **VS Code** con GitHub Copilot en **modo agente**, el **SDK de .NET 10** y **Git**.

## Punto de partida

Trabajas **en tu propio repositorio**, el que vienes construyendo desde el principio del curso. Llegas a este capítulo desde 10.1, así que tu proyecto ya trabaja dentro de GitHub; ahora le añades la red de tests.

Y tienes la **demo del curso como referencia**, `AppTodoList-curso`, que clonaste en el lab 1.1. La usas solo para mirar. Para ver dónde estaba el proyecto al terminar el capítulo anterior, sitúate en su rama —solo para leer, no tocas nada—:

```bash
cd AppTodoList-curso
git checkout submodulo-10.1/github-flow
```

Al final del lab volverás a la demo para comparar tu trabajo con la rama de **este** capítulo, `submodulo-10.2/tests`.

> **📌 Dos repositorios, dos papeles.** **El tuyo:** donde creas el agente de tests y generas las pruebas, en tu única rama de trabajo. **La demo `AppTodoList-curso`:** la consultas —cambiando a la rama del capítulo— para comparar. Nunca trabajas dentro de la demo.

---

## Ejercicio 1: El agente — enséñale a GitHub Copilot a generar tests

El objetivo es dar a tu sistema una capacidad que aún no tiene: escribir sus propias pruebas unitarias. Antes de generar un solo test, montas el agente que las va a producir, y le pones la frontera que importa —que se quede en el primer nivel de la pirámide—.

Y como siempre: **experimenta a tu aire**. El prompt de abajo es el que se escribió en clase, pero descríbelo con tus palabras si quieres. Lo que no debe faltar es la instrucción de acotar el alcance: solo unitarias.

### Tarea 1.1: Encárgale que cree el agente de pruebas unitarias

No vas a escribir el `.agent.md` a mano. Se lo describes a GitHub Copilot y deja que lo monte, igual que montaste cada agente del sistema en los capítulos anteriores. Este es, casi tal cual, el prompt con el que se puso en marcha en clase:

1. En el chat, en modo agente, pídeselo:

   > **Para el tema de integración continua necesitaremos el tema de pruebas unitarias, pero no hay nada por ahora, entonces necesitamos crear un agente que genere pruebas unitarias. Observa la pirámide de pruebas para generar esos tres tipos de pruebas; de momento solo queremos el primer nivel, pruebas unitarias, no de integración y tampoco e2e.**

   **→ Qué esperar.** GitHub Copilot estudia tu proyecto y monta el agente `generador-tests-unitarios`. Suele dejarlo con su `.agent.md`, sus herramientas y sus reglas: el patrón AAA, el uso de xUnit, Moq y FluentAssertions, y el compromiso de ejecutar `dotnet test` al terminar. Puede que primero te proponga un plan y espere tu visto bueno; si es así, dale luz verde.

   > **🔎 Por qué le insistes en «solo el primer nivel».** Esa frase no es un adorno: es la frontera del agente. La pirámide de pruebas tiene tres pisos —unitarias abajo, integración en medio, extremo a extremo en la cúspide—, y si no acotas el alcance, el agente puede irse a montar tests que levantan bases de datos reales o manejan un navegador. Al decirle «solo unitarias», le fijas el carril: prueba unidades aisladas, y nada más.

### Tarea 1.2: Comprueba que el agente quedó bien acotado

Antes de confiarle el trabajo, verifica que su definición dice lo que quieres. Esto lo miras tú, a ojo, en el fichero:

1. Abre el `.agent.md` del `generador-tests-unitarios` y busca su línea de `tools`. Debería tener cuatro:

   ```yaml
   tools: [read, search, edit, execute]
   ```

   Cada una está por un motivo. `read` y `search` para leer tu código. `edit` porque tiene que escribir los ficheros de test. Y `execute` —la que le da su carácter— porque va a lanzar `dotnet test` él mismo para comprobar que las pruebas pasan antes de darte nada.

2. Lee sus restricciones y confirma que el alcance quedó puesto: **solo pruebas unitarias**, nada de integración ni de extremo a extremo. Ese límite escrito es lo que lo mantiene dentro de su carril.

   > **💡 Si se le escapó el alcance.** Si ves que el agente contempla tests de integración o E2E, díselo a GitHub Copilot: pídele que lo acote al primer nivel de la pirámide. Es justo la lección del capítulo: el ámbito del agente es una decisión de diseño que tú controlas.

---

## Ejercicio 2: La primera batería — genera y ejecuta los tests

Con el agente listo, lo pones a trabajar. Y aquí surge una duda muy razonable, la misma que salió en clase: ahora que dominas el flujo de *issues* del capítulo anterior, ¿no debería abrir un *issue* para generar todos los tests?

### Tarea 2.1: Decide si esto necesita un *issue*

1. Antes de generar nada, hazte —y hazle a GitHub Copilot— la pregunta que se hizo en clase:

   > **Para generar todos los tests de la aplicación ahora, ¿tendríamos que generar uno o más issues?**

   **→ Qué esperar.** GitHub Copilot te explicará la convención del proyecto: los tests van con la característica que prueban, en el mismo trabajo, sin abrir un *ticket* de «añadir tests» que quede aparcado como deuda. Lo normal es invocar al agente directamente.

   > **🔎 Con honestidad: la excepción.** Hay una excepción, y es justo tu caso: cuando un proyecto ya lleva tiempo y **todavía no tiene ningún test** —como el tuyo ahora mismo—, generar la primera batería de golpe sí puede justificar un único *issue*, por dejar rastro de ese trabajo grande. La regla no es dogmática. Lo que evita es convertir «añadir tests» en un *ticket* recurrente cada vez que implementas algo, como si testear fuera opcional. De aquí en adelante, cada característica nueva vendrá con sus tests puestos, sin ceremonia.

### Tarea 2.2: Genera todos los tests

1. Ahora sí, ponlo a trabajar con el prompt directo de clase:

   > **genera todos los tests de la aplicación**

   **→ Qué esperar.** El agente recorre tu proyecto y va escribiendo tests para las tres capas, priorizando de lo más crítico a lo menos crítico: primero la lógica de negocio, luego los servicios, y por último los controladores. Si no tenías un proyecto de tests, lo crea —normalmente `AppTodoList.Tests`, con xUnit, Moq y FluentAssertions—. Y cuando termina de escribir, **ejecuta `dotnet test` él mismo** y no se detiene hasta dejar todo en verde.

   > **⚠️ Si algún test se queda en rojo.** Puede pasar que el agente encuentre un test que no pasa. Eso entra dentro de lo normal: encontrar un fallo es justo su trabajo. Recuerda el orden que sigue —primero sospecha del código, luego del doble, y solo al final del propio test—. Déjalo cerrar el ciclo; si se atasca, pídele que revise por qué falla ese test concreto. La regla de oro es que no se hace commit de nada en rojo.

### Tarea 2.3: Comprueba la red con tus propias manos

1. No te fíes solo de lo que diga el agente. Lánzalo tú desde el terminal, para verlo con tus ojos:

   ```bash
   dotnet test
   ```

   **→ Qué esperar.** El comando compila el proyecto de tests y ejecuta toda la batería. Deberías ver un resumen con el total de pruebas y **cero fallidas** —una veintena larga, repartidas entre controladores, servicios y lógica—. Eso es tu red de seguridad, tejida y funcionando.

   > **💡 Un solo comando, toda la red.** Fíjate en lo que acabas de conseguir: con un `dotnet test` lanzas de golpe todas las comprobaciones de tu proyecto, en segundos. Cada vez que un agente toque el código de aquí en adelante, este comando te dirá si algo se ha roto. Esa es la diferencia entre confiar a ciegas y tener una malla que atrapa las regresiones.

---

## Ejercicio 3: Lee lo que se ha escrito — AAA, aislamiento y el test del #2

Los tests ya pasan, pero el capítulo no iba solo de que existan: iba de entender cómo están hechos. En este ejercicio abres los ficheros que ha generado el agente y reconoces en ellos lo que diseccionaste sobre el papel.

### Tarea 3.1: Reconoce el patrón AAA y los nombres

1. Abre cualquiera de los ficheros de test —por ejemplo, el de un controlador, en `Tests/Controllers/`— y mira la estructura de un test cualquiera. Deberías reconocer las tres fases marcadas con comentarios:

   ```csharp
   // Arrange — preparar mocks, datos, sistema bajo prueba
   // Act — ejecutar el método a testear
   // Assert — verificar el resultado esperado
   ```

2. Fíjate también en los **nombres** de los métodos de test. Siguen el patrón `Método_Escenario_Resultado`, como `ObtenerPorId_ConIdInexistente_DevuelveNotFound`. Léelos: cada nombre te cuenta la historia completa sin abrir el cuerpo.

   > **🔎 Por qué importan los nombres.** El nombre del test es lo primero que ves cuando algo se pone en rojo en la salida de `dotnet test`. Si se llama `Test1`, tendrás que abrir el fichero para saber qué probaba. Si se llama `Crear_ConTituloVacio_LanzaValidationException`, ya sabes qué se rompió sin mirar nada más. Es diagnóstico gratis.

### Tarea 3.2: Mira cómo cambia la técnica por capa

1. Abre un test de la lógica de negocio, en `Tests/LogicaNegocio/`, y busca cómo se prepara la base de datos. Verás que usa una base **en memoria**, con un detalle importante:

   ```csharp
   .UseInMemoryDatabase($"{nombreBaseDatos}_{Guid.NewGuid():N}")
   ```

   Ese `Guid` pegado al nombre hace que cada test tenga su propia base, irrepetible, para que ninguno arrastre la basura de otro.

   > **⚠️ La base en memoria no es SQL de verdad.** Ojo con esto: esa base en memoria simula el contexto para probar tu lógica, pero no valida las restricciones de tu motor real ni ejecuta el SQL que correría en producción. Es perfecta para tests unitarios; para comprobar tu SQL de verdad necesitarías un test de integración, que es otro nivel de la pirámide y otro capítulo.

2. Ahora abre un test de un servicio y busca la palabra `Mock`. Aquí no hay base de datos: la dependencia se sustituye por un **doble controlado** con Moq, porque lo que se prueba es la traducción del servicio, no la lógica de debajo. Cada capa se aísla de lo que depende: la lógica con base en memoria, los servicios y controladores con dobles.

### Tarea 3.3: Encuentra el test que blinda el *issue* #2

1. En los tests de la lógica de negocio, busca uno que compruebe que crear una tarea con un usuario inexistente lanza una excepción. Se llamará algo como:

   ```csharp
   CrearAsync_ConUsuarioInexistente_LanzaArgumentException
   ```

   > **🔎 De dónde viene ese test.** ¿Te acuerdas del *issue* #2 del lab anterior —la violación de integridad referencial que el auditor cazó, poder borrar o asignar apuntando a un usuario que no existe—? Ese fallo, que en 10.1 se arregló a mano, ahora tiene su propio test. Está aquí, ejecutándose en cada `dotnet test`. Si algún día un agente toca esa validación y la rompe, este test se pone en rojo en el acto. Lo que antes cazó un auditor mirando el código una vez, ahora lo caza un test para siempre.

---

## Compara con la solución de referencia

La demo `AppTodoList-curso` es tu solución de referencia. Ahora la usas para revisar cómo quedó tu batería.

1. Ve a la carpeta de la demo y sitúate en la rama de este capítulo —solo para leer—:

   ```bash
   cd AppTodoList-curso
   git checkout submodulo-10.2/tests
   ```

2. Abre su carpeta `Tests/` y ponla al lado de la tuya. No busques que los tests sean idénticos —cada quien dirige a GitHub Copilot con sus palabras, y los datos de ejemplo pueden variar—; busca que las **decisiones de fondo** coincidan:

   - La estructura por capa: `Tests/Controllers/`, `Tests/Services/`, `Tests/LogicaNegocio/`.
   - El patrón AAA y la nomenclatura `Método_Escenario_Resultado` en todos los tests.
   - La técnica de aislamiento correcta en cada capa: base en memoria con `Guid` único en la lógica, dobles con Moq en servicios y controladores.
   - Que `dotnet test` pase en verde también en la referencia.

   > **⚠️ Verás detalles distintos.** El número exacto de tests, los datos de ejemplo, algún caso de más o de menos: es normal. Lo que cuenta es que la forma sea la misma —AAA, nombres que cuentan la historia, aislamiento por capa— y que la batería pase.

---

## Hecho cuando

Has terminado el lab cuando puedes marcar todo esto:

- [ ] Existe el agente `generador-tests-unitarios` en tu proyecto, con `execute` entre sus `tools` y el alcance acotado al primer nivel de la pirámide.
- [ ] Le has pedido que genere todos los tests y ha creado el proyecto de pruebas con xUnit, Moq y FluentAssertions.
- [ ] `dotnet test` pasa en verde, con una veintena larga de pruebas repartidas entre las tres capas.
- [ ] Sabes reconocer en los ficheros el patrón AAA, los nombres `Método_Escenario_Resultado` y la técnica de aislamiento de cada capa.
- [ ] Has encontrado el test que blinda el fallo de integridad referencial del *issue* #2.
- [ ] Sabes explicar por qué los tests van con la característica y no en un *issue* aparte.

## Reto opcional

Hasta aquí has generado toda la batería de golpe. En el día a día, lo más habitual es pedir tests de algo concreto que acabas de tocar. Pruébalo:

1. Elige una sola clase o una sola capa de tu proyecto y pídele al agente que le genere las pruebas —por ejemplo, «genera los tests de la capa de servicios»—. Fíjate en cómo acota el trabajo a lo que le pides.

2. Y ve más allá de que pasen: abre los tests que ha escrito y comprueba que cubre los **cinco escenarios** que enseña el capítulo —el caso feliz, los casos límite, las validaciones, el caso de null o no encontrado, y el manejo de errores—. Si ves que le falta alguno de peso, pídeselo: «añade un test para cuando el título viene vacío». Así compruebas que el agente no solo genera tests, sino que puedes dirigir su cobertura.

## Lo que has practicado + puente al lab siguiente

Mira lo que llevas hecho: creaste el agente `generador-tests-unitarios` con su alcance acotado al primer nivel, le pediste que generara toda la batería y lo viste ejecutarla él mismo hasta el verde, y luego abriste los ficheros para reconocer el patrón AAA, el aislamiento por capa y el test que blinda el *issue* #2. Esa casilla vacía del *pull request* —«Tests pasan, cuando existan»— ya tiene con qué llenarse.

Pero fíjate en quién lanza esa red: la lanzas tú, tecleando `dotnet test` cuando te acuerdas. Y «cuando te acuerdas» es justo el hueco por donde se cuelan las regresiones —el cambio con prisa, el viernes a última hora—. En el **lab 10.3** cierras ese hueco: montas la integración continua con GitHub Actions, para que estos mismos tests se ejecuten solos en cada *push* y en cada *pull request*, sin que nadie tenga que acordarse. La casilla «Tests pasan» pasará de marcarse a mano a marcarse sola.
