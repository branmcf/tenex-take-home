# Hardwire Backend

<p align="center"> 
    <img 
        src="https://github-production-user-asset-6210df.s3.amazonaws.com/8098163/545391398-caeb3b5d-77d5-4927-a0cb-f4f875a0ed0f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20260205%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260205T061020Z&X-Amz-Expires=300&X-Amz-Signature=37412de0c9f0697c946264dfc39ca2cbcb2416738838f6af843afffdf5decbf0&X-Amz-SignedHeaders=host" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

The backend is a **Node.js + Express REST API** serving the Hardwire deterministic workflow chat platform. It handles authentication, chat/message management, workflow execution, LLM orchestration, and tool integration via an external MCP server.

**Responsibilities:**
- Session-based authentication via better-auth (email/password + Google OAuth)
- Chat and message CRUD with PostgreSQL via PostGraphile
- Workflow DAG compilation, validation, and execution
- Multi-provider LLM integration (OpenAI, Anthropic, Google)
- Real-time workflow status streaming via SSE
- Tool orchestration through MCP Tools Server

**Non-goals:**
- Does not serve static frontend assets in production
- Does not handle payment processing (Stripe integration is stubbed)

**Entry point:** `index.ts`  
**Runtime:** Node.js with TypeScript (strict mode)

---

## Reviewer Notes (2 minutes)

- **Run:** `npm run dev` (requires PostgreSQL + `.env` configured)
- **Run tests:** `npm run test:unit`
- **Run evals:** `npm run test:evals`

**What to look at first:**
- `app/chats/chats.ctrl.ts` — Example of collection pattern with Either monad
- `lib/llm/llmWithTools.ts` — LLM orchestration with tool calling
- `lib/workflowDags/dagValidator.ts` — DAG cycle detection and validation
- `middleware/sessionValidator/sessionValidator.ts` — Auth middleware pattern

**What to judge:**
- Collection structure consistency across `app/` modules
- Either monad usage for explicit error handling
- Separation of concerns: ctrl → service → postGraphile
- Test coverage patterns in `tests/` (mocking, assertions)
- Eval dataset design in `evals/datasets/`

---

## Usage (Quick start)

### Prerequisites
- Node.js 20+
- PostgreSQL 16 (or use Docker)
- npm

### Install

```bash
cd backend
npm install
```

### Configure

Create `.env` from required variables:

```bash
# Database
DATABASE_URL=postgres://postgres:postgrespassword@localhost:5433/app

# Auth
AUTH_SECRET=your-secret-key-min-32-chars
API_URL=http://localhost:3026
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Resend)
RESEND_API_KEY=your-resend-api-key

# LLM Providers
OPENAI_API_KEY=your-openai-key
ANTHROPIC_API_KEY=your-anthropic-key
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-key

# External Services
MCP_TOOLS_URL=http://localhost:4010
EXA_API_KEY=your-exa-key

# Optional
REDIS_URL=redis://localhost:6379
LANGFUSE_PUBLIC_KEY=your-langfuse-public-key
LANGFUSE_SECRET_KEY=your-langfuse-secret-key
```

### Run

```bash
# Start PostgreSQL (if using Docker)
docker-compose up postgres -d

# Run migrations
npm run migrate:up

# Start dev server
npm run dev
```

Server runs at `http://localhost:3026`

---

## Repo Layout

```
backend/
├── index.ts                    # Application entry point
├── server/                     # Express server setup
│   ├── server.app.ts           # Middleware, routes, CORS
│   └── server.helper.ts        # Error handlers
│
├── app/                        # API collections (feature modules)
│   ├── index.ts                # Root router mounting
│   ├── chats/                  # Chat CRUD
│   ├── messages/               # Message creation + LLM streaming
│   ├── workflows/              # Workflow CRUD
│   ├── workflowChatMessages/   # Workflow authoring chat
│   ├── workflowRuns/           # Workflow execution + SSE streaming
│   ├── models/                 # LLM model listing
│   ├── tools/                  # MCP tool proxy
│   ├── users/                  # User routes + preferences
│   └── liveness/               # Health check endpoint
│
├── lib/                        # Shared libraries
│   ├── betterAuth/             # Authentication setup
│   ├── llm/                    # LLM providers, RAG, tools
│   ├── postGraphile/           # GraphQL client for PostgreSQL
│   ├── workflowDags/           # DAG modifier, sorter, validator
│   ├── workflowProposals/      # Proposal store and application
│   ├── mcpToolsServer/         # MCP tools client
│   ├── exa/                    # Exa search integration
│   ├── redis/                  # Redis client
│   ├── langfuse/               # Observability/tracing
│   └── workflowRunner.ts       # Workflow execution engine
│
├── middleware/                 # Express middleware
│   ├── sessionValidator/       # Auth validation
│   ├── requestValidator/       # Joi schema validation
│   ├── chatOwnershipValidator/ # Chat access control
│   ├── workflowOwnershipValidator/
│   ├── userIdValidator/        # User ID matching
│   ├── rateLimiter/            # Redis-based rate limiting
│   ├── requestLogger/          # Request/response logging
│   └── requestHandlerErrorWrapper/
│
├── migrations/                 # node-pg-migrate files (21 migrations)
├── errors/                     # Base error classes
├── types/                      # Shared TypeScript types
├── utils/                      # Utility functions
│
├── tests/                      # Unit/integration tests
│   ├── tests.server.ts         # Test Express app setup
│   ├── tests.helper.ts         # Mock session helpers
│   └── <collection>/           # Tests per collection
│
├── evals/                      # LLM evaluation suites
│   ├── datasets/               # Test datasets (28 files)
│   ├── *.eval.ts               # Eval test files
│   └── evals.ls.ts             # LangSmith integration
│
├── jest/                       # Jest configurations
│   ├── unitTests.config.json
│   ├── integrationTests.config.json
│   └── evals.config.json
│
├── scripts/                    # Utility scripts
│   └── migration-template.ts   # Migration file template
│
├── public/                     # Static files (email verification pages)
├── package.json
├── tsconfig.json
├── codegen.ts                  # GraphQL codegen config
├── docker-compose.yml          # Local dev PostgreSQL
└── Dockerfile                  # Production container
```

---

## Tech Stack

| Technology | Role | Evidence |
|------------|------|----------|
| **Express 4** | HTTP server | `server/server.app.ts` |
| **TypeScript (strict)** | Type safety | `tsconfig.json` → `"strict": true` |
| **PostGraphile 4** | Auto-generated GraphQL from PostgreSQL | `lib/postGraphile/` |
| **better-auth** | Authentication (OAuth + email/password) | `lib/betterAuth/` |
| **Vercel AI SDK** | Unified LLM provider interface | `lib/llm/providers.ts` |
| **LangChain** | Extended AI tooling | `lib/llm/rag.ts` |
| **Joi** | Request validation | `middleware/requestValidator/` |
| **node-pg-migrate** | Database migrations | `migrations/` |
| **Jest** | Testing framework | `jest/` configs |
| **Resend** | Transactional email | `lib/betterAuth/auth.ts` |
| **Redis (ioredis)** | Rate limiting, caching | `lib/redis/` |
| **Langfuse** | LLM observability | `lib/langfuse/` |

---

## System Context

### Provides
- REST API at `/api/*` for frontend consumption
- Authentication endpoints at `/api/auth/*` (handled by better-auth)
- SSE streaming for workflow execution status
- GraphQL endpoint at `/graphql` (development only)

### Depends On
- **PostgreSQL** — Primary data store
- **MCP Tools Server** — Tool definitions and execution (`MCP_TOOLS_URL`)
- **LLM Providers** — OpenAI, Anthropic, Google APIs
- **Exa** — Web search for RAG augmentation
- **Redis** — Rate limiting (optional, falls back to in-memory)
- **Resend** — Email verification delivery

### Interfaces
- Frontend calls REST endpoints with session cookies
- MCP Tools Server called for tool listing/execution
- LLM providers called for chat completions and structured outputs

---

## Key Concepts

### 1. Collection Module Structure
**What:** Every API resource follows a strict file pattern: `types.ts`, `errors.ts`, `validation.ts`, `ctrl.ts`, `router.ts`, `service.ts`, `helper.ts`.

**Why:** Consistency across modules, clear separation of concerns, LLM-friendly for code generation.

**Evidence:** `app/chats/`, `app/messages/`, `app/workflows/`

### 2. Either Monad for Error Handling
**What:** Service functions return `Either<ResourceError, SuccessType>` instead of throwing exceptions.

**Why:** Explicit error handling, type-safe propagation, no hidden control flow.

**Evidence:** `types/either.ts`, all `*.service.ts` files

### 3. Workflow DAG Execution
**What:** Workflows are compiled to DAGs, topologically sorted, and executed step-by-step with fail-fast semantics.

**Why:** Deterministic execution order, visible progress, no silent failures.

**Evidence:** `lib/workflowDags/`, `lib/workflowRunner.ts`

### 4. Proposal-Based Workflow Editing
**What:** All workflow changes go through a proposal → preview → apply flow.

**Why:** User control over changes, no surprises from LLM modifications.

**Evidence:** `lib/workflowProposals/`, `app/workflowChatMessages/`

### 5. LLM Evals as Tests
**What:** LLM behavior is validated through Jest-based eval suites with mocked providers and dataset-driven assertions.

**Why:** Regression testing for prompt changes, measurable quality metrics.

**Evidence:** `evals/`, `evals/datasets/`

---

## Tests

### Unit Tests
```bash
npm run test:unit
```
- Jest with TypeScript
- Mocks in `lib/<module>/__mocks__/`
- Test files: `tests/<collection>/<collection>.test.ts`

### Integration Tests
```bash
npm run test:int
```
- Requires running PostgreSQL
- Uses `tests/tests.server.ts` for isolated Express instance

### LLM Evaluations
```bash
# Mocked (fast, offline)
npm run test:evals

# Live (hits real LLM APIs)
npm run test:evals-live
```
- Eval files: `evals/*.eval.ts`
- Datasets: `evals/datasets/*.dataset.ts`
- LangSmith integration: `evals/evals.ls.ts`

### Lint
```bash
npx eslint .
```
- ESLint 9 with TypeScript parser
- Stylistic rules in `eslint.config.mjs`

### Type Check
```bash
npx tsc --noEmit
```

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/liveness` | GET | Health check |
| `/api/models` | GET | List available LLM models |
| `/api/users/:userId/chats` | GET | List user's chats |
| `/api/users/:userId/model-preferences` | GET, POST | User model preferences |
| `/api/chats/:chatId` | DELETE | Soft delete chat |
| `/api/chats/:chatId/messages` | GET, POST | List/create messages |
| `/api/chats/:chatId/workflow-runs` | GET | List workflow runs |
| `/api/chats/:chatId/workflow-runs/:runId/stream` | GET (SSE) | Stream run status |
| `/api/workflows` | GET, POST | List/create workflows |
| `/api/workflows/:workflowId` | GET, PATCH, DELETE | Workflow CRUD |
| `/api/workflows/:workflowId/messages` | GET, POST | Workflow chat |
| `/api/workflows/:workflowId/messages/apply` | POST | Apply proposal |
| `/api/workflows/:workflowId/messages/reject` | POST | Reject proposal |
| `/api/tools` | GET | List tools from MCP |
| `/api/tools/search` | GET | Search tools |
| `/api/auth/*` | * | Authentication (better-auth) |

---

## Database Migrations

```bash
# Create new migration
npm run migrate:create -- <migration-name>

# Run pending migrations
npm run migrate:up

# Rollback last migration
npm run migrate:down
```

Migration files are in `migrations/` with timestamp prefixes.

---

## Docker

```bash
# Start PostgreSQL only
docker-compose up postgres -d

# Build and run full backend
docker-compose up --build
```

Ports:
- PostgreSQL: `5433` (mapped to container's `5432`)
- Backend: `3026`

---

## Future Work

1. **Real integration tests** — Current tests use mocks; add database-backed integration tests
   - Where: `tests/` with real PostgreSQL transactions

2. **Stripe integration completion** — Payment processing is stubbed
   - Where: `lib/stripe/` (to be created)

3. **WebSocket for real-time chat** — Replace SSE polling with persistent connections
   - Where: `server/` + `app/messages/`

4. **Redis cluster support** — Production-ready caching configuration
   - Where: `lib/redis/`

5. **API documentation** — Auto-generate OpenAPI spec from routes and validation schemas
   - Where: New `docs/` tooling
