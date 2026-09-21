---
submódulo: M6.1
tipo: lab
tipo-lab: estudio
título: "Lab M6.1 — El plano del equipo"
base: "temario/GHCOPTL-M6.1-que-es-un-agente.md"
rama-referencia: "submodulo-6.1/que-es-un-agente"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-07
---

# 🧪 Lab M6.1 — El plano del equipo

> **Lab versión 1 · Última actualización 2026-07-07 · Base:** [M6.1 — Qué es un agente](../temario/GHCOPTL-M6.1-que-es-un-agente.md)

En el capítulo montaste el equipo sobre el papel: qué es un agente, cómo se define en un `.agent.md`, y por qué a cada rol se le dan solo las herramientas que necesita. Aquí abres el plano de verdad, el documento donde ese equipo está diseñado entero, y lo lees con lupa. No construyes ningún agente todavía; eso empieza en el capítulo siguiente. Hoy el trabajo es otro, y no menos útil: aprender a leer el diseño de un sistema de agentes antes de tocarlo.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — tu copia de la demo y el documento de diseño
- **Ejercicio 1** — El mapa: quién llama a quién
- **Ejercicio 2** — El contrato de herramientas, rol por rol
- **Definition of Done**
- **Reto opcional** — diseña el equipo de tu proyecto
- **Lo que has practicado + puente a 6.2**

---

## Overview

En este lab tu trabajo es leer un plano: el documento de diseño del equipo de agentes, el que reparte el trabajo entre el orquestador, el planificador, el desarrollador y el verificador. Aprendes a sacarle lo que importa: quién llama a quién, qué puede tocar cada uno, y por qué ese reparto hace fiable al conjunto. Es la misma lectura que harás con cualquier sistema de agentes ajeno antes de meterle mano: entender el diseño antes que el código. Hoy no escribes ni una línea; solo lees.

Al terminar sabrás recorrer la tabla de herramientas de un equipo de agentes y decir, de cada rol, qué hace y qué tiene prohibido, leyendo sus herramientas más que su descripción.

> ⏱️ Tiempo estimado: 20-30 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot, y tu copia de la demo del curso, ya clonada en los labs anteriores.

Este lab es de lectura: no tocas tu repositorio ni construyes nada. Trabajas sobre el documento de diseño del equipo, que está en la demo del curso.

Sitúate en la rama de este capítulo, solo para leer:

```bash
cd AppTodoList-curso
git checkout submodulo-6.1/que-es-un-agente
```

Abre el documento `docs/ARQUITECTURA-AGENTES.md`. Ahí está el equipo entero diseñado: el mapa, la tabla de roles y el ciclo completo. Hoy te quedas con las dos primeras partes, el mapa y la tabla; el resto es el plano de lo que irás construyendo a partir del capítulo siguiente, y lo abrirás cuando toque.

> 💡 **Por qué se lee antes de construir.** Ninguno de estos agentes existe todavía en tu proyecto: los montas uno a uno a partir de 6.2. Este documento es el plano que los describe antes de levantarlos, igual que el plano de una obra existe antes que la casa. Leerlo ahora te pone el mapa completo en la cabeza; cuando construyas cada agente, sabrás dónde encaja.

---

## Ejercicio 1 — El mapa: quién llama a quién

Todo sistema de agentes empieza por una pregunta: ¿quién manda a quién? Un equipo donde cualquiera llama a cualquiera es un caos; uno bien diseñado tiene un solo punto de entrada y un reparto claro. La primera parte del documento te responde eso de un vistazo, con un diagrama. Léelo despacio, que es el esqueleto de todo lo demás.

### Tarea 1.1 — Localiza el punto de entrada

1. En `docs/ARQUITECTURA-AGENTES.md`, busca el primer diagrama, el del mapa. Fíjate en las flechas: de quién salen y a quién llegan.

   → **Qué buscar:** tú, que eres quien pide, hablas con un solo agente, el orquestador. Y es el orquestador, no tú, quien llama a los demás: al planificador, al desarrollador, al verificador. Tú das una orden; él reparte.

   🔎 **Por qué importa.** Un solo punto de entrada es una decisión de diseño, no una casualidad. Te ahorra tener que saber a quién llamar para cada cosa: se lo dices al orquestador y él conoce el orden. Y fíjate en que los especialistas no se llaman entre ellos por su cuenta. Todo pasa por el orquestador.

### Tarea 1.2 — ¿Quién toca git?

2. Sigue las flechas hasta el final del ciclo, donde se hace el commit. ¿De qué agente sale esa flecha?

   → **Qué buscar:** solo el orquestador toca git. El planificador, el desarrollador y el verificador hacen cada uno lo suyo y ninguno guarda nada en el historial: ni el plan, ni el código, ni el veredicto pasan por git. El commit es el último paso, y lo da el orquestador.

   🔎 **Por qué se diseña así.** Que un solo agente cierre con el commit evita que tres manos distintas escriban en el historial a destiempo. Los especialistas se concentran en lo suyo y ni se enteran de que, al final, alguien guarda el resultado: el historial queda con un solo responsable.

---

## Ejercicio 2 — El contrato de herramientas, rol por rol

La segunda parte del documento es una tabla que le da a cada rol su lista de herramientas y, sobre todo, le niega el resto. En el capítulo lo llamaste el contrato de poder: un agente puede hacer exactamente lo que su lista de herramientas le permite, ni una cosa más. Vas a leer esa tabla como se lee un contrato, atento sobre todo a lo que calla.

### Tarea 2.1 — Recorre la columna de herramientas

1. Busca la tabla de roles, la de «quién hace qué». Quédate con las cuatro primeras filas, las del orquestador, el planificador, el desarrollador y el verificador, que son el equipo del ciclo. Lee, de cada uno, la columna de herramientas.

   → **Qué buscar:** cada rol lleva un subconjunto distinto. El desarrollador es el único que lleva a la vez `edit` y `execute`, porque es el que escribe código y lo compila. El planificador lleva `edit`, pero no `execute`. El verificador es el caso contrario: `execute`, sin `edit`. Y el orquestador lleva una herramienta que ningún otro tiene, `agent`, la que le deja llamar a los demás.

   💡 **Fíjate en lo que falta.** La gracia de un contrato de poder está en las ausencias: apunta, para cada agente, qué herramienta no tiene y qué le impide hacer eso. Ahí, en el hueco, está la garantía.

### Tarea 2.2 — Las dos ausencias que sostienen el capítulo

2. Fíjate ahora en dos filas concretas, las que viste en el capítulo. El verificador: ¿lleva `edit`? El planificador: ¿lleva `execute`?

   → **Qué buscar:** el verificador no lleva `edit`. No puede modificar un fichero ni queriendo: solo lee, compila y señala. Y el planificador no lleva `execute`: no lanza comandos, solo lee y escribe su plan.

   🔎 **La separación entre hacer y juzgar, grabada en las herramientas.** Junta las dos ausencias y verás el principio del capítulo, «quien diseña no aprueba», hecho tabla. El que verifica no puede arreglar lo que encuentra, porque le falta `edit`, así que no cae en la tentación de darse el visto bueno a sí mismo. El que planifica no ejecuta. Cada frontera separa a quien hace de quien juzga, y no descansa en la buena voluntad de nadie: está en la lista de herramientas. Por eso el equipo entero es predecible.

> ⚠️ **Lo que hay más abajo, y hoy no necesitas.** El documento sigue con el ciclo completo paso a paso, el bucle de verificación, el trabajo con GitHub y tres agentes más: uno que genera pruebas, otro que audita, otro que documenta. Todo eso es el plano de lo que construyes a partir de 6.2 y hasta el final del curso. Hoy no lo abras, o te llevarías el material de seis capítulos de golpe. Con el mapa y la tabla de herramientas tienes lo de este lab.

---

## Definition of Done

Aquí no hay entregable de código: lo que te llevas es criterio para leer un diseño. Lo has terminado cuando:

- [ ] Sabes decir, sin mirar, con qué único agente hablas tú (el orquestador) y cuál es el único que toca git (también el orquestador).
- [ ] Puedes recorrer los cuatro roles del ciclo y decir, de cada uno, qué herramientas lleva y cuál le falta.
- [ ] Sabes explicar por qué el verificador no lleva `edit` y qué garantiza esa ausencia.
- [ ] Entiendes que este documento es un plano: describe un equipo que aún no has construido, y que empezarás a levantar en el capítulo siguiente.

---

## Reto opcional — diseña el equipo de tu proyecto

Sal del proyecto de ejemplo, la lista de tareas de la demo, y piensa en un proyecto tuyo. Si tuvieras que montar un equipo de agentes para desarrollarlo, ¿qué roles pondrías? Y para cada uno, la pregunta que de verdad importa: ¿qué herramientas le darías y cuáles le negarías? Escríbelo como una tabla de cuatro columnas, igual que la del documento: rol, qué hace, herramientas, qué entrega. No hay una respuesta única, y lo interesante está en decidir qué le niegas a cada uno. Cuando lo tengas, ponlo al lado de la tabla del documento y mira en qué coincides y en qué no.

---

## Lo que has practicado

Has leído un plano de agentes como se lee un sistema ajeno: empezando por el mapa, quién llama a quién y quién toca git, y siguiendo por el contrato de herramientas de cada rol. Y te llevas el gesto que más vas a repetir: leer el reparto de herramientas de un equipo fijándote en lo que le niega a cada rol, porque en las ausencias está la garantía. El verificador sin `edit` no es un descuido; es el diseño.

**Puente a 6.2.** Hasta aquí has mirado el plano. En el capítulo siguiente coges las herramientas y levantas tu primer agente con las manos. Y no uno cualquiera: el `prompt-engineer`, cuya lista de herramientas está **vacía**. Un agente que no puede tocar nada, que solo aconseja, suena a contradicción después de todo lo que acabas de ver sobre el contrato de poder. Ese es justo el punto por donde entra 6.2.
