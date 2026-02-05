# Nolan API Documentation - Complete Project Guide

> A pathologically detailed guide to understanding, setting up, and maintaining this MkDocs Material documentation project.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Complete File & Folder Reference](#complete-file--folder-reference)
3. [Environment Setup](#environment-setup)
4. [The MkDocs Configuration (mkdocs.yml)](#the-mkdocs-configuration-mkdocsyml)
5. [Documentation Content Structure](#documentation-content-structure)
6. [Theme Customization & Overrides](#theme-customization--overrides)
7. [Custom Styling](#custom-styling)
8. [Writing Documentation](#writing-documentation)
9. [Endpoint Documentation Pattern](#endpoint-documentation-pattern)
10. [Complete Endpoint Example](#complete-endpoint-example)
11. [Building & Deploying](#building--deploying)
12. [Common Tasks & Workflows](#common-tasks--workflows)

---

## Project Overview

This project is a documentation site for the **Nolan API**, built using [MkDocs](https://www.mkdocs.org/) with the [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) theme. It provides comprehensive API documentation for Nolan's banking and rewards platform.

### Technology Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| Static Site Generator | MkDocs | Converts Markdown to HTML |
| Theme | Material for MkDocs | Modern, responsive documentation theme |
| Templating | Jinja2 | Custom HTML templates and overrides |
| Styling | CSS | Custom brand colors and components |
| Deployment | Heroku (PHP buildpack) | Production hosting |
| Content Format | Markdown | Documentation authoring |

### Key URLs

| Environment | URL |
|-------------|-----|
| Production Site | https://docs.nolantechnologies.com |
| API (Sandbox) | https://api.sandbox.nolantechnologies.com |
| API (Production) | https://api.nolantechnologies.com |
| GitHub Repository | https://github.com/Nolan-Technologies/docs |

---

## Complete File & Folder Reference

### Root Directory Files

#### `mkdocs.yml`
**Purpose**: The heart of the entire project. This YAML configuration file controls every aspect of MkDocs:

- Site metadata (name, description, URLs)
- Navigation structure
- Theme configuration
- Plugin configuration
- Markdown extensions
- Custom CSS paths
- File watch settings

**When to edit**: When adding new pages, changing navigation, modifying theme settings, or adding plugins.

---

#### `requirements.txt`
**Purpose**: Python package dependencies for the project.

**Contents**:
```
mkdocs-material==9.*
```

**Details**: This single line installs `mkdocs-material` which includes:
- MkDocs core
- Material theme
- All required dependencies (Jinja2, Markdown, PyYAML, etc.)

**When to edit**: When adding new MkDocs plugins or upgrading the Material theme version.

---

#### `README.md`
**Purpose**: Repository description displayed on GitHub. Currently minimal.

**Contents**:
```
# docs
```

**When to edit**: Add project description, setup instructions, or contribution guidelines for developers.

---

#### `buildpack-run.sh`
**Purpose**: Build script for Heroku deployment using the PHP buildpack.

**What it does (line by line)**:

```bash
#! /bin/bash

# build the documentation site
mkdocs build                           # Generates static HTML in /docs folder

# enable extglob
shopt -s extglob                       # Enables extended globbing for bash

# delete everything except for the mkdocs build output
rm -rf !(docs)                         # Removes all files except /docs directory

# move the mkdocs build output to the root, overwriting conflicting /docs dir
cp -R "docs/"* .                       # Copies built files to root

# create a composer file for heroku/php buildpack
touch composer.json                    # Creates empty composer.json

# write an empty object to the composer file
echo '{}' > composer.json              # PHP buildpack requires this file

# create an index file for the fake PHP app
touch index.php                        # Creates PHP entry point

# include the real index in the fake index
echo '<?php include_once("index.html"); ?>' > index.php  # Routes to MkDocs output
```

**Why PHP?**: Heroku's PHP buildpack provides a simple way to serve static files. The script tricks Heroku into serving the static HTML site through a minimal PHP wrapper.

---

### `/venv/` Directory

**Purpose**: Python virtual environment containing all installed packages.

**Important subdirectories**:

| Path | Purpose |
|------|---------|
| `venv/bin/` | Executable scripts (python, pip, mkdocs) |
| `venv/bin/activate` | Shell script to activate the virtual environment |
| `venv/bin/mkdocs` | MkDocs CLI executable |
| `venv/lib/python3.9/site-packages/` | All installed Python packages |

**Key packages in site-packages**:

| Package | Purpose |
|---------|---------|
| `mkdocs/` | Core MkDocs functionality |
| `material/` | Material theme files |
| `jinja2/` | Templating engine |
| `markdown/` | Markdown parsing |
| `pymdownx/` | PyMdown Extensions (code highlighting, tabs, etc.) |
| `pygments/` | Syntax highlighting |
| `yaml/` | YAML parsing for mkdocs.yml |
| `watchdog/` | File watching for live reload |

**When to modify**: Never edit directly. Use `pip install` in activated venv.

---

### `/site/` Directory

This is the **source content directory** (configured as `docs_dir` in mkdocs.yml).

#### `/site/content/`

The actual documentation source files live here.

##### `/site/content/index.md`

**Purpose**: Homepage content file.

**Contents**:
```yaml
---
template: layouts/home.html
title:
---
```

**Details**: Uses YAML front matter to specify a custom template (`layouts/home.html`). The empty `title:` prevents MkDocs from auto-generating a title. The actual homepage content is defined in the template itself, not this Markdown file.

---

##### `/site/content/stylesheets/extra.css`

**Purpose**: Custom CSS styles that extend/override the Material theme.

**Key style categories**:

1. **Typography helpers**:
   - `span.title` - Bold text
   - `span.em` - Emphasized text
   - `span.type` - Grayed type indicators
   - `span.faint` - Muted text

2. **Nolan branding**:
   - `.article-title` - Blue (#0080FF) page titles
   - `a.nolan-anchor` - Branded link color
   - CSS variables for accent colors

3. **HTTP Method Admonitions** (custom callout boxes):
   - `.admonition.post` - Blue for POST requests
   - `.admonition.get` - Green for GET requests
   - `.admonition.put` - Orange for PUT requests
   - `.admonition.patch` - Purple for PATCH requests
   - `.admonition.delete` - Red for DELETE requests

---

##### `/site/content/assets/`

**Purpose**: Static assets (images, icons, logos).

**Contents**:

| File | Purpose |
|------|---------|
| `Nolan_appicon.svg` | Site logo and favicon |
| `images/badge-get.svg` | Green GET method badge |
| `images/badge-post.svg` | Blue POST method badge |
| `images/badge-put.svg` | Orange PUT method badge |
| `images/badge-patch.svg` | Purple PATCH method badge |
| `images/badge-delete.svg` | Red DELETE method badge |
| `images/screen.svg` | Hero image on homepage |
| `images/screen.png` | Fallback hero image (raster) |
| `images/social-sharing.png` | Open Graph/Twitter card image |

---

##### `/site/content/docs/`

**Purpose**: All documentation content organized by topic.

**Structure**:

```
docs/
├── introduction.md          # Welcome page, API overview
├── errors.md                # Error codes reference
├── basics/                  # Foundational concepts
│   ├── environments.md      # Sandbox vs Production
│   ├── rate-limits.md       # API rate limiting info
│   ├── timeouts.md          # Request timeout info
│   ├── pagination.md        # Pagination patterns
│   ├── idempotency.md       # Idempotent requests
│   └── webhooks.md          # Webhook documentation
├── getting-started/         # Onboarding guides
│   ├── request-api-key.md   # How to get API access
│   ├── api-call.md          # Making your first call
│   └── postman.md           # Postman collection guide
└── endpoints/               # API reference
    ├── banking/             # Banking API endpoints
    │   ├── accounts/
    │   ├── applications/
    │   ├── cards/
    │   ├── customers/
    │   ├── payments/
    │   └── ... (more resources)
    └── rewards/             # Rewards API endpoints
        ├── users/
        ├── rewards/
        └── ... (more resources)
```

---

#### `/site/overrides/`

**Purpose**: Jinja2 template overrides that customize the Material theme.

##### `/site/overrides/main.html`

**Purpose**: Main template that extends the base Material theme. Adds custom meta tags for social sharing.

**What it does**:
- Extends `base.html` (Material's base template)
- Adds Open Graph meta tags (`og:title`, `og:image`)
- Adds Twitter Card meta tags
- Supports page-specific metadata via front matter

**Usage**: When a page has `image` in its front matter, those values are used. Otherwise, defaults to Nolan branding.

---

##### `/site/overrides/layouts/home.html`

**Purpose**: Custom homepage layout with hero section and call-to-action.

**Key sections**:

1. **Extended Styles** (`<style>` block):
   - Hides default content area
   - Hides navigation sidebars on home
   - Styles hero section
   - Styles "Get Started" button
   - Responsive breakpoints

2. **Hero Section** (`.tx-hero`):
   - Main headline: "Your toolkit for embedded finance"
   - Subheadline description
   - "Get started" CTA button linking to `/docs/introduction/`

3. **Hero Image** (`.tx-hero__image`):
   - Displays `screen.svg` visual

---

##### `/site/overrides/partials/header.html`

**Purpose**: Custom site header with logo, title, search, and GitHub link.

**Components**:
- Logo linking to home
- Mobile menu toggle
- Site name and current page title
- Search toggle (if search plugin enabled)
- GitHub repository link

---

##### `/site/overrides/partials/footer.html`

**Purpose**: Custom footer with copyright and social links.

**Components**:
- Copyright notice (from `mkdocs.yml`)
- "Made with Material for MkDocs" attribution
- Social media links (includes `social.html` partial)

---

##### `/site/overrides/partials/social.html`

**Purpose**: Renders social media icons in footer.

**How it works**:
- Loops through `config.extra.social` from mkdocs.yml
- Renders SVG icon for each platform
- Links to respective social profile
- Automatically handles Mastodon `rel=me` verification

---

### `/docs/` Directory (Output)

**Purpose**: Build output directory (configured as `site_dir` in mkdocs.yml).

**Important**: This directory is **generated** by `mkdocs build`. Do not edit files here directly—they will be overwritten.

---

## Environment Setup

### Prerequisites

- Python 3.9+ installed
- pip (Python package manager)
- Git

### Step-by-Step Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/Nolan-Technologies/docs.git
cd docs
```

#### 2. Create Virtual Environment

```bash
python3 -m venv venv
```

This creates an isolated Python environment in the `venv/` directory.

#### 3. Activate Virtual Environment

**macOS/Linux**:
```bash
source venv/bin/activate
```

**Windows (Command Prompt)**:
```cmd
venv\Scripts\activate.bat
```

**Windows (PowerShell)**:
```powershell
venv\Scripts\Activate.ps1
```

When activated, your prompt will show `(venv)` prefix.

#### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

This installs:
- `mkdocs-material==9.*` and all its dependencies

#### 5. Verify Installation

```bash
mkdocs --version
```

Should output something like: `mkdocs, version 1.5.x`

#### 6. Run Development Server

```bash
mkdocs serve
```

This starts a local server at `http://127.0.0.1:8000/` with live reload.

---

## The MkDocs Configuration (mkdocs.yml)

The `mkdocs.yml` file is the central configuration. Here's every setting explained:

### Site Metadata

```yaml
site_name: Nolan API Documentation       # Browser title, header text
site_description: 'Next generation payment solutions'  # Meta description
site_url: 'https://docs.nolantechnologies.com'        # Canonical URL
repo_name: 'Nolan-Technologies/docs'     # GitHub link text
repo_url: 'https://github.com/Nolan-Technologies/docs'  # GitHub URL
copyright: Copyright &copy; 2023 Nolan Technologies, Inc.  # Footer text
```

### Directory Configuration

```yaml
docs_dir: 'site/content'    # Source files location
site_dir: 'docs'            # Build output location
```

### Custom CSS

```yaml
extra_css:
  - stylesheets/extra.css   # Path relative to docs_dir
```

### Social Links (Footer)

```yaml
extra:
  social:
    - icon: fontawesome/brands/twitter
      link: https://twitter.com/nolantech_
    - icon: fontawesome/brands/facebook
      link: https://www.facebook.com/nolantechnologies
```

### Navigation Structure

```yaml
nav:
  - Home: index.md                          # Top-level page
  - Documentation:                          # Section header
    - Introduction: docs/introduction.md    # Page under section
    - Nolan Basics:                         # Nested section
      - Environments: docs/basics/environments.md
      # ... more pages
    - API Endpoints:
      - Banking:
        - Accounts:
          - Create Account: docs/endpoints/banking/accounts/create-account.md
```

**Navigation rules**:
- Files must exist at the specified paths (relative to `docs_dir`)
- Indentation creates hierarchy
- Strings without `:` are section headers (no page)
- `Key: path.md` creates a link

### Theme Configuration

```yaml
theme:
  name: material              # Use Material theme
  custom_dir: site/overrides  # Custom template location
  palette:
    primary: white            # Header background
    accent: custom            # Accent color (defined in CSS)
  font:
    text: Inter               # Body font
    code: Roboto Mono         # Code font
  logo: assets/Nolan_appicon.svg    # Header logo
  favicon: assets/Nolan_appicon.svg # Browser tab icon
  language: en                # Site language
  icon:
    annotation: material/alert-decagram  # Annotation icon
  features:
    - navigation.tabs         # Top-level nav as tabs
    - navigation.instant      # SPA-style navigation
    - navigation.path         # Breadcrumb navigation
    - search.suggest          # Search autocomplete
    - content.code.annotate   # Code annotations
```

### Markdown Extensions

```yaml
markdown_extensions:
  - admonition               # Callout boxes (!!! note, !!! warning)
  - meta                     # YAML front matter support
  - attr_list                # Add HTML attributes to elements
  - md_in_html               # Markdown inside HTML blocks
  - pymdownx.details         # Collapsible admonitions
  - pymdownx.superfences     # Nested code blocks
  - pymdownx.tabbed:         # Content tabs
      alternate_style: true
  - tables                   # Markdown tables
  - footnotes                # [^1] footnotes
  - pymdownx.emoji:          # :emoji: support
      emoji_index: !!python/name:materialx.emoji.twemoji
      emoji_generator: !!python/name:materialx.emoji.to_svg
      options:
        custom_icons:
          - site/overrides/.icons
```

### Plugins

```yaml
plugins:
  - search                   # Built-in search functionality
```

### Watch Settings

```yaml
watch:
  - site/overrides           # Also watch overrides during serve
```

---

## Documentation Content Structure

### Page Anatomy

Every documentation page follows this structure:

```markdown
---
icon: 'http/badge-post'                    # Optional: Front matter
---

<h1 class=article-title>Page Title</h1>    # Styled H1 header

---                                        # Horizontal rule separator

Content goes here...                       # Markdown content
```

### Front Matter

YAML front matter (between `---` markers) provides metadata:

```yaml
---
icon: 'http/badge-post'     # Custom icon (for nav)
template: layouts/home.html # Custom template (rare)
title: Custom Title         # Override page title
image: /path/to/image.png   # Open Graph image
---
```

### Common Markdown Patterns

#### Headers
```markdown
## Section Header
### Subsection
#### Minor Section
```

#### Tables
```markdown
| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Data     | Data     | Data     |
```

#### Code Blocks
````markdown
```javascript
const example = "code";
```
````

#### Admonitions (Callouts)
```markdown
!!! note
    This is a note callout.

!!! warning
    This is a warning callout.

!!! info
    This endpoint supports idempotency.
```

#### Tabs
```markdown
=== "Tab 1"
    Content for tab 1

=== "Tab 2"
    Content for tab 2
```

#### Footnotes
```markdown
This is text with a footnote[^1].

[^1]: This is the footnote content.
```

#### Links
```markdown
[Link text](https://example.com)
<a class="nolan-anchor" href="#">Styled link</a>
<a target="_blank" rel="noopener noreferrer" href="url">External link</a>
```

---

## Theme Customization & Overrides

### Override Priority

MkDocs Material allows overriding any template. The system checks:

1. `custom_dir` (site/overrides/) - **Your customizations**
2. Material theme templates - **Default fallback**

### Creating Overrides

To override a template:

1. Find the original in Material's source (or venv/lib/python3.9/site-packages/material/)
2. Create the same path in `site/overrides/`
3. Either extend or replace the original

**Extending** (recommended):
```jinja2
{% extends "base.html" %}

{% block content %}
  {{ super() }}  {# Include original content #}
  <p>Additional content</p>
{% endblock %}
```

**Replacing** (use sparingly):
```jinja2
{% extends "base.html" %}

{% block content %}
  <p>Completely new content</p>
{% endblock %}
```

### Available Blocks

Common blocks to override in Material theme:

| Block | Purpose |
|-------|---------|
| `extrahead` | Add content to `<head>` |
| `header` | Site header |
| `tabs` | Navigation tabs area |
| `content` | Main content area |
| `footer` | Site footer |
| `scripts` | JavaScript includes |

---

## Custom Styling

### CSS Architecture

The `extra.css` file uses these patterns:

#### 1. CSS Custom Properties
```css
:root {
  --md-typeset-a-color: #0080FF !important;
  --md-accent-fg-color: #0080FF !important;
}
```

#### 2. Custom Admonition Types

For each HTTP method, a custom admonition is defined:

```css
/* Define icon */
:root {
  --md-admonition-icon--post: url('/assets/images/badge-post.svg')
}

/* Style the admonition box */
.md-typeset .admonition.post,
.md-typeset details.post {
  border-color: rgb(59, 131, 250);
}

/* Style the header */
.md-typeset .post > .admonition-title,
.md-typeset .post > summary {
  background-color: rgba(59, 131, 250, 0.1);
}

/* Style the icon */
.md-typeset .post > .admonition-title::before,
.md-typeset .post > summary::before {
  background-color: rgb(59, 131, 250);
  -webkit-mask-image: var(--md-admonition-icon--post);
          mask-image: var(--md-admonition-icon--post);
}
```

#### HTTP Method Color Scheme

| Method | Color | RGB |
|--------|-------|-----|
| GET | Green | rgb(90, 197, 98) |
| POST | Blue | rgb(59, 131, 250) |
| PUT | Orange | rgb(240, 150, 55) |
| PATCH | Purple | rgb(117, 79, 246) |
| DELETE | Red | rgb(234, 57, 75) |

#### 3. Brand Colors

```css
/* Nolan Blue - Primary brand color */
#0080FF

/* Used for:
   - Page titles (.article-title)
   - Links (a.nolan-anchor)
   - Active nav items
   - Accent elements
*/
```

---

## Writing Documentation

### Basics Pages

Simple informational pages follow this pattern:

```markdown
<h1 class="article-title">Page Title</h1>

---

Introductory paragraph explaining the concept.

Additional details, tables, or examples as needed.

| Column | Description |
|--------|-------------|
| Data   | Explanation |
```

### Getting Started Pages

Tutorial-style pages with step-by-step instructions:

```markdown
<h1 class="article-title">Tutorial Title</h1>

---

## Prerequisites

List what users need before starting.

## Step 1: First Action

Instructions for the first step.

```bash
example command
```

## Step 2: Second Action

Continue with next steps...
```

---

## Endpoint Documentation Pattern

Every API endpoint follows a consistent structure. Here's the complete template:

### Template Structure

```markdown
---
icon: 'http/badge-[method]'
---

<h1 class=article-title>Endpoint Name<img class="article-title-image" src="/assets/images/badge-[method].svg" alt="[METHOD]"/></h1> 

---

!!! info
    Optional: Note about idempotency or special behavior.

## Overview
One-sentence description of what this endpoint does. [^ 1]

## Endpoint URL
`https://api-s.nolantechnologies.com/v0/path/to/endpoint`

## Endpoint Data
=== "Body"    
    | Property Name | Description | Type | Required | Allowed Values |
    | ------------- | ----------- | ---- | -------- | -------------- |
    | `propertyName` | What it is | String | Yes | Any |

    ##### Example Body

    ```js
    {
        "propertyName": "value"
    } 
    ```

=== "URL Parameters"
    | Parameter Name | Description |
    | -------------- | ----------- |
    | `paramName` | What it is |

=== "Query Parameters"
    | Parameter Name | Description | Default |
    | -------------- | ----------- | ------- |
    | `limit` | Number of results | 25 |

## Example Request
```text
curl -i -X [METHOD] "https://api-s.nolantechnologies.com/v0/path" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Nolan-API-Key: YourNolanApiKey" \
  --data '{
    "propertyName": "value"
}'
```

## Example Response
```text
HTTP/1.1 [STATUS_CODE] [STATUS_TEXT]
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: [LENGTH]
ETag: W/"[HASH]"
Date: [DATE]
Connection: keep-alive
Keep-Alive: timeout=5

{
    "data": {
        "id": "12345",
        // ... response properties
    }
}
```

[^ 1]: Read more about this endpoint in the <a target="_blank" rel="noopener noreferrer" href="[EXTERNAL_DOC_URL]">External API docs</a>
```

---

## Complete Endpoint Example

Here's a fully documented endpoint that demonstrates every pattern:

### File: `site/content/docs/endpoints/banking/payments/create-payment.md`

```markdown
---
icon: 'http/badge-post'
---

<h1 class=article-title>Create ACH Payment<img class="article-title-image" src="/assets/images/badge-post.svg" alt="POST"/></h1> 

---

!!! info
    This endpoint supports idempotency. Include an `Idempotency-Key` header to safely retry requests.

## Overview
Creates an ACH payment to transfer funds from a Nolan deposit account to an external bank account. Payments are processed within 1-3 business days depending on the payment type selected. [^ 1]

## Endpoint URL
`https://api-s.nolantechnologies.com/v0/banking/payments`

## Endpoint Data

=== "Body"    
    | Property Name | Description | Type | Required | Allowed Values |
    | ------------- | ----------- | ---- | -------- | -------------- |
    | `accountId` | The Nolan deposit account ID to debit | String | Yes | Valid account ID |
    | `counterpartyId` | The external account ID to credit | String | Yes | Valid external account ID |
    | `amount` | Amount in cents to transfer | Integer | Yes | 1 - 1000000000 |
    | `direction` | Direction of the payment | String | Yes | `Credit`, `Debit` |
    | `description` | Payment description (appears on statement) | String | Yes | 1-50 characters |
    | `type` | ACH payment speed | String | No | `Standard`, `SameDay` |
    | `scheduledDate` | Date to initiate payment (ISO 8601) | String | No | Future date |

    ##### Example Body

    ```js
    {
        "accountId": "1823631",
        "counterpartyId": "9876543",
        "amount": 50000,
        "direction": "Credit",
        "description": "Monthly rent payment",
        "type": "Standard"
    } 
    ```

=== "URL Parameters"
    ```text
    This endpoint has no URL parameters.
    ```

=== "Query Parameters"
    ```text
    This endpoint has no query parameters.
    ```

## Example Request
```text
curl -i -X POST "https://api-s.nolantechnologies.com/v0/banking/payments" \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -H "X-Nolan-API-Key: YourNolanApiKey" \
  -H "Idempotency-Key: unique-request-id-12345" \
  --data '{
    "accountId": "1823631",
    "counterpartyId": "9876543",
    "amount": 50000,
    "direction": "Credit",
    "description": "Monthly rent payment",
    "type": "Standard"
}'
```

## Example Response
```text
HTTP/1.1 201 CREATED
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 487
ETag: W/"1e7-Kj8mN2pLqR3sT4uV5wX6yZ"
Date: Mon, 15 Jan 2024 14:32:18 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
    "data": {
        "id": "2847561",
        "type": "achPayment",
        "accountId": "1823631",
        "counterpartyId": "9876543",
        "createdAt": "2024-01-15T14:32:18.246Z",
        "amount": 50000,
        "direction": "Credit",
        "description": "Monthly rent payment",
        "status": "Pending",
        "reason": null,
        "settlementDate": null,
        "expectedCompletionDate": "2024-01-18",
        "tags": {}
    }
}
```

## Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | String | Unique payment identifier |
| `type` | String | Always `achPayment` for ACH transfers |
| `accountId` | String | Source Nolan account ID |
| `counterpartyId` | String | Destination external account ID |
| `createdAt` | String | ISO 8601 timestamp of creation |
| `amount` | Integer | Payment amount in cents |
| `direction` | String | `Credit` or `Debit` |
| `description` | String | Payment description |
| `status` | String | Current payment status |
| `reason` | String | Failure reason (null if successful) |
| `settlementDate` | String | Date funds settled (null if pending) |
| `expectedCompletionDate` | String | Estimated completion date |
| `tags` | Object | Custom metadata tags |

## Payment Statuses

| Status | Description |
|--------|-------------|
| `Pending` | Payment created, awaiting processing |
| `PendingReview` | Payment flagged for manual review |
| `Clearing` | Payment sent to ACH network |
| `Sent` | Payment accepted by receiving bank |
| `Canceled` | Payment canceled before processing |
| `Returned` | Payment returned by receiving bank |

## Error Responses

| Status Code | Error | Description |
|-------------|-------|-------------|
| `400` | Bad Request | Invalid request body or parameters |
| `401` | Unauthorized | Invalid or missing API key |
| `404` | Not Found | Account or counterparty not found |
| `409` | Conflict | Idempotency key already used with different body |
| `422` | Unprocessable Entity | Insufficient funds or account frozen |

[^ 1]: Read more about this endpoint in the <a target="_blank" rel="noopener noreferrer" href="https://docs.unit.co/ach-origination#create-ach-payment">Unit API docs</a>
```

---

## Building & Deploying

### Local Development

```bash
# Activate virtual environment
source venv/bin/activate

# Start development server with live reload
mkdocs serve

# Server runs at http://127.0.0.1:8000/
```

### Building for Production

```bash
# Activate virtual environment
source venv/bin/activate

# Build static site
mkdocs build
```

This generates the static site in the `/docs/` directory.

### Deployment to Heroku

The project uses a custom buildpack workflow:

1. Push to GitHub
2. Heroku detects PHP buildpack (via composer.json)
3. `buildpack-run.sh` executes during build
4. Static site served via PHP wrapper

### Manual Deployment (GitHub Pages Alternative)

```bash
# Build and deploy to gh-pages branch
mkdocs gh-deploy
```

---

## Common Tasks & Workflows

### Adding a New Endpoint Page

1. **Create the Markdown file**:
   ```bash
   touch site/content/docs/endpoints/banking/resource/new-endpoint.md
   ```

2. **Add content using the template** (see [Endpoint Documentation Pattern](#endpoint-documentation-pattern))

3. **Add to navigation in `mkdocs.yml`**:
   ```yaml
   nav:
     - Documentation:
       - API Endpoints:
         - Banking:
           - Resource:
             - New Endpoint: docs/endpoints/banking/resource/new-endpoint.md
   ```

4. **Test locally**:
   ```bash
   mkdocs serve
   ```

### Adding a New Section

1. **Create the directory**:
   ```bash
   mkdir -p site/content/docs/new-section
   ```

2. **Create pages**:
   ```bash
   touch site/content/docs/new-section/page-one.md
   touch site/content/docs/new-section/page-two.md
   ```

3. **Update navigation in `mkdocs.yml`**:
   ```yaml
   nav:
     - Documentation:
       - New Section:
         - Page One: docs/new-section/page-one.md
         - Page Two: docs/new-section/page-two.md
   ```

### Modifying the Homepage

Edit `site/overrides/layouts/home.html`:

- **Change headline**: Find `<h1>Your toolkit for embedded finance</h1>`
- **Change subheadline**: Find the `<p>` tag below it
- **Change CTA button**: Find the `<a href="docs/introduction/"` element
- **Change hero image**: Modify `src="assets/images/screen.svg"`

### Adding a New Admonition Type

1. **Create the SVG icon** and save to `site/content/assets/images/badge-new.svg`

2. **Add CSS to `site/content/stylesheets/extra.css`**:
   ```css
   :root {
     --md-admonition-icon--new: url('/assets/images/badge-new.svg')
   }
   .md-typeset .admonition.new,
   .md-typeset details.new {
     border-color: rgb(YOUR_COLOR);
   }
   .md-typeset .new > .admonition-title,
   .md-typeset .new > summary {
     background-color: rgba(YOUR_COLOR, 0.1);
   }
   .md-typeset .new > .admonition-title::before,
   .md-typeset .new > summary::before {
     background-color: rgb(YOUR_COLOR);
     -webkit-mask-image: var(--md-admonition-icon--new);
             mask-image: var(--md-admonition-icon--new);
   }
   ```

3. **Use in Markdown**:
   ```markdown
   !!! new "Custom Title"
       Content here.
   ```

### Updating Dependencies

```bash
# Activate virtual environment
source venv/bin/activate

# Update all packages
pip install --upgrade mkdocs-material

# Update requirements.txt (if pinning versions)
pip freeze > requirements.txt
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `mkdocs: command not found` | Activate venv: `source venv/bin/activate` |
| Build fails with missing file | Check file path in `mkdocs.yml` nav matches actual file |
| Styles not updating | Hard refresh browser (Cmd+Shift+R) or clear cache |
| Custom templates not working | Ensure `custom_dir: site/overrides` is set |
| Search not working | Ensure `- search` is in plugins list |

---

## Quick Reference

### File Locations

| What | Where |
|------|-------|
| Main config | `mkdocs.yml` |
| Documentation source | `site/content/docs/` |
| Custom styles | `site/content/stylesheets/extra.css` |
| Template overrides | `site/overrides/` |
| Static assets | `site/content/assets/` |
| Build output | `docs/` |

### Common Commands

```bash
# Start dev server
mkdocs serve

# Build static site
mkdocs build

# Deploy to GitHub Pages
mkdocs gh-deploy

# Create new virtual environment
python3 -m venv venv

# Install dependencies
pip install -r requirements.txt
```

### Useful Links

- [MkDocs Documentation](https://www.mkdocs.org/)
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/)
- [PyMdown Extensions](https://facelessuser.github.io/pymdown-extensions/)
- [Jinja2 Templates](https://jinja.palletsprojects.com/)

---

*Last updated: February 2024*
