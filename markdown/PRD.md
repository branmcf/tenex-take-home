# Product Requirements Document (PRD)

## Project Title
Deterministic Workflow Chat

## Status
Draft

## Audience
AI-native professionals who need LLM queries to follow **deterministic, enforceable workflows** that integrate cleanly with tools.

## Owner
TBD

## Tech Owner(s)
TBD

## Stakeholders
TBD

---

## 1. Description

### Problem (as a question)
How do we ensure LLM-driven work follows **deterministic, enforceable workflows** instead of collapsing into brittle, free-form chat?

### Hypothesis
If workflows are treated as **first-class, deterministic execution graphs**—with strict ordering, explicit tool usage, visible step execution, and fail-fast semantics—then AI-native professionals can reliably use LLMs for complex work without losing trust or debuggability.

### Overview
This product is a chat-based interface where:
- Users define workflows in **natural language**
- The system compiles those workflows into **executable DAGs**
- Messages can optionally run through a selected workflow
- Workflow execution is rendered inline as a **CI-style pipeline**
- Failures stop execution immediately and surface clear errors

This product is **not** a generic chat app. If workflows become brittle or opaque, the product fails.

---

## 2. Objectives

### Customer Outcomes
- Enforce workflow execution order on LLM queries
- Reliably use tools inside workflows
- Observe and debug workflow execution step-by-step
- Trust that failures are explicit and deterministic

### Internal Outcomes
- Deterministic workflow execution engine
- Clear separation between chat, workflow definition, and workflow runs
- Strong guardrails preventing silent degradation to normal chat

---

## 3. Success Metrics

### Primary
- % of workflow runs that complete or fail deterministically (no silent fallbacks)
- % of workflow failures with surfaced, understandable error output

### Secondary
- Workflow reuse across chats
- User retention tied to workflow usage vs free chat
- Average workflows per user

---

## 4. Users

### Primary User
AI-native professionals who routinely need LLM outputs to follow **specific workflows** (decision processes, research flows, production artifacts, etc.).

### Core Job-to-be-Done
“Ensure my AI queries follow a strict process that I can see, trust, and debug.”

---

## 5. Scope

### In Scope (v1)
- Single-user accounts
- Natural-language workflow creation
- Compiled workflow DAG execution
- Inline pipeline visualization in chat
- Tool-enabled workflow steps
- Fail-fast execution semantics
- Search over chats and LLM responses

### Out of Scope (v1)
- Shared workflows or chats
- Canonical/prebuilt workflows
- Enforced output schemas
- Looping workflows
- Automatic workflow validation or correction

---

## 6. Core Concepts

- **Chat**: Ordered list of messages. Messages may optionally trigger a workflow run.
- **Workflow**: A user-defined, natural-language description of a process.
- **Workflow Version**: Immutable compiled representation of a workflow at execution time.
- **Workflow Run**: One execution of a workflow for a specific message.
- **Step**: A node in a workflow DAG.
- **Tool**: Any system-level or user-defined tool callable by a step.

---

## 7. Information Architecture / Screens

- Sign Up  
- Login  
- Home  
- Workflows  
- Search Chats (modal)  
- Settings (modal)

---

## 8. Functional Requirements (by Screen)

### Sign Up
**Purpose:** Create a verified user account.

**Requirements**
- Google OAuth sign-up
- Email + password sign-up
- Password confirmation required
- Email verification required before account activation

---

### Login
**Purpose:** Authenticate returning users.

**Requirements**
- Google OAuth login
- Email + password login

---

### Home
**Purpose:** Primary interaction surface for chat + workflow execution.

**UI**
- Shadcn sidebar with:
  - New Chat
  - Search Chats
  - Workflows
  - Scrollable Chat History
  - Fixed Account Settings
- Chat component with:
  - Message input
  - Model selector (per message)
  - Workflow selector (per message)
  - Send button

**Behavior**
- Selecting a workflow + sending a message triggers a workflow run
- Workflow execution renders inline as a **pipeline view**
- Each step shows status (queued, running, passed, failed)
- Clicking a step opens a **log view**

---

### Workflow Execution (inline in Chat)
**Purpose:** Make workflows observable and debuggable.

**Requirements**
- Steps execute in DAG order
- Fail-fast: any step failure halts the workflow
- Failed step is highlighted with error summary
- Chat input is immediately re-enabled after failure

**Step Debug View**
- Time-ordered execution log (CI-style)
- Tool calls and tool responses
- Status updates and errors
- No LLM internal prompts or hidden system messages

---

### Workflows
**Purpose:** Create and manage workflows.

**UI**
- “My Workflows” list (scrollable)
- Kebab menu per workflow (rename, delete)
- Chat-based workflow authoring panel
- Current workflow steps preview

**Behavior**
- Workflow authored in natural language
- System compiles workflow into DAG
- Both NL description and compiled DAG are stored
- Editing creates a new workflow version
- Runs are pinned to the workflow version used at execution time

---

### Search Chats (Modal)
**Purpose:** Retrieve past work.

**Requirements**
- Search over:
  - User messages
  - LLM responses (final outputs)
- Default view:
  - 3 most recent chats from this week
  - 3 most recent chats from last week
- Skeleton loader during search
- Results sorted newest → oldest

---

### Settings (Modal)
**Purpose:** Account and cost management.

**Tabs**
- Account settings
- Token usage / cost visibility
- Log out

---

## 9. Workflow Model

- Compiled representation: **DAG (no loops)**
- Steps execute strictly in order dictated by DAG
- No step skipping
- No automatic retries
- Failure immediately terminates run

---

## 10. Tools

- System-level tools available by default
- Users can enable/disable tools per step
- Users may define custom tools
- Tool usage is visible in step logs

---

## 11. Output Semantics

- Final output is a **separate assistant message**
- Free-form by default
- Optional structure only if workflow instructions specify it
- System does not validate or enforce output schemas

---

## 12. Non-Functional Requirements

### Determinism
- Workflow execution must never silently degrade to normal chat
- Failures must be explicit

### Observability
- Every workflow step must have visible execution output
- Tool usage must be inspectable

### Reliability
- Partial workflow progress is preserved on failure
- Workflow runs are reproducible via version pinning

---

## 13. Dependencies

- LLM provider(s)
- Tool execution infrastructure
- Authentication (OAuth + email)
- Persistent storage for chats, workflows, runs

---

## 14. Non-Goals / Guardrails

- Do not auto-correct workflows
- Do not infer missing steps
- Do not silently bypass workflows
- Do not hide execution details

---

## 15. Open Questions (Explicitly Deferred)

- Workflow sharing
- Workflow templates
- Looping / iterative steps
- Output schema enforcement
- Collaboration / teams

---

### Core Product Invariant (Non-Negotiable)

> **If workflows are brittle or non-deterministic, the product collapses into a normal chat app and fails.**
