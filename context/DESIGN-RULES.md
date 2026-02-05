# B-Plex Design Rules

## DO / DON'T Guidelines

These rules ensure consistent implementation of the Swiss-modernist technical blueprint style across all components and screens.

---

## Colors

### DO
- Use the defined color palette exclusively
- Apply accent color sparingly for primary actions and key highlights only
- Use muted colors for secondary information
- Maintain high contrast for readability (4.5:1 minimum)

### DON'T
- Use gradients anywhere
- Add color variations outside the palette
- Use bright/neon colors
- Apply accent color to large surface areas
- Use color as the only indicator (always pair with another visual cue)

```css
/* DO */
.button-primary {
  background: rgb(var(--primary));
}

/* DON'T */
.button-primary {
  background: linear-gradient(135deg, #00ff00, #00ffff);
}
```

---

## Typography

### DO
- Use geometric sans for UI and headings
- Use monospace for code, IDs, logs, and technical labels
- Apply strong hierarchy: large headlines, compact body, tiny uppercase labels
- Use negative letter-spacing on headlines (-0.02em)
- Use wide tracking on labels (0.1em)

### DON'T
- Use decorative or script fonts
- Mix more than 2 font families
- Use italic for emphasis (use weight instead)
- Make body text larger than 16px
- Use sentence case for labels (use uppercase)

```css
/* DO */
.label {
  text-transform: uppercase;
  letter-spacing: 0.1em;
  font-family: monospace;
  font-size: 12px;
}

/* DON'T */
.label {
  font-style: italic;
  font-size: 18px;
  text-transform: capitalize;
}
```

---

## Borders & Corners

### DO
- Use 1px hairline borders
- Keep all corners squared (0px radius)
- Use borders for structure and separation
- Apply consistent border color from the palette

### DON'T
- Use rounded corners (no border-radius)
- Use thick borders (>1px)
- Use dashed or dotted borders
- Use colored borders (except accent for focus states)

```css
/* DO */
.card {
  border: 1px solid rgb(var(--border));
  border-radius: 0;
}

/* DON'T */
.card {
  border: 2px dashed #ccc;
  border-radius: 16px;
}
```

---

## Shadows

### DO
- Use flat design with no shadows
- Rely on borders and spacing for depth
- Use subtle background color changes for elevation

### DON'T
- Add box-shadow to any element
- Use drop-shadow filters
- Create 3D effects
- Use inner shadows

```css
/* DO */
.button {
  border: 1px solid rgb(var(--border));
}

/* DON'T */
.button {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

---

## Spacing

### DO
- Use the 8px base unit consistently
- Stick to the spacing scale: 8 / 16 / 24 / 32 / 48px
- Leave generous negative space
- Align elements to the grid

### DON'T
- Use arbitrary spacing values (e.g., 13px, 27px)
- Crowd elements together
- Use inconsistent gaps within the same component
- Break the grid alignment

```css
/* DO */
.container {
  padding: 24px;
  gap: 16px;
}

/* DON'T */
.container {
  padding: 18px;
  gap: 11px;
}
```

---

## Icons & Illustrations

### DO
- Use simple, geometric line icons
- Keep icons monochrome
- Size icons consistently (16px, 20px, 24px)
- Use icons as functional indicators only

### DON'T
- Use colorful or illustrated icons
- Use playful or cartoon-style graphics
- Add icon animations (except subtle state changes)
- Mix icon styles from different sets

---

## Layout

### DO
- Use strict grid layouts
- Maintain one dominant focal element per view
- Left-align content blocks
- Use two-column layouts for "copy + diagram" sections
- Center only page-level headings

### DON'T
- Create asymmetrical or chaotic layouts
- Scatter elements randomly
- Center all content
- Use masonry or Pinterest-style layouts
- Overlap elements decoratively

---

## Components

### Buttons

```css
/* DO */
.btn-primary {
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  border: none;
  border-radius: 0;
  padding: 8px 16px;
}

.btn-secondary {
  background: transparent;
  color: rgb(var(--foreground));
  border: 1px solid rgb(var(--border));
}

/* DON'T */
.btn-primary {
  background: linear-gradient(to right, #4CAF50, #8BC34A);
  border-radius: 50px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
```

### Cards

```css
/* DO */
.card {
  background: rgb(var(--card));
  border: 1px solid rgb(var(--border));
  padding: 24px;
}

/* DON'T */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
```

### Inputs

```css
/* DO */
.input {
  background: transparent;
  border: 1px solid rgb(var(--input));
  padding: 8px 12px;
  height: 36px;
}

/* DON'T */
.input {
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}
```

---

## States

### Focus

```css
/* DO */
.element:focus {
  outline: none;
  ring: 1px solid rgb(var(--ring));
}

/* DON'T */
.element:focus {
  outline: 3px dashed blue;
  box-shadow: 0 0 10px rgba(0, 0, 255, 0.5);
}
```

### Hover

```css
/* DO */
.element:hover {
  background: rgb(var(--accent) / 0.1);
}

/* DON'T */
.element:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}
```

### Active/Selected

```css
/* DO */
.element.active {
  background: rgb(var(--accent));
  color: rgb(var(--accent-foreground));
}

/* DON'T */
.element.active {
  border: 3px solid #00ff00;
  background: rgba(0, 255, 0, 0.3);
}
```

---

## Animation

### DO
- Keep animations under 200ms
- Use `ease-out` for entrances
- Animate opacity and transform only
- Respect `prefers-reduced-motion`

### DON'T
- Use bounce or elastic easing
- Animate colors or backgrounds
- Use animations longer than 300ms
- Add decorative animations

```css
/* DO */
.element {
  transition: opacity 150ms ease-out, transform 150ms ease-out;
}

/* DON'T */
.element {
  transition: all 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
  animation: bounce 1s infinite;
}
```

---

## Dark Mode

### DO
- Use true black (#040404) for backgrounds
- Maintain the same accent color in both modes
- Ensure sufficient contrast in dark mode
- Test all components in both modes

### DON'T
- Use different accent colors per mode
- Invert all colors mechanically
- Reduce contrast in dark mode
- Use pure white text on pure black

---

## Responsive Design

### DO
- Design mobile-first
- Use breakpoints at 640px, 768px, 1024px, 1280px
- Maintain the 8px grid at all sizes
- Simplify layouts for smaller screens

### DON'T
- Hide critical content on mobile
- Use fixed pixel widths for containers
- Break the grid on smaller screens
- Use different design languages per breakpoint

---

## Quick Reference

| Element | Border Radius | Shadow | Border |
|---------|--------------|--------|--------|
| Button | 0 | None | Outline variant only |
| Card | 0 | None | 1px solid |
| Input | 0 | None | 1px solid |
| Dialog | 0 | None | 1px solid |
| Dropdown | 0 | None | 1px solid |
| Tooltip | 0 | None | 1px solid |
| Tab | 0 | None | Active: 1px solid |
| Badge | 0 | None | 1px solid |

---

## Checklist Before Shipping

- [ ] All corners are squared (0px radius)
- [ ] No shadows on any element
- [ ] Using defined color palette only
- [ ] Spacing follows 8px grid
- [ ] Typography hierarchy is clear
- [ ] Labels are uppercase with wide tracking
- [ ] Focus states are visible
- [ ] Tested in both light and dark mode
- [ ] Animations are subtle and fast
- [ ] One focal element per view
