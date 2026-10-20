# AGENTS.md

This file provides guidance to OpenCode (opencode.ai) when working with code in this repository. `CLAUDE.md` is a symlink to this file, kept for tools that look for that name specifically.

## Project overview

FlowSync (`flowsync-ai4devs`) is a course exercise project (LIDR Academy, docs in Spanish): a full-stack TypeScript app with two independent packages.

- `backend/` — AdonisJS 7 auth API (Lucid ORM, VineJS validation, access-token auth, SQLite via better-sqlite3). The backend already exists and is treated as read-only during the exercise: read it (especially the validators) to learn what the API really requires; don't modify it.
- `frontend/` — React 19 + Vite. This is where feature work happens (e.g. implementing login against the existing auth API, using shadcn/ui components copied into the repo). Currently a stock Vite template.
- Root `README.md` is generated from course material — never edit it by hand. `prompts.md` is a student-facing template for logging prompts.

Requires Node.js 24+ (older versions fail with `Unknown file extension ".ts"`).

## Commands

### Backend (run from `backend/`)

```bash
npm install
cp .env.example .env      # first time only
node ace generate:key     # first time only
node ace migration:run    # applies migrations, regenerates database/schema.ts
npm run dev               # dev server with HMR → http://localhost:3333
```

- `npm run test` — Japa test runner (tests live in `tests/`; only `bootstrap.ts` exists so far)
- `npm run lint` — ESLint (`@adonisjs/eslint-config`)
- `npm run format` — Prettier (`@adonisjs/prettier-config`: no semicolons, single quotes)
- `npm run typecheck` — `tsc --noEmit`
- `npm run build` — `node ace build`

### Frontend (run from `frontend/`)

```bash
npm install
npm run dev               # Vite dev server → http://localhost:5173
```

- `npm run build` — `tsc -b && vite build`
- `npm run lint` — oxlint
- No formatter is configured yet; the course harness adds Prettier over `frontend/src/**`.

## Backend architecture

Request flow: `start/routes.ts` → controller (`app/controllers/`) → VineJS validator (`app/validators/`) → Lucid model (`app/models/`) → transformer (`app/transformers/`) shapes the JSON response.

- Use the package subpath imports (`#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, `#middleware/*`, `#config/*`, `#start/*`, `#database/*`), never cross-layer relative paths.
- `database/schema.ts` is auto-generated (by `node ace migration:run`) — never edit it manually. Schema changes are always a new migration in `database/migrations/`, never hand-edited tables.
- When a ticket is vague about request fields, the VineJS validators in `app/validators/` are the source of truth for what the API accepts.

### API (all responses are JSON; `force_json_response` middleware is global)

| Route | Auth | Body | Response |
|---|---|---|---|
| `POST /api/v1/auth/signup` | no | `fullName` (string, nullable), `email` (valid, unique, max 254), `password` (8–32 chars), `passwordConfirmation` (must equal `password`) | `{ user, token }` |
| `POST /api/v1/auth/login` | no | `email`, `password` | `{ user, token }` |
| `GET /api/v1/account/profile` | Bearer token | — | serialized user |
| `POST /api/v1/account/logout` | Bearer token | — | `{ message }`, deletes current token |

- Auth uses the access-tokens guard (default `api`): tokens carry an `oat_` prefix and are sent as `Authorization: Bearer <token>`.
- The exposed user shape comes from `UserTransformer`: `id`, `fullName`, `email`, `createdAt`, `updatedAt`, `initials`. `password` is never serialized (`serializeAs: null`) — transformers are the boundary for what leaves the API.
- Signup with an existing email fails VineJS `unique` validation; login with bad credentials fails `User.verifyCredentials`. The frontend must surface these as clear user-facing messages, not generic/console errors.
- CORS: all origins allowed in dev; production uses an allowlist (`.env` `CORS_ORIGIN`, e.g. `http://localhost:5173`).

## Frontend architecture

- Entry point `src/main.tsx` renders `src/App.tsx`; styles in `src/index.css` / `src/App.css`.
- No router, state library, or UI kit is installed yet. Course work uses shadcn/ui: components are copied into the repo (freely editable), not added as `package.json` dependencies.
- The Vite dev server (5173) calls the backend (3333) cross-origin; the backend has CORS enabled in dev.

## Conventions

- TypeScript end-to-end; both packages are ESM (`"type": "module"`).
- Backend code style is enforced by Prettier/ESLint AdonisJS configs — run `npm run format` / `npm run lint` in `backend/` rather than hand-matching style.
- Course deliverables live in `docs/harness/` (comparison file) and `prompts.md`; work happens on a `harness-<initials>` branch off the fork.

## Process rules

Follow these for every piece of work, in this order:

1. **New branch before touching code.** Never work directly on the base branch; create a descriptive branch first.
2. **When closing the work**, run `/commit` to create a conventional commit (`tipo(scope): descripción`) from the staged changes, then open the pull request with `gh pr create`.
3. **After the PR is open**, run the `@adversarial-reviewer` subagent against the pull request. It reviews trying to break it, not to approve it, and edits nothing.
4. **In the chat, report only the pull request URL.** Nothing else.
