# Alcance del MVP — FlowSync

> Ejercicio Módulo 2 (SDD). Entregable: el recorte del MVP, no el código.
> Herramienta: OpenCode · Modelo: alibaba-token-plan/deepseek-v4.1-flash

## 1. El terreno que ya existe

El repo **no es una carpeta vacía**: ya tiene autenticación y cuenta de usuario completas — signup, login, logout y perfil protegido — con las tres pantallas correspondientes en el frontend (login, registro, perfil), guards de ruta, un `auth-provider` que guarda el token en `localStorage` y un único cliente HTTP (`lib/api.ts`). El modelo de datos son **dos tablas**: `users` (id, full_name, email único, password hasheado y no serializado, timestamps) y `access_tokens` (tokenable_id, type, hash, name, abilities, last_used_at, expires_at, timestamps). No hay ningún dominio de producto: **ni tareas, ni equipos, ni proyectos**, ni relaciones entre modelos. Es decir: la capa de identidad está resuelta y todo el MVP se construye encima de ella.

## 2. El interrogatorio

Cinco preguntas antes de proponer, una sola ronda, sin bajar a modelo de datos ni endpoints:

1. **¿Qué interrupción desaparece y qué decisión deja de tomarse a ciegas?** → Desaparece la ronda de «¿en qué estás?» de la daily. La decisión que cambia: no empezar algo que otro ya está tocando (dos personas del equipo tocaron el mismo módulo la misma semana; dos días perdidos).
2. **¿Quién cobra el valor y con qué roles?** → Los pares, no un lead. Equipos remotos de 3–10 personas, roles planos: todos ven y editan lo mismo.
3. **¿Qué significa «tiempo real» aquí, y qué no?** → Ver los cambios de estado sin refrescar ni preguntar. Es **frescura de la tarea**, no presencia de la persona. No es chat, ni videollamada, ni edición simultánea.
4. **¿Cómo llega la señal?** → Resumen que espera, no aviso que interrumpe. Llegas por la mañana o vuelves de una reunión y ves qué se ha movido. Sin push.
5. **¿Dónde está la frontera del MVP?** → Un espacio único compartido, sin entidad «equipo». Varios espacios queda fuera y se anota como supuesto. Fuera también: notificaciones, Slack, permisos, comentarios, analítica, historial.

## 3. El alcance en cinco bloques

### Problema

La daily no es el problema: lo es la ronda de «¿en qué estás?» que se come la mitad de sus 15 minutos, y el goteo de preguntas por chat el resto del día. Nadie ve el estado de los demás sin interrumpir a alguien, así que la información solo existe si alguien la arranca a mano. El coste ya se materializó: dos personas tocando el mismo módulo la misma semana. Los bloqueos de la daily se quedan donde están: no son parte de este encargo.

### Usuarios

Equipos remotos pequeños, 3–10 personas, planos: todos ven y editan lo mismo, en un único espacio compartido. Caso de estudio (no cliente real): 6 personas de un producto SaaS en 3 husos horarios, hoy con un gestor de tareas pesado y una daily de 15 minutos. Quien cobra el valor son los pares, no un lead; no hay reporte hacia arriba.

### Propuesta de valor

Que el estado del equipo se vea de un vistazo, sin preguntar y sin reunión. Es frescura de la tarea, no presencia: nada de «quién está conectado». La señal es un resumen que espera, no un aviso que interrumpe. Se sostiene porque actualizar cuesta dos clics sobre una lista que ya tienes abierta — esa misma lista es tu cola de trabajo, así que quien escribe cobra al momento. Y sustituye al gestor de tareas, no convive con él: convivir obligaría a doble actualización, que es como muere esta categoría. Éxito: a una semana de uso real, el equipo cancela la ronda y nadie pide que vuelva. Riesgo #1, asumido: que la información se quede vieja.

### Alcance

**Cinco capacidades, y nada más:**

1. **Tareas con cuatro campos** — título, responsable, estado y fecha de vencimiento. Ninguno obligatorio.
2. **Estados fijos y mínimos** — pendiente / en curso / hecho, sin configurar flujos.
3. **Crear y mover en dos clics** — desde la propia lista, sin formularios de configuración.
4. **Una lista única filtrable por estado** — que es la cola de trabajo y el tablero a la vez.
5. **Cambios visibles sin refrescar** — el estado de las tareas se actualiza solo.

**Recorte aplicado sobre la propuesta de la IA:** fuera la *señal visual de vencimiento* (el campo fecha se queda en la tarea; lo que no se construye es la alerta de atraso) y fuera *«espacio compartido» como capability* (hay uno y ya: no se construye nada de creación, cambio ni gestión de espacios).

### NO-alcance

Cada exclusión con la hipótesis del producto que **no** ayudaría a validar:

- **Notificaciones push** — la señal es resumen que espera. Un aviso entrena a reaccionar en vez de a mirar la lista, y **disimula el riesgo #1**: si nadie la abre, el push lo tapa en vez de delatarlo.
- **Señal visual de vencimiento** — el MVP valida que el equipo deje de preguntar «¿en qué estás?», no que gestione compromisos ni plazos. Un resaltado de atraso es gestión de compromisos: otro producto.
- **Espacios múltiples / entidad «equipo»** — el valor se valida con un espacio único. Añadir aislamiento no prueba que la frescura se sostenga; queda como supuesto en el PRD, no como backlog.
- **Integración con Slack / chat** — el estado viene de lo que teclea la persona. Traerlo de un canal no prueba que teclear dos clics se sostenga.
- **Derivar estado de Git, PRs, CI o calendario** — cambia la fuente del estado y no valida la única hipótesis que importa: que la gente está dispuesta a teclearlo.
- **Comentarios en tareas** — la conversación ya ocurre en el chat que existe; no mueve la decisión de «qué está libre».
- **Roles y permisos avanzados** — el valor lo cobran pares en un equipo plano; la jerarquía no cambia ninguna decisión de duplicidad.
- **Sprints, estimaciones, épicas, backlog priorizado, informes, analítica** — un equipo que los necesita no es el usuario. Construirlos reintroduce justo el «rollo» que es la razón de existir del producto.
- **Presencia / actividad / «quién está conectado»** — es vigilancia, se rechaza por diseño; y además no ayuda, porque la decisión es sobre la tarea, no sobre la persona.
- **Chat, videollamada, edición simultánea** — otro producto. «Tiempo real» aquí es solo ver los cambios sin refrescar.
- **Resolver los bloqueos de la daily** — límite reconocido del MVP, explícitamente no resuelto.

---

## Parte B: las tres líneas

**1. Los dos números.** La IA propuso **7** capacidades dentro del alcance; quedaron **5** después de mi recorte.

**2. Tres cosas que dejé fuera, y qué hipótesis no validan:**

- **Notificaciones push** → un aviso que interrumpe entrena a reaccionar, no a mirar la lista; y tapa el riesgo #1 (que la información se quede vieja) en vez de dejarlo a la vista.
- **Señal visual de vencimiento** → el MVP valida que el equipo deje de preguntar «¿en qué estás?», no que gestione plazos; el atraso es gestión de compromisos, no frescura.
- **Espacios múltiples / entidad «equipo»** → con un espacio único ya se puede saber si la frescura hace que el equipo cancele la ronda; el aislamiento entre equipos no aporta a esa validación.

**3. La exclusión de la que menos seguro estoy.** **Quitar las notificaciones push.** Lo que se contradecía: la ficha dice que el fracaso del producto es que la información se quede vieja, y el push es la forma evidente de empujar a actualizar. Elegí la versión barata y defendible — dos clics, sin obligar a nadie, y que el silencio delate el problema en vez de esconderlo — pero es una apuesta, no una certeza. Entraría si, tras una semana, el equipo cancela la ronda *pero* la lista se ve desactualizada por la mañana: ahí el push dejaría de ser ruido y pasaría a ser la mitigación del riesgo #1.

**Incoherencia detectada (no señalada por la IA, la provoqué yo al recortar):** la ficha de hechos dice que la fecha de vencimiento está para «ver de un vistazo qué se ha pasado de plazo», y mi recorte elimina justo la señal de atraso. Queda el campo, pero sin la lectura que lo justificaba. Lo dejo escrito en vez de taparlo: o la fecha entra con su señal, o el campo sobra. Es la decisión que llevaría a la sesión sin cerrar.