# Liveness Collection (`/backend/app/liveness`)

This folder contains the **liveness (health) collection** for the Express API.

## Purpose

- **Goal**: Provide a minimal endpoint that confirms the API process is running and able to serve HTTP requests.
- **Non-goals**: This is **not** a deep dependency check (DB/Redis/etc). Keep it fast, deterministic, and side-effect free.

## Public API

### Route

- **Method/Path**: `GET /api/liveness`
- **Mounted at**: `backend/app/index.ts` mounts `livenessRouter` at `/liveness`, and `backend/server/server.app.ts` mounts `apiRouter` at `/api`.
- **Response**:
  - **200** with JSON body `null`

### Handler

- **Controller**: `getLivenessHandler` in `liveness.ctrl.ts`
- **Router**: `livenessRouter` in `liveness.router.ts`
- **Middleware**: Wrapped by `requestHandlerErrorWrapper` (standard async error handling wrapper)

## Files & responsibilities

- **`index.ts`**
  - Barrel exports for this collection.
- **`liveness.router.ts`**
  - Defines the Express router and routes for this collection.
- **`liveness.ctrl.ts`**
  - Implements request handlers (currently just `getLivenessHandler`).
- **`liveness.types.ts`**
  - Reserved for request/response types as the collection grows (currently empty).

## Conventions (match repo standards)

- **Naming**:
  - Routers: `{collectionName}Router` (e.g. `livenessRouter`)
  - Handlers: `{action}Handler` (e.g. `getLivenessHandler`)
  - Files: `{collectionName}.{type}.ts` (e.g. `liveness.ctrl.ts`)
- **Behavior**:
  - Keep liveness endpoints **pure** and **fast** (no network I/O, no DB queries).
  - Avoid logging from liveness by default (it can be called frequently by infra).

## How to extend this collection

If you need a deeper health check, prefer adding a **separate endpoint** rather than changing liveness semantics:

- Add `readiness` or `health` endpoints, e.g. `GET /api/readiness`
- Implement dependency checks with timeouts and clear error responses.
- Add `*.types.ts` definitions for any new payloads.

## Testing guidance

If/when tests are added, follow `/markdown/standards/backend/TESTING_STANDARDS.md`:

- Mirror the directory structure under `backend/tests/app/liveness/`
- Add `liveness.test.ts` that:
  - starts the server with `app.listen()`
  - `GET /api/liveness`
  - asserts `status === 200` and `body === null`

