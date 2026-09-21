---
submódulo: M7.5
tipo: lab
tipo-lab: síntesis (capstone, sin agente nuevo)
título: "Lab M7.5 — De una frase a main (o al freno honesto)"
base: "temario/GHCOPTL-M7.5-el-sistema-en-marcha.md"
rama-referencia: "submodulo-7.5/sistema-en-marcha"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M7.5 — De una frase a `main` (o al freno honesto)

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M7.5 — El sistema en marcha](../temario/GHCOPTL-M7.5-el-sistema-en-marcha.md)

En el capítulo viste el sistema entero como una máquina de estados, con dos salidas válidas: el commit y el freno honesto. Aquí recorres las dos salidas con tus manos, sobre tu propio proyecto —con los agentes que ya tienes montados—, y cierras con el crítico que vigila desde fuera.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — El camino feliz, leído contra la máquina de estados
- **Ejercicio 2** — El freno honesto
- **Ejercicio 3** — El crítico de fuera, sobre todo lo construido
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — cuenta tu propia vuelta
- **Lo que has practicado + hacia dónde sigue el curso**

---

## Overview

Al terminar este lab habrás visto tu sistema recorrer **las dos salidas** de la máquina de estados de la base —el commit limpio y el bloqueo con parte— sobre características reales de tu proyecto, y habrás pasado al **auditor** sobre todo lo construido, como el cierre natural de una tanda de trabajo.

El capstone consiste en usar, de punta a punta, lo que montaste en 6.3-7.4.

> ⏱️ Tiempo estimado: 35-45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto, con los agentes del ciclo ya montados: planificador, desarrollador, verificador y orquestador (6.3-7.4), más el auditor (7.2) para las revisiones a fondo. Todo en la misma rama de siempre: aquí tampoco creas ramas.

Ten a mano el diagrama de la base, la máquina de estados de §2:

```
[*] → Planificado → Implementado → EnRevision → Aprobado → Commiteado → [*]
                          ↑______________|(REVISAR, iter<3)
                                         └→ Bloqueado → [*] (3 iteraciones sin éxito)
```

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — El camino feliz, leído contra la máquina de estados

*Ya viste esta cadena en el lab 7.4. Aquí la repites con una característica distinta, y esta vez la lees explícitamente contra el diagrama: cada respuesta del orquestador es una flecha concreta del dibujo.*

### Tarea 1.1 — Pide una característica pequeña

1. Piensa una característica pequeña de tu proyecto que todavía no tengas —un campo nuevo, un filtro, una regla sencilla— y pídesela al orquestador con una sola frase, en tus propias palabras.

   → **Qué esperar:** el orquestador recorre el ciclo entero por ti. Ve marcando, mientras lo ves trabajar, en qué estado del diagrama estás:

   | Lo que ves en la respuesta | Estado del diagrama |
   |---|---|
   | El planificador escribe `docs/plan-<slug>.md` | **Planificado** |
   | El desarrollador construye las capas y compila | **Implementado** |
   | El verificador da su veredicto | **EnRevision** |
   | El veredicto es APROBADO | **Aprobado** |
   | El commit y el push se hacen | **Commiteado** |

   🔎 **Por qué merece la pena pararse aquí.** En 7.4 viste esta cadena como una secuencia de pasos. El diagrama te enseña algo que una lista no dice: que **EnRevision** es una bifurcación real, con dos flechas de salida —una que vuelve atrás si REVISAR, otra que sigue adelante si APROBADO—. Vivirlo una vez con el dibujo delante fija la idea mejor que leerla.

---

## Ejercicio 2 — El freno honesto

*Esta es la salida que en 7.4 solo pudiste ver si tuviste suerte. Aquí la fuerzas con un truco legítimo: bajas el tope de iteraciones a uno, para que el primer REVISAR ya sea el bloqueo.*

### Tarea 2.1 — Baja el tope, a propósito

1. Pídele a GitHub Copilot que edite tu `orquestador-apptodolist.agent.md` y baje a uno el límite de iteraciones —el que tengas ahora mismo, tres si no tocaste el reto opcional de 7.4—, solo para esta prueba.

   → **Qué esperar:** la línea de tu agente que decía «Máximo 3 iteraciones» pasa a decir «Máximo 1 iteración». Con el tope en uno, el primer REVISAR que salga ya agota el margen: no hace falta fallar tres veces de verdad para ver el bloqueo.

   ⚠️ **Error común.** No olvides que este cambio es temporal. Al final del ejercicio lo devuelves a su valor de antes (Tarea 2.3); si lo dejas en uno, tu sistema real se bloqueará a la primera corrección en cualquier característica futura.

### Tarea 2.2 — Provoca el REVISAR

2. Pide una característica con un matiz escondido, del mismo modo que hiciste en el lab 7.4: describe algo con una condición secundaria fácil de pasar por alto, sin subrayarla como lo principal de la frase.

   → **Qué esperar:** si el desarrollador se deja el matiz —probable, si escondiste bien la condición—, el verificador dice REVISAR; y con el tope en uno, no hay margen para un segundo intento: el orquestador se detiene ahí mismo. Verás un parte parecido a este:

   ```
   ⛔ No se ha podido completar el ciclo
   - Iteraciones:  1 / 1
   Problemas pendientes:
     <el matiz que se le escapó>
   Los cambios están sin commitear.
   ```

   🔎 **Qué mirar aquí.** Nada llegó a `main`. El código con el fallo se quedó fuera de tu historial de commits, y tienes delante el punto exacto donde se atascó. Esa es la garantía del sistema: prefiere pararse a dejarte un commit roto con tu nombre.

   💡 **Pista.** Si a la primera sale APROBADO incluso con el tope en uno, prueba con una característica que cruce dos o tres reglas a la vez. Y si sigue sin fallar, no pasa nada: significa que tu desarrollador acertó, y eso también demuestra que el sistema funciona.

### Tarea 2.3 — Devuelve el tope a tres

3. Pídele a GitHub Copilot que restaure el límite a su valor de antes, y sube el cambio.

---

## Ejercicio 3 — El crítico de fuera, sobre todo lo construido

*Así se cierra de verdad una tanda de trabajo: llamando al auditor sobre el proyecto entero.*

### Tarea 3.1 — Audita todo el proyecto

1. Invócalo pidiéndole una revisión completa, sin acotar a una capa ni a una característica.

   → **Qué esperar:** el auditor compila, revisa capas, code smells, async/await, EF Core y seguridad sobre todo lo que hay —incluidas las características que fuiste añadiendo lab a lab—, y guarda su veredicto graduado en `docs/auditoria-<fecha>.md`.

   🔎 **Por qué llamas aquí al auditor.** El verificador ya trabajó de forma automática dentro de cada ciclo que acabas de completar en los Ejercicios 1 y 2. El auditor es la otra capa: la que tú decides llamar, de vez en cuando, para ver lo que ningún plan pidió mirar. Este es exactamente el momento —cierre de una tanda— en que tiene sentido llamarlo.

---

## Definition of Done

Este capítulo entrega el sistema completo, visto en marcha. Lo has terminado cuando:

- [ ] Has completado un ciclo entero con el orquestador y puedes señalar, en el diagrama de la base, por qué estados pasó tu característica.
- [ ] Has visto la salida **Bloqueado** al menos una vez, con su parte de pendientes y sin ningún commit de por medio.
- [ ] Has devuelto el tope de iteraciones a tres.
- [ ] Has pasado el auditor sobre el proyecto entero, sin acotarlo a una sola característica.
- [ ] Sabes explicar, sin mirar la base, por qué el sistema tiene dos salidas válidas.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-7.5/sistema-en-marcha`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-7.5/sistema-en-marcha
```

Abre `docs/ARQUITECTURA-AGENTES.md` y su diagrama de estados, y compáralo con lo que acabas de vivir: los mismos estados, las mismas dos salidas, y tu tope de iteraciones ya restaurado a su valor de antes.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — cuenta tu propia vuelta

Elige la característica más reciente que hayas construido con el orquestador, en este lab o en el 7.4, y escribe tú el resumen: qué estado alcanzó, cuántas iteraciones hicieron falta, y si el crítico de dentro o el de fuera tuvo algo que decir sobre ella. Es el mismo ejercicio que hace el propio sistema en cada resumen final, ahora contado por ti.

---

## Lo que has practicado

Has visto tu sistema recorrer sus dos salidas posibles —el commit limpio y el freno con parte— y has cerrado con el crítico que vigila desde fuera del ciclo. En este módulo completas el elenco: los cinco agentes que construyen y vigilan, más el que dirige, trabajando juntos, de una frase tuya a un commit en `main` o a un parte honesto de lo que falta.

**Hacia dónde sigue el curso.** El sistema ya construye backend solo. Lo que falta es dar la cara: un frontend con el que alguien trabaje de verdad y una forma de explorar la API con Scalar, eso es **M08**. Después llega documentarlo (**M09**) y abrirlo al trabajo en equipo con GitHub —issues, ramas, Pull Requests, el «Modo Issue» que el orquestador ya lleva guardado desde 7.4—, eso es **M10**.
