---
submódulo: M7.1
tipo: lab
tipo-lab: construcción
título: "Lab M7.1 — El inspector con las manos atadas"
base: "temario/GHCOPTL-M7.1-el-agente-verificador.md"
rama-referencia: "submodulo-7.1/verificador"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M7.1 — El inspector con las manos atadas

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M7.1 — El agente `verificador`](../temario/GHCOPTL-M7.1-el-agente-verificador.md)

En el capítulo leíste por qué compilar y cumplir el plan son cosas distintas. Aquí montas al agente que nace de esa distinción: lo construyes, le entregas tu código real de categorías para que dicte veredicto, y luego rompes algo a propósito para verlo cambiar de veredicto.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Monta el verificador
- **Ejercicio 2** — Dale tu código, y luego rómpelo
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — verifica algo tuyo
- **Lo que has practicado + puente al Lab 7.2**

---

## Overview

Al terminar este lab sabrás **construir el primer agente crítico del equipo** —lee, compila, pero no toca una línea— y **usarlo para juzgar tu propio código**: primero contra la implementación que ya tienes de 6.4, y después contra una versión rota a propósito, para ver el veredicto cambiar de APROBADO a REVISAR con su lista de problemas.

El detalle conceptual —por qué el verificador es el desarrollador menos una herramienta, cómo se lee la §9 del plan como lista de comprobación, qué separa un 🔴 de un 🟡— está en la base del capítulo; este lab construye y usa lo que ahí se explica.

> ⏱️ Tiempo estimado: 35-45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Del lab 6.4 te traes la característica de categorías ya construida y compilando, y tu `docs/plan-*.md` con su §9 de criterios de aceptación. Los vas a necesitar los dos en el Ejercicio 2. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Monta el verificador

*Este agente sale del mismo documento de arquitectura que ya conoces de 6.1: el equipo entero estaba dibujado ahí desde el principio, y ahora le toca cobrar forma al crítico. Experimenta a tu aire con la redacción del encargo.*

### Tarea 1.1 — Encárgale el agente

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Vamos a crear ahora el agente verificador, recuerda nombrarlo como hemos hecho con los anteriores, toma como referencia el documento de arquitectura de agentes.»**

   → **Qué esperar:** GitHub Copilot abre `docs/ARQUITECTURA-AGENTES.md`, localiza el papel del verificador en el plano del equipo, y redacta un `.agent.md` con `tools: [read, search, execute]` —fíjate: exactamente las del desarrollador, menos `edit`— y un cuerpo que fija su único cometido: comparar el código con el plan y devolver APROBADO o REVISAR.

   ⚠️ **Error común.** Igual que te pasó con el desarrollador en 6.4, aquí también puede colarse la convención de **otro asistente**. Si el fichero no sale en `.github/agents/` con el formato del resto de tu equipo, corrígelo con el mismo aviso real de aquella clase:

   > **«¡Es para GitHub Copilot!»**

### Tarea 1.2 — Exígele el plan como entrada

2. Completa el encargo con la misma corrección real:

   > **«El agente verificador necesita saber qué plan ha de verificar; le hemos de pasar el documento que contenga el plan que se ha implementado.»**

   → **Qué esperar:** GitHub Copilot añade la regla de arranque: si invocas al verificador sin decirle la ruta del plan, pregunta antes de dar un solo paso. Sin plan, no tiene contra qué comparar tu código.

3. Sube el resultado:

   > **«Sube los cambios.»**

   → **Qué esperar:** GitHub Copilot hace el commit y el `push` de tu nuevo agente.

   🔎 **Por qué esta herramienta de menos importa tanto.** Compara `tools: [read, search, execute]` con el `[read, search, edit, execute]` del desarrollador. Una sola herramienta separa a quien construye de quien juzga, y esa herramienta es justo la que permite cambiar algo. El verificador puede mirarlo todo y compilar; lo que puede hacer con lo que encuentra se reduce a señalarlo.

---

## Ejercicio 2 — Dale tu código, y luego rómpelo

*El verificador solo demuestra su valor en marcha. Primero lo pones a comprobar tu característica de categorías tal como está; después la estropeas a propósito, para ver su veredicto cambiar.*

### Tarea 2.1 — Verifica tu implementación tal cual está

1. Invócalo con el mismo encargo real de clase, dándole la ruta de tu plan:

   > **«Verificamos ahora el plan de categorías.»**

   Si te pregunta la ruta, dásela: `docs/plan-categorias.md` (o el nombre que le pusiste tú).

   → **Qué esperar:** el verificador lee tu plan entero, localiza la §9 y saca sus criterios de aceptación uno por uno. Luego los comprueba con hechos: lanza `dotnet build`, lista tus migraciones, recorre tus capas —modelo, DTOs, lógica, servicio, controlador— y revisa tus tests. Si tu implementación de 6.4 quedó completa, el resultado es un veredicto limpio:

   ```
   ## ✅ VEREDICTO: APROBADO
   - ✅ Compilación exitosa, sin errores
   - ✅ Migración creada y aplicada
   - ✅ Modelos, DTOs, lógica, servicios y controladores según el plan
   ```

   💡 **Pista.** Guarda este primer veredicto a la vista; en la próxima tarea lo vas a comparar con uno bastante distinto.

### Tarea 2.2 — Rompe algo pequeño, y verifica otra vez

2. Ahora estropea tu proyecto a propósito, con algo pequeño y con intención. Dos opciones sencillas:
   - Comenta la línea que registra tu servicio de categorías en `Program.cs` (`builder.Services.AddScoped<ICategoriaService, CategoriaService>();`).
   - O introduce una coma de más en algún inicializador de objeto de tu `CategoriaService.cs`, para que no compile.

   Guarda el cambio, pero **no lo subas todavía**.

3. Invoca al verificador otra vez, con el mismo encargo:

   > **«Verificamos ahora el plan de categorías.»**

   → **Qué esperar:** el veredicto cambia. Si rompiste la compilación, verás un 🔴 con el fichero, la línea y el error exacto. Si comentaste el registro del servicio, verás un 🟡 —el código compila, pero le falta algo del plan—. En cualquier caso, el resultado ya no es APROBADO:

   ```
   ## ⚠️ VEREDICTO: REVISAR
   ### 🔴 (o 🟡) <tu problema aquí>
   - Fichero:  ...
   - Problema: ...
   - Solución: ...
   ```

   🔎 **Fíjate en lo que NO hace el verificador.** Aunque te diga exactamente qué falla y cómo arreglarlo, no toca el fichero. Tienes delante la prueba viva de por qué le quitaron `edit`: sabe la solución y aun así te la deja a ti.

4. Deshaz tu rotura —descomenta la línea, o quita la coma de más— y confirma que vuelve a salir APROBADO. Sube el estado final:

   > **«Sube los cambios.»**

---

## Definition of Done

Este capítulo entrega un agente dedicado por completo a comparar. Lo has terminado cuando:

- [ ] Existe tu agente verificador en `.github/agents/`, con `tools: [read, search, execute]` —sin `edit`— y la regla de exigir la ruta del plan antes de trabajar.
- [ ] Lo has invocado sobre tu implementación intacta de 6.4 y ha dictado **APROBADO**, comprobando los criterios de tu §9 uno por uno.
- [ ] Has roto algo a propósito y el veredicto ha cambiado a **REVISAR**, con el problema clasificado (🔴 o 🟡) y una solución sugerida.
- [ ] Sabes explicar por qué el veredicto solo admite dos valores, sin término medio.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-7.1/verificador`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-7.1/verificador
```

Abre su `.github/agents/verificador-apptodolist.agent.md` y ponlo al lado del tuyo. Lo esencial que debe coincidir: `tools: [read, search, execute]`, la regla de exigir el plan, y el formato del veredicto —binario, con severidad 🔴/🟡/🔵—.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — verifica algo tuyo

Si tienes en marcha una característica propia, con su plan y su §9 de criterios, pásasela a tu verificador. Presta atención especial a lo que marca como «no verificable automáticamente» —los criterios que requieren mirar la aplicación en marcha, no solo el código—. Esa distinción, entre lo que un agente puede comprobar leyendo y compilando y lo que necesita un par de ojos humanos, es útil bastante más allá de este curso.

---

## Lo que has practicado

Has construido el primer agente del equipo dedicado enteramente a comparar: coge lo que ya existe y dice si cumple. Y lo has visto en las dos caras posibles —APROBADO sobre tu código intacto, REVISAR sobre el mismo código con un fallo metido a propósito—, con la misma disciplina en ambos casos: comprobar hechos contra la §9, sin opinar. Quien construye y quien juzga son, a partir de aquí, agentes distintos, y esa separación está en la lista de herramientas que le diste, no en la buena voluntad de nadie.

**Puente al Lab 7.2.** El verificador solo mira lo que el plan le mandó mirar. Si nadie escribió un criterio para algo —una consulta lenta, un hueco de seguridad—, el verificador ni se entera. Para eso hace falta otro crítico: el **auditor**, que sale a buscar problemas por su cuenta, sin lista que lo guíe, como un abogado del diablo. Lo montas en el Lab 7.2.
