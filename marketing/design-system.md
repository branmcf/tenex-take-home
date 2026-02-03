# Marketing Design System

This system is aligned to the Tensorlake reference in `marketing/REFERENCE.html` with a focus on precise typography, structured grids, and minimal high contrast surfaces. No gradients are permitted. No em dashes are permitted.

## 1. Principles
- Technical clarity over decoration
- Strong hierarchy with restrained motion
- Grids, linework, and mono accents
- High contrast with disciplined color use
- Consistent spacing and corner treatment

## 2. Color
Core tokens are solid fills only.

### 2.1 Base
- `--color-black` `#0b0b0b`
- `--color-white` `#ffffff`
- `--color-gray-950` `#0b0b0b`
- `--color-gray-900` `#171717`
- `--color-gray-800` `#262626`
- `--color-gray-700` `#3f3f3f`
- `--color-gray-600` `#5c5c5c`
- `--color-gray-500` `#737373`
- `--color-gray-400` `#a3a3a3`
- `--color-gray-300` `#d4d4d4`
- `--color-gray-200` `#e5e5e5`
- `--color-gray-100` `#f5f5f5`

### 2.2 Accent
- `--color-green-1` `#82c38c`
- `--color-green-2` `#0aa67d`
- `--color-green-3` `#1f8f72`
- `--color-blue-focus` `#4d65ff`
- `--color-warning` `#f97316`
- `--color-danger` `#ef4444`

### 2.3 Semantic Tokens
- `--color-bg` `#ffffff`
- `--color-fg` `#0b0b0b`
- `--color-muted` `#6b6b6b`
- `--color-border` `#e5e5e5`

## 3. Typography
Typeface is `Noto Sans` for UI and `JetBrains Mono` for code and labels.

### 3.1 Type Scale
- Display 1: 64px, 700, tracking -0.02, line height 1.05
- Display 2: 48px, 700, tracking -0.02, line height 1.1
- H1: 36px, 700, tracking -0.02, line height 1.2
- H2: 28px, 600, tracking -0.01, line height 1.25
- H3: 22px, 600, line height 1.3
- H4: 18px, 600, line height 1.35
- Body L: 18px, 400, line height 1.6
- Body M: 16px, 400, line height 1.6
- Body S: 14px, 400, line height 1.55
- Label: 12px, 600, uppercase, letter spacing 0.08em
- Code: 13 to 14px, 500, line height 1.6

### 3.2 Text Rules
- Headlines use text balance when possible
- Labels use uppercase and mono styling
- No em dashes in content

## 4. Spacing
Base unit is 4px. Preferred steps are 8 and 16.

### 4.1 Scale
- `xs` 4
- `sm` 8
- `md` 16
- `lg` 24
- `xl` 32
- `2xl` 48
- `3xl` 64
- `4xl` 96
- `5xl` 128

### 4.2 Layout
- Standard max width 1200
- Hero max width 1440
- Page padding 24 mobile, 48 tablet, 72 desktop

## 5. Lines, Grids, and Patterns
All texture is line based and image based.

### 5.1 Grid
- Use SVG line grids as backgrounds
- Use SVG dot patterns as backgrounds
- Use 1px strokes only

### 5.2 Dividers
- Use 1px solid borders
- Use dotted SVG line assets where needed

## 6. Borders, Radius, and Elevation
- Default radius is 0
- Media and code blocks can use 8px radius
- Use `shadow-soft` for floating overlays

## 7. Motion
Motion is precise and linear.

### 7.1 Timing
- Fast 150ms
- Medium 250ms
- Slow 400ms

### 7.2 Easing
- `cubic-bezier(0.215, 0.61, 0.355, 1)`

### 7.3 Allowed Motions
- Opacity fades
- Horizontal and vertical line loops
- No scale bounce or overshoot

## 8. Components

### 8.0 Layout Primitives
- `section-dark`: default page surface (white background, near-black text).
- `section-light`: secondary surface (warm light gray background).
- `section-grid`: adds a subtle SVG line grid background (no gradients).
- `hero-grid-overlay blueprint-grid`: hero-only grid overlay.
- `dotted-divider`: dotted rule divider (SVG pattern).
- `big-divider`: full-width hairline divider.

### 8.1 Buttons
- Implementation: `.button`, `.button-text`, `.button-arrow`
- Configuration: `data-text-color`, `data-border-color`, `data-arrow-color`
  - Values used: `green 1`, `green 2`, `green 3`, `black`, `white`, `dark gray`, `light gray`
- Primary pattern (green outline, tinted background): `data-text-color="green 1" data-border-color="green 1" data-arrow-color="green 1"`
- Primary hover: solid green fill with white text and arrow
- Secondary pattern (dark outline): `data-text-color="dark gray" data-border-color="dark gray"`
- White on dark surfaces: `data-text-color="white" data-border-color="white"`
- Sizing: 40px height by default, uppercase label, tracked letter spacing

### 8.2 Navigation
- Layout: `.nav_component`, `.nav-container`, `.nav-left`, `.nav-brand`
- Dropdown: `.dropdown`, `.nav-dropdown`, `.nav-dropdown-item`, `.green-square`
- Mobile: `.menu-button` toggles `.mobile-menu`

### 8.3 Inputs
- Solid background and 1px border
- Focus ring uses `--color-blue-focus` or `--color-green-2`
- Placeholder uses muted color

### 8.4 Cards
- White or black background depending on section
- 1px border, no heavy shadows

### 8.5 Tabs
- Outline and text emphasis only
- Active tab uses border and background shift

### 8.6 Tooltips
- Solid background, small radius, no gradients

### 8.7 Code Blocks
- Black background, light text
- Title label in top left
- Copy button in top right

### 8.8 Lines and Loops
- Logos scroll: `.logo-row` with `logo-scroll` keyframes
- CTA line loop: `.cta-lines-row` with `cta-lines-loop` keyframes
- Footer line loop: `.footer-loop-row` with `footer-lines-loop` keyframes

### 8.9 Navigation and Footer
- Minimal surfaces with line separators
- Active states use muted background and bold text

## 9. Accessibility
- Contrast ratio at least 4.5 to 1
- Focus ring always visible
- Reduce motion respects user preference

## 10. Content Tone
- Short, precise sentences
- Avoid buzzwords where possible
- No em dashes
