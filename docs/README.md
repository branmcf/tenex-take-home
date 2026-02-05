# HardWire Documentation

<p align="center"> 
    <img 
        src="https://github.com/user-attachments/assets/045c0b27-cf5b-4411-9ee5-83ba3476346f" 
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

The `docs/` directory contains the **MkDocs Material documentation site** for the HardWire API. It provides comprehensive API reference documentation for both the Backend API and MCP Tools Server.

**Responsibilities:**
- API endpoint documentation with request/response examples
- Authentication guides and getting started tutorials
- Interactive code examples with syntax highlighting
- Light/dark theme support following the HardWire design system

**Non-goals:**
- Does not contain runnable code or tests
- Does not auto-generate from code (manually maintained)

**Framework:** MkDocs with Material theme  
**Output:** Static HTML site in `build/`

---

## Reviewer Notes

- **Run:** `mkdocs serve` (requires Python venv activation)
- **Build:** `mkdocs build`

**What to look at first:**
- `mkdocs.yml` — Site configuration and navigation structure
- `site/content/docs/introduction.md` — API overview and key concepts
- `site/content/docs/endpoints/backend/messages/create-message.md` — Example endpoint documentation
- `site/content/stylesheets/extra.css` — Custom Swiss-modernist styling

**What to judge:**
- Navigation structure matching actual API routes
- Consistency of endpoint documentation format
- Design system adherence (no rounded corners, no shadows, proper color tokens)
- Code example quality and accuracy

---

## Usage (Quick start)

### Prerequisites
- Python 3.x
- pip

### Install

```bash
cd docs

# Create virtual environment (first time only)
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Run Development Server

```bash
# Activate venv if not already active
source venv/bin/activate

# Start dev server with hot reload
mkdocs serve
```

Site runs at `http://localhost:8000`

### Build for Production

```bash
mkdocs build
```

Output goes to `build/` directory.

---

## Directory Structure

```
docs/
├── mkdocs.yml              # MkDocs configuration
├── requirements.txt        # Python dependencies (mkdocs-material)
│
├── site/                   # Source content
│   ├── content/            # Markdown documentation
│   │   ├── index.md        # Home page
│   │   ├── stylesheets/
│   │   │   └── extra.css   # Custom HardWire styling
│   │   ├── assets/
│   │   │   └── images/     # Logo and favicon
│   │   └── docs/
│   │       ├── introduction.md
│   │       ├── getting-started/
│   │       │   ├── authentication.md
│   │       │   └── api-calls.md
│   │       └── endpoints/
│   │           ├── backend/           # Backend API docs
│   │           │   ├── overview.md
│   │           │   ├── chats/
│   │           │   ├── messages/
│   │           │   ├── workflows/
│   │           │   ├── workflow-chat-messages/
│   │           │   ├── workflow-runs/
│   │           │   ├── tools/
│   │           │   ├── models/
│   │           │   ├── users/
│   │           │   └── liveness/
│   │           └── mcp-tools-server/  # MCP server docs
│   │               ├── overview.md
│   │               └── mcp-request.md
│   └── overrides/          # MkDocs theme overrides
│       ├── main.html       # Base template with meta tags
│       ├── layouts/
│       │   └── home.html   # Custom home page layout
│       └── partials/
│
├── build/                  # Generated static site (gitignored)
│
├── venv/                   # Python virtual environment (gitignored)
│
└── LANGFUSE_IMPLEMENTATION_PLAN.md  # Planning document
```

---

## Tech Stack

| Technology | Role | Evidence |
|------------|------|----------|
| **MkDocs** | Static site generator | `mkdocs.yml` |
| **Material for MkDocs** | Theme and components | `requirements.txt` |
| **Python 3** | Build runtime | `venv/` |
| **PyMdown Extensions** | Enhanced markdown | `mkdocs.yml` → `markdown_extensions` |

---

## Documentation Structure

### Getting Started
| Document | Purpose |
|----------|---------|
| `introduction.md` | API overview, base URLs, key concepts |
| `getting-started/authentication.md` | Session auth, sign up/in flows |
| `getting-started/api-calls.md` | Making authenticated requests |

### Backend API Endpoints
| Section | Endpoints |
|---------|-----------|
| Liveness | Health check |
| Models | List available LLM models |
| Users | Get chats, workflows, model preferences |
| Chats | Delete chat |
| Messages | Create, stream, list messages |
| Workflows | CRUD operations |
| Workflow Chat Messages | Authoring chat, apply/reject proposals |
| Workflow Runs | List runs, stream status |
| Tools | List, search, get by ID |

### MCP Tools Server
| Document | Purpose |
|----------|---------|
| `overview.md` | Server architecture |
| `mcp-request.md` | MCP protocol request format |

---

## Key Concepts

### 1. Endpoint Documentation Format
**What:** Each endpoint has a consistent structure: overview, URL, parameters, example request, example response, error codes.

**Why:** Predictable format helps developers quickly find what they need.

**Evidence:** `site/content/docs/endpoints/backend/messages/create-message.md`

### 2. HTTP Method Badges
**What:** Custom CSS badges for GET/POST/PUT/PATCH/DELETE methods.

**Why:** Visual differentiation of endpoint types at a glance.

**Evidence:** `site/content/stylesheets/extra.css` → `.badge-get`, `.badge-post`, etc.

### 3. Design System Compliance
**What:** Custom CSS removes all border-radius and shadows, applies HardWire color tokens.

**Why:** Documentation matches the application's Swiss-modernist aesthetic.

**Evidence:** `site/content/stylesheets/extra.css` — 700+ lines of custom styling

### 4. Tabbed Content
**What:** PyMdown tabbed extension for URL params, query params, and body in separate tabs.

**Why:** Reduces visual clutter, groups related information.

**Evidence:** `mkdocs.yml` → `pymdownx.tabbed`

---

## System Context

### Provides
- Static HTML documentation site
- Deployable to any static hosting (Vercel, Netlify, GitHub Pages)

### Depends On
- Nothing at runtime (static files)
- Python + MkDocs for building

### Interfaces
- Links to production API URLs (`https://api.hardwire.dev`)
- References authentication patterns from backend

---

## Configuration

### mkdocs.yml Key Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| `docs_dir` | `site/content` | Source content location |
| `site_dir` | `build` | Output location |
| `theme.custom_dir` | `site/overrides` | Template overrides |
| `theme.palette` | Light/dark toggle | Theme switching |
| `features` | `navigation.tabs`, `search.suggest`, `content.code.copy` | UX features |

### Adding New Endpoints

1. Create markdown file in appropriate `site/content/docs/endpoints/` subdirectory
2. Add entry to `nav` section in `mkdocs.yml`
3. Follow existing endpoint format (see `create-message.md`)
4. Use `<h1 class="article-title">Name <span class="badge-post">POST</span></h1>` for title

---

## Future Work

1. **OpenAPI generation** — Auto-generate endpoint docs from backend schemas
   - Where: Build script to parse Joi schemas

2. **API playground** — Interactive request builder
   - Where: Custom MkDocs plugin or embedded component

3. **Versioned docs** — Support multiple API versions
   - Where: `mike` plugin for MkDocs versioning

4. **Search analytics** — Track what developers search for
   - Where: Custom analytics integration
