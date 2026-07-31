# 05 — Print Assets

Specs and production pipeline for the physical materials. Design position: [`04-poster-philosophy.md`](04-poster-philosophy.md).

---

## Inventory

| Asset | Format | Status |
|---|---|---|
| **A4 wall poster** | A4 portrait, 300 dpi | ✅ Produced. QR is a placeholder. |
| **A6 stamp-exchange postcard** (แลกแต้ม) | A6 landscape, 300 dpi | ✅ Front produced. Back not designed. |
| **QR point signage** ×7 | TBD | ⬜ Not produced |
| **Kiosk graphics** | TBD | ⬜ Concept renders only |

Vector sources and exports live in [`assets/`](assets/).

---

## A4 wall poster

The recruitment piece — hung at the market entrance and around Nakhon Chai Si to get people to start the rally.

**Composition**, top to bottom:

1. **Shophouse skyline** — a row of stylised wooden shophouse rooflines forming the top edge
2. **น้องส้มโอ**, the pomelo mascot, as the central figure
3. **The 7-stamp mechanic**, shown as a visual row of stamp slots — shown, not explained
4. **QR code in a shrine-niche frame** — arched, green with gold detail
5. Market name in Thai, with a minimal Latin lockup

Palette: core tokens plus the print-only extended palette (mustard yellow, shrine red, pomelo green-gold). Type: Sarabun throughout.

**⚠️ The QR URL is a placeholder.** It points at a stand-in until the site is hosted. Before any print run: update the `QR_URL` constant in the poster generator, regenerate, re-verify the code, then print.

---

## A6 stamp-exchange postcard (แลกแต้ม)

Handed out at the market — a physical companion to the digital stamps.

**Front:** watercolour-style illustration — a sleepy tabby cat asleep on an antique typewriter — in the established design system. Warm, textural, deliberately unhurried.

Delivered in four formats:

| Format | Purpose |
|---|---|
| 300 dpi PNG | General use |
| 2× PNG | Digital / preview |
| Press-ready PDF | The print shop's file |
| SVG | Editable source |

**Back: not yet designed.** Needs a classic postcard back — stamp box top-right, address rules, a divider, and space for the 7-stamp grid. This is a known gap ([`06-roadmap.md`](06-roadmap.md)).

**Known change pending:** the front currently uses a generic pomelo mark where **น้องส้มโอ** should be. Replace it with the actual mascot.

---

## Production pipeline

Assets are generated as code, not drawn by hand in an editor, so they can be regenerated when the QR URL or copy changes.

```
Python  →  SVG  →  rsvg-convert  →  PNG / PDF
```

```bash
# PNG at an explicit pixel size
rsvg-convert -w 2480 -h 3508 poster-a4.svg -o poster-a4.png    # A4 @ 300dpi

# Press-ready PDF
rsvg-convert -f pdf poster-a4.svg -o poster-a4.pdf
```

### Thai text rendering — read this before generating anything

**Use `rsvg-convert` (from `librsvg2-bin`). Do not use `cairosvg`.**

`cairosvg` mis-stacks Thai diacritics and tone marks — vowels and tone marks land in the wrong vertical position, and the error is subtle enough to survive a quick glance and reach the print shop. This has already cost this project a rendering pass. `librsvg` handles Thai complex-text shaping correctly.

```bash
sudo apt-get install -y librsvg2-bin
```

### Installing Sarabun for rendering

Font must be installed system-side for the renderer to find it:

```bash
mkdir -p ~/.fonts
for w in Regular Medium SemiBold Bold Light; do
  curl -L -o ~/.fonts/Sarabun-$w.ttf \
    https://github.com/google/fonts/raw/main/ofl/sarabun/Sarabun-$w.ttf
done
fc-cache -f ~/.fonts
fc-list | grep -i sarabun   # verify
```

### QR verification — mandatory

Every generated QR gets decoded before it goes to print:

```python
from pyzbar.pyzbar import decode
from PIL import Image

result = decode(Image.open("poster-a4.png"))
assert result, "QR did not decode — do not print"
print(result[0].data.decode())   # must match the intended URL exactly
```

An unscannable QR on a printed poster breaks the entire rally and can't be patched after the fact.

---

## Print checklist

- [ ] `QR_URL` points at the live hosted site, not the placeholder
- [ ] QR decodes and the decoded string matches exactly
- [ ] Rendered with `rsvg-convert`, not `cairosvg`
- [ ] Thai tone marks and vowels visually verified at 100% zoom
- [ ] 300 dpi at final physical size
- [ ] Bleed and safe margins confirmed with the print shop
- [ ] Uncoated / lightly textured stock — no gloss
- [ ] Cream `#F5EDD8` reproduces warm; ask for a proof if unsure
- [ ] Mascot is น้องส้มโอ, not the placeholder pomelo mark

---

*Related: [`04-poster-philosophy.md`](04-poster-philosophy.md) · [`03-design-system.md`](03-design-system.md)*
