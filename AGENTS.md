# AGENTS.md

ScopeGuard — a React 19 + Vite + TypeScript + Tailwind 4 (CSS-first, Material-3-style tokens) prototype for logistics "scope creep" / change-order management. Single flat package: **no workspaces, no backend, no API, no tests, no React Router.**

## Commands

- `npm run dev` — Vite dev server on port 3000 (host 0.0.0.0). HMR gated on `DISABLE_HMR` env var (AI Studio); don't change.
- `npm run lint` — `tsc --noEmit`. This is the only verification step; run it after every change.
- `npm run build` / `npm run preview` / `npm run clean` — production build / serve / rm dist.

## Env is compile-time

`vite.config.ts` loads `.env` and bakes values into the bundle via `define`:
- `process.env.GEMINI_API_KEY` — Gemini key (empty = offline mode)
- `process.env.AI_PROVIDER` — `'mock'` (default) or `'gemini'`

`.env*` is gitignored (only `.env.example` committed). Changing `.env` requires **restarting the dev server** — baked at build time, not read at runtime.

## AI layer (important)

All AI goes through the facade in `src/lib/ai/` — never import `@google/genai` directly. Pages use `ai` (provider) and `aiStatus` (UI state: `provider`, `enabled`).

- Default `AI_PROVIDER=mock`: offline heuristics + message templates in `src/lib/ai/mock.ts`. Works with no key/network.
- `AI_PROVIDER=gemini`: `src/lib/ai/gemini.ts` dynamically imports `@google/genai` **only when called** (lazy). If the key is missing, the facade falls back to mock with a console warning.
- Do NOT instantiate `GoogleGenAI` at module scope — that was the original bug that crashed the app without a key.
- To add a provider: implement `AiProvider` in `src/lib/ai/types.ts`, register it in `src/lib/ai/index.ts` resolver.
- In production builds with `mock`, the gemini module is fully tree-shaken out of the bundle.

## Routing & pages

No router library. `src/App.tsx` is a single state container that conditionally renders screens in strict priority order (public portal → preview → wizards → drill-downs → sidebar pages). To add a page: add a state flag, a render branch in `App.tsx`, and a nav entry in `src/components/Sidebar.tsx`. Public/portal screens must return early, **without** the `Sidebar`/`TopBar` layout (see `App.tsx` layout handler).

## Data

- `src/types.ts` — `Client`, `Scope` (= `ChangeOrder`), `Notification`.
- `src/lib/mockData.ts` — all app data is mocked here (clients, scopes, notifications). No persistence; add data here.

## Styling & imports

- Use semantic theme classes from `src/index.css` (`bg-surface-container-*`, `text-on-surface`, `text-primary`, `font-h3`, `font-label-caps`) rather than raw colors — they drive dark/light mode.
- Icons: `lucide-react`.
- The `@` alias points to the **project root**, not `src` (see `vite.config.ts` and `tsconfig.json` `paths`): `@/src/pages/...` or use relative imports. Other files in the repo mostly use relative imports.
