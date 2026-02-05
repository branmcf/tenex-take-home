# HardWire Context

<p align="center"> 
    <img 
        src="https://github.com/user-attachments/assets/72f148d5-9e1a-4fe9-b0b0-6d673ad74963" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

The `context/` directory is the **canonical source of truth for all project documentation**, standards, and architectural decisions for the HardWire deterministic workflow chat platform. It provides LLM-consumable context files that define product requirements, technical specifications, coding conventions, and design systems.

**Responsibilities:**
- Product definition (PRD, BRIEF, PLAN)
- Backend coding standards (collection structure, library patterns, migrations, testing)
- Frontend integration patterns and design system specifications
- Workflow engine architecture and MCP tools integration
- Evaluation and observability standards

**Non-goals:**
- This directory contains no executable code
- Does not replace inline code documentation—it provides higher-level guidance

---

## Reviewer Notes (2 minutes)

- **Start with:** `BRIEF.md` — Complete product overview with architecture diagrams and tech stack
- **Understand the product:** `PRD.md` — Functional requirements and core concepts
- **Backend standards:** `COLLECTION-STANDARDS.md` — The definitive guide for backend module structure

**What to judge:**
- Consistency between PRD requirements and implementation plan in `PLAN.md`
- Completeness of coding standards (collection, library, migration, testing)
- Design system coherence in `DESIGN-SYSTEM.md` and `DESIGN-RULES.md`
- Workflow engine specification depth in `WORKFLOWS.md`

---

## Directory Contents

```
context/
├── BRIEF.md                    # Executive summary + full technical architecture
├── PRD.md                      # Product requirements document
├── PLAN.md                     # Implementation plan with phases
│
├── COLLECTION-STANDARDS.md     # Backend collection module structure
├── LIBRARY-STANDARDS.md        # Backend library module patterns
├── MIGRATION-STANDARDS.md      # Database migration conventions
├── TESTING-STANDARDS.md        # Test file organization and patterns
├── RESOURCE-VALIDATORS.md      # Request validation patterns
│
├── DESIGN-SYSTEM.md            # Swiss-modernist design tokens and specs
├── DESIGN-RULES.md             # UI/UX implementation rules
├── COMPONENT-SPECS.md          # Frontend component specifications
├── PROMPT-KIT.md               # AI prompt component library
│
├── WORKFLOWS.md                # Workflow engine + MCP tools masterplan
├── FRONTEND-BACKEND-INTEGRATION.md  # API integration patterns
├── BETTER-AUTH.md              # Authentication implementation guide
│
├── EVAL-STANDARDS.md           # LLM evaluation cookbook reference
├── LANGFUSE-LLMS-TXT.md        # Observability integration
│
├── CURL.md                     # API testing examples
├── ISSUE-STANDARDS.md          # GitHub issue templates
├── MKDOCS.md                   # Documentation site config
├── TERRAFORM.md                # Infrastructure as code reference
└── README-STANDARDS.md         # README generation prompts (this standard)
```

---

## Document Categories

### Product Definition
| Document | Purpose |
|----------|---------|
| `BRIEF.md` | Complete product spec with architecture, data model, API design |
| `PRD.md` | Functional requirements, user stories, success metrics |
| `PLAN.md` | Phased implementation plan with milestones |

### Backend Standards
| Document | Purpose |
|----------|---------|
| `COLLECTION-STANDARDS.md` | Module structure for `/app/<collection>/` directories |
| `LIBRARY-STANDARDS.md` | Shared library patterns for `/lib/<library>/` |
| `MIGRATION-STANDARDS.md` | node-pg-migrate conventions |
| `TESTING-STANDARDS.md` | Jest test organization and naming |
| `RESOURCE-VALIDATORS.md` | Joi validation patterns |

### Frontend Standards
| Document | Purpose |
|----------|---------|
| `DESIGN-SYSTEM.md` | Color tokens, typography, spacing, component specs |
| `DESIGN-RULES.md` | Implementation rules (no rounded corners, no shadows) |
| `COMPONENT-SPECS.md` | React component API specifications |
| `PROMPT-KIT.md` | AI-focused UI component patterns |

### Integration & Architecture
| Document | Purpose |
|----------|---------|
| `WORKFLOWS.md` | Workflow DAG engine and MCP tools architecture |
| `FRONTEND-BACKEND-INTEGRATION.md` | API client patterns, auth flow |
| `BETTER-AUTH.md` | Authentication setup with better-auth |

### Observability & Quality
| Document | Purpose |
|----------|---------|
| `EVAL-STANDARDS.md` | LLM evaluation framework reference |
| `LANGFUSE-LLMS-TXT.md` | Tracing and observability setup |

---

## Key Concepts

### 1. Collection-Based Backend Architecture
**What:** Every API resource follows a strict file structure with types, validation, controller, service, router, errors, and helpers.

**Why:** Ensures consistency, enables LLM-assisted development, prevents architectural drift.

**Evidence:** `COLLECTION-STANDARDS.md` (1400+ lines of patterns)

### 2. Either Monad for Error Handling
**What:** All service and helper functions return `Either<ResourceError, SuccessType>` instead of throwing exceptions.

**Why:** Explicit error handling, type-safe error propagation, no hidden control flow.

**Evidence:** `COLLECTION-STANDARDS.md` → "Core Pattern: The Either Monad"

### 3. Swiss-Modernist Design System
**What:** Strict visual language with no rounded corners, no shadows, 8px grid, monospace labels.

**Why:** Technical, blueprint aesthetic that differentiates from generic SaaS products.

**Evidence:** `DESIGN-SYSTEM.md`, `DESIGN-RULES.md`

### 4. Proposal-First Workflow Editing
**What:** All workflow DAG changes go through a proposal → review → apply flow.

**Why:** Determinism guarantee—users always confirm before changes take effect.

**Evidence:** `WORKFLOWS.md` → "Non-Negotiable Invariants"

### 5. MCP Tools as External Registry
**What:** Tools are served by a standalone MCP server, not embedded in the backend.

**Why:** Separation of concerns, canonical tool definitions, version pinning for reproducibility.

**Evidence:** `WORKFLOWS.md` → "Root MCP Service"

---

## System Context

### Provides
- Authoritative product and technical specifications for the HardWire platform
- Coding standards consumed by LLMs during development
- Design tokens and component specs for frontend implementation

### Depends On
- Nothing—this is a documentation-only directory

### Interfaces
- Referenced by `AGENTS.md` at repo root for AI coding context
- Backend and frontend implementations should conform to these standards
- CI/linting could validate conformance (not currently implemented)

---

## Usage

These documents are designed for:

1. **Onboarding** — New developers read `BRIEF.md` → `PRD.md` → `PLAN.md`
2. **Implementation** — Reference `COLLECTION-STANDARDS.md` when building backend features
3. **LLM Context** — Feed relevant documents to AI assistants for code generation
4. **Design Review** — Use `DESIGN-SYSTEM.md` to validate UI implementations

### Recommended Reading Order

| Role | Start With |
|------|------------|
| Product understanding | `BRIEF.md` → `PRD.md` |
| Backend development | `COLLECTION-STANDARDS.md` → `LIBRARY-STANDARDS.md` |
| Frontend development | `DESIGN-SYSTEM.md` → `COMPONENT-SPECS.md` |
| Workflow features | `WORKFLOWS.md` |

---

## Future Work

1. **Conformance validation** — Lint rules to check backend modules match `COLLECTION-STANDARDS.md`
   - Where: CI pipeline + custom ESLint rules

2. **Design token extraction** — Auto-generate Tailwind config from `DESIGN-SYSTEM.md`
   - Where: `frontend/tailwind.config.ts`

3. **API documentation generation** — Generate OpenAPI spec from standards + code
   - Where: `docs/` directory

4. **Standards versioning** — Track breaking changes to standards over time
   - Where: Version headers in each document
