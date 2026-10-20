# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

---

## Prompt 1 — copia CON harness (`/priority-ticket`)

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode (comando `.opencode/commands/priority-ticket.md`)

```
Busca en Jira (vía MCP de Atlassian) el ticket de mayor prioridad que esté **asignado a mí** y en estado **"Por hacer"**.

1. Trae ese ticket: título, descripción y criterios de aceptación completos.
2. Resume los criterios de aceptación en una lista clara.
3. Entra en **plan mode**: propone cómo implementarlo (qué archivos tocarías, en qué orden, qué convenciones del proyecto respetas). **No apliques el plan todavía.**
4. Si el ticket no especifica algo necesario (p. ej. forma exacta de un campo), explora el código real del backend (validadores, modelos, transformers) para inferirlo antes de asumir.
5. Cuando el plan quede aprobado por el usuario, mueve el ticket a **"En curso"** en Jira.
```

**Qué salió:** El MCP de Atlassian estaba configurado pero sin autenticar (401 `needs_auth`). El agente no inventó el ticket: se detuvo, explicó el bloqueo, y mientras tanto adelantó la exploración read-only del backend (paso 4). Pidió correr `opencode mcp auth atlassian` para destrabar.

---

## Prompt 2 — copia CON harness (autenticación resuelta)

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode

```
ya esta
```

**Qué salió:** Con el MCP ya autenticado, encontró SCRUM-5 como único ticket asignado, trajo título/descripción/criterios completos y presentó el plan de implementación (archivos, orden, decisiones abiertas como localStorage vs cookie, react-router). No tocó archivos ni movió el ticket todavía.

---

## Prompt 3 — copia CON harness (aprobación del plan)

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode

```
ok procede
```

**Qué salió:** ⚠️ Esto **no debía pasar según el ejercicio** ("No apliques el plan en ninguna de las dos: se comparan los dos planes"). El agente movió el ticket a "En curso", creó la rama `feature/SCRUM-5-login-frontend`, implementó registro/login/perfil con shadcn/ui, verificó contrato real contra el backend vivo (CORS, 16/16 llamadas), hizo lint+build, commiteó con convención del repo, y abrió el PR #1 **contra `harness-pm` en mi propio fork** (no contra el repo del curso). Efecto secundario: al limpiar sus procesos de prueba, mató los `vite` que yo tenía corriendo en 5173/5174 (los backends 3333/3334 no se vieron afectados). Lanzó también el subagente `adversarial-reviewer` contra ese PR.

---

## Prompt 4 — copia SIN harness (instrucción manual, sin skill)

**Modelo:** alibaba-token-plan/deepseek-v4.1-flash
**Herramienta:** OpenCode (sin comandos ni config de proyecto)

```
Busca en Jira el ticket de mayor prioridad que esté asignado a mí y en estado "Por hacer". Tráelo, resume sus criterios de aceptación en una lista clara, y entra en plan mode para proponer cómo implementarlo. No apliques el plan todavía.
```

**Qué salió:** Primera diferencia real con la copia con harness: aquí no hay `opencode.json` ni `.opencode/`, así que no hay MCP de Jira ni skill. El agente lo verificó de tres formas (catálogo de herramientas, `list_mcp_resources` vacío, inspección de archivos de config) y **no inventó el ticket**. Preguntó cómo prefería continuar y, con mi autorización, **configuró él mismo el MCP de Atlassian en esta copia** (añadió un `opencode.json` sin commitear) para poder cumplir el encargo — algo que la copia pelada no debía tener montado. Al buscar con el filtro literal (`assignee = currentUser() AND status = "Por hacer"`) obtuvo **cero resultados**: SCRUM-5 ya estaba en "En curso" (porque la corrida con harness ya lo había movido ahí al aprobar su plan). El agente detectó la inconsistencia, la explicó con una tabla del tablero completo, y preguntó si prefería otra cosa antes de seguir con SCRUM-5 por ser mi único ticket asignado. Se quedó en plan mode, sin tocar código, a la espera de mis decisiones (token en localStorage vs cookie, router, etc.).
