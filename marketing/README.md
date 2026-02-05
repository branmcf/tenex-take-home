# Hardwire Marketing

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/0ed4ecc6-0d7d-462d-9ae1-c5d8155306b2"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

Vite-based static marketing/landing page for the B-PLEX platform. Built as a pixel-perfect replication of a Webflow design, using external Webflow CSS and minimal custom JavaScript for interactions.

- **Responsibilities**
  - Marketing landing page with hero, product features, testimonials, and CTAs
  - Interactive elements: feature tabs accordion, testimonials slider, mobile menu
  - Scroll-triggered fade-up animations
- **Non-goals**
  - No backend integration — purely static content
  - Does not share components with frontend app — standalone build

**Runtime:** Vite 5.4.8 with TypeScript  
**Entry point:** `index.html`

---

## Reviewer Notes (2 minutes)

- **Run:** `npm install && npm run dev`
- **What to look at first:**
  - `src/main.ts` — Intersection Observer animations, feature tabs, testimonials slider
  - `src/style.css` — Minimal custom styles complementing Webflow CSS
  - `TODO.md` — Detailed task list with line-by-line reference to REFERENCE.html
- **What to judge:**
  - Clean separation between Webflow CSS (CDN) and custom styles
  - Vanilla TypeScript interactions without framework overhead
  - Implementation approach documented in TODO.md
- **Tests:** No automated tests found in repo.

---

## Usage (Quick start)

### Prereqs

- Node.js (any recent LTS version)
- npm (lockfile: `package-lock.json`)

### Install

```bash
cd marketing
npm install
```

### Configure

No environment variables required.

### Run

```bash
npm run dev
```

Opens at `http://localhost:5173` with auto-open enabled.

### Build

```bash
npm run build
```

Output to `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

---

## Repo Layout

```
marketing/
├── index.html              # Main landing page (~2000 lines)
├── REFERENCE.html          # Webflow export — source of truth for structure
├── index-old.html          # Previous version (backup)
├── src/
│   ├── main.ts             # Animations, tabs accordion, slider, menu toggle
│   └── style.css           # Custom styles (fade-up, accordion, slider)
├── dist/                   # Production build output
│   ├── index.html
│   └── assets/
├── public/                 # Static assets (empty)
├── TODO.md                 # Implementation task checklist
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript config
└── package.json
```

---

## Tech Stack

| Tech | Role | Evidence |
|------|------|----------|
| **Vite 5.4.8** | Build tool, dev server | `package.json`, `vite.config.ts` |
| **TypeScript** | Type-safe interactions | `tsconfig.json`, `src/main.ts` |
| **Webflow CSS (CDN)** | Primary styling | `index.html` stylesheet link |
| **Vanilla JS** | DOM interactions | `src/main.ts` — no framework |

---

## System Context

### Provides

- Public marketing landing page
- Product positioning and feature explanations
- CTAs linking to cloud app and demo booking

### Depends on

- **Webflow CSS CDN** — External stylesheet at `cdn.prod.website-files.com`
- **External media** — Video hosted on R2, SVG icons from Webflow CDN

### Interfaces

- Links to cloud app: `https://cloud.tensorlake.ai/`
- Links to docs: `https://docs.tensorlake.ai/`
- Links to demo booking: Calendly

---

## Key Concepts

### 1. Webflow CSS Integration

Styling is handled by an external Webflow-generated stylesheet. Custom CSS is minimal and only adds functional styles.

- **What it does:** All visual styling comes from CDN; local CSS handles only animations and interactive states
- **Why it exists:** Enables designers to update styles in Webflow without code changes
- **Evidence:** `index.html` (line 25-26), `src/style.css` comment header

### 2. Intersection Observer Animations

Scroll-triggered fade-up animations using the Intersection Observer API.

- **What it does:** Elements with `.fade-up` class animate in when they enter the viewport
- **Why it exists:** Adds polish without heavy animation library
- **Evidence:** `src/main.ts` (lines 3-23), `src/style.css` (lines 6-16)

### 3. Feature Tabs Accordion

Interactive accordion for product feature sections with animated expand/collapse.

- **What it does:** Clicking a tab expands its content and shows the corresponding image; others collapse
- **Why it exists:** Compact presentation of multiple features without page scroll
- **Evidence:** `src/main.ts` (lines 25-72), `src/style.css` (lines 18-44)

### 4. Reference-Driven Implementation

`REFERENCE.html` serves as the canonical source for HTML structure and class names.

- **What it does:** Provides exact Webflow export to replicate pixel-perfect
- **Why it exists:** Maintains consistency with design specifications
- **Evidence:** `TODO.md` (lines 5-7), `REFERENCE.html`

---

## Tests

No automated tests found in repo.

**Available validation commands:**

```bash
# Type check via build
npm run build
```

---

## Future Work

1. **Add Visual Regression Tests**
   - Why: No test coverage; CSS changes could break layout
   - Where: `tests/` with Playwright screenshots

2. **Extract Reusable Components**
   - Why: 2000+ line HTML file is hard to maintain; repeated patterns could be templated
   - Where: Consider templating system or partial includes

3. **Implement Newsletter Form Submission**
   - Why: Form exists but no backend integration
   - Where: `src/main.ts`, connect to email service API

4. **Add Performance Optimizations**
   - Why: External CSS CDN is a blocking resource; video could be lazy-loaded
   - Where: `index.html` — consider preload hints, lazy video loading

5. **Remove index-old.html**
   - Why: Appears to be backup; adds confusion
   - Where: Delete after confirming not needed
