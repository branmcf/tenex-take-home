# Component Specifications

## Screen-by-Screen Design Specifications

This document provides detailed specifications for each screen in the HardWire application.

---

## 1. Main Chat Interface

### Layout
```
+------------------+----------------------------------------+
| SIDEBAR          | CHAT AREA                              |
| 16rem (256px)    | Flexible                               |
+------------------+----------------------------------------+
```

### Grid
- Sidebar: Fixed 256px width
- Chat content: max-width 768px, centered
- Vertical spacing: 32px between messages

### Typography
| Element | Size | Weight | Color |
|---------|------|--------|-------|
| Welcome heading | 36px | Bold | `--foreground` |
| Welcome subtitle | 12px | Regular | `--muted-foreground` |
| User message | 14px | Regular | `--primary-foreground` |
| Assistant message | 14px | Regular | `--foreground` |
| Timestamp | 12px | Mono | `--muted-foreground` |

### Colors
- User message bubble: `--primary`
- Assistant message: No background
- Input area: `--background` with 1px `--border`

### Spacing
- Message vertical gap: 32px
- Input padding: 16px
- Content horizontal padding: 16px

### Component Variants
- Send button: Icon, Primary variant
- Copy button: Icon, Ghost variant
- Model selector: Outline select
- Workflow selector: Outline select

---

## 2. Login Page

### Layout
```
+------------------------+------------------------+
| FORM COLUMN            | IMAGE COLUMN           |
| 50%                    | 50% (hidden on mobile) |
+------------------------+------------------------+
```

### Grid
- Two equal columns on desktop
- Single column on mobile (< 1024px)
- Form max-width: 384px
- Padding: 64px (desktop), 32px (mobile)

### Typography
| Element | Size | Weight | Tracking | Transform |
|---------|------|--------|----------|-----------|
| Page title | 30px | Bold | -0.02em | None |
| Subtitle | 12px | Regular | 0.1em | Uppercase |
| Labels | 14px | Medium | Normal | None |
| Input placeholder | 14px | Regular | Normal | None |
| Helper text | 12px | Mono | Normal | None |

### Colors
- Logo icon: `--primary` bg, `--primary-foreground` text
- Form background: `--background`
- Image overlay: `--muted` with grid pattern
- Links: `--foreground` with underline

### Spacing
- Logo to title: 32px
- Title to form: 24px
- Form fields gap: 24px
- Button margin-top: 24px

### Component Variants
- Login button: Full-width, Primary
- Google button: Full-width, Outline
- Form inputs: Default size

---

## 3. Sign Up Page

### Layout
Same as Login page

### Grid
Same as Login page

### Typography
Same as Login page with:
| Element | Size | Weight | Tracking | Transform |
|---------|------|--------|----------|-----------|
| Password hint | 12px | Regular | Normal | None |

### Spacing
- Additional fields follow same 24px gap
- Hint text margin-top: 8px

---

## 4. Email Verification Page

### Layout
```
+--------------------------------------------------+
| HEADER (Logo)                                     |
+--------------------------------------------------+
| CENTERED CONTENT                                  |
| max-width: 448px                                  |
+--------------------------------------------------+
```

### Grid
- Single centered column
- Content max-width: 448px
- Padding: 64px (desktop), 32px (mobile)

### Typography
| Element | Size | Weight | Tracking |
|---------|------|--------|----------|
| Heading | 30px | Bold | -0.02em |
| Body text | 14px | Regular | Normal |
| Helper text | 12px | Mono | Normal |

### Colors
- Icon container: `--muted` bg
- Icon: `--muted-foreground`
- Divider: 1px `--border`

### Spacing
- Icon to heading: 32px
- Heading to body: 12px
- Body to helper: 24px
- Helper to link: 24px

---

## 5. Sidebar

### Layout
```
+------------------+
| LOGO             | h: 48px
+------------------+
| NAV BUTTONS      | h: auto
+------------------+
| CHAT LIST        | h: flex-1
+------------------+
| USER FOOTER      | h: 56px
+------------------+
```

### Grid
- Fixed width: 256px (expanded), 48px (collapsed)
- Internal padding: 8px
- Item padding: 8px 12px

### Typography
| Element | Size | Weight | Transform |
|---------|------|--------|-----------|
| Logo text | 18px | Semibold | None |
| Nav label | 14px | Medium | None |
| Chat title | 14px | Regular | None |
| Section header | 12px | Medium | Uppercase |
| User name | 14px | Medium | None |

### Colors
- Background: `--sidebar-background`
- Active item: `--sidebar-accent`
- Hover item: `--sidebar-accent` at 50% opacity
- Border right: 1px `--sidebar-border`

### Spacing
- Logo padding: 16px
- Nav items gap: 4px
- Chat list gap: 4px
- Section header margin: 16px top, 8px bottom

---

## 6. Settings Modal

### Layout
```
+------------------------------------------+
| HEADER: Settings                   [X]   |
+------------------------------------------+
| TABS: Account | Usage                    |
+------------------------------------------+
| TAB CONTENT                              |
|                                          |
+------------------------------------------+
```

### Grid
- Modal width: max-width 512px
- Padding: 24px
- Tab content padding: 24px

### Typography
| Element | Size | Weight |
|---------|------|--------|
| Modal title | 18px | Semibold |
| Tab label | 14px | Medium |
| Form label | 14px | Medium |
| Input text | 14px | Regular |

### Spacing
- Header to tabs: 24px
- Tabs to content: 24px
- Form fields gap: 16px

---

## 7. Search Modal

### Layout
```
+------------------------------------------+
| SEARCH INPUT                       [X]   |
+------------------------------------------+
| SECTION: Recent                          |
+------------------------------------------+
| RESULT ITEM                              |
| RESULT ITEM                              |
+------------------------------------------+
| SECTION: Previous 7 Days                 |
+------------------------------------------+
| RESULT ITEM                              |
+------------------------------------------+
```

### Grid
- Modal width: max-width 512px
- Result item padding: 12px 16px

### Typography
| Element | Size | Weight | Transform |
|---------|------|--------|-----------|
| Section header | 12px | Medium | Uppercase |
| Result title | 14px | Medium | None |
| Result snippet | 12px | Regular | None |
| Result date | 12px | Mono | None |

### Colors
- Active result: `--accent` at 10% opacity
- Keyboard hint: `--muted-foreground`

### Spacing
- Input to results: 16px
- Section header margin: 8px
- Result items gap: 0 (dividers instead)

---

## Common Component Sizes

### Buttons
| Size | Height | Horizontal Padding |
|------|--------|--------------------|
| sm | 32px | 12px |
| default | 36px | 16px |
| lg | 40px | 32px |
| icon | 36x36px | 0 |

### Inputs
| Size | Height |
|------|--------|
| default | 36px |

### Dialogs
| Type | Width |
|------|-------|
| Small | 384px |
| Default | 512px |
| Large | 640px |

### Spacing Scale
| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
