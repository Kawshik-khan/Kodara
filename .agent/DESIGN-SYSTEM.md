# KODARA DESIGN SYSTEM

## 1. Visual Philosophy & Core Identity

The Kodara visual language communicates **precision, clarity, and deep engineering aesthetics**.

> **White + Orange + Technical Structure.**

It deliberately avoids dark neon "hacker" tropes, generic enterprise purple SaaS gradients, and childish gamified aesthetics. Instead, it feels like a precision engineering instrument: clean white canvases, crisp orange structural outlines, technical typography, and subtle Cartesian coordinate grids.

```text
Visual Identity Matrix:
- Background: Crisp White (#FFFFFF) & Pure Warm Tint (#FAFAFA)
- Primary Accent: Precision Orange (#FF5722 / #F4511E)
- Structural Accent: Subtle Technical Grid in Orange Tint
- Cards & Panels: White surfaces with crisp orange/neutral borders
- Layout Model: Structured Bento Box grids with intentional visual hierarchy
- Shadows: Minimal, crisp or zero-shadow (border-first definition)
- Interaction Feel: Sharp, technical, highly responsive
```

## 2. Design Tokens

All styles are defined as CSS Custom Properties in `index.css`:

```css
:root {
  /* Surfaces */
  --bg-app: #FFFFFF;
  --bg-surface: #FFFFFF;
  --bg-surface-muted: #FBFBFB;
  --bg-surface-subtle: #F5F5F5;
  --bg-overlay: rgba(255, 255, 255, 0.92);

  /* Brand Accents */
  --accent-primary: #FF5722;
  --accent-primary-hover: #E64A19;
  --accent-primary-active: #D84315;
  --accent-soft: rgba(255, 87, 34, 0.08);
  --accent-subtle: rgba(255, 87, 34, 0.04);
  --accent-contrast: #FFFFFF;

  /* Typography & Neutrals */
  --text-primary: #121212;
  --text-secondary: #555555;
  --text-muted: #888888;
  --text-inverse: #FFFFFF;
  --text-brand: #FF5722;

  /* Borders & Rules */
  --border-subtle: #ECECEC;
  --border-default: #E0E0E0;
  --border-brand: #FF5722;
  --border-brand-soft: rgba(255, 87, 34, 0.35);
  --border-brand-subtle: rgba(255, 87, 34, 0.15);

  /* Semantic Status Colors */
  --color-success: #16A34A;
  --color-success-soft: rgba(22, 163, 74, 0.08);
  --color-warning: #D97706;
  --color-warning-soft: rgba(217, 119, 6, 0.08);
  --color-danger: #DC2626;
  --color-danger-soft: rgba(220, 38, 38, 0.08);
  --color-info: #0284C7;
  --color-info-soft: rgba(2, 132, 199, 0.08);

  /* Technical Grid */
  --grid-line-color: rgba(255, 87, 34, 0.06);
  --grid-size: 24px;

  /* Typography */
  --font-sans: 'Noto Sans Bengali', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', 'Roboto Mono', monospace;
  --line-height-body: 1.6;
  --line-height-heading: 1.3;

  /* Radii */
  --radius-xs: 2px;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;

  /* Shadows */
  --shadow-none: none;
  --shadow-subtle: 0 1px 2px rgba(0, 0, 0, 0.04);
  --shadow-elevated: 0 4px 12px rgba(0, 0, 0, 0.05);
}
```

## 3. Technical Grid Background

Kodara surfaces feature a signature, low-contrast orange technical coordinate grid to reinforce engineering precision:

```css
.bg-technical-grid {
  background-color: var(--bg-app);
  background-image:
    linear-gradient(to right, var(--grid-line-color) 1px, transparent 1px),
    linear-gradient(to bottom, var(--grid-line-color) 1px, transparent 1px);
  background-size: var(--grid-size) var(--grid-size);
}
```

### Grid Usage Rules
- **Subtle**: Grid lines must never exceed `rgba(255, 87, 34, 0.08)` in opacity.
- **Readable**: Content cards, text bodies, and interactive code surfaces sit on solid white surfaces (`--bg-surface`) to guarantee high text contrast and zero legibility issues.
- **Purposeful**: Use primarily behind dashboards, hero sections, playground canvases, and visualization backgrounds.

## 4. Bento Grid Layout System

Cards must form structured, logical compositions with explicit information hierarchy. Never present a chaotic sea of uniform cards.

```text
Bento Layout Blueprint:
┌───────────────────────────────────────┬───────────────────────────────┐
│ Continue Learning (Featured Hero)    │ Concept Mastery Summary       │
│                                       │                               │
├───────────────────┬───────────────────┴───────────────────────────────┤
│ Active Challenge  │ Next Recommended Concept                          │
│                   │                                                   │
├───────────────────┴───────────────────┬───────────────────────────────┤
│ Recent Execution Traces               │ Quick Action Workbench        │
└───────────────────────────────────────┴───────────────────────────────┘
```

### Card Architecture
- **Surface**: Solid white (`#FFFFFF`).
- **Border**: Clean 1px border (`var(--border-default)` or `var(--border-brand-subtle)`).
- **Radius**: Medium corner radius (`6px` to `8px`). Never use oversized pill shapes for structural cards.
- **Header**: Compact technical header featuring uppercase small labels (`font-mono`, `text-xs`, `tracking-wider`).

## 5. Technical Button System

Kodara interactions use precision-engineered controls. The primary aesthetic favors **white surfaces with crisp orange outlines**.

```text
Default Kodara Action Button:
┌───────────────────────────────────────┐
│  ▶  Run Trace                         │  (White surface + Orange border + Orange text)
└───────────────────────────────────────┘

High-Emphasis Primary Action:
┌───────────────────────────────────────┐
│  Start Lesson →                       │  (Orange surface + White text)
└───────────────────────────────────────┘
```

### Button Variants
1. **Outline Technical (Default)**:
   - Surface: `#FFFFFF`
   - Border: `1px solid var(--accent-primary)`
   - Text: `var(--accent-primary)`
   - Hover: `background-color: var(--accent-soft)`
2. **Solid Primary (High-Emphasis)**:
   - Surface: `var(--accent-primary)`
   - Border: `1px solid var(--accent-primary)`
   - Text: `#FFFFFF`
   - Hover: `background-color: var(--accent-primary-hover)`
3. **Ghost / Tool Button**:
   - Surface: `transparent`
   - Border: `1px solid transparent`
   - Text: `var(--text-secondary)`
   - Hover: `border-color: var(--border-default); background-color: var(--bg-surface-subtle)`

## 6. Typography & Information Density

- **Headings & Body**: Clean, readable sans-serif using `'Noto Sans Bengali', 'Inter'` with proper glyph shaping and vertical clearance.
- **Line Height**: Minimum `1.6` for body text to allow ample clearance for Bengali matras, ascenders, and descenders.
- **Letter Spacing**: Normal tracking (`letter-spacing: 0`). Never artificially expand letter-spacing on Bangla text as it severs conjunct glyph ligatures.
- **Code & Metadata**: Monospace (`JetBrains Mono`) for all variable names, execution steps, memory addresses, and file paths.
- **Information Density**: High density without visual crowding. Complex views (code, memory, stack, timeline) are presented harmoniously.

## 7. Bilingual Layout & Horizontal Text Expansion

Bangla text occupies **20% to 35% more horizontal width** than equivalent English words.

- **No Fixed-Width Containers**: Never set rigid fixed widths (`width: 120px`) on buttons, badge tags, navigation items, or bento card headers.
- **Flexible Controls**: Use `min-width`, `padding`, `flex-wrap: wrap`, and fluid grid columns (`minmax(280px, 1fr)`).
- **Graceful Wrapping**: Ensure navigation headers, tab bars, and lesson section titles wrap cleanly without clipping or overflowing viewports down to 360px.
- **Visual Parity**: Switching between `বাংলা` and `English` must preserve visual hierarchy, bento proportions, and interaction models without layout shift.
