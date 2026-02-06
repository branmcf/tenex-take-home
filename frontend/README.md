# HardWire Frontend

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/ac336143-e359-4df7-aca1-1787942e8147"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p

## Overview

This repository contains a [Next.js](https://nextjs.org/) 15 React application providing the chat interface and workflow management UI for the Hardwire platform. This codebase acts as the primary user-facing client, communicating with the backend API for authentication, chat sessions, and workflow execution.

- **Responsibilities**
  - User authentication (email/password, Google OAuth) via [Better Auth](https://www.better-auth.com/)
  - Real-time chat interface with AI model selection
  - Workflow execution visualization with SSE (server-sent events) streaming
  - Settings management (profile, password, model preferences)
- **Non-goals**
  - Does not process AI requests directly — delegates to backend
  - No server-side business logic — pure presentation layer

**Runtime:** Next.js 15.1.6 with React 19 and TypeScript  
**Entry points:** `src/app/layout.tsx`, `src/app/page.tsx`

---

## Reviewer Notes

- **Run:** `npm install && npm run dev`
- **What to look at first:**
  - `src/contexts/ChatContext.tsx` — Central chat state with SSE workflow streaming
  - `src/lib/errors.ts` — Structured error handling with categorization
  - `src/app/globals.css` — "Swiss-Modernist Technical Blueprint" design system
  - `src/components/chat/ChatContainer.tsx` — Main chat UI composition
- **What to judge:**
  - Context-based state management pattern (AuthContext, ChatContext, ModalContext)
  - Error handling approach with typed categories and toast notifications
  - Component composition and prop drilling boundaries
  - SSE streaming integration for workflow run updates
- **Tests:**
   - There are no tests for this application 

---

## Usage

### Prereqs

- [Node.js](https://nodejs.org/en) 20+ (see `Dockerfile` base image)
- [npm](https://www.npmjs.com/)

### Install

```bash
# move into the frontend dir
cd frontend

# install the dependencies
npm install
```

### Configure

Create a `.env.local` file with the following vars:

```env
NEXT_PUBLIC_API_URL=http://localhost:3026
```

The `NEXT_PUBLIC_API_URL` environment variable is referenced in `src/lib/constants.ts` and `src/lib/auth-client.ts`. Defaults to `http://localhost:3026` if not set.

### Run

```bash
# run the service
npm run dev
```

The HardWire UI will be available at http://localhost:3000 by default.

---

## Repo Layout

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home (chat) page
│   │   ├── globals.css         # Design system + Tailwind
│   │   ├── login/              # Auth pages
│   │   ├── signup/
│   │   ├── verify-email/
│   │   ├── chats/[chatId]/     # Dynamic chat routes
│   │   └── workflows/          # Workflow management
│   ├── components/
│   │   ├── auth/               # Auth forms, guards
│   │   ├── chat/               # Chat UI (container, input, messages)
│   │   ├── layout/             # AppSidebar, page layouts
│   │   ├── search/             # Chat search modal
│   │   ├── settings/           # User settings dialogs
│   │   ├── ui/                 # shadcn/ui primitives
│   │   └── workflows/          # Workflow cards, panels
│   ├── contexts/               # React Context providers
│   ├── hooks/                  # Custom hooks (useChats, useAuth, etc.)
│   └── lib/
│       ├── api/                # API client functions
│       ├── api-client.ts       # Axios instance
│       ├── auth-client.ts      # Better Auth client
│       ├── errors.ts           # Error handling utilities
│       └── mocks/              # Development mock data
├── components.json             # shadcn/ui config (lyra style)
├── tailwind.config.ts          # Tailwind + design tokens
├── Dockerfile                  # Production container
└── package.json
```

---

## Tech Stack

| Tech | Role | Evidence |
|------|------|----------|
| **Next.js 15.1.6** | Framework, App Router | `package.json`, `next.config.ts` |
| **React 19** | UI library | `package.json` dependencies |
| **TypeScript** | Type safety | `tsconfig.json` with strict mode |
| **shadcn/ui (lyra style)** | Component primitives | `components.json`, `src/components/ui/` |
| **Tailwind CSS** | Styling | `tailwind.config.ts`, `globals.css` |
| **Better Auth** | Authentication client | `src/lib/auth-client.ts` |
| **Axios** | HTTP client | `src/lib/api-client.ts` |
| **React Hook Form + Zod** | Form handling | `src/components/auth/LoginForm.tsx` |
| **Phosphor Icons** | Icon library | `components.json` iconLibrary setting |

---

## System Context

### Provides

- User-facing chat interface
- Authentication flows (login, signup, email verification)
- Workflow execution UI with real-time progress
- Settings management (profile, password changes)

### Depends on

- **Backend API** (`NEXT_PUBLIC_API_URL`) — All data operations and AI processing
- **Better Auth** — Session management via backend's auth endpoints
- **SSE** — Workflow run streaming from `GET /api/chats/:chatId/workflow-runs/:runId/stream`

### Interfaces

- Consumes REST API from backend (`src/lib/api/`)
- Uses Better Auth React client for session state (`src/lib/auth-client.ts`)

---

## Key Concepts

### 1. Context-based State Management

Chat, auth, and modal state are managed via React Context providers composed at the root layout level.

- **What it does:** Provides global state without prop drilling; enables cross-component communication
- **Why it exists:** Avoids external state libraries for this scope; keeps bundle small
- **Evidence:** `src/contexts/AuthContext.tsx`, `src/contexts/ChatContext.tsx`, `src/app/layout.tsx`

### 2. SSE Workflow Streaming

Workflow run progress is streamed via Server-Sent Events, updating UI in real-time as steps complete.

- **What it does:** Opens EventSource connection to backend, processes `snapshot`/`complete`/`error` events
- **Why it exists:** Provides live feedback for multi-step workflow execution
- **Evidence:** `src/contexts/ChatContext.tsx` (startWorkflowStream, workflowStreamRef)

### 3. Swiss-Modernist Design System

Custom design tokens with sharp corners (`--radius: 0`), blueprint-style grid overlays, and teal primary accent.

- **What it does:** Defines visual language via CSS variables and utility classes
- **Why it exists:** Creates distinctive, technical aesthetic; avoids "AI slop" generic look
- **Evidence:** `src/app/globals.css`, `tailwind.config.ts`

### 4. Centralized Error Handling

Errors are classified by category (network, auth, validation, server, client) with typed responses and toast notifications.

- **What it does:** Transforms raw errors into structured `AppError` objects with user-friendly messages
- **Why it exists:** Consistent error UX; supports Better Auth error codes
- **Evidence:** `src/lib/errors.ts`

### 5. Auth Guard Pattern

Protected routes are enforced client-side with redirect logic based on authentication state.

- **What it does:** Redirects unauthenticated users to login; redirects authenticated users away from auth pages
- **Why it exists:** Prevents unauthorized access without server-side middleware complexity
- **Evidence:** `src/components/auth/AuthGuard.tsx`

---

## Tests

There are no tests for this application.

**Available validation commands:**

```bash
# lint the code for style and error checking
npm run lint

# build production bundle with TypeScript type checking
npm run build
```

---

## Future Work

1. **Add E2E Tests**
   - Why: No test coverage currently; auth flows and chat interactions are critical paths
   - Where: `tests/` or `e2e/` directory with Playwright

2. **Implement Optimistic Updates for Chat List**
   - Why: Currently refetches after new chat creation; could show immediately
   - Where: `src/hooks/useChats.ts`, `src/contexts/ChatContext.tsx`

3. **Extract Model/Workflow Selection to Dedicated Context**
   - Why: ChatContext is large (~660 lines); selection logic could be isolated
   - Where: `src/contexts/SelectionContext.tsx`
