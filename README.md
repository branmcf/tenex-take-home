# HardWire

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/7a6ad561-bbc7-49c5-b38f-ea8e586d1cea"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

<p align="center">
  <strong>AI-Native Web Search with Deterministic Workflows</strong>
</p>

<p align="center">
  Transform LLM interactions into structured, auditable workflows with DAG execution, CI-style pipeline visualization, and fail-fast error handling.
</p>

---

## Overview

**Hardwire** (codename B-PLEX) is a full-stack AI chat platform that enforces **deterministic, user-defined workflows** instead of unpredictable free-form conversations. Users describe workflows in natural language, which compile into executable **Directed Acyclic Graphs (DAGs)**. Every workflow run renders inline as a CI-style pipeline with step-by-step logs, tool invocation transparency, and fail-fast semantics.

**What makes it different:**
- **Deterministic Execution** — Workflows follow strict topological order; no silent degradation to free-form chat
- **Full Transparency** — Every tool call, every step output, every error is visible and auditable
- **Proposal-Based Editing** — All workflow changes require user approval before taking effect
- **Reproducibility** — Workflow versions are pinned to runs for exact replay

**The stack:**
- **Frontend:** Next.js 15 + React 19 + Tailwind with Swiss-Modernist design system
- **Backend:** Express + PostgreSQL + PostGraphile + Vercel AI SDK
- **MCP Tools Server:** Standalone tool registry and execution service
- **Infrastructure:** Terraform for AWS (App Runner, RDS, ElastiCache, CloudFront)

---

## Reviewer Notes (2 minutes)

### Quick Start (Single Command)

```bash
# Clone and start everything
docker compose up --build
```

This spins up:
- **PostgreSQL** at `localhost:5433`
- **Backend API** at `localhost:3026`
- **MCP Tools Server** at `localhost:4010`
- **Frontend** at `localhost:3000`

### What to Look At First

| File | Why |
|------|-----|
| `backend/lib/workflowRunner.ts` | DAG execution engine — the core innovation |
| `backend/app/chats/chats.ctrl.ts` | Example of collection pattern with Either monad |
| `frontend/src/contexts/ChatContext.tsx` | SSE streaming and workflow state management |
| `mcp-tools-server/app/v0/tools/tools.executors.ts` | Tool implementations with security controls |
| `context/BRIEF.md` | Full product specification |

### What to Judge

- **Workflow execution model** — Topological sort, fail-fast, version pinning
- **Code organization** — Consistent collection structure across all backend modules
- **Error handling** — Either monad pattern throughout services
- **Security** — MCP server URL allowlist, private IP blocking, session validation
- **Test coverage** — Unit tests, integration tests, and LLM evals

### Run Tests

```bash
# Backend unit tests
cd backend && npm run test:unit

# Backend LLM evals (mocked)
cd backend && npm run test:evals

# MCP Tools Server tests
cd mcp-tools-server && npm test
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Client                                          │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 + React 19 + Tailwind                                     │  │
│  │  - Chat interface with workflow execution visualization               │  │
│  │  - SSE streaming for real-time step progress                          │  │
│  │  - Swiss-Modernist design (no rounded corners, no shadows)            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                          HTTP/REST + SSE
                                     │
┌─────────────────────────────────────────────────────────────────────────────┐
│                              Backend API (:3026)                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  Express + TypeScript + PostGraphile                                   │  │
│  │  - Session auth via Better Auth (email + Google OAuth)                │  │
│  │  - Workflow DAG compilation, validation, execution                     │  │
│  │  - Multi-provider LLM integration (OpenAI, Anthropic, Google)         │  │
│  │  - Real-time workflow streaming via SSE                               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
          │                    │                         │
          │                    │                         │
    ┌─────▼─────┐    ┌────────▼────────┐    ┌──────────▼──────────┐
    │PostgreSQL │    │ MCP Tools Server│    │  LLM Providers      │
    │  (:5433)  │    │    (:4010)      │    │  - OpenAI           │
    │           │    │                 │    │  - Anthropic        │
    │ 21+ tables│    │ Tool registry   │    │  - Google           │
    │ 23 migrat.│    │ web_search      │    └─────────────────────┘
    └───────────┘    │ read_url        │
                     │ http_request    │
                     │ summarize       │
                     │ extract_json    │
                     └─────────────────┘
```

---

## Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- npm

### Option 1: Docker Compose (Recommended)

```bash
# Start all services
docker compose up --build
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3026
- MCP Tools: http://localhost:4010

### Option 2: Local Development

```bash
# 1. Start PostgreSQL
docker compose up postgres -d

# 2. Start MCP Tools Server
cd mcp-tools-server
npm install
npm run dev

# 3. Start Backend (new terminal)
cd backend
npm install
cp .env.example .env  # Configure your API keys
npm run migrate:up
npm run dev

# 4. Start Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Environment Variables

Create `backend/.env` with:

```env
# Required
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5433/app
AUTH_SECRET=your-secret-key-min-32-chars-here
API_URL=http://localhost:3026
MCP_TOOLS_URL=http://localhost:4010

# LLM Providers (at least one required)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
GOOGLE_GENERATIVE_AI_API_KEY=...

# Optional
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...
EXA_API_KEY=...
```

---

## Repository Structure

```
hardwire/
├── backend/                 # Express API server
│   ├── app/                 # API collections (chats, messages, workflows, etc.)
│   ├── lib/                 # Shared libraries (LLM, workflow engine, auth)
│   ├── middleware/          # Express middleware (auth, validation, rate limiting)
│   ├── migrations/          # PostgreSQL migrations (21 files)
│   ├── tests/               # Unit and integration tests
│   └── evals/               # LLM evaluation suites
│
├── frontend/                # Next.js 15 React application
│   ├── src/app/             # App Router pages
│   ├── src/components/      # React components (chat, auth, workflows)
│   ├── src/contexts/        # State management (Auth, Chat, Modal)
│   └── src/lib/             # API client, error handling
│
├── mcp-tools-server/        # MCP tools microservice
│   ├── app/v0/tools/        # Tool routes, executors, service
│   ├── data/tools.json      # Tool registry
│   └── tests/               # Tool tests
│
├── infrastructure/          # Terraform AWS configuration
│   └── environments/
│       ├── prod/            # Production environment
│       └── staging/         # Staging environment
│
├── docs/                    # MkDocs API documentation
│   ├── site/content/        # Markdown documentation
│   └── mkdocs.yml           # MkDocs configuration
│
├── marketing/               # Vite marketing site
│   ├── index.html           # Landing page
│   └── src/                 # Animations and interactions
│
├── context/                 # Project documentation and standards
│   ├── BRIEF.md             # Full product specification
│   ├── PRD.md               # Product requirements
│   ├── COLLECTION-STANDARDS.md  # Backend module patterns
│   └── DESIGN-SYSTEM.md     # Frontend design tokens
│
├── docker-compose.yml       # Full-stack local development
└── AGENTS.md                # AI coding assistant context
```

See individual directory READMEs for detailed documentation:
- [`backend/README.md`](./backend/README.md)
- [`frontend/README.md`](./frontend/README.md)
- [`mcp-tools-server/README.md`](./mcp-tools-server/README.md)
- [`infrastructure/README.md`](./infrastructure/README.md)
- [`docs/README.md`](./docs/README.md)
- [`marketing/README.md`](./marketing/README.md)
- [`context/README.md`](./context/README.md)

---

## Tech Stack

### Backend

| Technology | Role |
|------------|------|
| **Express 4** | HTTP server |
| **TypeScript (strict)** | Type safety |
| **PostgreSQL 16** | Primary database |
| **PostGraphile 4** | Auto-generated GraphQL from PostgreSQL |
| **Better Auth** | Session authentication (email + OAuth) |
| **Vercel AI SDK** | Unified LLM provider interface |
| **node-pg-migrate** | Database migrations |
| **Jest** | Testing framework |

### Frontend

| Technology | Role |
|------------|------|
| **Next.js 15** | React framework with App Router |
| **React 19** | UI library |
| **Tailwind CSS** | Utility-first styling |
| **shadcn/ui (lyra)** | Component primitives |
| **Better Auth Client** | Session management |
| **Axios** | HTTP client |

### Infrastructure

| Technology | Role |
|------------|------|
| **Terraform** | Infrastructure as Code |
| **AWS App Runner** | Container orchestration |
| **RDS PostgreSQL** | Managed database |
| **ElastiCache Redis** | Caching and rate limiting |
| **CloudFront + S3** | Static site hosting |

---

## Key Concepts

### 1. Workflow DAG Execution

Workflows are compiled into Directed Acyclic Graphs and executed with strict topological ordering.

- **Topological Sort** — Steps run in dependency order
- **Fail-Fast** — Any step failure halts the entire workflow
- **Version Pinning** — Runs are tied to specific workflow versions
- **SSE Streaming** — Real-time progress updates to the frontend

**Evidence:** `backend/lib/workflowRunner.ts`, `backend/lib/workflowDags/`

### 2. Proposal-Based Workflow Editing

All workflow modifications go through a review cycle:

1. User describes change in natural language
2. LLM generates structured tool calls (add_step, modify_step, etc.)
3. System creates a proposal with change preview
4. User approves or rejects
5. Applied changes create a new workflow version

**Evidence:** `backend/lib/workflowProposals/`, `backend/app/workflowChatMessages/`

### 3. Either Monad Error Handling

All service functions return `Either<ResourceError, SuccessType>` for explicit error propagation.

```typescript
const result = await createChat(params);
if (result.isError()) {
  return res.status(result.value.statusCode).json(result.value);
}
return res.status(201).json(result.value);
```

**Evidence:** `backend/types/either.ts`, all `*.service.ts` files

### 4. Collection Module Structure

Every API resource follows a strict file pattern:

```
app/<collection>/
├── <collection>.types.ts      # TypeScript interfaces
├── <collection>.errors.ts     # Custom error classes
├── <collection>.validation.ts # Joi schemas
├── <collection>.ctrl.ts       # Request handlers
├── <collection>.router.ts     # Express routes
├── <collection>.service.ts    # PostGraphile operations
└── <collection>.helper.ts     # Either-wrapped business logic
```

**Evidence:** `backend/app/chats/`, `context/COLLECTION-STANDARDS.md`

### 5. MCP Tools Registry

Tools are served by a standalone microservice following the Model Context Protocol pattern:

- **List/Search/Get** — Tool discovery
- **Run** — Tool execution with input validation
- **Security** — URL allowlist, private IP blocking, timeout handling

**Evidence:** `mcp-tools-server/`, `backend/lib/mcpToolsServer/`

---

## API Overview

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/*` | * | Authentication (Better Auth) |
| `/api/models` | GET | List available LLM models |
| `/api/users/:id/chats` | GET | List user's chats |
| `/api/chats/:id/messages` | GET, POST | Chat messages |
| `/api/workflows` | GET, POST | Workflow CRUD |
| `/api/workflows/:id/messages` | GET, POST | Workflow authoring chat |
| `/api/chats/:id/workflow-runs/:runId/stream` | GET (SSE) | Workflow execution stream |
| `/api/tools` | GET | List tools from MCP server |

Full API documentation: [`docs/`](./docs/)

---

## Tests

### Backend

```bash
cd backend

# Unit tests
npm run test:unit

# Integration tests (requires PostgreSQL)
npm run test:int

# LLM evals (mocked)
npm run test:evals

# LLM evals (live API calls)
npm run test:evals-live

# Lint
npx eslint .
```

### MCP Tools Server

```bash
cd mcp-tools-server

# All tests
npm test

# Watch mode
npm run test:watch
```

### Frontend

```bash
cd frontend

# Lint
npm run lint

# Type check
npm run build
```

---

## Deployment

### AWS (Production)

```bash
cd infrastructure/environments/prod
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values

terraform init
terraform plan
terraform apply
```

Provisions:
- VPC with public/private subnets
- App Runner services (backend, frontend, MCP tools)
- RDS PostgreSQL (Multi-AZ)
- ElastiCache Redis
- CloudFront + S3 for static sites

See [`infrastructure/README.md`](./infrastructure/README.md) for details.

---

## Contributing

1. Read [`context/BRIEF.md`](./context/BRIEF.md) for product context
2. Follow [`context/COLLECTION-STANDARDS.md`](./context/COLLECTION-STANDARDS.md) for backend patterns
3. Follow [`context/DESIGN-SYSTEM.md`](./context/DESIGN-SYSTEM.md) for frontend styling
4. Run tests before submitting PRs

---

## License

Proprietary. All rights reserved.
