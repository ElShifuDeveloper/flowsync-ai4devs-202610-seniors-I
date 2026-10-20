---
description: Crea un commit convencional (tipo(scope): descripción) a partir de los cambios ya preparados (staged).
agent: build
---

Revisa los cambios en stage (`git diff --cached`). Si no hay nada en stage, avisa y no continúes (no hagas `git add` por tu cuenta salvo que el usuario lo pida).

Genera un mensaje de commit siguiendo **Conventional Commits**: `tipo(scope): descripción breve en imperativo`.

Tipos válidos: `feat`, `fix`, `refactor`, `docs`, `test`, `chore`, `style`, `perf`, `harness`.

Reglas:
- El `scope` es el área tocada (`frontend`, `backend`, `harness`, etc.).
- La descripción va en minúscula, sin punto final, en español.
- Si el cambio toca varias áreas sin relación, sugiere dividir el commit en vez de forzar un solo mensaje.

Ejecuta el commit con ese mensaje.
