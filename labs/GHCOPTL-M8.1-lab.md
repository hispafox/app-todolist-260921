---
submódulo: M8.1
tipo: lab
tipo-lab: construcción
título: "Lab M8.1 — Ponle cara a tu API"
base: "temario/GHCOPTL-M8.1-una-api-que-se-explica-sola.md"
rama-referencia: "submodulo-8.1/scalar"
repo-ejemplos: "hispafox/AppTodoList-curso"
lab-version: 1
actualizado: 2026-07-08
---

# 🧪 Lab M8.1 — Ponle cara a tu API

> **Lab versión 1 · Última actualización 2026-07-08 · Base:** [M8.1 — Una API que se explica sola](../temario/GHCOPTL-M8.1-una-api-que-se-explica-sola.md)

En el capítulo leíste que tu API ya genera su propio esquema OpenAPI, y que Scalar lo convierte en una página que se lee y se prueba sin abrir el código. Aquí lo instalas con tus manos, recorres tu propia API desde esa página y compruebas tú mismo, no de oídas, que esa documentación desaparece fuera de desarrollo.

---

## En este lab

- **Overview** — qué practicas
- **Punto de partida** — dónde retomas
- **Ejercicio 1** — Pide Scalar, mira el diff
- **Ejercicio 2** — Recorre tu API desde `/scalar`
- **Ejercicio 3** — Comprueba que solo existe en Development
- **Definition of Done**
- **Comparar con la referencia**
- **Reto opcional** — un campo que aparece solo
- **Lo que has practicado + puente al Lab 8.2**

---

## Overview

Al terminar este lab sabrás pedirle a GitHub Copilot que integre Scalar en una API que ya funciona, leer el diff que produce, y comprobar las tres promesas de la base: que la documentación sale del código, que se explora con «Try it», y que no deja rastro fuera de desarrollo.

> ⏱️ Tiempo estimado: 25-35 min.

---

## Punto de partida

**Requisitos** (los mismos de todo el curso): VS Code con la extensión de GitHub Copilot en modo agente, y tu repositorio de siempre, publicado en GitHub.

Sigues en el mismo proyecto. Tu API de tareas, plantillas, categorías y usuarios asignados (M04-M07) ya funciona y responde; en este lab no le tocas ni el modelo ni la lógica, solo le enseñas a explicarse a quien la abra. Todo en la misma rama de siempre: aquí tampoco creas ramas.

> 💡 **Tu red de seguridad: la demo del curso.** Cuando termines, te asomas a la rama de este capítulo en tu clon de `AppTodoList-curso` para comparar. Solo para mirar, como en cada lab.

---

## Ejercicio 1 — Pide Scalar, mira el diff

*Vas a pedir esto con la misma frase que se usó en clase, y vas a fijarte en algo que dice mucho del sistema que montaste en M06 y M07: no toda petición necesita la maquinaria pesada.*

### Tarea 1.1 — El mismo encargo real

1. Pídeselo a tu agente orquestador, con el mismo encargo real del capítulo:

   > **«Lo que quiero implementar ahora es scalar para la api»**

   → **Qué esperar:** el plan que redacta reconoce que esto es pura documentación —sin entidades nuevas, sin DTOs, sin endpoints, sin lógica de negocio ni tests de por medio— y que no hace falta la cadena de skills de M04 para algo así. Lo implementa directo, en tres sitios:
   - en tu `.csproj`, la referencia al paquete `Scalar.AspNetCore`;
   - en tu `Program.cs`, junto a los `builder.Services...` que ya tienes, la línea `builder.Services.AddOpenApi();` —el generador del esquema, que tu proyecto todavía no tenía—;
   - y, antes de `app.Run()`, el bloque nuevo:
     ```csharp
     if (app.Environment.IsDevelopment())
     {
         app.MapOpenApi();
         app.MapScalarApiReference();
     }
     ```

   🔎 **Por qué el bloque entero, y no solo la línea de Scalar.** Tu proyecto nunca había necesitado publicar su esquema hasta ahora, así que montas las dos piezas de golpe en este mismo paso: el `if` de desarrollo, `MapOpenApi()` y `MapScalarApiReference()` llegan juntos. OpenAPI y Scalar, a la vez.

   ⚠️ **Error común.** Comprueba que las dos llamadas (`MapOpenApi()` y `MapScalarApiReference()`) queden DENTRO del `if`, no fuera de él. Si quedaran fuera, las dos rutas se colarían también en producción, y eso es justo lo que ese bloque evita.

### Tarea 1.2 — Compila y confirma el diff

2. Comprueba: `dotnet build` → verde.
3. Repasa el diff con `git diff` (o el panel de cambios de tu editor): deberías ver el paquete nuevo en el `.csproj`, y en `Program.cs` la línea `AddOpenApi()` junto a tus demás servicios más el bloque `if` con las dos llamadas de dentro.

---

## Ejercicio 2 — Recorre tu API desde `/scalar`

*Ya tienes el esquema con cara. Ahora úsalo para lo que antes te costaba media mañana: entender un endpoint sin abrir el código.*

### Tarea 2.1 — Abre la página

1. Arranca tu aplicación y entra en `/scalar`.

   → **Qué esperar:** la lista de tus endpoints —tareas, plantillas, categorías, usuarios asignados—, agrupados y con buscador.

### Tarea 2.2 — Despliega un endpoint y pruébalo

2. Despliega `POST /api/Tareas` y mira el cuerpo que pide.

   → **Qué esperar:** el `CrearTareaDto`, con `title` marcado como obligatorio y el resto (entre otros, `categoriaId`, `plantillaId`, `usuarioAsignadoId`, `esRepetitiva`, `recurrencia`) como opcional, cada uno con su tipo.

3. Pulsa «Try it», rellena solo el `title`, y envía.

   → **Qué esperar:** un `201 Created` con la tarea recién creada en el cuerpo de la respuesta. Sin Postman, sin terminal.

   💡 **Pista.** Prueba también a enviarlo sin `title`. Vas a ver el `400 Bad Request` del que habla la base: la validación de 4.6 sigue funcionando exactamente igual, Scalar solo te la enseña.

---

## Ejercicio 3 — Comprueba que solo existe en Development

*La base te dijo que Scalar desaparece en producción por una condición en el código. Aquí lo compruebas de verdad, en vez de creértelo sin más.*

### Tarea 3.1 — Simula producción

1. Cambia, solo para esta prueba, la variable `ASPNETCORE_ENVIRONMENT` a `Production` —en tu perfil de `launchSettings.json`, o exportándola en tu terminal antes de arrancar—.
2. Arranca la aplicación y entra en `/scalar`.

   → **Qué esperar:** un `404`. La página no existe. Prueba también `/openapi/v1.json`: tampoco está, porque las dos llamadas están dentro del mismo `if`.

   ⚠️ **Error común.** Este cambio es temporal. Revierte el valor en la Tarea 3.2 antes de seguir, o la próxima vez que arranques en desarrollo te vas a preguntar por qué «ha desaparecido» tu documentación.

### Tarea 3.2 — Devuelve el entorno a Development

3. Restaura `ASPNETCORE_ENVIRONMENT` a `Development` y confirma que `/scalar` vuelve a responder.

---

## Definition of Done

Este lab no añade nada nuevo a la API, solo la hace explicarse. Lo has terminado cuando:

- [ ] El paquete `Scalar.AspNetCore` está en tu `.csproj`.
- [ ] `builder.Services.AddOpenApi()` está registrado junto a tus demás servicios.
- [ ] `app.MapOpenApi()` y `app.MapScalarApiReference()` están en tu `Program.cs`, las dos dentro del mismo `if (app.Environment.IsDevelopment())`.
- [ ] Tu proyecto compila.
- [ ] `/scalar` te muestra tus endpoints y «Try it» te devuelve una respuesta real.
- [ ] Has confirmado que `/scalar` y `/openapi/v1.json` desaparecen fuera de Development, y los has devuelto a Development.
- [ ] Tu diff coincide con el de la rama de referencia.

---

## Comparar con la referencia

La solución de referencia está en la demo del curso, `AppTodoList-curso`, en su rama `submodulo-8.1/scalar`.

```bash
cd AppTodoList-curso
git checkout submodulo-8.1/scalar
```

Abre su `Program.cs` y su `.csproj`, y ponlos al lado de los tuyos. Lo esencial que debe coincidir: la referencia a `Scalar.AspNetCore` en el `.csproj`, `builder.Services.AddOpenApi()` junto a los demás servicios, y el bloque `if` de desarrollo con `app.MapOpenApi()` y `app.MapScalarApiReference()` dentro.

Cuando termines de mirar, vuelve a tu proyecto y sigue con lo tuyo.

---

## Reto opcional — un campo que aparece solo

Añádele a tu `CrearTareaDto` un campo nuevo —por ejemplo, una fecha límite— y pídeselo a GitHub Copilot sin mencionar Scalar ni la documentación para nada. Cuando compile, arranca la aplicación y entra en `/scalar` sin tocar nada más: el campo ya está ahí, en el cuerpo de `POST /api/Tareas`, con su tipo. Nadie escribió esa parte de la documentación a mano; salió sola, del DTO que acabas de cambiar. Esa es la prueba de lo que dice el título del capítulo.

---

## Lo que has practicado

Has visto tu API generar su propio contrato —el esquema OpenAPI—, y le has puesto cara con Scalar. Has probado un endpoint real en vivo con «Try it», y has comprobado con tus manos, no de oídas, que esa documentación desaparece fuera de desarrollo y se pone al día sola en cuanto cambias un DTO.

**Puente al Lab 8.2.** Tu API ya sabe explicarse a quien la abra en el navegador. Pero todavía le falta lo que la gente de verdad toca: una pantalla. En el próximo lab construyes, con su propio skill, el frontend en React que consume esta misma API —y vas a ver que el esquema que acabas de exponer es exactamente lo que ese frontend necesita para saber, sin adivinar, con qué está hablando.
