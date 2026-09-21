---
submódulo: M7.4
tipo: lab
tipo-lab: construcción
título: "Lab M7.4 — El director de orquesta"
base: "temario/GHCOPTL-M7.4-el-agente-orquestador.md"
rama-referencia: "submodulo-7.4/orquestador"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M7.4 — El director de orquesta

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M7.4 — El agente `orquestador`](../temario/GHCOPTL-M7.4-el-agente-orquestador.md)

En el capítulo leíste cómo un agente puede dirigir a otros agentes en vez de tocar el código él mismo. Aquí lo montas, le das una característica con una sola frase, y ves la cadena entera —planificar, construir, verificar, commit— funcionar sola. Después le pones un obstáculo real, para ver el bucle de corrección funcionando de verdad.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Monta el orquestador
- **Ejercicio 2** — Dale una frase y mira la cadena completa
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — sube el tope de iteraciones
- **Lo que has practicado + puente al Lab 7.5**

---

## Overview

Al terminar este lab sabrás **construir el agente que dirige a los demás** —con la herramienta `agent`, su lista blanca de subagentes, y un principio que le prohíbe programar— y **usarlo de punta a punta**: le pides una característica con una frase y ves cómo encadena al planificador, al desarrollador y al verificador hasta el commit, incluido el bucle de corrección cuando algo no sale a la primera.

El detalle conceptual está en la base del capítulo: qué añade la herramienta `agent`, por qué el campo `agents` es una lista cerrada, cómo funciona el bucle con tope de tres vueltas, y por qué el que dirige es el único que toca Git.

> ⏱️ Tiempo estimado: 40-50 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Te traes el planificador, el desarrollador y el verificador —los tres agentes que va a llamar el orquestador— ya montados y probados en los labs de 6.3, 6.4 y 7.1. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Monta el orquestador

*Este agente se construyó en clase en varios pasos: el encargo, una corrección de convención, el nombre, y el límite de lo que aún no hace. Sigue el mismo camino.*

### Tarea 1.1 — Encárgale el agente

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Ahora necesito implementar el agente orquestador, y si fuera necesario cambiar los otros agentes a los que llama el orquestador, léete el documento de arquitectura de agentes.»**

   → **Qué esperar:** GitHub Copilot abre `docs/ARQUITECTURA-AGENTES.md` y redacta un `.agent.md` con dos elementos que no habías visto en ningún agente anterior: `tools` incluye `agent` (la que le permite invocar a otros agentes), y aparece un campo nuevo, `agents`, con la lista de a quién puede llamar.

   ⚠️ **Error común.** Igual que te pasó antes con el desarrollador, aquí también puede colarse la convención de otro asistente. Corrígelo con el mismo aviso real de clase:

   > **«¡El agente es para GitHub Copilot!»**

### Tarea 1.2 — Nómbralo y ponle un límite

2. Complétalo con las mismas dos correcciones reales:

   > **«El nombre de agente, similar a los otros, para relacionarlo con este proyecto.»**
   >
   > **«El agente orquestador, de momento, no crea el issue, tampoco una rama, tampoco el PR: solo hace commit y push a la rama principal.»**

   → **Qué esperar:** GitHub Copilot renombra el agente atándolo a tu proyecto (y hace lo mismo con los nombres dentro de su campo `agents`), y deja escrito que su ciclo termina en un commit a tu rama principal, sin tocar GitHub más allá de eso.

3. Confirma que su lista `agents` solo tiene tres nombres —tu planificador, tu desarrollador, tu verificador— y que el auditor no aparece.

   🔎 **Por qué el auditor no está en la lista.** El auditor trabaja fuera del ciclo, para una revisión puntual a fondo, no automática en cada característica. Que no esté en `agents` es la misma regla de 7.2, escrita ahora en una lista de nombres.

4. Sube el resultado:

   > **«Sube los cambios.»**

---

## Ejercicio 2 — Dale una frase y mira la cadena completa

*Aquí está la prueba real: una sola petición, y el orquestador reparte el trabajo entre tres agentes sin que tengas que intervenir entre uno y otro.*

### Tarea 2.1 — Una característica, una frase

1. Invócalo con una petición corta, del mismo tipo que se usó en clase:

   > **«Añade la posibilidad de asignar una tarea a un usuario.»**

   → **Qué esperar:** el orquestador deriva un `slug`, invoca al planificador (que escribe `docs/plan-<slug>.md`), invoca al desarrollador (que construye las capas y compila), invoca al verificador (que compara contra el plan), y si el veredicto es APROBADO, hace el commit y el push. Al final te deja un resumen de cuatro líneas: el plan, las iteraciones, el commit, los ficheros tocados.

   💡 **Pista.** No intervengas entre agente y agente aunque te dé la tentación. La gracia de este lab es ver la cadena funcionar sola, de principio a fin.

### Tarea 2.2 — Provoca el bucle de corrección

2. Pide tú mismo una segunda característica, redactada con un matiz fácil de pasar por alto: describe algo que añada una restricción secundaria sobre datos ya existentes —por ejemplo, una regla que dependa del estado de otra entidad—, sin destacar esa condición como lo principal de la frase. Cuanto más escondida quede la regla dentro del encargo, más fácil es que el desarrollador la pase por alto a la primera.

   → **Qué esperar:** dos desenlaces posibles, y los dos son válidos. Si el desarrollador acierta a la primera, verás un APROBADO limpio en una sola iteración: eso también cuenta como éxito del lab. Si se le escapa el matiz que escondiste, el verificador dirá REVISAR, y el orquestador, sin que tú muevas un dedo, le devolverá el problema al desarrollador y volverá a verificar. Verás el contador de iteraciones subir en el resumen final.

   🔎 **Qué mirar si sale REVISAR.** Fíjate en que tú no leíste el informe del verificador ni decidiste nada: el orquestador cogió la lista de problemas, se la pasó al desarrollador con sus propias palabras, y repitió la verificación él solo. Ese traspaso es exactamente lo que antes hacías tú a mano.

   💡 **Pista.** Si a la primera sale APROBADO y quieres ver el bucle de todos modos, repite con una petición que combine dos o tres reglas cruzadas a la vez —cuantas más condiciones dependan unas de otras, más probable que alguna se quede en el tintero—.

---

## Definition of Done

Este capítulo entrega un agente que no escribe código de producción, solo coordina. Lo has terminado cuando:

- [ ] Existe tu agente orquestador en `.github/agents/`, con `tools` incluyendo `agent` y un campo `agents` con solo tus tres agentes constructores (sin el auditor).
- [ ] Le has dado una característica con una frase y ha completado el ciclo entero —planificar, implementar, verificar, commit— sin que intervinieras entre agentes.
- [ ] Has visto el bucle de corrección en acción, al menos una vez, con el contador de iteraciones subiendo en el resumen.
- [ ] Sabes explicar por qué el orquestador tiene `edit` y `execute` pero tiene prohibido usarlos para escribir código de la aplicación.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-7.4/orquestador`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-7.4/orquestador
```

Abre su `.github/agents/orquestador-apptodolist.agent.md` y ponlo al lado del tuyo. Lo esencial que debe coincidir: `tools: [read, search, edit, execute, agent]`, el campo `agents` con los tres nombres y sin el auditor, el principio «orquestas, no implementas», el ciclo de cinco pasos, y el tope de tres iteraciones con la regla de no hacer commit sin APROBADO.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — sube el tope de iteraciones

El tope de tres vueltas está escrito en el `.agent.md`: puedes tocarlo como cualquier otro número del agente. Pídele a GitHub Copilot que lo suba a cinco, y piensa en qué caso real te interesaría ese cambio —una característica más compleja, con más puntos que puedan fallar— y en qué caso preferirías bajarlo a dos, para no gastar llamadas persiguiendo un fallo que no tiene arreglo automático.

---

## Lo que has practicado

Has construido el agente que convierte tres especialistas sueltos en una cadena que arranca con una sola orden. Le diste una frase y viste al planificador, al desarrollador y al verificador trabajar en el orden correcto, pasándose el plan como testigo, sin que tú tuvieras que estar pendiente del siguiente paso. Y viste el bucle de corrección funcionar solo, con su límite de tres vueltas y su regla de no subir nada sin aprobar.

**Puente al Lab 7.5.** Tienes ya el equipo entero montado: los skills de M04, los tres constructores, los dos críticos, y ahora quien los dirige. En el Lab 7.5 vas a verlo todo junto, de una petición tuya a producción, y a entender cómo encaja el conjunto en una sola máquina.
