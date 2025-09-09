# Copilot Instructions for AI Agents

## Project Overview
- This is a Next.js app (see `next.config.mjs`, `app/`, `components/`) for gym management, bootstrapped with `create-next-app`.
- Main features: member management, authentication, dashboard, and UI modals.
- Key folders:
  - `app/`: Next.js app directory (entry: `page.js`, layout: `layout.js`).
  - `components/`: UI and logic components, organized by feature (e.g., `members/`, `dashboard/`, `auth/`).
  - `contexts/`: React context providers for authentication and toast notifications.
  - `services/`: Business logic and API calls (e.g., `memberService.js`).
  - `lib/`: Utility libraries (e.g., Firebase integration).

## Architecture & Patterns
- Uses React Context for global state (see `contexts/`).
- Authentication logic is in `contexts/AuthContext.js`, `hooks/useAuth.js`, and `components/auth/`.
- Member management is handled in `components/members/` and `services/memberService.js`.
- UI modals and notifications are in `components/ui/` and `contexts/ToastContext.js`.
- Follows Next.js app directory structure (see Next.js docs for routing and layouts).

## Developer Workflows
- **Start dev server:** `npm run dev` (see `README.md`).
- **Edit main page:** `app/page.js` (auto-reloads).
- **Add new features:** Place new UI in `components/`, business logic in `services/`, and shared state in `contexts/`.
- **Authentication:** Use `useAuth` hook and `ProtectedRoute` for gated pages.
- **Member CRUD:** Use `MemberForm`, `MemberTable`, and `memberService.js` for member operations.

## Conventions & Integration
- Use functional React components and hooks.
- Organize components by feature, not by type.
- Use context for cross-cutting concerns (auth, notifications).
- Integrate with Firebase via `lib/firebase.js`.
- Use modals (`components/ui/Modal.js`) for forms and confirmations.
- Follow Next.js conventions for routing and layouts.

## Examples
- To add a new member: use `MemberForm` (UI), call `memberService.js` (logic), update state via context.
- To protect a route: wrap page in `ProtectedRoute` and use `useAuth`.
- To show a toast: use `useNotification` hook or `ToastContext`.

## References
- See `README.md` for getting started and dev commands.
- See Next.js docs for framework-specific details.

---
Edit this file to keep AI agents up to date with project-specific knowledge and patterns.
