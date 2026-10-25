# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

---

## Prompt 1 — el terreno que ya existe

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode (`opencode run --model alibaba-token-plan/deepseek-v4.1-flash`)

```
Antes de especificar nada de producto: explora este repositorio y dime (1) qué capabilities ya están construidas y (2) cómo es el modelo de datos actual. Solo lo que existe en el código, no propongas nada nuevo. Máximo 5 líneas.
```

**Qué salió:** funcionó a la primera. Devolvió que solo existe auth + cuenta (signup, login, logout, perfil protegido, 3 pantallas, guards, `auth-provider` con token en `localStorage`, `lib/api.ts`) y que el modelo de datos son dos tablas (`users`, `access_tokens`), sin ningún dominio de producto. Se pasó un poco de las 5 líneas que pedí. Nota: intentó usar `backend/.codegraph/` (un índice que la guía del proyecto menciona) y al no existir hizo fallback a lectura directa de archivos, avisándolo.

---

## Prompt 2 — el interrogatorio (una sola ronda)

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode

```
Antes de proponer nada: hazme exactamente las 5 preguntas que más reducirían la incertidumbre sobre el problema, los usuarios y el alcance de este producto. Una sola ronda, no más. Prohibido bajar al modelo de datos o a endpoints: solo producto.
```

**Qué salió:** 5 preguntas, ni una más, y no bajó a endpoints ni a modelo de datos. Coincidieron casi punto por punto con la ficha de hechos del ejercicio (decisión que cambia, quién cobra el valor, qué significa tiempo real, forma de la señal, frontera del MVP). Añadió de su cuenta "si algo no lo tienes decidido, lo decidiré yo y lo marcaré como supuesto", que es justo el comportamiento que el ejercicio pide vigilar. Antes de responder leyó `README.md` (líneas 114-144) para situarse: no hizo falta decirle que era la lección del módulo.

---

## Prompt 3 — el alcance en cinco bloques, con recorte

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode

```
Partimos del encargo del cliente, tal cual llegó:

«Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.»

Aquí están las respuestas del producto, ya decididas. No me las vuelvas a preguntar:

- Qué duele hoy: la daily de sincronización y el "¿en qué estás?" constante por Slack/chat. Nadie ve el estado del equipo sin interrumpir a alguien.
- Quién cobra el valor: los pares, no un lead. No hay reporte hacia arriba y a un manager le daría igual. Duele a los dos devs que descubren tarde que iban a lo mismo, y al que interrumpe a otro para preguntar.
- Episodio concreto: dos personas del equipo tocaron el mismo módulo la misma semana porque una empezó sin que la otra lo supiera. Dos días perdidos.
- Qué reunión desaparece (respuesta honesta, no la vendas de más): la daily NO desaparece entera. Desaparece la ronda de "¿en qué estás?", que hoy se come la mitad de los 15 minutos. La parte de bloqueos sigue, y este MVP no la resuelve.
- Usuarios / equipo: equipos remotos pequeños, 3–10 personas. Roles planos: en el MVP todos ven y editan lo mismo, sin jerarquía de permisos.
- Primer usuario concreto: equipo de 6 personas de producto SaaS, en 3 husos horarios, que hoy usa un gestor de tareas pesado y una daily de 15 minutos por videollamada. Es un CASO DE ESTUDIO, no un cliente real.
- Fronteras: un espacio único compartido, sin entidad "equipo". Varios equipos separados, o gente en más de uno, queda FUERA del MVP: se anota como supuesto en el PRD, no se construye.
- "Tiempo real" = ver los cambios de estado de las tareas sin refrescar ni preguntar. NO es chat, NO es videollamada, NO es colaboración simultánea sobre el mismo documento.
- Es frescura, no presencia: el estado es de la TAREA, no de la persona. Nada de "quién está conectado ahora" ni indicadores de actividad; eso es vigilancia y lo rechazamos a propósito.
- Forma de la señal: resumen que espera, no aviso que interrumpe. El caso es "llego por la mañana o vuelvo de una reunión y veo qué se ha movido". Sin notificaciones push.
- Qué decisión cambia: no empezar algo que otra persona ya está tocando, y elegir lo siguiente sabiendo qué está libre. Si la única respuesta fuera "sentirse informado", el tiempo real no valdría lo que cuesta.
- De dónde sale el estado: lo teclea la persona que hace la tarea, en segundos. Derivarlo de señales externas (Git/PRs, CI, calendario) está FUERA del MVP: es otro producto, con integraciones y OAuth de terceros.
- Por qué se sostiene: no porque sea más agradable, sino porque son dos clics sobre una lista ya abierta, sin campos obligatorios, sin decidir sprint ni estimación. Y quien lo escribe cobra en el momento: esa misma lista es su cola de trabajo, la mira para decidir qué coge, y de paso deja de recibir interrupciones preguntándole cómo va. Si el beneficio fuera solo para los demás, no lo escribiría.
- Si la información se queda vieja: el producto pierde el sentido, y lo asumo. Es el riesgo #1 a validar, no un detalle. La mitigación es que actualizar cueste dos clics, no obligar a nadie.
- Es donde se hace el trabajo, no donde se cuenta: sustituye al gestor de tareas, no convive con él. FlowSync crea las tareas, no lee las de otro sitio. Convivir exigiría doble actualización, que es como muere esta categoría.
- Renuncia explícita a sprints, estimaciones, épicas, backlog priorizado e informes. Un equipo que necesite eso no es nuestro usuario.
- "Menos rollo que Jira" = crear una tarea y cambiarle el estado en segundos, sin flujos de configuración ni campos obligatorios. Lo mínimo para saber quién está en qué.
- Qué necesita una tarea en el MVP: título, responsable, estado y fecha de vencimiento. La fecha, para ver de un vistazo qué se ha pasado de plazo.
- Cómo se consume la lista: filtrando por estado, para centrarse en lo pendiente.
- Éxito para el usuario: dejar de hacer la ronda de "¿en qué estás?" de la daily porque el estado del equipo se ve de un vistazo.
- Criterio a una semana de uso real: que el equipo cancele esa ronda y nadie pida que vuelva. Si la siguen haciendo igual, no funcionó.
- Cuánto construir: una vertical fina y usable de punta a punta, no el andamiaje amplio de un producto. Prefiero una capability terminada a tres a medias.

Y esto ya está decidido que queda FUERA del MVP:
- Fuera del MVP: notificaciones push, integración con Slack, roles/permisos avanzados, analítica/reporting, comentarios en tareas.

Con todo eso, propón el alcance del MVP en cinco bloques, en este orden: problema · usuarios · propuesta de valor · alcance · NO-alcance.

Requisitos duros:
- Sé agresivo recortando. Cada cosa que metas en el alcance hay que poder construirla y defenderla.
- Cada exclusión del NO-alcance lleva su justificación al lado: qué hipótesis del producto no ayuda a validar. Nada de "no da tiempo".
- Nada de tablas, endpoints, arquitectura ni modelo de datos: esto es un documento de producto, no una spec técnica.
- Que quepa en una pantalla larga.
```

**Qué salió:** cumplió el formato (5 bloques, sin tablas ni endpoints ni arquitectura) y trajo **7 capacidades** en el alcance, todas justificadas y con el NO-alcance más largo que el alcance. Lo que no hizo: recortar de verdad — las 7 eran razonables, pero ninguna era una renuncia incómoda. El recorte a 5 lo hice yo (fuera la señal visual de vencimiento y fuera "espacio compartido" como capability), y está anotado en el documento. También se saltó la coherencia interna de la ficha: dejó la fecha de vencimiento en el alcance y a la vez aceptó el discurso de que el MVP no gestiona plazos, sin señalar el choque. Eso lo detecté al escribir el documento, no él.