# Docs — Talat Tha Na Map

Concept, design and product documentation for **CEP_M12 · Talat Tha Na Map**.

If you are an AI assistant working in this repo, start with [`../CLAUDE.md`](../CLAUDE.md).
If you are a human joining the project, read `01` and `02`, then skim the rest.

---

## Read in order

| | File | What's in it |
|---|---|---|
| 01 | [`01-concept.md`](01-concept.md) | The market, the problem, the intervention, who benefits, what this project is *not* |
| 02 | [`02-product-spec.md`](02-product-spec.md) | The 7 check-in points, four tabs, stamp mechanic, kiosk redemption, states, porting checklist |
| 03 | [`03-design-system.md`](03-design-system.md) | Palette, typography, spacing, components, accessibility floor |
| 04 | [`04-poster-philosophy.md`](04-poster-philosophy.md) | "Festival Timber" — the design position for physical materials, and the น้องส้มโอ mascot |
| 05 | [`05-print-assets.md`](05-print-assets.md) | Poster and postcard specs, the render pipeline, and the Thai-rendering trap |
| 06 | [`06-roadmap.md`](06-roadmap.md) | What's next, in dependency order, and the handover risk |

## Reference files

| Path | What it is |
|---|---|
| [`data/spots.json`](data/spots.json) | The 7 check-in locations — names, icons, historical facts, local tips. **Use this as the data source when building components**, not the array inside the prototype HTML. |
| [`design-tokens.css`](design-tokens.css) | Single source of truth for colour, type, spacing, motion. Mirrored at `frontend/src/styles/tokens.css`. |
| [`design-tokens.json`](design-tokens.json) | Same tokens, machine-readable. Generated from the CSS. |
| [`mockups/talat-thana-map.html`](mockups/talat-thana-map.html) | **The approved interactive prototype.** Single-file, no build step. Source of truth for design and UX. |
| [`mockups/component-reference.html`](mockups/component-reference.html) | Static spec sheet — palette, type scale, all four tabs, stamp states, buttons, modal, and the rules that are easiest to break. Build React components against this. |
| [`assets/`](assets/) | Logo mark, mascot, point icons, stamp set, palette sheet, A4 poster, A6 postcard — all SVG |
| [`assets/preview/`](assets/preview/) | PNG renders of the above, for quick viewing on GitHub or in VS Code |
| [`assets/make_assets.py`](assets/make_assets.py) | Regenerates every SVG in `assets/` from the design tokens. Run it after changing a colour or the QR URL. |

---

## Two implementations — don't confuse them

| | Path | Status |
|---|---|---|
| **Design prototype** | `docs/mockups/talat-thana-map.html` | ✅ Complete. Design source of truth. |
| **Production app** | `frontend/` + `backend/` | 🚧 Bare scaffold. `App.tsx` renders one `<h1>`. |

The current job is porting the prototype into the React app. The design is decided and approved — this is transcription, not design work. Checklist: [`02-product-spec.md`](02-product-spec.md#porting-checklist-prototype--react).

---

## Regenerating assets

```bash
pip install qrcode
cd docs/assets && python3 make_assets.py

# rasterise — rsvg-convert, NOT cairosvg (it mis-stacks Thai tone marks)
rsvg-convert -w 2480 -h 3508 poster-a4.svg -o poster-a4.png   # A4 @ 300dpi
rsvg-convert -f pdf poster-a4.svg -o poster-a4.pdf
```

⚠️ The QR code in `poster-a4.svg` encodes a **placeholder URL**. Update `QR_URL` in
`make_assets.py` once the site is hosted, regenerate, and verify with `pyzbar` before any
print run — see [`05-print-assets.md`](05-print-assets.md#print-checklist).

---

## Caveat on the reference assets

The SVGs in `assets/` are **reference reconstructions** built from the documented design system, not
the original production files. They are correct on palette, type, layout logic and the mechanic, and
they are regenerable from code — but the original A4 poster and A6 postcard artwork (including the
watercolour cat illustration on the postcard front) were produced separately and are the files that
should go to print. Use these to communicate the concept and to check colour and structure.
