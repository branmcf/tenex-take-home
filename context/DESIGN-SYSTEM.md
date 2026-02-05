# HardWire Design System

## Swiss-Modernist Technical Blueprint

A strict, grid-aligned design language for developer infrastructure products. Emphasizes precision, clarity, and engineered minimalism.

---

## Visual DNA

### Color System

#### Light Mode (Spec Sheet Aesthetic)
| Token | RGB Value | Hex | Usage |
|-------|-----------|-----|-------|
| `--background` | 236 235 235 | `#ECEBEB` | Page canvas |
| `--foreground` | 20 20 20 | `#141414` | Primary text |
| `--card` | 255 255 255 | `#FFFFFF` | Card surfaces |
| `--primary` | 45 98 37 | `#2D6225` | Primary actions |
| `--secondary` | 157 154 151 | `#9D9A97` | Secondary elements |
| `--muted` | 186 186 186 | `#BABABA` | Muted elements |
| `--accent` | 94 208 74 | `#5ED04A` | Highlights (sparingly) |
| `--destructive` | 148 104 100 | `#946864` | Error states |
| `--border` | 186 186 186 | `#BABABA` | Borders |

#### Dark Mode (Blueprint Aesthetic)
| Token | RGB Value | Hex | Usage |
|-------|-----------|-----|-------|
| `--background` | 4 4 4 | `#040404` | Page canvas |
| `--foreground` | 236 235 235 | `#ECEBEB` | Primary text |
| `--card` | 20 20 20 | `#141414` | Card surfaces |
| `--primary` | 59 61 58 | `#3B3D3A` | Primary actions |
| `--secondary` | 57 95 75 | `#395F4B` | Secondary elements |
| `--muted` | 32 61 48 | `#203D30` | Muted elements |
| `--accent` | 94 208 74 | `#5ED04A` | Highlights (sparingly) |
| `--destructive` | 162 117 116 | `#A27574` | Error states |
| `--border` | 76 76 76 | `#4C4C4C` | Borders |

### Grid System

- **Base unit**: 8px
- **Spacing scale**: 8 / 16 / 24 / 32 / 48px
- **Grid overlay**: Coordinate grid pattern for technical aesthetic
- **Canvas**: Off-white (light) or near-black charcoal (dark)

---

## Typography

### Font Stack
```css
/* Primary - Geometric sans */
font-family: "Noto Sans", "Inter", system-ui, sans-serif;

/* Monospace - Technical content */
font-family: "JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace;
```

### Type Scale
| Style | Size | Weight | Letter Spacing | Usage |
|-------|------|--------|----------------|-------|
| H1 | 36px (text-4xl) | Bold | -0.02em | Page titles |
| H2 | 24px (text-2xl) | Semibold | -0.01em | Section headers |
| H3 | 18px (text-lg) | Semibold | Normal | Card titles |
| H4 | 16px (text-base) | Medium | Normal | Subsections |
| Body | 14px (text-sm) | Regular | Normal | Content |
| Label | 12px (text-xs) | Medium | 0.1em | Uppercase labels |
| Caption | 12px (text-xs) | Regular | Normal | Helper text |

### Label Styling
```css
/* Technical metadata labels */
.label-mono {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: monospace;
  font-size: 12px;
}
```

---

## Component Specifications

### Buttons

| Variant | Background | Border | Text Color |
|---------|------------|--------|------------|
| Primary | `--primary` | None | `--primary-foreground` |
| Secondary | `--secondary` | None | `--secondary-foreground` |
| Outline | Transparent | 1px `--border` | `--foreground` |
| Ghost | Transparent | None | `--foreground` |
| Accent | `--accent` | None | `--accent-foreground` |

**Sizing:**
- Default: h-9 (36px), px-4
- Small: h-8 (32px), px-3
- Large: h-10 (40px), px-8
- Icon: h-9 w-9 (36x36px)

**States:**
- Hover: Opacity 90%
- Focus: 1px ring
- Disabled: Opacity 50%

### Cards

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  /* NO shadow */
  /* NO border-radius */
}
```

### Inputs

```css
.input {
  height: 36px;
  padding: 4px 12px;
  border: 1px solid var(--input);
  background: transparent;
  /* NO shadow */
  /* NO border-radius */
}

.input:focus {
  ring: 1px var(--ring);
}
```

### Dialogs

```css
.dialog-content {
  border: 1px solid var(--border);
  background: var(--background);
  padding: 24px;
  /* NO shadow */
  /* NO border-radius */
}
```

---

## Layout Rules

### Grid Alignment
- All elements snap to 8px grid
- Consistent gutters: 16px (mobile), 24px (tablet), 32px (desktop)
- Maximum content width: 768px for readable content

### Spacing
| Token | Value | Usage |
|-------|-------|-------|
| `space-8` | 8px | Tight spacing |
| `space-16` | 16px | Default spacing |
| `space-24` | 24px | Section padding |
| `space-32` | 32px | Large gaps |
| `space-48` | 48px | Section separators |

### Page Structure
```
+---------------------------------------------------+
| HEADER (Logo + Nav)                               |
+-------------------+-------------------------------+
| SIDEBAR           | MAIN CONTENT                  |
| (16rem fixed)     | (Flexible, max-width 768px)   |
|                   |                               |
|                   | +---------------------------+ |
|                   | | PRIMARY FOCAL ELEMENT     | |
|                   | +---------------------------+ |
|                   |                               |
|                   | Supporting content...         |
+-------------------+-------------------------------+
| FOOTER                                            |
+---------------------------------------------------+
```

---

## Blueprint Motifs

### Corner Brackets
Use for focus states and key interactive elements:
```css
.corner-brackets::before,
.corner-brackets::after {
  width: 12px;
  height: 12px;
  border-color: var(--accent);
}
```

### Crop Marks
Use for document registration and print-inspired layouts:
```css
.crop-marks::before {
  /* 8px marks at each corner */
}
```

### Grid Overlay
```css
.blueprint-grid {
  background-image:
    linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px);
  background-size: 8px 8px;
}
```

---

## Metrics Display

For displaying key statistics and data:

```html
<div class="metric-block">
  <span class="metric-value">1,234</span>
  <span class="metric-label">TOTAL REQUESTS</span>
</div>
```

```css
.metric-value {
  font-size: 36px;
  font-weight: bold;
  font-variant-numeric: tabular-nums;
}

.metric-label {
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: monospace;
  color: var(--muted-foreground);
}
```

---

## Animation Guidelines

- **Duration**: 150-200ms for micro-interactions
- **Easing**: `ease-out` for entrances, `ease-in` for exits
- **Transforms**: Prefer `opacity` and `transform` for performance
- **No bounce**: Avoid playful animations

---

## Accessibility

- Minimum contrast ratio: 4.5:1 for body text
- Focus states: Visible 1px ring in accent color
- Touch targets: Minimum 36x36px
- Reduced motion: Respect `prefers-reduced-motion`
