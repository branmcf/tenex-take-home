# HardWire Context

<p align="center"> 
    <img 
        src="https://github.com/user-attachments/assets/72f148d5-9e1a-4fe9-b0b0-6d673ad74963" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

This directory contains the **canonical source of truth for all project reference materials** for the HardWire deterministic workflow chat platform. It provides LLM-consumable context files that define product requirements, technical specifications, coding conventions, and design systems.

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

## Reviewer Notes

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

### 1. Planning as Documentation
**What:** Every major system has explicit plans and roadmaps captured in documents before implementation begins.

**Why:** Plans force clarity of thought. Documented plans become reviewable artifacts that prevent scope creep and misaligned expectations.

**Evidence:** `PLAN.md`, `BRIEF.md`, `WORKFLOWS.md` all capture intent before code.

### 2. Radical Clarity
**What:** Every document answers "what," "why," and "how" without ambiguity. No implicit knowledge assumed.

**Why:** Ambiguity creates drift. When two developers interpret a standard differently, inconsistency compounds over time.

**Evidence:** `COLLECTION-STANDARDS.md` shows full code examples for every pattern, not just descriptions.

### 3. Codified Standards Over Tribal Knowledge
**What:** Conventions are written down with explicit rules, not passed along verbally or "just known."

**Why:** Tribal knowledge doesn't scale. New team members (and LLMs) can only follow rules they can read.

**Evidence:** `DESIGN-RULES.md` lists explicit prohibitions; `MIGRATION-STANDARDS.md` specifies exact file naming.

### 4. LLM-First Authoring
**What:** Documents are structured for machine consumption: consistent headings, code blocks, tables, and predictable patterns.

**Why:** Context windows are precious. Well-structured documents let LLMs extract relevant sections efficiently.

**Evidence:** Every standards doc uses the same format: Purpose → Rules → Examples → Anti-patterns.

---

## System Context

### Provides
- Authoritative product and technical specifications for the HardWire platform
- Coding standards consumed by LLMs during development
- Design tokens and component specs for frontend implementation

### Depends On
- Nothing. This is a documentation-only directory

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

1. **Standards versioning** — Track breaking changes to standards over time
   - Where: Version headers in each document
