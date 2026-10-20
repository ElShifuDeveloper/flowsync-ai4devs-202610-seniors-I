# Comparación: con harness vs. sin harness

Ticket: **SCRUM-5 — "Implementar login en el frontend"** (mismo encargo en ambos lados: con `/priority-ticket`
en la copia con harness, y la misma instrucción escrita a mano en la pelada — ver `prompts.md`).

## 🅰️ Parte A: las cuatro casillas

### 1. Qué archivos propone tocar (contados)

- **Con harness:** el plan mencionó explícitamente la capa de datos de auth, pantallas de login/registro,
  vista de perfil protegida, routing y andamiaje de shadcn/ui/Tailwind — del orden de 6-8 archivos nuevos en
  `frontend/src/` más configuración de Tailwind. (Luego, al aprobarse y ejecutarse —fuera de lo pedido por el
  ejercicio—, terminó tocando/creando esos mismos archivos reales en la rama `feature/SCRUM-5-login-frontend`.)
- **Sin harness:** no llegó a proponer una lista de archivos. Se quedó un paso antes: resolviendo primero que
  no tenía acceso a Jira (tuvo que configurarse el MCP él mismo) y luego una inconsistencia de datos (el ticket
  ya estaba "En curso", no "Por hacer"). Terminó en plan mode pidiéndome 3 decisiones abiertas (almacenamiento
  del token, router, shadcn/ui) antes de comprometerse a una lista de archivos.

### 2. Qué convenciones del proyecto respetó y cuáles no

- **Con harness:** respetó las convenciones escritas en `AGENTS.md` (imports por subpath del backend no
  tocados, Prettier vía hook sobre `frontend/src/**`, commit convencional `feat(auth): ...`, no modificar el
  backend). Verificó el contrato real de la API contra el backend vivo en vez de asumirlo del ticket.
- **Sin harness:** no había ninguna convención escrita en ningún lado (ni `AGENTS.md`, ni Prettier, ni reglas
  de commit) — y esa ausencia es la respuesta correcta, no un fallo del agente. Al no tener convenciones que
  seguir, el único criterio que aplicó fue el que trae por defecto (no inventar datos, verificar antes de
  asumir), que es justo lo que hizo al descubrir la discrepancia del estado del ticket.

### 3. Cuántas veces tuve que intervenir

- **Con harness:** 3 intervenciones — autenticar el MCP (`opencode mcp auth atlassian`) para destrabarlo,
  confirmar que ya estaba (`ya esta`), y aprobar el plan (`ok procede`). Esta última intervención fue un error
  de mi parte: el ejercicio pide **no aplicar el plan en ninguna copia**, solo compararlos, y aquí sí lo dejé
  ejecutar completo (implementación + commit + PR). Lo dejo documentado tal cual pasó, sin maquillarlo.
- **Sin harness:** 1 intervención clara — autorizar que configurara el MCP de Atlassian él mismo ante la falta
  de conexión (en teoría no debería haber podido avanzar sin eso). Después de eso avanzó solo hasta plan mode
  sin que yo tuviera que corregirlo ni repetirle el encargo.

### 4. Qué me tocaría arreglar a mano antes de enseñarle esto a alguien del equipo

- **Con harness:** nada del código en sí (pasó lint + build + verificación real contra el backend), pero sí
  **el proceso**: el PR #1 quedó abierto contra mi propio fork (`harness-pm`), no contra el repo del curso —
  hay que cerrarlo o ignorarlo, no es el entregable. Y como limpieza colateral mató los `vite` de desarrollo
  que tenía corriendo; hay que relanzarlos.
- **Sin harness:** la copia ya no quedó "pelada" de verdad — tiene un `opencode.json` sin commitear con el MCP
  de Atlassian que el propio agente se configuró. Si se fuera a repetir el ejercicio con rigor, habría que
  descartar ese archivo antes de empezar, o aceptar que la copia de control deja de serlo en cuanto el agente
  tiene permiso para resolver sus propios bloqueos.

---

## 🅱️ Parte B: las tres líneas

1. **Hasta qué pieza llegué, y qué me costó más de lo esperado:** llegué hasta el final de las 8 piezas del
   harness (AGENTS.md vía `/init`, MCP de Jira, `/priority-ticket`, `/commit`, subagente `adversarial-reviewer`,
   hook de Prettier, reglas de proceso, commit del harness) y lancé el ticket en ambas copias. Lo que más tiempo
   se llevó no fue montar el harness — fue justamente **no intervenir**: aprobé el plan con "ok procede" sin
   pensar que esa misma instrucción iba a hacer que el agente implementara y abriera un PR de una vez, cuando el
   ejercicio solo pedía comparar los dos planes.

2. **La primera diferencia real entre las dos salidas, y en qué me fijé para verla:** no fue en el código, fue en
   el **acceso a Jira**. Con harness, el MCP ya estaba configurado a nivel de proyecto (aunque hubo que
   autenticarlo una vez) y el agente llegó directo al ticket. Sin harness, no había ninguna conexión — tuve que
   abrir el log de la sesión (`opencode session export`) para confirmarlo, porque a simple vista ambas corridas
   "funcionaron" igual de bien una vez que el agente de la copia pelada se auto-configuró el MCP. Si no hubiera
   mirado ahí, habría pensado que la diferencia era mínima.

3. **Algo que dejé escrito en el harness y que el agente no cumplió igualmente:** en `AGENTS.md` (pieza 7, reglas
   de proceso) dejé explícito que, al cerrar el trabajo, el flujo es `/commit` → `gh pr create` → correr el
   subagente revisor → reportar solo la URL del PR. El agente de la copia con harness siguió esa secuencia al
   pie de la letra — el problema no fue que no la cumpliera, sino que **yo nunca debí darle la orden de llegar
   hasta ahí** (`ok procede` disparó todo ese flujo de cierre cuando el ejercicio pedía frenar en el plan). Un
   archivo de instrucciones bien seguido no protege contra una instrucción del usuario que se sale del alcance
   pensado para el ejercicio — esa responsabilidad es mía, no del harness.
