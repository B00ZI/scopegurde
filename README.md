# ScopeGuard

**Catch scope creep before it eats the project.**

Every freelancer knows the pattern: the contract is signed, work starts, and then come the
"small favors" — one more page, one more revision, one more integration. None of them huge,
all of them unpaid. By the time you push back, you've already done the work.

ScopeGuard keeps the line visible from both sides. Every request that drifts beyond the
contract gets flagged, turned into a priced change proposal, and approved by the client from
their own link — before the work happens, not after.

## The idea in one flow

1. **Set up the project** — contract sections, base price, milestones. This is the reference
   point everything gets measured against.
2. **A request comes in** — from the client, your team, or pasted as raw "brain dump" notes.
   AI (Google Gemini) structures it into a proper change item.
3. **Scope check** — every request is classified *In Scope*, *Needs Review*, or *Out of Scope*,
   with the contract section that justifies the call.
4. **Send a change proposal** — out-of-scope work becomes a proposal: exact deliverables, a
   price adjustment, extra time. The message can be drafted friendly, neutral, or firm.
5. **The client decides from their own room** — a public link, no account needed. They see
   exactly what changed and accept or decline. The project updates either way.

No awkward email threads. No "I thought that was included." Just a shared, written record.

## The app

- **Dashboard** — the projects and decisions that need you today: scope calls waiting,
  proposals awaiting clients, overdue milestones.
- **Projects** — each project's contract, milestones, scope timeline, and every change
  proposal with its status (Draft → Awaiting Client → Approved / Declined).
- **Clients** — a lightweight CRM: contacts, active projects, revenue at a glance.
- **Client Room** — the client-facing side, at a public link (`#/room/:projectId`). They see
  their project, respond to proposals, and message you — without logging in.
- **Notifications & history** — what happened, when, and who decided.

## Current state — v1 prototype

This repo is the **working prototype**, and it's honest about what that means:

- **No backend yet.** It's a frontend-only React app; all data lives in memory, seeded with
  realistic mock projects and clients. A refresh resets everything.
- **AI is pluggable.** By default it runs an offline mock provider (no key, no network).
  Set `AI_PROVIDER=gemini` + `GEMINI_API_KEY` and the same features run on real Google
  Gemini instead — see `.env.example`.
- **Login is a demo gate**, not real authentication.
- **Payments and email delivery are designed for but not wired up** — the proposal flow ends
  at "Approved", ready for a Stripe step.

The intended next step is a real backend (auth, database, Stripe on approved proposals,
email delivery of client links). The frontend is built to plug into it: one state layer
(`src/lib/appStore.ts`) and one AI facade (`src/lib/ai/`) are the only data entry points.

## Tech

Vite 6 · React 19 · TypeScript · Tailwind CSS 4 · motion · lucide-react ·
`@google/genai` (Gemini Flash)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

Works with zero configuration — offline mock AI, seeded data. To try the real extractor:

```bash
# .env
AI_PROVIDER=gemini
GEMINI_API_KEY=your-key
```

## Repo layout

```
src/landing/        Marketing site (shown before sign-in): hero, problem, how-it-works, FAQ
src/pages/          App screens: Dashboard, ProjectView, Clients, ClientRoom, NewProject…
src/components/     UI kit: Sidebar, TopBar, StatCard, StatusBadge, ThemeToggle…
src/lib/appStore.ts All app state (the single write path — swap this for API calls later)
src/lib/ai/         AI facade: mock (default) or Gemini, chosen by env
src/types.ts        The data model: Project, ChangeRequest, Milestone, Client…
```

**Live demo:** [scopegurde.vercel.app](https://scopegurde.vercel.app)

---

*Generated from the Google AI Studio app template; since then it's grown its own landing
page, a full project/scope domain model, and the client-room flow.*
