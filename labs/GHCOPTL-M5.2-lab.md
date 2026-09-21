# 🧪 Lab M5.2 — Depurar lo que el orquestador rompe

**Lab versión 1 · Última actualización: 2026-07-07 · Base:** `temario/GHCOPTL-M5.2-depurar-lo-que-el-agente-rompe.md`

En el capítulo has visto, sobre el papel, los dos fallos que el orquestador dejó al construir la característica del usuario asignado, y por qué el `dotnet build` no cazó ninguno. Ahora los provocas tú, con tus manos: arrancas la aplicación y ves la excepción saltar en vivo, la lees hasta su causa, aplicas el parche, y cierras el segundo círculo virtuoso arreglando el skill para que ese fallo no vuelva a colarse. Este es el lab de la otra mitad de dirigir a GitHub Copilot: depurar lo que construye.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — requisitos + tu repositorio + la demo de referencia
- **Ejercicio 1** — El fallo que el compilador no mira: el `.http`
- **Ejercicio 2** — El fallo que revienta al arrancar: la `AggregateException` de DI
- **Ejercicio 3** — El segundo círculo virtuoso: arregla el skill
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — provoca un tercer fallo de registro y depúralo con el método
- **Lo que has practicado + puente a M06**

---

## Overview

Al terminar este lab habrás **provocado y depurado los dos fallos reales** del usuario asignado. El primero: el `.http` sin los endpoints nuevos, que el compilador no mira y que cazas al ir a probar la API con la extensión REST Client. El segundo: la **`System.AggregateException`** que tumba la aplicación al arrancar; compila sin un error, pero revienta en ejecución porque falta un registro de inyección de dependencias en `Program.cs`. Habrás **leído esa excepción de fuera adentro** hasta la línea que nombra la causa, aplicado el **parche de una línea**, y, sobre todo, **cerrado el segundo círculo virtuoso**: mejorar el skill `servicio` con un checklist para que ese fallo de registro no vuelva a aparecer. El entregable es tu aplicación depurada y arrancando, y un skill más maduro que cuando empezaste.

El detalle conceptual —qué caza el compilador y qué no, por qué la validación de dependencias salta al arrancar, cuándo el arreglo va en tu código y cuándo en el skill— está en la base del capítulo; este lab es la parte práctica.

> ⏱️ Tiempo estimado: 40–55 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso):

- **VS Code** con la **extensión de GitHub Copilot** y una cuenta con acceso al **modo agente**.
- **SDK de .NET 10**, **Node.js**, **Git** y la **GitHub CLI** (`gh`), ya listos de los labs anteriores.
- La **extensión REST Client** para VS Code, que usarás para lanzar peticiones desde el `.http`. Si no la tienes, la instalas desde el panel de extensiones (busca «REST Client»).

**Trabajas en tu propio repositorio**, el mismo de siempre, en una sola rama. Sigues justo donde lo dejaste en 5.1: orquestaste el usuario asignado con `/nueva-feature`, el proyecto **compila**, y mejoraste el seeder. Lo que todavía no has hecho es **arrancar y probar** la aplicación con la característica nueva. En cuanto lo haces, salen a la luz los dos fallos que el `dotnet build` no vio. Este lab es exactamente ese momento.

> 💡 **Tu red de seguridad: la demo del curso.** La solución de referencia está en la demo `AppTodoList-curso`, que clonaste al principio. Cuando termines, abres su rama de este capítulo para comparar, solo para mirar; nunca trabajas dentro de la demo.

---

## Ejercicio 1 — El fallo que el compilador no mira: el `.http`

*Empezamos por el más leve, porque deja grabada la primera lección: el compilador solo revisa lo que se compila, y hay ficheros de tu proyecto que quedan fuera de su radar. Este fallo no rompe nada; simplemente, falta. Y como no salta solo, lo cazas tú al ir a usar la API.*

### Tarea 1.1 — Descubre que los endpoints nuevos no están en el `.http`

1. Abre el fichero `AppTodoList.http` de tu proyecto. Es tu cuaderno de pruebas: una lista de peticiones que lanzas contra la API sin salir de VS Code. Busca en él los endpoints del usuario asignado que acabas de orquestar —crear, listar, actualizar—.

   - → **Qué esperar:** no están. El orquestador creó el controlador con todos sus endpoints y el proyecto compiló, pero al skill del controlador se le olvidó añadir esas peticiones al `.http`. En clase, la observación de Pedro fue exacta:

   > **«a la hora de crear los controladores los endpoints no estás actualizando el archivo .http»**

   🔎 **Por qué el compilador ni se inmuta.** El `.http` no es código que forme parte de la aplicación: no se compila, no se ejecuta, no lo toca el `dotnet build`. Es una herramienta tuya, al margen del programa. Así que cuando el skill se olvidó de añadir ahí los endpoints nuevos, no hubo ningún error que saltara; faltaba algo en un sitio que el compilador no tiene por qué mirar. Esta es la primera familia de fallos que el compilador no cubre: la de lo que no compila —los ficheros de configuración, de pruebas, de datos—.

### Tarea 1.2 — Añade las peticiones y pruébalas con REST Client

2. Pídele a GitHub Copilot que complete el `.http` con las peticiones de los endpoints del usuario asignado, o añádelas tú a mano siguiendo el patrón de las que ya hay. Cuando las tengas, arranca la aplicación (`dotnet run`) y pruébalas. En clase, la siguiente pregunta fue precisamente cómo:

   > **«cómo probar en vs code el .http»**

   - → **Qué esperar:** con la extensión **REST Client** instalada, sobre cada petición del fichero aparece un enlace **Send Request**. Púlsalo y VS Code lanza la petición y te enseña la respuesta —el código de estado, las cabeceras y el cuerpo— en un panel al lado. El único requisito es que la aplicación esté arrancada en el puerto que espera el fichero, definido en su primera línea:

   ```
   @AppTodoList_HostAddress = http://localhost:5104
   ```

   💡 **Si tu puerto no coincide.** Ese puerto tiene que ser el mismo que el de tu `launchSettings.json`. Si no cuadra, cambias solo esa línea del `.http` y listo.

   ⚠️ **Puede que ni llegues a probar.** Al hacer `dotnet run` para arrancar, es posible que la aplicación no llegue a levantarse y, en su lugar, te reciba con una excepción. No es casualidad: es el segundo fallo, y lo desmontas en el Ejercicio 2. Si te pasa, ve directo allí y vuelve luego a rematar las pruebas del `.http`.

---

## Ejercicio 2 — El fallo que revienta al arrancar: la `AggregateException` de DI

*Este es de otra categoría, y da un susto de verdad. Le das a arrancar y la aplicación se cae de golpe, con una excepción larga y de mala pinta. Lo desconcertante es que el proyecto compila sin un solo error. Aquí aprendes a leer ese muro de texto con calma, capa por capa, hasta que él mismo te dice qué falta.*

### Tarea 2.1 — Provoca la excepción

1. Arranca la aplicación con `dotnet run`. Antes de servir una sola petición, se cae con una excepción parecida a esta (la que se vio en clase):

   ```
   System.AggregateException: Some services are not able to be constructed
    (Error while validating the service descriptor
     'ServiceType: AppTodoList.Services.IUsuarioAsignadoService
      Lifetime: Scoped
      ImplementationType: AppTodoList.Services.UsuarioAsignadoService':
      Unable to resolve service for type
      'AppTodoList.LogicaNegocio.IUsuarioAsignadoLogica'
      while attempting to activate
      'AppTodoList.Services.UsuarioAsignadoService'.)
   ```

   - → **Qué esperar:** la aplicación no arranca. Y lo que más despista: **el proyecto compila**. Todas las clases existen —`UsuarioAsignadoService`, `IUsuarioAsignadoLogica`, todas—. Este es un fallo de **tiempo de ejecución**; por eso el `dotnet build` no podía verlo.

   🔎 **Por qué revienta al arrancar y no antes.** Cuando arrancas en desarrollo, la línea `builder.Build()` de `Program.cs` construye el contenedor de inyección de dependencias, y ASP.NET Core hace algo muy sensato: **valida** que puede fabricar cada servicio registrado, comprobando que todas sus dependencias estén también registradas. Ahí descubre el hueco: `UsuarioAsignadoService` pide por su constructor una `IUsuarioAsignadoLogica` que nadie registró en `Program.cs`, no sabe con qué construirla, y aborta el arranque entero.

   ⚠️ **Ese chequeo, por defecto, solo se ejecuta en desarrollo.** La validación del contenedor al arrancar está activa de serie en **Development**. En producción no se ejecuta así, y el mismo hueco explotaría más tarde, en la primera petición que use el servicio. Por eso arrancar en local **antes** de desplegar te caza el fallo cuando aún es barato arreglarlo, no en cara del usuario en producción.

### Tarea 2.2 — Lee el error hasta la causa

2. Una excepción de treinta líneas asusta, y el reflejo de mucha gente es cerrar los ojos o probar cosas al azar. Haz lo contrario: recórrela por capas, de fuera adentro.

   - **La capa de fuera**, el titular: `Some services are not able to be constructed`. Aún no sabes cuáles, pero ya sabes la familia del problema: es de construcción de servicios, o sea, de inyección de dependencias.
   - **La capa siguiente** nombra el servicio que falla: `IUsuarioAsignadoService`, con su implementación `UsuarioAsignadoService`.
   - **El corazón del mensaje**, la última frase, es la que resuelve el caso: `Unable to resolve service for type 'IUsuarioAsignadoLogica' while attempting to activate 'UsuarioAsignadoService'`. Traducido: «intentando fabricar `UsuarioAsignadoService`, no encuentro con qué construir la `IUsuarioAsignadoLogica` que pide». Ahí está la causa, con nombre y apellidos: **falta el registro de `IUsuarioAsignadoLogica`**.

   En clase, Pedro llegó a esa conclusión leyendo justo eso, y la dijo antes de tocar nada:

   > **«Creo que es un error del skill que no ha registrado los servicios en el program»**

   💡 **Apóyate en GitHub Copilot para diagnosticar.** La misma herramienta que construye es buenísima leyendo errores. Pégale el mensaje **entero** —el texto tal cual, no un resumen tuyo—: te señalará el registro que falta y te propondrá la línea. Diriges igual que siempre: le das el contexto (el error) y revisas lo que te devuelve.

### Tarea 2.3 — Aplica el parche en `Program.cs`

3. Localizada la causa, el arreglo rápido es de una línea. Abre `Program.cs`, y donde se registran las lógicas de negocio, añade la que faltaba:

   ```csharp
   builder.Services.AddScoped<ITodoLogica, TodoLogica>();
   builder.Services.AddScoped<IPlantillaLogica, PlantillaLogica>();
   builder.Services.AddScoped<IUsuarioAsignadoLogica, UsuarioAsignadoLogica>();  // ← la que faltaba
   ```

   - → **Qué esperar:** arrancas otra vez con `dotnet run`, y la aplicación se levanta. Vuelve al `.http` del Ejercicio 1 y termina de probar los endpoints del usuario asignado con Send Request: ahora responden. Fallo resuelto… a medias, como verás en el Ejercicio 3.

---

## Ejercicio 3 — El segundo círculo virtuoso: arregla el skill

*El parche levanta la aplicación, pero es solo la mitad del arreglo, y la menos importante. Ese hueco no es un descuido tuyo: lo dejó el skill. El de `servicio`, y de rebote el orquestador `nueva-feature`, registraban el servicio pero se olvidaban de la lógica de la que ese servicio depende. Así que la próxima vez que orquestes una característica, volverá a pasar. Reconoces el movimiento: es el círculo virtuoso de 5.1, en su segunda vuelta.*

### Tarea 3.1 — Mejora el skill para que el fallo no vuelva

1. En clase, Pedro no se conformó con la línea. Su siguiente instrucción fue directa al origen:

   > **«para que no pase más por favor arregla el skill correspondiente»**

   Pídeselo a GitHub Copilot: que mejore el skill `servicio` para que su paso de registro en `Program.cs` deje de olvidarse la lógica. La idea es la misma que en 5.1: mejorar la herramienta para que el fallo no vuelva.

   - → **Qué esperar:** el Paso 5 del skill `servicio` —el de registrar en `Program.cs`— pasa de una instrucción floja a una regla con red, con un checklist que obliga a registrar **las dos** dependencias:

   ```markdown
   ### Paso 5 — Registrar los servicios en `Program.cs`

   Abrir `Program.cs` y añadir el registro de **la lógica de negocio y el servicio** de cada
   recurso generado como `Scoped`.
   **OBLIGATORIO: registrar ambas dependencias — si falta alguna, la app falla al arrancar.**

   > **Checklist de verificación antes de terminar:**
   > - [ ] Cada `I<Recurso>Logica` tiene su `AddScoped` en `Program.cs`
   > - [ ] Cada `I<Recurso>Service` tiene su `AddScoped` en `Program.cs`
   > - [ ] El orden es: primero la lógica, después el servicio que la consume
   ```

   La misma corrección se lleva al skill `nueva-feature`, para que el orquestador herede la regla completa. A partir de ahí, ese fallo no vuelve —ni para ti, ni para nadie que use el skill—.

   🔎 **Por qué esta mitad es la que cuenta.** El parche del Ejercicio 2 levanta la aplicación de hoy. Mejorar el skill protege todas las características que orquestes a partir de ahora: has convertido un error concreto en una regla permanente del sistema. Cada fallo que encuentras y llevas al skill deja la herramienta mejor de lo que estaba, y eso es lo que madura una herramienta con el tiempo.

   > 📝 **Nota sobre el orden del checklist.** El punto del orden («primero la lógica, después el servicio») es por **legibilidad**, no por obligación técnica: el contenedor resuelve el grafo entero cuando construye, así que el orden de las líneas de registro no cambia el resultado. Se pide para que quien lea `Program.cs` vea agrupada cada capa con la de debajo.

---

## Definition of Done

Lo has terminado cuando:

- [ ] Has **reproducido los dos fallos**: el `.http` sin los endpoints del usuario asignado, y la `System.AggregateException` al arrancar.
- [ ] El `.http` incluye las peticiones de los endpoints nuevos y las **pruebas pasan con REST Client** (Send Request responde).
- [ ] `Program.cs` tiene el registro que faltaba (`AddScoped<IUsuarioAsignadoLogica, UsuarioAsignadoLogica>()`) y la **aplicación arranca** sin la excepción.
- [ ] El skill `servicio` está **mejorado** con la regla de registrar ambas dependencias y su checklist (segundo círculo virtuoso cerrado).
- [ ] Sabes explicar por qué el proyecto **compilaba** aun con el fallo de DI, y en qué se diferencia un fallo de compilación de uno de ejecución.
- [ ] Sabes explicar **cuándo** un fallo se arregla con un parche en tu código y cuándo se arregla en el skill que lo generó.

---

## Comparar con la referencia

La solución de referencia de este capítulo está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-5.2/depurar`. La usas solo para mirar; nunca trabajas dentro de la demo.

En tu clon de la demo (la carpeta aparte, no la de tu proyecto):

```bash
cd AppTodoList-curso
git checkout submodulo-5.2/depurar
```

Abre su `Program.cs`, su `AppTodoList.http` y el `SKILL.md` del skill `servicio`, y ponlos al lado de los tuyos. No busques que sean idénticos —tu proyecto y tus prompts influyen—; busca que **las decisiones de fondo coincidan**: el registro de la lógica que faltaba, los endpoints del usuario asignado en el `.http`, y el paso de registro del skill reforzado con su checklist. Si a lo tuyo le falta algo, pídeselo a GitHub Copilot.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — provoca un tercer fallo de registro y depúralo con el método

Ya has arreglado el skill, así que este fallo no debería volver a colarse por su cuenta. Provócalo tú a mano para practicar el método completo: abre `Program.cs` y **comenta** la línea de registro de una lógica que sí se use —por ejemplo, `ITodoLogica`—. Arranca, y verás una `AggregateException` como la de antes, pero apuntando a otro tipo. Ahora aplica el método entero, sin mirar atrás: reprodúcelo (ya está), lee el error hasta la frase de la causa, decide de quién es la culpa (esta vez es tuya: lo comentaste tú), arréglalo descomentando la línea, y verifica que arranca. Es el mismo método que has usado en los dos fallos reales, aplicado a uno que conoces al dedillo: la mejor forma de que se te quede.

---

## Lo que has practicado

Ya sabes que «compila» no es «funciona»: el compilador cubre una familia de fallos, y los que están fuera del código, como el `.http`, o los que solo aparecen al ejecutar, como la excepción de DI, los cazas tú, arrancando y probando. Sabes leer una excepción larga de fuera adentro hasta la frase que nombra la causa, en vez de adivinar. Y sabes arreglar en dos niveles: el parche en tu código y la mejora del skill que lo generó. Con esto cierras el ciclo entero de dirigir a GitHub Copilot —construir y depurar— y te llevas una regla de oro: cuando el fallo lo sembró un skill, arregla el skill y no solo el caso.

**Puente a M06.** Has llevado los skills hasta su techo: sabes crearlos, orquestarlos, depurarlos y mejorarlos cuando se quedan cortos. Un skill es un procedimiento —unos pasos que tú escribes y GitHub Copilot sigue al pie de la letra—. En el módulo siguiente das el salto que lo cambia todo: de los skills a los **agentes constructores**. Un agente ya no sigue el guion que le diste; recibe un objetivo y decide por su cuenta cómo alcanzarlo, con qué pasos y en qué orden. Has aprendido a dirigir procedimientos; ahora vas a aprender a dirigir agentes que deciden por su cuenta.
