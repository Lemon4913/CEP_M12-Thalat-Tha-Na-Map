# 03 — Design System

**Name:** *Minimal Thai heritage*

One system covers the web app, the A4 poster, the A6 postcard and the kiosk graphics. A visitor should recognise the printed QR sign and the screen it opens as the same thing.

Machine-readable: [`design-tokens.css`](design-tokens.css) · [`design-tokens.json`](design-tokens.json) · importable at `frontend/src/styles/tokens.css`

---

## Colour

| Token | Hex | Use |
|---|---|---|
| `--cream` | `#F5EDD8` | Page background. The base of everything. |
| `--cream-lt` | `#FAF5EA` | Raised surfaces, cards, modal body |
| `--cream-md` | `#EAE0CC` | Borders, dividers, locked/inactive states |
| `--green` | `#2C5E42` | **Shophouse green.** Primary. Header, bottom nav, primary buttons. |
| `--green-lt` | `#3D7A57` | Hover / active on green |
| `--gold` | `#C8993A` | **Rice-gold.** Accent. Earned stamps, highlights, the logo arc. |
| `--gold-lt` | `#E0B84A` | Gold hover, glow on newly-earned stamps |
| `--brown` | `#3D2B1A` | Body text |
| `--brown-lt` | `#6B4C30` | Secondary text, map labels |
| `--ink` | `#1E1408` | Headings |
| `--river` | `#6A9888` | River and canal fill on the map, italic river labels |

**Where these come from:** cream is the aged paint of the old shophouses; green is the shophouse trim; gold is unhusked rice — the cargo that gave the pier, and the market, its name.

### Rules

- **Cream is the background. Green is the frame. Gold is the reward.** Gold means "you earned this" — do not use it for decoration, or the stamp payoff stops reading as special.
- Never put `--gold` text on `--cream`. Contrast fails outdoors. Gold on green, or gold as a fill/border, only.
- Locked states use `--cream-md`, never opacity on a coloured element. Opacity washes out in sunlight.
- The broader physical palette also includes **mustard yellow, shrine red and pomelo green-gold** for print materials. These are for posters and postcards only — do not introduce them into the app UI.

---

## Typography

**Sarabun, and only Sarabun.** Weights 300 / 400 / 500 / 600 / 700.

```html
<link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

Sarabun covers Thai and Latin in one family, which is the whole point — the UI is Thai, the code is English, and mixing font stacks breaks Thai tone marks and diacritics. **Never substitute `system-ui` or a generic sans fallback.**

| Token | Size | Typical use |
|---|---|---|
| `--fs-h1` | 1.35rem | Header title (ตลาดท่านา) |
| `--fs-h2` | 1.05rem | Modal headers, section titles |
| `--fs-body` | 0.95rem | Body copy, button labels |
| `--fs-small` | 0.82rem | Header subtitle, secondary text |
| `--fs-label` | 0.64rem | Bottom-nav labels, eyebrow text |

Weights: 400 body · 500 nav labels · 600 buttons and emphasis · 700 numerals and stamp counts.

Uppercase Latin labels (`TALAT THA NA · CHECK-IN MAP`) take `--ls-caps` (0.04em). Thai text never gets letter-spacing — it damages cluster rendering.

**Thai rendering warning:** when generating print assets, Thai diacritics and tone marks require `rsvg-convert` (from `librsvg2-bin`). `cairosvg` mis-stacks them and has produced broken output on this project. See [`05-print-assets.md`](05-print-assets.md).

---

## Space, shape, motion

- **4px base scale:** 4 / 8 / 12 / 16 / 24 / 32
- **`--radius: 4px`** for buttons and cards. Deliberately tight — heavy rounding reads as generic app, not heritage.
- **`--radius-lg: 12px`** for the bottom-sheet modal only.
- Shadows are low and warm-tinted (`rgba(30,20,8,…)`), never neutral grey — grey shadow on cream looks dirty.
- Motion: `--t-fast` (0.2s) for hover and state flips, `--t-base` (0.3s) for the modal sheet. Nothing longer; a person is standing in the sun waiting.

---

## Components

### Header

Green bar, full width, fixed. Logo mark (gold arc + roof triangle over stylised water lines) at left, then title `ตลาดท่านา` and a per-tab uppercase subtitle in `--gold-lt`.

### Progress strip (map tab)

Label `เก็บแสตมป์` + count `n / 7 จุด`, a track in `--cream-md` with a fill in `--gold`, and a row of 7 small stamp slots below. The fill is `n/7 × 100%`.

### Map

Inline SVG. Cream ground, `--river` water, `--brown-lt` labels at 9px, italic river labels at 8px. Pins are numbered circles with 8px bold white numerals, coloured by earned state. A small compass rose sits in a corner.

Keep the map as inline SVG rather than a tile-based map library — it works offline, it's styleable with tokens, and a hand-drawn market map communicates the place better than a generic basemap.

### Stamp

The core object. Circular, icon-centred.
- **Locked:** `--cream-md` fill, muted icon, no border
- **Earned:** `--cream-lt` fill, `--gold` border, full-colour icon
- **Just earned:** brief `--gold-lt` glow and slight scale, settling to Earned

### Bottom nav

Four items, fixed, `--nav-height: 60px`. Icon over label (`--fs-label`, weight 500, `--ls-caps`). Active item takes `--gold`; inactive sits at reduced-contrast cream on green.

### Bottom-sheet modal

Slides from the bottom. Drag handle, header (icon + name + sub), body (fact, then tips). Dismiss by tap-outside or swipe-down. Primary button: full-width, `--green`, `--radius`, weight 600, `--ls-caps`.

### Buttons

Primary is green with cream text. There is no secondary button style in the system yet — if you need one, add it here first rather than inventing it in a component.

---

## Accessibility floor

- Tap targets **≥ 44px** (`--tap-min`). No exceptions on the nav or the pins.
- Never rely on colour alone for state. Earned stamps also change border and icon saturation; the kiosk lock state also changes copy.
- Body text stays ≥ 0.82rem. Do not shrink Thai text to make a layout fit — Thai needs more vertical room than Latin, so give it the room instead.
- Icons in the nav are decorative; the Thai label carries the meaning.

---

## Adding to the system

If you need a colour, size or component that isn't here: add it to `design-tokens.css` and document it in this file **before** using it in a component. A token that exists in one component and nowhere else is how a design system dies.

---

*Related: [`04-poster-philosophy.md`](04-poster-philosophy.md) for how this translates to print · [`02-product-spec.md`](02-product-spec.md) for behaviour*
