# HardWire MCP Server

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/53422d95-0249-4bac-9f54-18ce87d60ab0"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

Standalone MCP (Model Context Protocol) tools service providing tool discovery and execution via a JSON-RPC-style API. Enables AI agents to search, read URLs, make HTTP requests, summarize text, and extract JSON through a unified interface.

- **Responsibilities**
  - Tool registry with list/search/get operations
  - Tool execution with input validation and timeout handling
  - Service-level authentication via API key
  - Security controls for outbound HTTP requests (allowlist, private IP blocking)
- **Non-goals**
  - Does not manage user sessions — stateless service
  - Does not store execution history — fire-and-forget execution

**Runtime:** Node.js with Express and TypeScript  
**Entry point:** `index.ts`  
**Default port:** 4010

---

## Reviewer Notes (2 minutes)

- **Run:** `npm install && npm run dev`
- **What to look at first:**
  - `app/v0/tools/tools.executors.ts` — Tool implementations with security controls
  - `app/v0/tools/tools.helper.ts` — Either-based error handling pattern
  - `middleware/serviceAuth.ts` — API key authentication
  - `data/tools.json` — Tool registry with JSON Schema definitions
- **What to judge:**
  - Security approach: URL allowlist, private IP blocking, timeout handling
  - Either monad pattern for error propagation
  - Clean separation: router → controller → helper → service → executor
  - Test coverage across service, executors, and middleware
- **Run tests:** `npm test`

---

## Usage (Quick start)

### Prereqs

- Node.js 18+ (see `Dockerfile` base image)
- npm (lockfile: `package-lock.json`)

### Install

```bash
cd mcp-tools-server
npm install
```

### Configure

Create `.env` with:

```env
PORT=4010
ENVIRONMENT=Local
MCP_TOOLS_API_KEY=your_service_key_here
MCP_HTTP_REQUEST_ALLOWLIST=api.example.com,*.trusted-domain.com
```

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `4010` |
| `MCP_TOOLS_API_KEY` | API key for service authentication | (none — auth disabled if empty) |
| `MCP_HTTP_REQUEST_ALLOWLIST` | Comma-separated hostnames for HTTP requests | (all public hosts allowed) |

### Run

```bash
npm run dev
```

---

## Repo Layout

```
mcp-tools-server/
├── index.ts                    # Server entry point
├── app/
│   ├── index.ts                # API router aggregation
│   └── v0/tools/
│       ├── tools.router.ts     # POST /v0/tools/mcp route
│       ├── tools.ctrl.ts       # Request handler (method dispatch)
│       ├── tools.helper.ts     # Either-wrapped business logic
│       ├── tools.service.ts    # Tool registry operations
│       ├── tools.executors.ts  # Tool implementations
│       ├── tools.types.ts      # TypeScript interfaces
│       ├── tools.validation.ts # Input validation schemas
│       └── tools.errors.ts     # Custom error classes
├── data/
│   └── tools.json              # Tool definitions with JSON Schema
├── middleware/
│   ├── serviceAuth.ts          # API key authentication
│   ├── requestValidator.ts     # Joi-based request validation
│   └── requestLogger.ts        # Request logging
├── server/
│   ├── server.app.ts           # Express app configuration
│   └── server.helper.ts        # Error handlers
├── errors/                     # Error class definitions
├── types/                      # Shared types (Either, etc.)
├── utils/                      # Logging utilities
├── tests/                      # Jest integration tests
├── jest/                       # Jest configuration
├── Dockerfile                  # Production container
└── package.json
```

---

## Tech Stack

| Tech | Role | Evidence |
|------|------|----------|
| **Node.js 18** | Runtime | `Dockerfile` base image |
| **Express 4.18** | HTTP framework | `package.json`, `server/server.app.ts` |
| **TypeScript** | Type safety | `tsconfig.json`, strict mode |
| **Joi** | Request validation | `middleware/requestValidator.ts` |
| **Jest + ts-jest** | Testing | `jest/integrationTests.config.json` |
| **Supertest** | HTTP testing | `package.json` devDependencies |
| **tsx** | Development runner | `package.json` scripts |

---

## System Context

### Provides

- **MCP Tools API** — Single endpoint for tool discovery and execution
- **Built-in tools:** `web_search`, `read_url`, `http_request`, `summarize`, `extract_json`

### Depends on

- **External web** — `web_search` scrapes DuckDuckGo; `read_url`/`http_request` fetch external URLs

### Interfaces

- **Backend** calls this service via `POST /v0/tools/mcp` with `x-service-key` header
- Referenced in backend via `MCP_TOOLS_URL` and `MCP_TOOLS_API_KEY` environment variables

---

## Key Concepts

### 1. JSON-RPC-style API

Single endpoint handles multiple methods via `method` field in request body.

- **What it does:** Routes `listTools`, `searchTools`, `getTool`, `runTool` through one POST endpoint
- **Why it exists:** Follows MCP specification pattern; simplifies client integration
- **Evidence:** `app/v0/tools/tools.ctrl.ts`, `app/v0/tools/tools.types.ts`

### 2. Either Monad Pattern

Error handling uses `Either<Error, Success>` type for explicit error propagation.

- **What it does:** Functions return `error(...)` or `success(...)` instead of throwing
- **Why it exists:** Makes error paths explicit; avoids try/catch proliferation
- **Evidence:** `types/either.ts`, `app/v0/tools/tools.helper.ts`

### 3. URL Security Controls

Outbound HTTP requests are validated against allowlist and blocked for private IPs.

- **What it does:** Prevents SSRF attacks by blocking `localhost`, private IP ranges, and non-allowlisted hosts
- **Why it exists:** Tool execution involves fetching arbitrary URLs; must prevent internal network access
- **Evidence:** `app/v0/tools/tools.executors.ts` (isPrivateIp, isHostAllowed, assertUrlAllowed)

### 4. Tool Registry Pattern

Tools are defined in JSON with JSON Schema for input validation.

- **What it does:** Declarative tool definitions separate from executor implementations
- **Why it exists:** Enables tool discovery; schema can be used for LLM function calling
- **Evidence:** `data/tools.json`, `app/v0/tools/tools.service.ts`

---

## API Endpoints

### POST /v0/tools/mcp

All operations go through this endpoint with different `method` values.

**Headers:**
- `x-service-key: <MCP_TOOLS_API_KEY>` (required if key is configured)

#### List Tools

```json
{
  "method": "listTools",
  "params": { "cursor": null, "limit": 50 }
}
```

#### Search Tools

```json
{
  "method": "searchTools",
  "params": { "query": "search", "limit": 10 }
}
```

#### Get Tool

```json
{
  "method": "getTool",
  "params": { "id": "tool_web_search", "version": "1.0.0" }
}
```

#### Run Tool

```json
{
  "method": "runTool",
  "params": {
    "id": "tool_web_search",
    "input": { "query": "typescript generics", "limit": 5 }
  }
}
```

---

## Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

**Test coverage:**
- `tests/tools/tools.service.test.ts` — listTools, searchTools, getTool
- `tests/tools/tools.executors.test.ts` — Tool execution logic
- `tests/tools/tools.helper.test.ts` — Either-wrapped helpers
- `tests/middleware/serviceAuth.test.ts` — Authentication middleware

---

## Future Work

1. **Add Tool Input Validation Against Schema**
   - Why: Tool schemas exist but inputs aren't validated against them at runtime
   - Where: `app/v0/tools/tools.helper.ts` (runToolHelper)

2. **Implement Rate Limiting**
   - Why: No protection against abuse; external fetch calls could be exploited
   - Where: `middleware/` — add rate limiter before `serviceAuth`

3. **Add Execution Metrics/Tracing**
   - Why: Logs exist but no structured metrics for monitoring
   - Where: `app/v0/tools/tools.helper.ts` (runToolHelper already has timing)

4. **Support Tool Versioning in Registry**
   - Why: Version field exists but only one version per tool currently
   - Where: `data/tools.json`, `app/v0/tools/tools.service.ts`

5. **Add Health Check Endpoint**
   - Why: No dedicated health endpoint for load balancer probes
   - Where: `server/server.app.ts` — add `GET /health`
