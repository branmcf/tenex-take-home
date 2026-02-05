# README Section Prompts (God-tier, Take-home Optimized)

Use these prompts with an LLM that can **read the repo filesystem** (and run ripgrep/search).  
Each prompt outputs **only the section content** in Markdown under the specified heading.

## Global Rules (apply to every prompt)
- Use **only evidence in this repo** (code, configs, comments, scripts). If unknown, say **“Not found in repo.”**
- **No hallucination.** Every command must exist in `package.json`/Makefile/scripts. Every path must exist.
- Prefer **concrete file paths** over vague descriptions.
- Keep sections **tight and scannable**. No marketing fluff.
- If this repo is part of a larger system, describe only what this repo proves and what it assumes.

---

## Overview → summary of what the codebase is

**Prompt**
> You are writing the `## Overview` section of this repository’s README for a take-home reviewer.
>
> Crawl the repo and infer what this repo is responsible for.
>
> Output requirements:
> - 2–4 sentences max describing: what it is, what it enables, and what it does *not* do.
> - Then 3–6 bullets:
>   - responsibilities (concrete)
>   - explicit non-goals/boundaries (1–2 bullets)
>
> Constraints:
> - Use only evidence from the repo. If something isn’t supported, write: “Not found in repo.”
> - Mention the primary runtime/framework and the main entry point file(s) if discoverable.
>
> Output only Markdown under `## Overview`.

---

## Reviewer Notes → fastest path to evaluate the code

**Prompt**
> You are writing the `## Reviewer Notes` section.
>
> Goal: make a busy reviewer successful in 60–120 seconds.
>
> Steps:
> 1) Identify repo type from evidence (`package.json`, `vite.config.*`, `next.config.*`, `mkdocs.yml`, `main.tf`, etc.).
> 2) Extract the exact run commands from scripts (no invented commands).
> 3) Identify 3–6 “evidence locations” (file paths) that best demonstrate architecture and engineering judgment in *this* repo.
>
> Output format (8–12 bullets total, no paragraphs):
> - **Run:** `<copy/paste command>`
> - **What to look at first:** `path` — one-line why
> - **What to judge:** 2–4 bullets describing the most important things a reviewer should notice (state boundaries, error handling, component architecture, etc.)
>
> Constraints:
> - Every command must exist in repo scripts.
> - Every file path must exist.
> - If something is missing (tests, mocks, docs), say “Not found in repo.”
>
> Output only Markdown under `## Reviewer Notes`.

---

## Usage (Quick start) → prereqs + install/setup + run locally

**Prompt**
> You are writing the `## Usage (Quick start)` section.
>
> Goal: reviewer can run locally in under 10 minutes.
>
> Tasks:
> 1) Identify prerequisites from repo evidence: `.nvmrc`, `package.json engines`, `tool-versions`, Dockerfiles, etc.
> 2) Determine package manager from lockfile(s) and scripts (pnpm/yarn/npm/bun).
> 3) Extract install + dev/run commands from scripts (exact).
> 4) Identify required env vars and config:
>    - list only vars in `.env.example` / docs / or referenced in code.
>    - if none, say “No env vars required to boot (per repo evidence).”
>
> Output structure:
> - **Prereqs**
> - **Install**
> - **Configure** (env vars, if any)
> - **Run**
>
> Constraints:
> - Do not invent ports/URLs. Use what’s in config or code; otherwise omit.
> - Do not invent env vars.
>
> Output only Markdown under `## Usage (Quick start)`.

---

## Repo Layout → tree + descriptions

**Prompt**
> You are writing the `## Repo Layout` section.
>
> Requirements:
> - Generate an accurate tree view (depth 2–3).
> - Annotate only meaningful directories/files for navigation value.
> - If the tree is long, keep depth 2 and add a note indicating where deeper details live.
>
> Output format:
> - A short intro sentence (1 line max)
> - Then a tree in a code block, with inline comments/descriptions (short).
>
> Constraints:
> - Do not include paths that do not exist.
> - Do not enumerate every file; focus on readability.
>
> Output only Markdown under `## Repo Layout`.

---

## Tech Stack → technologies used and why

**Prompt**
> You are writing the `## Tech Stack` section.
>
> Tasks:
> 1) Extract primary language/framework/build tool from `package.json`, configs, imports.
> 2) Identify architectural libraries that matter (routing, state/query, auth, UI system, testing, formatting, etc.).
> 3) For each item, write:
>    - **Tech** — Role in this repo — Evidence (file path) — Why (only if repo supports it)
>
> Constraints:
> - 6–12 bullets max.
> - “Why” must be supported by evidence (config choices, code patterns, docs). If not supported, write: “Why: not documented in repo.”
> - Avoid generic filler like “TypeScript for type safety” unless strictness/tooling is clearly configured and used.
>
> Output only Markdown under `## Tech Stack`.

---

## System Context → where it fits in the broader system

**Prompt**
> You are writing the `## System Context` section.
>
> Tasks:
> 1) Find references to external systems: env vars, API base URLs, docs links, CI pipelines, shared packages, workspace config.
> 2) Summarize what this repo **provides**, what it **depends on**, and how it interfaces with other components.
>
> Output structure:
> - **Provides**
> - **Depends on**
> - **Interfaces** (only if proven by repo evidence; otherwise “Not found in repo.”)
>
> Constraints:
> - No guessing about other repos or architecture unless explicitly referenced.
> - If this repo is intentionally standalone, say so.
>
> Output only Markdown under `## System Context`.

---

## Key Concepts → what the reviewer should know about the code

**Prompt**
> You are writing the `## Key Concepts` section.
>
> Goal: surface 3–6 non-obvious concepts/decisions that demonstrate engineering judgment.
>
> Process:
> 1) Identify seams and patterns: folder architecture, state boundaries, error handling strategy, async patterns, component composition, accessibility approach, performance constraints, etc.
> 2) Select 3–6 items that are clearly visible in the codebase.
>
> For each concept, output:
> - **Concept/Decision**
> - **What it does**
> - **Why it exists** (if supported; else “Why: not documented in repo.”)
> - **Evidence:** list 1–3 file paths
>
> Constraints:
> - No more than 6 concepts.
> - Every item must cite file paths that exist.
> - Avoid “we could do X” (that belongs in Future Work).
>
> Output only Markdown under `## Key Concepts`.

---

## Tests → how to run tests (if applicable)

**Prompt**
> You are writing the `## Tests` section.
>
> Tasks:
> 1) Extract exact test commands from `package.json` scripts / Makefile / task runner.
> 2) Identify test tooling (Vitest/Jest/Playwright/Cypress/etc.) from deps/config.
> 3) Provide copy/paste commands grouped by:
>    - Unit
>    - Integration
>    - E2E
>    - Lint / Typecheck (if present)
>
> Constraints:
> - Only include commands that exist.
> - If there are no tests, write:
>   - “No automated tests found in repo.” and then list the best available validation commands (typecheck/lint) if they exist.
>
> Output only Markdown under `## Tests`.

---

## Future Work → what you’d add next and why

**Prompt**
> You are writing the `## Future Work` section.
>
> Goal: propose the next 3–6 highest-leverage improvements grounded in the current repo.
>
> Steps:
> 1) Identify gaps from evidence: TODO/FIXME, stubbed code, missing states, missing tests, hard-coded values, known limitations described in docs.
> 2) Propose 3–6 next steps, prioritized.
>
> For each item, include:
> - **Next step**
> - **Why it matters**
> - **Where it would land** (file/folder path)
>
> Constraints:
> - No rewrites unless the repo clearly forces it.
> - No speculative features unrelated to repo scope.
> - Keep it short and defensible.
>
> Output only Markdown under `## Future Work`.
