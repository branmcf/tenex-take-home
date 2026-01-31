# ISSUE_STANDARDS.md

## 1) Purpose

This document defines a **standard GitHub Issue format** optimized for:
- **LLM generation** (creating issue cards)
- **LLM execution** (implementing them with minimal/no clarification)

Goals:
- Issues are **implementable without clarification**.
- Each issue is **small + scoped** (one coherent change).
- Each issue includes **explicit, testable outcomes** and a **concrete test plan** describing *what* to test.

Non-goals:
- Long narrative specs or decision logs.
- “Explore / consider / refactor” tasks without measurable outcomes.

---

## 2) Required Issue Structure

Every issue MUST follow this exact section order and heading names.

### Title
Format: **Verb + object + (work type)**
- Examples: `Implement GET /cards/:cardId (endpoint)`, `Add request validator wrapper (middleware)`

### Work Type
Choose exactly one:

**Backend**
- `endpoint` — HTTP route handler + router wiring (and validation)
- `middleware` — Express middleware (auth, validation, error mapping, etc.)
- `library` — reusable module with a stable exported API
- `util` — small helper(s), low-level, broadly reusable
- `types` — type-only change (no runtime behavior)
- `db-migration` — schema/migration/seed changes
- `script` — one-off/CLI/dev script
- `app-config` — runtime config/env defaults/feature flags
- `tooling-config` — lint/tsconfig/jest/vite/next/etc.

**Frontend (React / Next)**
- `page` — route-level screen (Next route or SPA route)
- `component` — reusable UI component
- `hook` — reusable React hook
- `state` — store/context/query-cache wiring
- `api-client` — typed client/fetchers for backend APIs
- `style` — theme/tokens/global styles

**Cross-cutting**
- `infrastructure` — docker/compose/deploy wiring, env provisioning
- `test` — test harness/framework changes (NOT feature tests; those live in the feature issue)
- `docs`
- `other`

Optional: add up to 3 tags at the top of the issue body, e.g. `Tags: global, security, perf`.

### Context
1–2 sentences only:
- What is being built/changed?
- Why it matters (user/system outcome)?

### Scope
Bullets only.
- **In Scope**: concrete deliverables.
- **Out of Scope**: explicitly list adjacent work NOT included.

Work-type-specific scope requirements:
- `endpoint`: route + auth requirement + validation + typed success/error contracts to add.
- `middleware`: where it is applied + what it adds/guarantees (e.g., attaches `req.user`, blocks unauth).
- `library|util`: exported functions + signatures + error behavior.
- `types`: which module(s) import these types; confirm “no runtime changes”.
- `db-migration`: tables/columns/indexes + whether down/rollback is required + data backfill notes.
- `page|component|hook|state|api-client`: surfaces + states (loading/empty/error) if relevant.

If anything is ambiguous, **decide it here**.

### API / Types (REQUIRED when the change defines or changes a typed contract)
Bullets only. This section is REQUIRED for:
- `endpoint`, `middleware`, `library`, `api-client`, and most `types` issues.

Rules:
- Name all new/changed types explicitly (exact TypeScript names).
- If the contract has error cases, define named error types/classes (don’t hand-wave “returns an error”).

Backend conventions (if applicable in the repo):
- Request types extend Express `Request` and specify `params/body/query` shapes.
- Success responses have named types (e.g., `GetXResponse`) in `*.types.ts`.
- Errors are named classes in `*.errors.ts` extending `ResourceError` with `message`, `statusCode`, `code`.
- Controller handler signature returns `Response<ResourceError | SuccessType>` and uses early-return on errors.
- Router chain order: `requestValidator(SCHEMA)` then `wrapAsync(handler)`.

Frontend conventions (if applicable):
- `api-client`: define request/response types that mirror backend success/error types.
- `page|component|hook`: define prop types / return types; define UI state model if non-trivial.

### Acceptance Criteria
Bullets only. Each bullet MUST be:
- Observable + testable
- Prefixed with `AC#`
- Names the **exact surface** it applies to:
  - endpoint: `METHOD /path`
  - middleware: middleware function name + where applied
  - library/util: exact exported function name
  - db-migration: migration name + schema objects
  - frontend: page/component/hook name
- Specifies **exact expected outputs**:
  - endpoints: exact status code + exact JSON keys (and exact values when small)
  - errors: exact error `code` + `statusCode`
  - DB: exact row effects or schema diffs
  - UI: exact text/elements/states

For contract-changing work (`endpoint`, `api-client`, `library`, `types`):
- ACs MUST reference the **named types/errors** from “API / Types”.

### Test Plan
Bullets only. Describe **exactly what to test** and **exact assertions** (not “works”).

Requirements:
- 3–8 test cases (unless trivial)
- Each test case MUST include:
  - `T#` + level (`unit|integration|e2e`)
  - Setup (fixtures/state)
  - Action (what is called/done)
  - Assertions (exact status codes, keys, values, DB rows, UI text)
  - `Covers: AC#...` (every AC covered by ≥1 test)

Work-type minimums:
- `endpoint`: ≥1 integration test hitting the route.
- `db-migration`: verify schema effect (migration test or verification query) + any backfill logic.
- `api-client`: unit tests for request building + response parsing + error mapping.
- `types`: at least one compile-time “usage” check (e.g., a small typed example) OR a `tsc --noEmit` assertion in CI context.

Reference `TESTING_STANDARDS.md` for how to implement tests. This section is ONLY coverage + assertions.

### Files / Surfaces
Bullets only. List expected touchpoints (paths/modules/routes/components/tables).
(Anchors the implementer to the right files.)

### Constraints
Bullets only. Hard requirements (not suggestions).
If none: `- None`

### Dependencies
Bullets only.
If none: `- None`

---

## 3) Example Issue

**Title:** Implement GET /cards/:cardId (endpoint)

### Work Type
endpoint

### Context
Expose a typed endpoint to fetch a card by ID so the UI can render a card detail view.

### Scope
- **In Scope**
  - Add `GET /cards/:cardId`
  - Add Joi request validation schema for params
  - Add typed request/response/error contracts (see API / Types)
  - Return 404 when card does not exist
- **Out of Scope**
  - Search, pagination, caching, auth model changes

### API / Types
- Request type: `GetCardRequest` extends `Request` with `params: { cardId: string }`
- Success type: `GetCardResponse` (exact JSON shape; includes at least `id`, `accountId`, `status`)
- Error class: `CardNotFoundError` extends `ResourceError` with:
  - `statusCode = 404`
  - `code = "CARD_NOT_FOUND"`
  - `message = "Card not found"`
- Handler signature: `(req: GetCardRequest, res: Response<ResourceError | GetCardResponse>) => Promise<Response<...>>`

### Acceptance Criteria
- AC1 (`GET /cards/:cardId`): when card exists, returns `200` with body matching `GetCardResponse` exactly (keys + types; no extra keys).
- AC2 (`GET /cards/:cardId`): when card does not exist, returns `404` with `{ code: "CARD_NOT_FOUND", statusCode: 404, message: "Card not found" }`.
- AC3 (`GetCardResponse`): type exists and matches the runtime JSON shape returned by the handler.
- AC4 (`CardNotFoundError`): error class exists, extends `ResourceError`, and serializes with `message/statusCode/code`.

### Test Plan
- T1 (integration): Setup: insert card `card_1` fixture. Action: `GET /cards/card_1`. Assert: status `200`; body deep-equals expected `GetCardResponse` fixture; keys exactly `[...]`. Covers: AC1, AC3
- T2 (integration): Setup: ensure `card_404` does not exist. Action: `GET /cards/card_404`. Assert: status `404`; body deep-equals `{ code:"CARD_NOT_FOUND", statusCode:404, message:"Card not found" }`. Covers: AC2, AC4
- T3 (unit): Setup: call the mapping/transform function used by the handler with fixture input. Action: transform. Assert: output deep-equals `GetCardResponse` fixture. Covers: AC3

### Files / Surfaces
- `/app/cards/cards.types.ts` (add request/response types)
- `/app/cards/cards.errors.ts` (add `CardNotFoundError`)
- `/app/cards/cards.validation.ts` (add `GET_CARD` Joi schema)
- `/app/cards/cards.ctrl.ts` (add `getCardHandler`)
- `/app/cards/cards.router.ts` (wire route + middleware chain)
- `/app/cards/tests/getCard.test.ts` (new)

### Constraints
- Follow module file naming and patterns (`*.types.ts`, `*.errors.ts`, `*.validation.ts`, `*.ctrl.ts`, `*.router.ts`).
- Router chain order: `requestValidator(SCHEMA)` then `wrapAsync(handler)`.
- Errors must extend `ResourceError` and include `message/statusCode/code`.

### Dependencies
- None