Here's an ASCII system diagram of your system:


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              TENEX - AI Workflow Platform                                │
└─────────────────────────────────────────────────────────────────────────────────────────┘

 ┌──────────────┐                                          ┌──────────────────────────┐
 │   Browser    │                                          │   External LLM Providers │
 │              │                                          │                          │
 │  Next.js 15  │                                          │  ┌────────┐ ┌─────────┐  │
 │  React 19    │                                          │  │ OpenAI │ │Anthropic│  │
 │  Tailwind    │                                          │  │ (GPT)  │ │(Claude) │  │
 │  Radix UI    │                                          │  └───┬────┘ └────┬────┘  │
 │              │                                          │      │           │        │
 │  Contexts:   │                                          │  ┌───┴───────────┴────┐   │
 │  - Auth      │                                          │  │      Google        │   │
 │  - Chat      │                                          │  │     (Gemini)       │   │
 │  - Workflow   │                                          │  └─────────┬──────────┘   │
 │  - Modal     │                                          └────────────┼──────────────┘
 └──────┬───────┘                                                       │
        │ HTTP/REST                                                     │
        │ SSE (workflow run streams)                                    │ Vercel AI SDK
        │                                                               │
 ┌──────▼──────────────────────────────────────────────────────────────▼───────────────┐
 │                            Backend API  (Express :3026)                              │
 │                                                                                     │
 │  ┌─────────────────────────────────── Middleware ─────────────────────────────────┐  │
 │  │  Session Validator │ Rate Limiter │ Request Validator │ Ownership Validators   │  │
 │  └───────────────────────────────────────────────────────────────────────────────┘  │
 │                                                                                     │
 │  ┌──────────── API Routes (/api) ────────────────────────────────────────────────┐  │
 │  │                                                                               │  │
 │  │  /auth/*          → BetterAuth Handler (email/pass + Google OAuth)            │  │
 │  │  /models          → List available LLM models                                 │  │
 │  │  /users/:id/*     → User resources                                            │  │
 │  │  /chats/:id/*     → Chat CRUD + nested messages                               │  │
 │  │  /workflows/:id/* → Workflow CRUD + versioning + proposals                    │  │
 │  │  /tools           → Tool catalog                                              │  │
 │  │  /chats/:id/workflow-runs/:id/stream → SSE workflow execution                 │  │
 │  │                                                                               │  │
 │  └───────────────────────────────────────────────────────────────────────────────┘  │
 │                                                                                     │
 │  ┌──────────── Domain Modules ───────────────────────────────────────────────────┐  │
 │  │                                                                               │  │
 │  │  ┌──────────┐ ┌──────────┐ ┌───────────┐ ┌───────────┐ ┌─────────────────┐   │  │
 │  │  │  Chats   │ │ Messages │ │ Workflows │ │   Tools   │ │ Workflow Runs   │   │  │
 │  │  │  .ctrl   │ │ .ctrl    │ │ .ctrl     │ │ .service  │ │ .ctrl           │   │  │
 │  │  │  .helper │ │ .helper  │ │ .helper   │ │ .valid.   │ │ (SSE streaming) │   │  │
 │  │  │  .router │ │ .service │ │ .service  │ │           │ │                 │   │  │
 │  │  └──────────┘ └──────────┘ └───────────┘ └───────────┘ └─────────────────┘   │  │
 │  │                                                                               │  │
 │  │  ┌─────────────────────┐  ┌──────────────────────────────┐                    │  │
 │  │  │ Workflow Chat Msgs  │  │ User Model Preferences       │                    │  │
 │  │  │ (authoring chat)    │  │                               │                    │  │
 │  │  └─────────────────────┘  └──────────────────────────────┘                    │  │
 │  └───────────────────────────────────────────────────────────────────────────────┘  │
 │                                                                                     │
 │  ┌──────────── Libraries ────────────────────────────────────────────────────────┐  │
 │  │                                                                               │  │
 │  │  ┌─────────────────────┐  ┌─────────────────────────────────────────────┐     │  │
 │  │  │ LLM Abstraction     │  │ Workflow Engine                             │     │  │
 │  │  │                     │  │                                             │     │  │
 │  │  │ - llm.ts            │  │ - workflowRunner.ts (DAG executor)         │     │  │
 │  │  │ - llmWithTools.ts   │  │ - dagValidator.ts   (cycle detection)      │     │  │
 │  │  │ - providers.ts      │  │ - dagSorter.ts      (topological sort)     │     │  │
 │  │  │ - systemPrompts     │  │ - dagModifier.ts    (add/remove/modify)    │     │  │
 │  │  └─────────────────────┘  │ - workflowProposals (propose → approve)    │     │  │
 │  │                           └─────────────────────────────────────────────┘     │  │
 │  │                                                                               │  │
 │  │  ┌──────────┐ ┌────────────┐ ┌───────────┐ ┌──────────┐ ┌──────────────┐     │  │
 │  │  │BetterAuth│ │  Langfuse  │ │   Redis    │ │  Exa     │ │ PostGraphile │     │  │
 │  │  │(auth)    │ │  (tracing) │ │  (cache)   │ │ (search) │ │ (GQL codegen)│     │  │
 │  │  └──────────┘ └────────────┘ └───────────┘ └──────────┘ └──────────────┘     │  │
 │  └───────────────────────────────────────────────────────────────────────────────┘  │
 └──────┬──────────────────────────┬──────────────────────┬────────────────────────────┘
        │                          │                      │
        │ pg driver                │ HTTP + x-service-key │ ioredis
        │                          │                      │
 ┌──────▼──────────┐  ┌────────────▼────────────────┐  ┌──▼───────────────┐
 │                 │  │                             │  │                  │
 │  PostgreSQL     │  │  MCP Tools Server           │  │   Redis          │
 │  (:5433)        │  │  (Express :4010)            │  │                  │
 │                 │  │                             │  │  - Response cache│
 │  Tables:        │  │  Endpoints:                 │  │  - Session state │
 │  - user         │  │  GET  /tools/list           │  │                  │
 │  - chats        │  │  GET  /tools/search         │  └──────────────────┘
 │  - messages     │  │  GET  /tools/:id/:version   │
 │  - msg_sources  │  │  POST /tools/:id/run        │  ┌──────────────────┐
 │  - workflows    │  │                             │  │                  │
 │  - wf_versions  │  │  Available Tools:           │  │   Exa API        │
 │  - wf_proposals │  │  ┌───────────────────────┐  │  │   (Neural Search)│
 │  - wf_chat_msgs │  │  │ web_search            │──┼──▶                  │
 │  - workflow_runs│  │  │ read_url              │  │  └──────────────────┘
 │  - step_runs    │  │  │ http_request          │  │
 │  - tools        │  │  │ summarize             │  │  ┌──────────────────┐
 │  - models       │  │  │ extract_json          │  │  │                  │
 │  - usage_records│  │  └───────────────────────┘  │  │   Langfuse       │
 │                 │  │                             │  │   (Observability)│
 │  23+ migrations │  │  Auth: x-service-key header │  │   via OpenTel    │
 │                 │  │                             │  │                  │
 └─────────────────┘  └─────────────────────────────┘  └──────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              Workflow Execution Flow                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User sends message ──▶ Create Workflow Run ──▶ Topological Sort DAG                   │
│                                                        │                                │
│                                   ┌────────────────────▼─────────────────────┐          │
│                                   │        For each step (in order):         │          │
│                                   │                                          │          │
│                                   │  1. Build step prompt + context          │          │
│                                   │  2. LLM decides which tools to use       │          │
│                                   │  3. Execute tools via MCP server         │          │
│                                   │  4. Log tool results to step_runs        │          │
│                                   │  5. LLM generates step output            │          │
│                                   │  6. Stream updates via SSE ──▶ Frontend  │          │
│                                   │                                          │          │
│                                   └────────────────────┬─────────────────────┘          │
│                                                        │                                │
│                                   Update run status (PASSED/FAILED)                     │
│                                   Create final message with results                     │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                              Workflow Authoring Flow                                    │
├─────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                         │
│  User describes workflow ──▶ LLM determines intent                                     │
│                                     │                                                   │
│                    ┌────────────────┼────────────────────┐                              │
│                    ▼                ▼                    ▼                               │
│              modify_workflow   ask_clarifying      answer_only                          │
│                    │                                                                    │
│                    ▼                                                                    │
│          LLM generates tool calls:                                                     │
│          - add_step                                                                    │
│          - remove_step                                                                 │
│          - modify_step                                                                 │
│          - modify_step_tools                                                           │
│                    │                                                                    │
│                    ▼                                                                    │
│          Apply to DAG ──▶ Create Proposal (pending)                                    │
│                                     │                                                   │
│                          ┌──────────┴──────────┐                                       │
│                          ▼                     ▼                                        │
│                     User Approves         User Rejects                                 │
│                          │                     │                                        │
│                          ▼                     ▼                                        │
│                  Apply to workflow       Mark rejected                                  │
│                  Create new version      (no changes)                                  │
│                                                                                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
The diagram covers three main views:

System Architecture - The full stack showing Frontend, Backend API, MCP Tools Server, PostgreSQL, Redis, and all external service integrations (LLM providers, Exa, Langfuse)

Workflow Execution Flow - How a workflow run proceeds: topological DAG sorting, step-by-step execution with tool calls through the MCP server, SSE streaming back to the frontend

Workflow Authoring Flow - How users create/modify workflows through natural language: LLM intent detection, DAG modification tool calls, proposal/approval mechanism with versioning