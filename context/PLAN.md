## **Project Plan: Deterministic Workflow Chat**

A chat application where LLM queries execute through user-defined, deterministic workflows. Workflows are authored in natural language, compiled into directed acyclic graphs (DAGs), and executed with strict ordering and fail-fast semantics.

### **1. Guiding Principles**

*   **Determinism is Non-Negotiable:** Workflows execute exactly as defined. No silent fallbacks to free-form chat. No skipped steps. No automatic retries.
*   **Transparent Execution:** Every workflow step produces visible output. Tool invocations are logged and inspectable. Users always know what happened and why.
*   **Explicit Failure Handling:** When a step fails, execution halts immediately. The failure is surfaced clearly. Users can inspect logs and understand the error.
*   **Strict TypeScript:** Both frontend and backend enforce TypeScript strict mode. Runtime validation with zod at API boundaries and for LLM outputs.

### **2. System Architecture & Technology Stack**

The application consists of a Next.js frontend communicating with an Express backend via GraphQL. The backend manages authentication, LLM orchestration, and workflow execution.

| Category               | Technology                   | Justification                                                                                                     |
| ---------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Containerization**   | **Docker**                   | Single-command local development. Compose orchestrates frontend, backend, and database services.                 |
| **Frontend Framework** | **Next.js (React)**          | App Router for modern React patterns. Server components where beneficial. TypeScript strict mode enforced.       |
| **Styling**            | **Tailwind CSS**             | Utility-first approach enables rapid UI development. Pairs naturally with shadcn/ui components.                  |
| **UI Components**      | **shadcn/ui**                | Accessible, composable components built on Radix primitives. Sidebar, dialogs, and forms out of the box.         |
| **Frontend State**     | **TanStack Query**           | Manages server state, caching, and refetching. Handles optimistic updates for chat interactions.                 |
| **Backend Runtime**    | **Node.js (Express)**        | Widely adopted, well-documented. TypeScript strict mode for type safety across the codebase.                     |
| **Authentication**     | **better-auth**              | Handles Google OAuth and email/password flows. Manages password hashing, sessions, and email verification.       |
| **Database**           | **PostgreSQL**               | Relational store for users, chats, workflows, and execution logs. Robust and well-suited for structured data.    |
| **API Layer**          | **PostGraphile**             | Auto-generates GraphQL API from PostgreSQL schema. Reduces boilerplate while maintaining type safety.            |
| **Migrations**         | **node-pg-migrate**          | Programmatic, version-controlled database migrations. Simple and reliable.                                        |
| **Email**              | **Resend**                   | Transactional emails for account verification. Clean API, reliable delivery.                                      |
| **Package Manager**    | **npm**                      | Standard Node.js package manager. Workspaces not required given separate frontend/backend directories.           |
| **Language**           | **TypeScript (strict)**      | End-to-end type safety. Strict mode catches errors at compile time.                                               |
| **LLM Providers**      | **OpenAI / Anthropic / Google** | Workflow compilation and step execution. Configurable per deployment. Structured output for DAG generation.   |
| **Validation**         | **zod**                      | Runtime schema validation for API inputs, LLM responses, and workflow DAG structures.                            |

### **3. Authentication Flow**

Authentication is handled entirely by better-auth, which provides both OAuth and credential-based flows with built-in session management.

#### **Google OAuth**
1.  User clicks "Continue with Google" on the frontend.
2.  Frontend redirects to better-auth's Google OAuth endpoint.
3.  User authenticates with Google and grants consent.
4.  better-auth handles the callback, creates/updates the user record, and establishes a session.
5.  User is redirected back to the application, authenticated.

#### **Email/Password**
1.  **Registration:** User submits email and password. better-auth hashes the password and stores the user (unverified status).
2.  **Verification:** better-auth triggers a verification email via Resend. User clicks the link to activate their account.
3.  **Login:** User submits credentials. better-auth verifies the password hash and establishes a session.

#### **Session Management**
- Sessions are managed by better-auth using secure, HttpOnly cookies.
- The frontend checks authentication status via better-auth's session endpoint.
- Protected API routes validate the session before processing requests.

### **4. Data Model**

The PostgreSQL schema supports users, conversations, workflows, and execution tracking.

```
users
├── id (uuid, pk)
├── email (unique)
├── google_id (nullable, unique)
├── email_verified (boolean)
├── created_at, updated_at

chats
├── id (uuid, pk)
├── user_id (fk → users)
├── title
├── created_at, updated_at

messages
├── id (uuid, pk)
├── chat_id (fk → chats)
├── role (enum: user, assistant, system)
├── content (text)
├── model_id (nullable)
├── workflow_run_id (nullable, fk → workflow_runs)
├── created_at

workflows
├── id (uuid, pk)
├── user_id (fk → users)
├── name
├── description (text, natural language)
├── created_at, updated_at

workflow_versions
├── id (uuid, pk)
├── workflow_id (fk → workflows)
├── version_number (int)
├── dag (jsonb)
├── created_at

workflow_runs
├── id (uuid, pk)
├── workflow_version_id (fk → workflow_versions)
├── message_id (fk → messages)
├── status (enum: running, passed, failed)
├── started_at, completed_at

step_runs
├── id (uuid, pk)
├── workflow_run_id (fk → workflow_runs)
├── step_id (string, matches dag step)
├── status (enum: queued, running, passed, failed)
├── logs (jsonb)
├── tool_calls (jsonb)
├── error (text, nullable)
├── started_at, completed_at

tools
├── id (uuid, pk)
├── name
├── description
├── schema (jsonb)
├── is_system (boolean)
├── user_id (nullable, fk → users)
```

### **5. Workflow Compilation**

Users describe workflows in natural language. The system compiles these descriptions into executable DAGs.

#### **Process**
1.  User writes a workflow description (e.g., "Research the topic thoroughly. Identify the three most important points. Write a summary paragraph for each point.").
2.  Backend sends the description to the configured LLM with a compilation prompt.
3.  LLM returns a structured DAG representing the workflow steps and their dependencies.
4.  Backend validates the response against a zod schema (valid step IDs, no cycles, valid dependencies).
5.  The natural language description and compiled DAG are stored as a new WorkflowVersion.

#### **DAG Structure**
```typescript
const StepSchema = z.object({
  id: z.string(),
  name: z.string(),
  instruction: z.string(),
  tools: z.array(z.string()).optional(),
  dependsOn: z.array(z.string()).default([]),
});

const DAGSchema = z.object({
  steps: z.array(StepSchema),
});
```

#### **Compilation Prompt**
The prompt instructs the LLM to:
- Parse the natural language into discrete steps
- Identify dependencies between steps
- Assign unique IDs to each step
- Output strictly conforming JSON (no prose, no explanations)

Validation rejects any response with cycles, missing dependencies, or malformed structure.

### **6. Workflow Execution Engine**

The engine executes workflows step-by-step with strict ordering and immediate failure propagation.

#### **Execution Sequence**
1.  User sends a message with a workflow selected.
2.  Backend creates a WorkflowRun record (status: running).
3.  Engine performs topological sort on the DAG to determine execution order.
4.  For each step in sorted order:
    - Create StepRun record (status: running)
    - Construct prompt from step instruction plus outputs from completed dependencies
    - Execute LLM call with any enabled tools
    - Log tool invocations and responses
    - On success: update StepRun (status: passed), store output
    - On failure: update StepRun (status: failed), store error, mark WorkflowRun as failed, **stop execution**
5.  If all steps complete: mark WorkflowRun as passed, generate final assistant message.

#### **Real-time Status Updates**
- Server-Sent Events (SSE) stream step status changes to the frontend.
- Each transition (queued → running → passed/failed) emits an event.
- Frontend updates the pipeline visualization without polling.

#### **Failure Semantics**
- Any step failure immediately terminates the workflow.
- Partial progress is preserved in the database.
- The failed step is highlighted with its error message.
- Chat input re-enables immediately so the user can respond or retry.

### **7. Screen Specifications**

#### **Sign Up**
- Google OAuth button as primary option
- Email/password form with password confirmation
- Submit triggers account creation and verification email
- Redirect to "check your email" screen
- Verification link activates the account

#### **Login**
- Google OAuth button
- Email/password form
- Error states for invalid credentials or unverified accounts

#### **Home**
The primary interface for chat and workflow execution.

**Sidebar (shadcn sidebar component):**
- New Chat button
- Search Chats button (opens modal)
- Workflows navigation link
- Scrollable list of recent chats
- Account settings button (fixed at bottom)

**Chat Area:**
- Chronological message list
- Workflow runs render inline as pipeline visualizations
- Input bar containing:
  - Text input field
  - Model selector dropdown
  - Workflow selector dropdown (optional)
  - Send button

#### **Workflow Execution (Inline)**
Renders within the chat when a workflow runs.

**Pipeline Visualization:**
- Horizontal layout showing each step
- Step displays: name, status indicator (spinner/checkmark/X), elapsed time
- Visual connection lines between dependent steps

**Step Detail View (on click):**
- Expands below the pipeline
- Shows chronological execution log
- Displays tool calls with request and response payloads
- Shows error details for failed steps
- No hidden prompts or system internals

#### **Workflows**
Interface for creating and managing workflows.

**Layout:**
- Left column: scrollable list of user's workflows
- Right column: workflow editor

**Workflow List:**
- Each item shows workflow name
- Kebab menu with rename and delete options

**Workflow Editor:**
- Chat-style interface for describing the workflow
- Live preview of compiled steps
- Save button compiles and stores new version

#### **Search Chats (Modal)**
- Search input with debounced requests
- Searches across user messages and assistant responses
- Empty state shows recent chats (3 from this week, 3 from last week)
- Results display chat title, snippet, and date
- Clicking a result navigates to that chat

#### **Settings (Modal)**
- Tabs: Account, Usage, Logout
- Account: displays email, password change option for credential users
- Usage: token consumption and cost estimates
- Logout: confirms action and clears session

### **8. Project Structure**

```
/
├── backend/               # Express API server
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── migrations/        # node-pg-migrate files
│   ├── package.json
│   └── tsconfig.json
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── lib/
│   │   └── hooks/
│   ├── package.json
│   └── tsconfig.json
├── docker-compose.yml
├── .env.example
└── README.md
```

### **9. Local Development**

#### **Prerequisites**
- Node.js 20+
- Docker and Docker Compose
- npm

#### **Environment Setup**
1.  Clone the repository.
2.  Copy `.env.example` to `.env` in both `backend/` and `frontend/` (or root, depending on config structure).
3.  Configure environment variables:
    - `DATABASE_URL` - PostgreSQL connection string
    - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` - OAuth credentials
    - `SESSION_SECRET` - Session encryption key
    - `RESEND_API_KEY` - Email service credentials
    - `OPENAI_API_KEY` and/or `ANTHROPIC_API_KEY` and/or `GOOGLE_AI_API_KEY` - LLM provider keys

#### **Running the Application**
**Development mode:**
```bash
# Start database
docker-compose up db -d

# Backend (in /backend)
npm install
npm run migrate
npm run dev

# Frontend (in /frontend)
npm install
npm run dev
```

**Full Docker setup:**
```bash
docker-compose up --build
```

Application accessible at `http://localhost:3000` (frontend) and `http://localhost:4000` (backend/GraphQL).

### **10. Development Phases**

**Phase 1: Foundation & Authentication**
- [ ] Initialize Express backend with TypeScript strict configuration
- [ ] Initialize Next.js frontend with TypeScript strict, Tailwind, shadcn/ui
- [ ] Set up PostgreSQL with node-pg-migrate, create users table
- [ ] Configure PostGraphile for GraphQL API generation
- [ ] Integrate better-auth with Google OAuth and email/password strategies
- [ ] Configure Resend for verification emails
- [ ] Implement session-based authentication with HttpOnly cookies
- [ ] Create docker-compose.yml for local development
- [ ] **Milestone:** Users can register, verify email, log in via both methods, and log out.

**Phase 2: Chat System**
- [ ] Add chats and messages tables with migrations
- [ ] Expose chat operations via PostGraphile/GraphQL
- [ ] Integrate LLM provider for basic message responses
- [ ] Build Home screen with sidebar and chat interface
- [ ] Set up TanStack Query for GraphQL data fetching
- [ ] Implement SSE for streaming message responses
- [ ] **Milestone:** Users can create chats, send messages, and receive LLM responses.

**Phase 3: Workflow Definition**
- [ ] Add workflows and workflow_versions tables
- [ ] Build LLM integration for natural language to DAG compilation
- [ ] Implement zod validation for compiled DAG structures
- [ ] Create Workflows screen with list and editor panels
- [ ] Build DAG preview component
- [ ] **Milestone:** Users can create workflows in natural language and see compiled steps.

**Phase 4: Workflow Execution**
- [ ] Add workflow_runs and step_runs tables
- [ ] Build execution engine with topological sorting
- [ ] Implement fail-fast logic with immediate termination on errors
- [ ] Create tool execution framework (system tools)
- [ ] Set up SSE endpoint for real-time step status
- [ ] Build inline pipeline visualization component
- [ ] Create step log viewer with tool call inspection
- [ ] **Milestone:** Workflows execute deterministically with visible progress and inspectable logs.

**Phase 5: Search & Settings**
- [ ] Implement full-text search across messages
- [ ] Build Search modal with results and navigation
- [ ] Add token usage tracking to database
- [ ] Create Settings modal with account and usage tabs
- [ ] **Milestone:** Users can search chat history and monitor usage.

**Phase 6: Refinement**
- [ ] Add comprehensive error handling and error boundaries
- [ ] Implement loading states and skeleton loaders
- [ ] Conduct accessibility review (keyboard navigation, ARIA)
- [ ] Optimize database queries and add appropriate indexes
- [ ] Write README with complete setup and usage documentation
- [ ] **Milestone:** Application is stable, accessible, and documented.

### **11. Implementation Log**

Updated as development progresses.

#### **Current State**
- Project structure established with `/backend` and `/frontend` directories
- Standards documentation available in `/standards`

#### **Next Actions**
- Initialize backend Express application with TypeScript
- Initialize frontend Next.js application with TypeScript
- Set up PostgreSQL and initial migrations

#### **Technical Decisions**
- (Recorded during implementation)

#### **Adjustments**
- (Recorded as plan evolves)
