---
submódulo: M7.2
tipo: lab
tipo-lab: construcción
título: "Lab M7.2 — El abogado del diablo"
base: "temario/GHCOPTL-M7.2-el-agente-auditor-calidad.md"
rama-referencia: "submodulo-7.2/auditor"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M7.2 — El abogado del diablo

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M7.2 — El agente `auditor-calidad`](../temario/GHCOPTL-M7.2-el-agente-auditor-calidad.md)

En el capítulo leíste la diferencia entre comprobar contra un plan y buscar sin ninguno. Aquí montas al segundo crítico del equipo y lo sueltas sobre tu propio proyecto, sin lista de la compra: que encuentre lo que encuentre, con la puntuación que le corresponda.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Monta el auditor
- **Ejercicio 2** — Suéltalo sobre tu proyecto, y cuélale un defecto
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — audita una capa suelta
- **Lo que has practicado + puente al Lab 7.3**

---

## Overview

Al terminar este lab sabrás **construir un agente en modo abogado del diablo** —con permiso para escribir, pero solo su propio informe— y **leer su veredicto graduado**: la puntuación, las cuatro severidades, y cómo cambia cuando le metes un defecto real a propósito.

El detalle conceptual —por qué el auditor busca sin plan, qué son exactamente un code smell o un N+1, cómo se lee una puntuación de 35 sobre 100— está en la base del capítulo; este lab construye el agente y lo pone a trabajar sobre código tuyo.

> ⏱️ Tiempo estimado: 35-45 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Del lab 7.1 te traes el verificador ya montado y tu característica de categorías con su veredicto APROBADO. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Monta el auditor

*Este agente se construyó en dos pasos en clase: primero el encargo grande, y luego un ajuste que cambió una de sus herramientas. Experimenta a tu aire con la redacción.*

### Tarea 1.1 — Encárgale el auditor

1. En modo agente, pídeselo con el mismo encargo real del capítulo:

   > **«Necesito ahora un agente auditor de toda la aplicación para verificar que la incorporación de cambios cumple con todos los requisitos de calidad de código, de implementación, evita deuda técnica, code smells, etc. Intenta generar el agente con excelencia, modo abogado del diablo.»**

   → **Qué esperar:** GitHub Copilot redacta un `.agent.md` que se define a sí mismo como «un revisor técnico senior en modo abogado del diablo: tu trabajo es encontrar problemas, no aprobar código», con un mantra propio —«el código no está bien escrito hasta que se demuestre que no tiene defectos»— y un guion de auditoría por categorías: arquitectura de capas, code smells, async/await, EF Core, seguridad. En esta primera versión, el informe se queda en el chat: todavía no se guarda en ningún sitio.

2. Sube este primer punto de partida:

   > **«Sube los cambios.»**

### Tarea 1.2 — Pídele que también lo guarde

3. Completa el encargo con la misma pregunta real de aquella sesión:

   > **«¿El auditor genera un documento, no? ¿En `docs`?»**

   → **Qué esperar:** GitHub Copilot revisa lo que acaba de crear, ve que el informe se quedaba solo en el chat, y lo corrige: añade `edit` a la lista de herramientas y un paso final que guarda el informe en `docs/auditoria-<fecha>.md`.

   🔎 **Por qué este `edit` no contradice lo que aprendiste en 7.1.** El verificador no tenía `edit` porque su única salida era un veredicto de una palabra; el auditor sí lo tiene, pero para una cosa: su propio informe. Compáralo con el primer principio que acaba de escribirse en su fichero —«SOLO lees. Nunca editas ni sugieres correcciones directas en ficheros»—: ese «ficheros» habla de tu código. Misma disciplina del equipo, aplicada con un matiz distinto según lo que cada agente necesita entregar.

   💡 **Pista.** Confirma que el fichero final tiene `tools: [read, search, execute, edit]` y que el paso de guardado apunta a `docs/`, fuera de tu carpeta de código.

---

## Ejercicio 2 — Suéltalo sobre tu proyecto, y cuélale un defecto

*Un auditor solo demuestra su valor con un caso real. Lo pones a trabajar sobre tu proyecto tal como está, y luego le das algo que encontrar de verdad.*

### Tarea 2.1 — Audita tu proyecto completo

1. Invócalo con el mismo encargo real de clase:

   > **«Por favor, revisa la aplicación; hemos implementado el plan que implementa categorías de tareas.»**

   → **Qué esperar:** el auditor compila tu proyecto, ejecuta tus tests, y recorre capa por capa —controladores, servicios, lógica de negocio, modelos, DTOs— buscando smells, problemas de async/await, consultas EF Core sin `AsNoTracking()`, huecos de seguridad. Al terminar, guarda en `docs/auditoria-<fecha>.md` un informe con veredicto (APROBADO, OBSERVACIONES o RECHAZADO), una puntuación sobre 100, y el recuento de hallazgos por severidad (🔴🟠🟡🔵).

   💡 **Pista.** No esperes un 100/100 a la primera. En clase, la misma auditoría sobre AppTodoList sacó un RECHAZADO de 35 sobre 100, con un hallazgo crítico real: la validación del usuario asignado a una tarea existía, pero la de la categoría no —una tarea podía crearse con una categoría que no existe—. Si tu auditor encuentra algo parecido en tu proyecto, es exactamente el tipo de hueco que el plan de 6.3 no pidió comprobar.

### Tarea 2.2 — Cuélale un defecto real

2. Ahora dale al auditor algo concreto que encontrar. Introduce a propósito uno de estos dos defectos, del tipo que rastrea de verdad:
   - Un `.Result` sobre una llamada asíncrona en algún método de tu `CategoriaLogica` o `TodoLogica` (por ejemplo, cambia un `await _contexto.SaveChangesAsync();` por `_contexto.SaveChangesAsync().Result;`).
   - O quita un `[Authorize]` de un endpoint que debería llevarlo, si tu proyecto usa autenticación.

   No lo subas todavía.

3. Vuelve a invocar al auditor con el mismo encargo:

   > **«Por favor, revisa la aplicación; hemos implementado el plan que implementa categorías de tareas.»**

   → **Qué esperar:** el nuevo hallazgo aparece en el informe, con su fichero, su línea, su categoría y su severidad —un `.Result` sobre código asíncrono se suele marcar con 🔴 o 🟠, según el riesgo real de bloqueo—. Compara la puntuación con la de la Tarea 2.1: debería haber bajado.

   ⚠️ **Error común.** Si el auditor no detecta el defecto, revisa que el fichero que tocaste esté dentro del alcance que le diste —por defecto audita toda la aplicación, pero si le indicaste una carpeta concreta antes, puede que se haya quedado con ese alcance limitado—.

4. Deshaz el defecto y confirma que la puntuación vuelve a subir. Sube el estado final:

   > **«Sube los cambios.»**

---

## Definition of Done

Este capítulo entrega un agente que encuentra y puntúa lo que hay, sin tocar una línea de tu código. Lo has terminado cuando:

- [ ] Existe tu agente `auditor-calidad` en `.github/agents/`, con `tools: [read, search, execute, edit]` y su paso de guardado dentro de `docs/`.
- [ ] Lo has invocado sobre tu proyecto completo y tienes un informe en `docs/auditoria-<fecha>.md`, con veredicto, puntuación y hallazgos por severidad.
- [ ] Le has colado un defecto real y el informe lo ha recogido, con su severidad correspondiente y la puntuación más baja.
- [ ] Sabes explicar la diferencia entre lo que verifica el verificador (7.1) y lo que audita este agente.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-7.2/auditor`. La usas solo para mirar.

```bash
cd AppTodoList-curso
git checkout submodulo-7.2/auditor
```

Abre su `.github/agents/auditor-calidad.agent.md` y ponlo al lado del tuyo. Lo esencial que debe coincidir: `tools: [read, search, execute, edit]`, el mantra del abogado del diablo, las cuatro severidades, y el paso final que guarda el informe en `docs/`.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — audita una sola capa

Invoca al auditor otra vez, pero dale solo una carpeta —por ejemplo `Services/`— en lugar de todo el proyecto. Compara ese informe con el de la auditoría completa: ¿qué se le escapa por mirar solo una capa? Esa limitación es justo la que el propio auditor te advierte cuando el alcance viene recortado.

---

## Lo que has practicado

Has construido el segundo crítico del equipo, el que sale a buscar problemas por su cuenta, sin plan de por medio, con la desconfianza sistemática de quien empieza asumiendo que algo falla. Y lo has visto trabajar sobre tu propio código dos veces: primero sobre tu código tal cual estaba, con una puntuación real, y después con un defecto metido por ti, viendo cómo esa puntuación cae y el hallazgo aparece clasificado con su severidad.

**Puente al Lab 7.3.** Si le hubieras colado el mismo defecto en varios ficheros a la vez —el mismo `.Result` repetido en tres capas—, el auditor podría haber rastreado que ese defecto salió del mismo skill, en vez de limitarse a listarlo tres veces. Esa idea, arreglar el molde en vez de parchear cada copia, es el círculo virtuoso, y es lo que montas en el Lab 7.3.
