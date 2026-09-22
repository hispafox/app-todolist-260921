---
name: fundamentos-documentacion-arquitectura
description: 'Conocimiento de referencia sobre marcos para documentar arquitectura de software (C4 model y arc42): qué niveles/diagramas/secciones existen y cómo elegir cuáles usar según el tamaño del proyecto. Úsalo cuando otro skill necesite decidir qué diagramas o secciones incluir en un documento de arquitectura, o cuando el usuario pregunte qué es C4 model, qué es arc42, o cómo estructurar un documento de arquitectura desde cero.'
---

# Skill: Fundamentos para Documentar Arquitectura de Software

Este skill no genera un documento por sí mismo: es una base de conocimiento que otros skills (por ejemplo [`documento-funcional-arquitectura`](../documento-funcional-arquitectura/SKILL.md) o [`diseño-analisis`](../diseño-analisis/SKILL.md)) pueden consultar para decidir qué diagramas o secciones incluir, y para justificar esa elección en vez de inventar una estructura ad hoc.

## Cuándo usar este skill

- Antes de diseñar la estructura de un documento de arquitectura nuevo, en cualquier proyecto
- Cuando otro skill necesite decidir qué diagramas o secciones son proporcionales al tamaño del proyecto
- Cuando el usuario pregunte "qué es C4 model", "qué es arc42", "cómo se documenta una arquitectura", o pida comparar marcos de documentación
- Para evitar sobre-documentar (aplicar una plantilla completa de 12 secciones a un monolito pequeño) o infra-documentar (omitir el contexto del sistema o las decisiones clave)

## C4 model (Simon Brown) — [c4model.com](https://c4model.com/)

Modelo de diagramas jerárquicos, independiente de notación y de herramienta. Se basa en 4 abstracciones anidadas:

1. **Software system** — el sistema completo que se está construyendo (una unidad de valor para sus usuarios).
2. **Container** — una aplicación o almacén de datos desplegable/ejecutable por separado (p. ej. una SPA, una API, una base de datos). No es un contenedor Docker; es "algo que hay que ejecutar para que el sistema funcione".
3. **Component** — un agrupamiento de funcionalidad relacionada detrás de una interfaz, dentro de un contenedor (p. ej. una capa Application, un módulo de autenticación).
4. **Code** — clases, interfaces, funciones: el nivel de detalle que normalmente ya expresa el propio código y las herramientas del IDE.

Y 4 tipos de diagrama estático correspondientes, pensados como niveles de zoom para audiencias distintas:

1. **System context diagram** — el sistema y con quién/qué interactúa (personas, sistemas externos). Para cualquier audiencia, técnica o no.
2. **Container diagram** — las aplicaciones/almacenes de datos que componen el sistema y cómo se comunican. Para el equipo técnico y stakeholders de infraestructura.
3. **Component diagram** — los módulos internos de un contenedor concreto. Solo tiene sentido si aporta valor real; C4 explícitamente dice que **no siempre hace falta**.
4. **Code diagram** — normalmente innecesario en documentación funcional; se genera mejor con herramientas del IDE bajo demanda.

Más 3 diagramas de apoyo, a usar solo si aportan algo que los 4 anteriores no cubren:

- **System landscape diagram** — varios sistemas relacionados a la vez (útil en organizaciones con muchos sistemas, no en un proyecto aislado).
- **Dynamic diagram** — una colaboración concreta en tiempo de ejecución (equivalente a un `sequenceDiagram` de un caso de uso).
- **Deployment diagram** — mapeo de contenedores a infraestructura real (entornos, instancias, nodos).

Regla práctica de C4: **"no necesitas usar los 4 niveles; el contexto y los contenedores bastan para la mayoría de equipos"**. Añadir componentes o código solo si el proyecto lo justifica.

## arc42 (12 secciones) — [arc42.org](https://arc42.org/overview)

Plantilla de referencia para documentación de arquitectura, pensada para adaptarse (no rellenarse mecánicamente sección por sección):

1. Introducción y objetivos — requisitos fundamentales, objetivos de calidad
2. Restricciones — regulaciones y limitaciones externas
3. Contexto y alcance — sistemas externos e interfaces
4. Estrategia de solución — ideas y enfoques centrales
5. Vista de bloques de construcción (building block view) — estructura del código, modularización; suele ser la sección más extensa
6. Vista de runtime — escenarios de ejecución importantes
7. Vista de despliegue — hardware, infraestructura y despliegue
8. Conceptos transversales — decisiones tecnológicas, patrones recurrentes, procesos de desarrollo/despliegue
9. Decisiones arquitectónicas — decisiones importantes no descritas en otra sección
10. Requisitos de calidad — árbol de calidad y escenarios de calidad
11. Riesgos y deuda técnica — problemas y riesgos conocidos
12. Glosario — términos importantes y específicos del dominio

arc42 también ofrece un ["canvas" de una sola página](https://arc42.org/canvas/) para cuando las 12 secciones son demasiado para el caso.

## Cómo elegir qué incluir según el tamaño del proyecto

No aplicar los marcos al pie de la letra. Usarlos como checklist de preguntas a responder, y adaptar el nivel de detalle:

- **Monolito pequeño / proyecto de un equipo** (caso típico de este repositorio): Contexto del sistema + Contenedores/Componentes (C4, niveles 1-2, sin nivel Código) + building block view, runtime view, decisiones y riesgos (arc42, secciones 3, 5, 6, 9, 11). Omitir árbol de calidad formal, glosario extenso, restricciones organizativas y diagrama de despliegue si no hay topología de infraestructura real que documentar.
- **Sistema con varios servicios/microservicios**: añadir System landscape diagram y Deployment diagram, y considerar la sección 7 (vista de despliegue) de arc42 de forma más completa.
- **Proyecto grande, regulado o con varios equipos**: considerar arc42 completo, incluyendo restricciones (sección 2), requisitos de calidad formales (sección 10) y glosario (sección 12); y Architecture Decision Records (ADR) individuales para la sección 9 en vez de una lista simple.

## Cómo referenciar este skill desde otro skill

Un skill generador de documentos no debe copiar esta explicación completa: debe enlazar a este fichero y quedarse solo con la lista concreta de secciones que va a producir, adaptadas al proyecto. Esto evita que la explicación de los marcos quede duplicada y desincronizada en varios sitios.
