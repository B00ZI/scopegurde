# ScopeGuard

ScopeGuard is a sophisticated operations and logistics dashboard designed to catch "scope creep", manage surcharges, and streamline the client approval process via automated notifications and an integrated payment gateway.

## Features Focus & Flow

1. **Dashboard Overview:** Displays high-level CRM and scope performance metrics, with global search and filtering capabilities.
2. **AI Scope Extractor:** Takes raw "Brain Dump" notes and automatically extracts and structures new scope modifications using Google's Gemini models.
3. **Automated Client Comms:** Analyzes the structured scope details to formulate a friendly, neutral, or firm notification message (with direct approval links) for the client.
4. **Public Approval Portal:** Provides a secure, branded public link where end-clients can review exact deliverables, accept pricing updates, and process immediate payment via a direct integration (e.g. Stripe).

## App Architecture

This application consists of a standalone React client paired with Tailwind CSS for rapid styling, and Lucide for unified iconography.

- **`App.tsx`:** Coordinates state routing for public vs internal pages.
- **`Sidebar.tsx` / `TopBar.tsx`:** Dictate main admin app layout and navigation flow, as well as the dark/light mode toggle.
- **`types.ts`:** Global data interfaces to make mock content generation simple and type-safe.

### Core Views
* `Dashboard.tsx`: High-level summary of system metrics and a timeline of recent scope changes.
* `Clients.tsx`: Standard CRM-style list view of all clients with pagination.
* `Notifications.tsx`: Specialized split-view tracking inbox alerts against wider system health processes.
* `Settings.tsx`: Configuration for organization identity and external API integrations.
* `ApprovalPortal.tsx`: The public-facing client flow, separated entirely from Admin sidebars and context.

## Development

Ensure packages are installed (`npm install`), then start the development environment: `npm run dev`.

**Tech Stack:**
- Vite
- React
- Tailwind CSS
- Lucide React
- `@google/genai` (Gemini Flash)
