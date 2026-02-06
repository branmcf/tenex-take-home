# Hardwire Backend

<p align="center"> 
    <img 
        src="https://github.com/user-attachments/assets/e0a5c26e-c23e-4078-a505-2a95eef09f1d" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

This directory contains a **Node.js + Express REST API** serving the HardWire deterministic workflow chat application. It handles authentication, chat/message management, workflow execution, LLM orchestration, and tool integration via an external MCP server.

**Responsibilities:**
- Session-based authentication via [better-auth](https://www.better-auth.com/) (email/password + Google OAuth)
- Chat and message CRUD with [PostgreSQL](https://www.postgresql.org/) via [PostGraphile](https://www.graphile.org/)
- Workflow DAG compilation, validation, and execution
- Multi-provider LLM integration (OpenAI, Anthropic, Google)
- Real-time workflow status streaming via SSE
- Tool orchestration through [MCP](https://modelcontextprotocol.io/docs/getting-started/intro) (Model Context Protocol) Tools Server

**Non-goals:**
- Does not serve static frontend assets in production
- Does not handle payment processing (Stripe integration is stubbed)

**Entry point:** `index.ts`  
**Runtime:** Node.js with TypeScript (strict mode)

---

## Reviewer Notes

- **Run:** `npm run dev` (requires PostgreSQL + `.env` configured)
- **Run tests:** `npm run test:int`
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

## Usage

### Prerequisites

- Node.js 20+
- npm
- Docker

### Quick Start

```bash
# move into the backend dir
cd backend

# install the dependencies
npm install

# start postgres
docker compose up postgres -d

# run the migrations to create/populate tables
npm run migrate:up

# in a new tab, run the backend
npm run dev
```

The HardWire API server will run at http://localhost:3026.

### Environment Variables

Create a `.env` file before running migrations.

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | `postgres://postgres:postgrespassword@localhost:5433/app` |
| `AUTH_SECRET` | Yes | Random string, minimum 32 characters |
| `API_URL` | Yes | `http://localhost:3026` |
| `MCP_TOOLS_URL` | Yes | `http://localhost:4010` |
| `OPENAI_API_KEY` | One LLM required | OpenAI API key |
| `ANTHROPIC_API_KEY` | One LLM required | Anthropic API key |
| `GOOGLE_GENERATIVE_AI_API_KEY` | One LLM required | Google AI API key |
| `GOOGLE_CLIENT_ID` | No | For Google OAuth |
| `GOOGLE_CLIENT_SECRET` | No | For Google OAuth |
| `RESEND_API_KEY` | No | For email verification |
| `EXA_API_KEY` | No | For web search tools |
| `REDIS_URL` | No | For distributed rate limiting |
| `LANGFUSE_PUBLIC_KEY` | No | For LLM observability |
| `LANGFUSE_SECRET_KEY` | No | For LLM observability |

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
- Authentication endpoints at `/api/auth/*` for auth
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

### Integration Tests
```bash
# run the full integration test suite
npm run test:int
```
- Uses `tests/tests.server.ts` for isolated Express instance

### LLM Evaluations
```bash
# mocked (fast, offline)
npm run test:evals

# live (hits real LLM APIs)
npm run test:evals-live
```
- Eval files: `evals/*.eval.ts`
- Datasets: `evals/datasets/*.dataset.ts`
- LangSmith integration: `evals/evals.ls.ts`

### Lint
```bash
# lint the code for style and error checking
npx eslint .
```
- ESLint 9 with TypeScript parser
- Stylistic rules in `eslint.config.mjs`

### Type Check
```bash
# type check without emitting files
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
# create new migration
npm run migrate:create -- <migration-name>

# run pending migrations
npm run migrate:up

# rollback last migration
npm run migrate:down
```

Migration files are in `migrations/` with timestamp prefixes.

---

## Docker

```bash
# start PostgreSQL only
docker-compose up postgres -d

# build and run full backend
docker-compose up --build
```

Ports:
- PostgreSQL: `5433` (mapped to container's `5432`)
- Backend: `3026`

---

## Future Work

1. **Workflow chaining** — Allow workflow outputs to trigger other workflows; enable composable, multi-stage automations
   - Trade-off made: Focused on single-workflow execution for initial scope

2. **Recommended follow-up queries** — After chat responses, suggest related questions or next actions based on context
   - Trade-off made: Prioritized core chat functionality over discovery features

3. **Multimodal support** — Accept audio and image inputs; integrate speech-to-text and vision models for richer interactions
   - Trade-off made: Started with text-only to ship faster

4. **Workflow step retry and resume** — Failed workflows currently halt entirely; add configurable retry policies and resume from last successful step
   - Trade-off made: Kept initial implementation simple with fail-fast behavior

5. **Distributed tracing** — `requestId` exists but isn't propagated to MCP calls or LLM requests; add OpenTelemetry spans for end-to-end visibility
   - Trade-off made: Prioritized core functionality over observability instrumentation

6. **Graceful shutdown** — No handling for in-flight requests during deploys; SSE connections and running workflows should drain properly
   - Trade-off made: Relied on container orchestration for restart handling


## License

Proprietary. All rights reserved. Brandon McFarland.
