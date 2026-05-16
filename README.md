# ScopeGuard

ScopeGuard is a sophisticated operations and logistics dashboard designed to catch "scope creep", manage surcharges, and streamline the client approval process via automated notifications and an integrated payment gateway.

## Features Focus & Flow

1. **Dashboard Overview:** Displays high-level CRM and scope performance metrics, with global search and filtering capabilities.
2. **AI Scope Extractor:** Takes raw "Brain Dump" notes and automatically extracts and structures new scope modifications using Google's Gemini models.
3. **Automated Client Comms:** Analyzes the structured scope details to formulate a friendly, neutral, or firm notification message (with direct approval links) for the client.
4. **Public Approval Portal:** Provides a secure, branded public link where end-clients can review exact deliverables, accept pricing updates, and process immediate payment via a direct integration (e.g. Stripe).

## App Architecture

This application consists of a standalone React client paired with Tailwind CSS for rapid styling, and Lucide for unified iconography.

- **`frontend/src/App.tsx`:** Coordinates state routing for public vs internal pages.
- **`frontend/src/components/Sidebar.tsx` / `frontend/src/components/TopBar.tsx`:** Dictate main admin app layout and navigation flow, as well as the dark/light mode toggle.
- **`frontend/src/types.ts`:** Global data interfaces to make mock content generation simple and type-safe.

### Core Views
* `frontend/src/pages/Dashboard.tsx`: High-level summary of system metrics and a timeline of recent scope changes.
* `frontend/src/pages/Clients.tsx`: Standard CRM-style list view of all clients with pagination.
* `frontend/src/pages/Notifications.tsx`: Specialized split-view tracking inbox alerts against wider system health processes.
* `frontend/src/pages/Settings.tsx`: Configuration for organization identity and external API integrations.
* `frontend/src/pages/CreateChangeOrder.tsx`: The primary logic gate, funneling AI unstructured text into formatted `details`.
* `frontend/src/pages/PreviewSend.tsx`: Converts `details` into an AI generated string, applying regex to turn raw links into internal React router state bridges.
* `frontend/src/pages/ApprovalPortal.tsx`: The public-facing client flow, separated entirely from Admin sidebars and context.

## Development

This project uses npm workspaces to separate the frontend from an upcoming backend API.

Ensure packages are installed (`npm install`), then start the development environment: `npm run dev`.

**Tech Stack:**
- Vite
- React
- Tailwind CSS
- Lucide React
- `@google/genai` (Gemini Flash)
