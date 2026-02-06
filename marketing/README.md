# Hardwire Marketing

<p align="center"> 
    <img 
src="https://github.com/user-attachments/assets/0ed4ecc6-0d7d-462d-9ae1-c5d8155306b2"
        alt="Hardwire" 
        height="70%"
        width="100%">
</p>

## Overview

This directory contains a static marketing/landing site for the HardWire chat platform built using [Vite](https://v3.vitejs.dev/).

This application is hosted at: https://hardwire.branmcf.com.

- **Responsibilities**
  - Marketing page with hero, product features, "testimonials", and CTAs to introduce HardWire
  - A central hub for accessing the HardWire documentation and application
- **Non-goals**
  - No backend integrations — purely static content

**Runtime:** Vite 5.4.8 with TypeScript  
**Entry point:** `index.html`

---

## Reviewer Notes

- **Run:** `npm install && npm run dev`
- **What to look at first:**
  - `src/main.ts` — Intersection Observer animations, feature tabs, testimonials slider
  - `src/style.css` — Minimal custom styles complementing Webflow CSS
  - `TODO.md` — Detailed task list with line-by-line reference to REFERENCE.html
  - `index.html` — Main site implementation
- **What to judge:**
  - Vanilla TypeScript interactions without framework overhead
  - Implementation approach documented in TODO.md
  - Clean separation between Webflow CSS (CDN) and custom styles
- **Tests:**
   - There are no tests for this application

---

## Quick Start

```bash
cd marketing
npm install
npm run dev
```

The marketing site runs at http://localhost:5173.

### Build for Production

```bash
npm run build      # Output goes to dist/
npm run preview    # Preview production build
```

---

## Repo Layout

```
marketing/
├── index.html              # Main landing page (~2000 lines)
├── REFERENCE.html          # Website design reference
├── index-old.html          # Previous version (backup)
├── src/
│   ├── main.ts             # Animations, tabs accordion, slider, menu toggle
│   └── style.css           # Custom styles (fade-up, accordion, slider)
├── dist/                   # Production build output
│   ├── index.html
│   └── assets/
├── public/                 # Static assets
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
| **Webflow CSS (CDN)** | Remote styles | `index.html` stylesheet link |
| **Vanilla JS** | DOM interactions | `src/main.ts` — no framework |

---

## System Context

### Provides

- Public marketing landing page
- Product positioning and feature explanations
- CTAs linking to cloud app and documentation

### Depends on

- **External media** — Stylesheets from the Webflow CDN

### Interfaces

- Links to app: `https://hardwire.branmcf.com/`
- Links to docs: `https://docs-hardwire.branmcf.com/`
- Links to Postgraphile: `https://github.com/graphile/crystal`

---

## Key Concepts

### 1. Webflow CSS Integration

Styling is largely handled by an external Webflow stylesheet. Some custom CSS is used to provide additional styles.

- **What it does:** Most styling comes from a CDN; local CSS handles animations and interactive states
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

There are no tests for this application.

---

## Future Work

1. **Add Visual Regression Tests**
   - Why: No test coverage; CSS changes could break layout
   - Where: `tests/` with Playwright screenshots

2. **Create Reusable Components**
   - Why: The Large HTML file will become hard to maintain; repeated patterns could be templated
   - Where: Consider templating system or partial includes