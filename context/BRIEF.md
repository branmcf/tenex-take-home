# B-PLEX: Deterministic Workflow Chat Platform

## Executive Summary

**B-PLEX** is a next-generation AI chat application that fundamentally reimagines how professionals interact with Large Language Models. Unlike conventional chat interfaces that devolve into unpredictable, free-form conversations, B-PLEX enforces **deterministic, user-defined workflows** that transform LLM queries into structured, auditable, and reproducible processes.

The platform enables users to define workflows in natural language, which are then compiled into executable **Directed Acyclic Graphs (DAGs)**. Every query can optionally run through these workflows, with execution rendered inline as a **CI-style pipeline visualization**, complete with step-by-step logs, tool invocation transparency, and fail-fast error handling.

---

## Problem Statement

> How do we ensure LLM-driven work follows **deterministic, enforceable workflows** instead of collapsing into brittle, free-form chat?

### The Trust Deficit in AI-Assisted Work

Traditional LLM chat interfaces suffer from several critical failures:

1. **Non-determinism**: Same prompt, different results. No guarantee the model follows the intended process.
2. **Opacity**: Users cannot inspect what happened between input and output.
3. **Silent Failures**: Models fabricate, skip steps, or hallucinate without surfacing errors.
4. **Lack of Reproducibility**: Workflows cannot be saved, versioned, or reliably re-executed.
5. **Tool Invocation Blindness**: When models use tools, users have no visibility into what was called or why.

### The B-PLEX Hypothesis

If workflows are treated as **first-class, deterministic execution graphs**—with strict ordering, explicit tool usage, visible step execution, and fail-fast semantics—then AI-native professionals can reliably use LLMs for complex work without losing trust or debuggability.

---

## Target Users

### Primary Persona: AI-Native Professionals

Professionals who routinely need LLM outputs to follow **specific workflows**:
- Decision processes
- Research flows  
- Production artifacts
- Content creation pipelines
- Data analysis procedures

### Core Job-to-be-Done

> "Ensure my AI queries follow a strict process that I can see, trust, and debug."

---

## Core Product Features

### 1. Natural Language Workflow Authoring

Users describe workflows conversationally:
```
"Research the topic thoroughly. Identify the three most important points. 
Write a summary paragraph for each point."
```

The system compiles this into a structured DAG with discrete steps, dependencies, and optional tool assignments.

### 2. Deterministic DAG Execution

- **Topological Sort**: Steps execute in strict dependency order
- **Fail-Fast Semantics**: Any step failure halts the entire workflow immediately
- **No Silent Fallbacks**: Workflows never degrade to free-form chat
- **Version Pinning**: Runs are tied to specific workflow versions for reproducibility

### 3. CI-Style Pipeline Visualization

Workflow execution renders inline within chat:
- Horizontal step pipeline with status indicators (queued → running → passed/failed)
- Real-time SSE streaming of step progress
- Expandable step detail panels showing:
  - Execution logs
  - Tool calls with request/response payloads
  - Error messages with full context

### 4. Proposal-Based Workflow Editing

Changes to workflows go through a review process:
1. User describes desired change in chat
2. LLM interprets intent and generates structured tool calls
3. System creates a **proposal** with preview of changes
4. User can **Apply** or **Reject** before changes take effect
5. Applied changes create a new workflow version

### 5. MCP Tool Registry

Standalone microservice serving as the canonical source of truth for all available tools:
- `web_search` - DuckDuckGo web search
- `read_url` - URL fetching with content extraction
- `http_request` - General HTTP API calls
- `summarize` - Text summarization
- `extract_json` - JSON extraction from unstructured text

### 6. Multi-Model Support

Configurable LLM providers per message:
- **OpenAI**: GPT-4o, GPT-4o-mini
- **Anthropic**: Claude 3.5 Sonnet, Claude 3 Haiku
- **Google**: Gemini 1.5 Pro, Gemini 1.5 Flash

### 7. Complete Authentication System

- Email/password registration with email verification
- Google OAuth 2.0 integration
- Session-based authentication with HttpOnly cookies
- Password reset flows

---

## Technical Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND                                 │
│              Next.js 15 + React 19 + TailwindCSS                │
│        ┌──────────┐  ┌──────────┐  ┌────────────────┐          │
│        │ Chat UI  │  │ Workflow │  │ Auth Pages     │          │
│        │          │  │ Builder  │  │                │          │
│        └────┬─────┘  └────┬─────┘  └───────┬────────┘          │
│             │             │                 │                    │
│        ┌────┴─────────────┴─────────────────┴────┐              │
│        │         React Context + Hooks           │              │
│        │    (ChatContext, WorkflowContext)       │              │
│        └────────────────────┬────────────────────┘              │
│                             │                                    │
│        ┌────────────────────┴────────────────────┐              │
│        │           Axios API Client              │              │
│        └────────────────────┬────────────────────┘              │
└─────────────────────────────┼───────────────────────────────────┘
                              │ HTTP/SSE
┌─────────────────────────────┼───────────────────────────────────┐
│                         BACKEND                                  │
│                   Express + PostGraphile                         │
│        ┌────────────────────┴────────────────────┐              │
│        │              API Router                  │              │
│        │  /chats  /workflows  /tools  /models    │              │
│        └──────┬───────────┬──────────────┬───────┘              │
│               │           │              │                       │
│        ┌──────┴───┐  ┌────┴────┐  ┌──────┴──────┐              │
│        │ Workflow │  │   LLM   │  │ MCP Client  │              │
│        │ Runner   │  │ Service │  │             │              │
│        └────┬─────┘  └────┬────┘  └──────┬──────┘              │
│             │             │              │                       │
│        ┌────┴─────────────┴──────────────┴────┐                 │
│        │           PostGraphile                │                 │
│        │        (GraphQL Gateway)              │                 │
│        └────────────────────┬─────────────────┘                 │
│                             │                                    │
│        ┌────────────────────┴─────────────────┐                 │
│        │              PostgreSQL               │                 │
│        │   users, chats, messages, workflows   │                 │
│        │   workflow_versions, workflow_runs    │                 │
│        │   step_runs, tools, proposals         │                 │
│        └───────────────────────────────────────┘                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP
┌─────────────────────────────┼───────────────────────────────────┐
│                    MCP TOOLS SERVER                              │
│                    (Standalone Service)                          │
│        ┌────────────────────┴────────────────────┐              │
│        │         Tool Registry + Executor         │              │
│        │   listTools, searchTools, getTool, run   │              │
│        └─────────────────────────────────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

### Architectural Principles

1. **Separation of Concerns**: MCP tool registry is a standalone microservice
2. **Proposal-First Changes**: All workflow edits require user confirmation
3. **DAG Validation**: Cycle detection, dependency validation, tool existence checks
4. **Immutable Versions**: Workflow versions are never mutated, only created
5. **Real-Time Streaming**: SSE for workflow execution status updates

---

## Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library with latest concurrent features |
| **TypeScript 5** | Type safety throughout |
| **TailwindCSS** | Utility-first styling |
| **shadcn/ui** | Radix-based accessible components |
| **React Context** | State management (ChatContext, WorkflowContext) |
| **Axios** | HTTP client with interceptors |
| **react-hook-form + Zod** | Form handling with runtime validation |
| **Phosphor Icons** | Icon library |
| **Sonner** | Toast notifications |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | API server runtime |
| **TypeScript 5 (strict)** | Type safety with strict mode |
| **PostGraphile** | Auto-generated GraphQL API from PostgreSQL |
| **PostgreSQL** | Primary database |
| **better-auth** | Authentication framework |
| **Resend** | Transactional email service |
| **Vercel AI SDK** | Unified LLM provider interface |
| **LangChain** | Extended AI tooling |
| **Zod/Joi** | Runtime validation |
| **node-pg-migrate** | Database migrations |

### MCP Tools Server

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | Standalone microservice |
| **TypeScript** | Type safety |
| **JSON Schema** | Tool input/output validation |

### Infrastructure

| Technology | Purpose |
|------------|---------|
| **Docker + Docker Compose** | Containerized development |
| **Terraform** | Infrastructure as Code (AWS) |

---

## Data Model

### Core Entities

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│      user       │────<│      chats      │────<│    messages     │
│                 │     │                 │     │                 │
│ id (pk)         │     │ id (pk)         │     │ id (pk)         │
│ email           │     │ user_id (fk)    │     │ chat_id (fk)    │
│ email_verified  │     │ title           │     │ role (enum)     │
│ created_at      │     │ created_at      │     │ content         │
│ updated_at      │     │ updated_at      │     │ model_id (fk)   │
└─────────────────┘     └─────────────────┘     │ workflow_run_id │
        │                                        │ created_at      │
        │                                        └─────────────────┘
        │
        │               ┌─────────────────┐     ┌─────────────────┐
        └──────────────<│    workflows    │────<│workflow_versions│
                        │                 │     │                 │
                        │ id (pk)         │     │ id (pk)         │
                        │ user_id (fk)    │     │ workflow_id(fk) │
                        │ name            │     │ version_number  │
                        │ description     │     │ dag (jsonb)     │
                        │ created_at      │     │ created_at      │
                        │ updated_at      │     └────────┬────────┘
                        │ deleted_at      │              │
                        └─────────────────┘              │
                                                         │
┌─────────────────┐     ┌─────────────────┐              │
│   step_runs     │────<│  workflow_runs  │<─────────────┘
│                 │     │                 │
│ id (pk)         │     │ id (pk)         │
│ workflow_run_id │     │ workflow_ver_id │
│ step_id         │     │ chat_id (fk)    │
│ status (enum)   │     │ trigger_msg_id  │
│ output          │     │ status (enum)   │
│ error           │     │ started_at      │
│ tool_calls(json)│     │ completed_at    │
│ logs (json)     │     └─────────────────┘
│ started_at      │
│ completed_at    │
└─────────────────┘

┌─────────────────┐     ┌─────────────────┐
│     tools       │     │    models       │
│                 │     │                 │
│ id (pk)         │     │ id (pk)         │
│ name            │     │ name            │
│ description     │     │ provider        │
│ schema (jsonb)  │     │ is_active       │
│ source (enum)   │     │ created_at      │
│ external_id     │     └─────────────────┘
│ version         │
│ last_synced_at  │
└─────────────────┘

┌─────────────────┐
│workflow_proposals│
│                 │
│ id (pk)         │
│ workflow_id(fk) │
│ base_version_id │
│ user_message    │
│ model_id        │
│ tool_calls(json)│
│ proposed_dag    │
│ status (enum)   │
│ created_at      │
│ expires_at      │
│ resolved_at     │
└─────────────────┘
```

### Workflow DAG Schema

```typescript
interface WorkflowDAG {
  steps: WorkflowStep[];
}

interface WorkflowStep {
  id: string;
  name: string;
  instruction: string;
  tools?: WorkflowToolRef[];
  dependsOn?: string[];
}

interface WorkflowToolRef {
  id: string;
  name: string;
  version: string;
}
```

### Status Enums

```sql
-- Message roles
CREATE TYPE message_role AS ENUM ('user', 'assistant', 'system');

-- Workflow run states
CREATE TYPE workflow_run_status AS ENUM ('running', 'passed', 'failed', 'cancelled');

-- Step run states  
CREATE TYPE step_run_status AS ENUM ('queued', 'running', 'passed', 'failed', 'cancelled');
```

---

## API Design

### REST Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/liveness` | GET | Health check |
| `/api/models` | GET | List available LLM models |
| `/api/users/me` | GET | Current user profile |
| `/api/chats` | GET, POST | List/create chats |
| `/api/chats/:id` | GET, PATCH, DELETE | Chat operations |
| `/api/chats/:id/messages` | GET, POST | List/create messages |
| `/api/chats/:id/workflow-runs` | GET | List workflow runs for chat |
| `/api/chats/:id/workflow-runs/:runId/stream` | GET (SSE) | Stream run status |
| `/api/workflows` | GET, POST | List/create workflows |
| `/api/workflows/:id` | GET, PATCH, DELETE | Workflow operations |
| `/api/workflows/:id/messages` | GET, POST | Workflow chat messages |
| `/api/workflows/:id/messages/apply` | POST | Apply workflow proposal |
| `/api/workflows/:id/messages/reject` | POST | Reject workflow proposal |
| `/api/tools` | GET | List available tools |
| `/api/tools/search` | GET | Search tools by query |
| `/api/tools/:id` | GET | Get tool details |

### MCP Tools Server Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/v0/tools` | GET | List tools with pagination |
| `/v0/tools/search` | GET | Search tools |
| `/v0/tools/:id` | GET | Get tool by ID |
| `/v0/tools/:id/run` | POST | Execute a tool |

---

## Workflow Engine

### Execution Flow

```
1. User sends message with workflow selected
   ↓
2. Backend creates WorkflowRun record (status: RUNNING)
   ↓
3. Engine performs topological sort on DAG
   ↓
4. For each step in sorted order:
   │
   ├─ Create StepRun record (status: RUNNING)
   ├─ Build prompt from step instruction + upstream outputs
   ├─ Execute LLM call with any assigned tools
   ├─ Log tool invocations and responses
   │
   ├─ On SUCCESS:
   │   ├─ Update StepRun (status: PASSED)
   │   └─ Store output for downstream steps
   │
   └─ On FAILURE:
       ├─ Update StepRun (status: FAILED, error stored)
       ├─ Mark WorkflowRun as FAILED
       └─ STOP EXECUTION IMMEDIATELY
   ↓
5. If all steps complete:
   ├─ Mark WorkflowRun as PASSED
   └─ Generate final assistant message
```

### Real-Time Status Updates

Server-Sent Events (SSE) stream step status changes:

```typescript
// Event types
{ type: "snapshot", workflowRun: {...}, steps: [...], message?: {...} }
{ type: "complete" }
{ type: "error", error: { message: string } }
```

### Fail-Fast Semantics

- **Immediate Termination**: Any step failure stops the entire workflow
- **Partial Progress Preserved**: Completed steps remain in database
- **Error Visibility**: Failed step highlighted with full error context
- **Recovery Ready**: Chat input re-enables immediately for retry

---

## LLM Integration

### Intent Classification

Before modifying workflows, the system classifies user intent:

```typescript
type WorkflowIntent = 
  | 'modify_workflow'   // User wants to change the workflow
  | 'ask_clarifying'    // Need more information
  | 'answer_only';      // Just answer, don't modify
```

### Workflow Tool Calls

LLM uses structured tool calls to modify DAGs:

```typescript
// Add a new step
{ name: 'add_step', args: { name, instruction, tools?, dependsOn?, position? } }

// Update existing step
{ name: 'update_step', args: { stepId, name?, instruction?, tools?, addTools?, removeTools? } }

// Delete a step
{ name: 'delete_step', args: { stepId, rewireStrategy? } }

// Reorder step dependencies
{ name: 'reorder_steps', args: { stepId, newDependsOn } }
```

### Model Provider Abstraction

The Vercel AI SDK provides unified interface across providers:

```typescript
const getModelProvider = (modelId: string): LanguageModel => {
  if (modelId.startsWith('gpt-')) return openai(modelId);
  if (modelId.startsWith('claude-')) return anthropic(modelId);
  if (modelId.startsWith('gemini-')) return google(modelId);
  return openai('gpt-4o'); // fallback
};
```

---

## MCP Tools Server

### Architecture

Standalone microservice at `/mcp-tools-server` serving as canonical tool registry:

```
mcp-tools-server/
├── app/v0/tools/
│   ├── tools.service.ts     # Tool listing/search
│   ├── tools.executors.ts   # Tool execution logic
│   ├── tools.ctrl.ts        # Request handlers
│   ├── tools.router.ts      # Express routes
│   └── tools.types.ts       # Type definitions
├── data/
│   └── tools.json           # Tool definitions
├── middleware/
│   └── serviceAuth.ts       # Service-to-service auth
└── server/
    └── server.app.ts        # Express app configuration
```

### Available Tools

| Tool | Purpose | Input Schema |
|------|---------|--------------|
| `web_search` | DuckDuckGo web search | `{ query: string, limit?: number }` |
| `read_url` | Fetch and extract text from URL | `{ url: string, maxChars?: number }` |
| `http_request` | General HTTP API calls | `{ url, method, headers?, body?, timeoutMs? }` |
| `summarize` | Text summarization | `{ text: string, maxWords?: number }` |
| `extract_json` | Extract JSON from text | `{ text: string, fields?: string[] }` |

### Security

- URL allowlist for `http_request` tool
- Private IP blocking (10.x, 127.x, 192.168.x, 172.16-31.x)
- Request timeouts (8s default)
- Response size limits (20KB)

---

## Frontend Architecture

### State Management

React Context-based architecture with specialized providers:

```
AuthProvider (authentication state)
  └── ChatRefetchProvider (sidebar refresh triggers)
       └── ChatProvider (chat state, messages, workflow runs)
            └── WorkflowProvider (workflow CRUD, proposals)
                 └── Application UI
```

### Key Contexts

**ChatContext**: Manages active chat state
- `messages`, `isLoading`, `workflowRuns`
- `selectedModel`, `selectedWorkflow`
- `sendMessage()`, `startNewChat()`, `loadChat()`

**WorkflowContext**: Manages workflow authoring
- `workflows`, `selectedWorkflow`
- `workflowChatMessages`, `pendingProposal`
- `sendWorkflowChatMessage()`, `applyWorkflowProposal()`

### Component Structure

```
components/
├── auth/              # Login, SignUp, OAuth, Verification
├── chat/              # ChatContainer, ChatInput, ChatMessage
│   ├── WorkflowRunPanel.tsx    # Pipeline visualization
│   ├── WorkflowSelector.tsx    # Workflow dropdown
│   └── ModelSelector.tsx       # Model dropdown
├── workflows/         # Workflow builder UI
│   ├── WorkflowChat.tsx        # Natural language authoring
│   ├── WorkflowStepsPanel.tsx  # DAG visualization
│   └── WorkflowList.tsx        # Sidebar list
├── layout/            # App shell components
│   ├── AppSidebar.tsx
│   ├── ChatPageLayout.tsx
│   └── WorkflowsPageLayout.tsx
├── settings/          # Settings modal tabs
├── search/            # Chat search modal
└── ui/                # shadcn/ui primitives
```

---

## Design System: B-Plex

### Visual Philosophy

**Swiss-Modernist Technical Blueprint**: A strict, grid-aligned design language emphasizing precision, clarity, and engineered minimalism.

### Core Principles

1. **No Rounded Corners**: All elements use 0px border-radius
2. **No Shadows**: Flat design with borders for structure
3. **8px Grid System**: All spacing follows 8/16/24/32/48px scale
4. **Monospace Labels**: Technical labels use uppercase + monospace
5. **Sparse Accent**: Green accent (`#5ED04A`) used sparingly

### Color Palette

**Light Mode (Spec Sheet Aesthetic)**
- Background: `#ECEBEB` (warm off-white)
- Foreground: `#141414` (near-black)
- Primary: `#2D6225` (deep forest green)
- Accent: `#5ED04A` (bright green, highlights only)

**Dark Mode (Blueprint Aesthetic)**
- Background: `#040404` (true black)
- Foreground: `#ECEBEB` (soft white)
- Primary: `#3B3D3A` (charcoal)
- Accent: `#5ED04A` (same bright green)

### Typography

- **Primary**: Noto Sans, Inter (geometric sans)
- **Monospace**: JetBrains Mono, Fira Code (technical content)
- **Headlines**: Bold, -0.02em tracking
- **Labels**: 12px, uppercase, 0.1em tracking, monospace

---

## Differentiation

### What B-PLEX Is NOT

| Traditional Chat Apps | B-PLEX |
|----------------------|--------|
| Free-form, unpredictable responses | Deterministic workflow execution |
| Black-box processing | Transparent, inspectable pipelines |
| Silent failures | Fail-fast with explicit errors |
| No reproducibility | Version-pinned workflow runs |
| Hidden tool usage | Full tool call visibility |

### Key Differentiators

1. **Workflows as First-Class Citizens**
   - Not an afterthought or plugin
   - Core to the product's value proposition
   - Natural language authoring → executable DAGs

2. **Proposal-Based Editing**
   - Changes require explicit user confirmation
   - Preview before commit
   - No surprises, full control

3. **CI-Pipeline UX for AI**
   - Familiar mental model from DevOps
   - Step-by-step progress visualization
   - Log inspection for debugging

4. **Tool Transparency**
   - Every tool call logged with inputs/outputs
   - No hidden API calls
   - Auditable execution trail

5. **Multi-Model Flexibility**
   - Per-message model selection
   - Mix providers (OpenAI, Anthropic, Google)
   - Easy to test different models on same workflow

---

## Non-Functional Requirements

### Determinism
- Workflow execution never silently degrades to normal chat
- Failures are always explicit and visible
- Same workflow version produces reproducible results

### Observability
- Every workflow step has visible execution output
- Tool usage is fully inspectable
- Logs capture request/response for debugging

### Reliability
- Partial workflow progress preserved on failure
- Runs pinned to specific workflow versions
- Version conflicts detected before apply

### Security
- Session-based authentication with HttpOnly cookies
- CORS configuration for frontend origin
- Service-to-service auth for MCP server
- URL allowlisting for external HTTP requests

---

## Development Standards

### Backend Code Organization

Following `COLLECTION_STANDARDS.md`:
```
app/<collection>/
├── index.ts           # Barrel exports
├── <collection>.types.ts
├── <collection>.errors.ts
├── <collection>.validation.ts
├── <collection>.ctrl.ts
├── <collection>.router.ts
├── <collection>.helper.ts
└── <collection>.service.ts
```

### Library Organization

Following `LIBRARY_STANDARDS.md`:
```
lib/<library>/
├── index.ts
├── <library>.types.ts
├── <library>.errors.ts
└── <library>.<function>.ts
```

### Testing Standards

- Unit tests: `*.unit.spec.ts`
- Integration tests: `*.int.spec.ts`
- Jest with TypeScript
- Mocks in `__mocks__/` directories

### Migration Standards

- node-pg-migrate with TypeScript
- Timestamped migration files
- Up/down functions for reversibility

---

## Implementation Status

### Completed ✅

- [x] Full authentication system (better-auth)
- [x] Email verification with Resend
- [x] Google OAuth integration
- [x] Chat CRUD operations
- [x] Message streaming
- [x] Multi-model support (OpenAI, Anthropic, Google)
- [x] Workflow CRUD operations
- [x] Workflow version management
- [x] Workflow proposal system
- [x] DAG validation (cycles, dependencies, tools)
- [x] Workflow execution engine
- [x] Step-by-step logging
- [x] Tool integration framework
- [x] MCP Tools Server
- [x] Real-time SSE streaming
- [x] Pipeline visualization UI
- [x] Natural language workflow authoring
- [x] Chat search functionality
- [x] Settings modal

### In Progress 🚧

- [ ] Usage tracking and cost visibility
- [ ] Workflow templates/prebuilts
- [ ] Advanced tool configuration

### Future Roadmap 🔮

- [ ] Shared workflows
- [ ] Team/organization support
- [ ] Looping workflow steps
- [ ] Output schema enforcement
- [ ] Automatic workflow validation/correction
- [ ] Custom tool definitions
- [ ] Workflow analytics

---

## Non-Goals (Explicit Guardrails)

These are intentional design decisions, not missing features:

- **No Auto-Correction**: Workflows do not self-heal
- **No Step Inference**: System does not guess missing steps
- **No Silent Bypass**: Cannot skip workflow when selected
- **No Hidden Execution**: All processing is visible
- **No Implicit Retries**: Failures require explicit user action

---

## Core Product Invariant

> **If workflows become brittle or non-deterministic, the product collapses into a normal chat app and fails.**

This is the fundamental constraint that informs every architectural and product decision. B-PLEX succeeds only if users can trust that their workflows execute exactly as defined, every single time.

---

## Quick Start

### Prerequisites
- Node.js 20+
- Docker + Docker Compose
- PostgreSQL (via Docker)

### Development Setup

```bash
# Start database
docker-compose up db -d

# Backend (terminal 1)
cd backend
npm install
cp .env.example .env  # Configure API keys
npm run migrate:up
npm run dev

# Frontend (terminal 2)
cd frontend
npm install
npm run dev

# MCP Tools Server (terminal 3)
cd mcp-tools-server
npm install
npm run dev
```

### Environment Variables

```bash
# Backend
DATABASE_URL=postgres://user:pass@localhost:5432/bplex
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx
RESEND_API_KEY=xxx
OPENAI_API_KEY=xxx
ANTHROPIC_API_KEY=xxx
GOOGLE_AI_API_KEY=xxx
MCP_TOOLS_SERVER_URL=http://localhost:4010

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3026
```

### Access Points

- Frontend: http://localhost:3000
- Backend API: http://localhost:3026
- MCP Tools: http://localhost:4010

---

*B-PLEX: Where AI follows your process, not the other way around.*
