---
name: ui
description: Design system for all UI in this project. Applies a broadsheet/newspaper-inspired brutalist aesthetic with warm ivory background, serif typography, and blue accent color. Use this skill whenever creating, modifying, or styling HTML templates, pages, components, forms, or any UI. If the task involves views/, templates, CSS, HTML structure, or front-end layout, this skill applies.
---

# Broadsheet UI Design System

University department website (Neurology & Neurosurgery at VNMU). Design language: **broadsheet newspaper** — structured, typographic, utilitarian.

**Scope**: All UI in the project.

## References

| File | Contents |
|------|----------|
| `references/base.css` | Complete reference CSS with all design tokens, typography, layout, and component styles. Use modern CSS (nesting, custom properties). |
| `references/components.md` | HTML patterns for each component with accessibility markup and Nunjucks partial structure. |

## Core Principles

- **Content-first**: Typography and whitespace do the work, not color or decoration
- **Structural honesty**: Borders, rules, and columns are visible organizational tools
- **Restraint**: Accent blue + warm grays. System serif fonts. No shadows, gradients, or border-radius
- **Accessible by default**: Semantic HTML, proper heading hierarchy, ARIA where needed, keyboard navigable

## Color Palette

Six CSS custom properties — the entire palette. Never introduce additional colors.

| Variable | Value | Purpose |
|----------|-------|---------|
| `--bg` | `#f7f5f0` | Warm ivory background |
| `--fg` | `#1c1c1c` | Body text, heavy rules |
| `--fg-light` | `#5c5c5c` | Secondary text, bylines |
| `--rule` | `#1c1c1c` | Major structural rules |
| `--rule-light` | `#c8c3b8` | Subtle dividers |
| `--accent` | `#2454a0` | Links, section labels, interactive elements |

All pairings meet WCAG AA contrast. `--fg` on `--bg` = 12.5:1. `--accent` on `--bg` = 5.2:1.

## CSS Architecture

All styles live in `src/infrastructure/web/ui/styles/`. Use modern CSS (nesting, custom properties, `:is()`, `:where()`, container queries where useful). No SCSS, no preprocessors.

| File | Purpose |
|------|---------|
| `main.css` | Global styles — reset, palette, typography, layout primitives, shared components |
| Page-specific CSS | Only when a page has unique styles not shared anywhere else. Prefer extending `main.css`. |

CSS is imported via `scripts/main.js`. In dev, Vite dev server injects styles via HMR (instant updates). In prod, Vite bundles CSS to `dist/public/styles/` with hashed filenames. Templates use the `{{ vite('scripts/main.js') | safe }}` helper to load the correct assets.

See `references/base.css` for the complete reference stylesheet.

## Typography

System serif stack, no webfonts:

```
'Iowan Old Style', 'Palatino Linotype', 'Palatino', 'Georgia', 'Times New Roman', serif
```

Base: `16px`, line-height `1.55`. Full type scale is in `references/base.css`.

## Layout

Max-width `1100px`, centered. Canonical column split: `2fr 1fr` via CSS Grid, separated by rule borders (not gaps). Single responsive breakpoint at `700px`.

## Structural Rules (Lines)

Rules are the primary organizational tool, borrowed from broadsheet layout:

| Type | CSS | Use |
|------|-----|-----|
| Heavy double | `4px double var(--rule)` | Masthead, footer — page frame |
| Solid | `1px solid var(--rule)` | Major structural breaks |
| Medium | `2px solid var(--rule)` | Section nav bottom |
| Light | `1px solid var(--rule-light)` | Between articles, column dividers |
| Dotted | `1px dotted var(--rule-light)` | Between sidebar list items |
| Accent | `2px solid var(--accent)` | Under section labels |

## Accessibility

### Semantic Structure
- Use `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>` — the layout IS the landmark map
- One `<main>` per page with `id="main-content"`. One `<h1>` per page
- Headings follow sequential order: h1 → h2 → h3 — never skip levels
- Use `<article>` for self-contained content, `<section>` with a heading for thematic groups

### Images
- Every `<img>` requires `alt`. Informative: describe content. Decorative: `alt=""` + `aria-hidden="true"`
- Profile photos: person's name as alt text

### Navigation
- `<nav>` elements need `aria-label` describing purpose
- Current page link: `aria-current="page"`
- Skip-to-content link as first focusable element: `<a href="#main-content" class="skip-link">`

### Forms
- Every input needs a visible `<label>` with matching `for`/`id`
- Required fields: `required` + `aria-required="true"`
- Errors: `role="alert"` on container, `aria-describedby` linking input to error
- Group related fields with `<fieldset>` + `<legend>`

### Focus & Keyboard
- Focus style: `outline: 2px solid var(--accent); outline-offset: 2px` — never `outline: none`
- All interactive elements must work via keyboard
- Pagination: `<nav aria-label="Pagination">`, current page gets `aria-current="page"`

### ARIA
- Loading states: `aria-busy="true"` on updating container
- HTMX swap targets: `aria-live="polite"`
- Don't duplicate native semantics — `<button>` doesn't need `role="button"`

## Nunjucks Partials

Reusable UI goes in `src/infrastructure/web/ui/views/partials/`. Prefix with `bs-` (broadsheet) to distinguish from existing partials.

| Partial | File | Contains |
|---------|------|----------|
| Masthead | `partials/bs-masthead.html` | Site title, subtitle, dateline |
| Navigation | `partials/bs-nav.html` | Section navigation bar |
| Footer | `partials/bs-footer.html` | Copyright footer |
| Article card | `partials/bs-article.html` | Single news article in list |
| Pagination | `partials/bs-pagination.html` | Page navigation |
| Skip link | `partials/bs-skip-link.html` | Accessibility skip-to-content |

Include via `{% include "partials/bs-nav.html" %}`. Partials inherit the parent template context — no need to pass variables.

**When to extract a partial**: same block in 2+ pages, or a component with internal logic (conditionals, loops).

## HTMX

### Global boost
`hx-boost="true"` is on `<body>` in `layouts/base.html`. All internal links on public pages are automatically boosted — no need to add `hx-boost` per page or partial.

### Preload
`hx-ext="preload"` is on `<body>`. Add `preload preload-images="true"` to **inner containers** that hold links (nav, `<main>`, footer) — NOT on `<body>` itself — so the extension re-initializes after each HTMX swap.

```html
<main id="main-content" preload preload-images="true">
```

### Layout-crossing links
Links that navigate between layouts (e.g., public → admin) need `hx-boost="false"` to force a full page reload:

```html
<a href="/admin" hx-boost="false" preload="false">Admin</a>
```

### Admin layout
Admin uses a separate `layouts/admin.html` with its own `<body>` (no global boost). Add `hx-boost="true"` on specific containers:
- Sidebar `<nav>` for navigation
- `.admin-lang-selector` for language switching
- Individual `<section>` and `<form>` elements as needed

### File downloads
`main.js` has an `htmx:beforeRequest` listener that prevents HTMX from intercepting file-download links (PDF, docs, images, etc.) and opens them in a new tab instead.

### Partial updates
For filtering, pagination, or search — swap only the relevant container:

```html
<select name="specialty"
  hx-get="/student"
  hx-target="#course-content"
  hx-swap="innerHTML"
  hx-push-url="true">
```

Target containers need `aria-live="polite"` for screen reader announcements.

### Forms
Forms that redirect on success: standard `method="post"` — they inherit `hx-boost` from body (public) or need explicit `hx-boost="true"` (admin).
Forms that update inline: `hx-post` with `hx-target`.

### Key rules
- `aria-live="polite"` on all swap targets
- `hx-push-url="true"` when URL should reflect state (pagination, filters)
- `hx-swap="innerHTML"` for content within container, `outerHTML` to replace container
- `hx-indicator` for any request with noticeable latency

## What NOT to Do

- No box shadows, border-radius, gradients, or background images
- No colors outside the 6-variable palette
- No CSS/JS frameworks (no Bootstrap, Tailwind)
- No webfonts or icon fonts
- No inline `<style>` blocks or `style=""` attributes — all CSS goes in `ui/styles/` as classes
- No `outline: none` — visible focus states required
- No `<div>` soup — use semantic elements
- No images without `alt`
- No SCSS — use modern CSS (nesting, custom properties, `:is()`, `:where()`)

## Reference Implementation

`src/infrastructure/web/ui/views/pages/home.html` — canonical example of this design applied to the homepage.
