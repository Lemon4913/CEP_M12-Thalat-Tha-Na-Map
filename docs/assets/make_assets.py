#!/usr/bin/env python3
"""
Talat Tha Na Map — reference asset generator.

Generates the SVG reference assets in this folder from the design tokens.
Assets are generated as code so they can be regenerated when the QR URL,
copy, or palette changes — see docs/05-print-assets.md.

Icons are drawn as vector paths rather than emoji, deliberately: emoji
render inconsistently across print pipelines and are off-brand for
"illustration over photography" (docs/04-poster-philosophy.md).

Usage:
    pip install qrcode
    python3 make_assets.py

Then rasterise (see docs/05-print-assets.md — use rsvg-convert, NOT cairosvg,
which mis-stacks Thai tone marks):

    rsvg-convert -w 2480 -h 3508 poster-a4.svg -o poster-a4.png
    rsvg-convert -f pdf poster-a4.svg -o poster-a4.pdf
"""

import pathlib
import qrcode

OUT = pathlib.Path(__file__).parent

# --- Design tokens (mirror of docs/design-tokens.css) ----------------------
CREAM, CREAM_LT, CREAM_MD = "#F5EDD8", "#FAF5EA", "#EAE0CC"
GREEN, GREEN_LT = "#2C5E42", "#3D7A57"
GOLD, GOLD_LT = "#C8993A", "#E0B84A"
BROWN, BROWN_LT, INK = "#3D2B1A", "#6B4C30", "#1E1408"
RIVER = "#6A9888"
# Print-only extended palette (docs/04-poster-philosophy.md)
MUSTARD, SHRINE_RED, POMELO = "#D9A521", "#A63A2E", "#8FA845"

FONT = "Sarabun, 'Noto Sans Thai', sans-serif"

# ⚠️ PLACEHOLDER — update once the site is hosted, then regenerate and
# re-verify with pyzbar before any print run. See docs/05-print-assets.md.
QR_URL = "https://example.invalid/talat-tha-na"


# --------------------------------------------------------------------------
# Icons — drawn in a 24×24 box centred on (0,0), i.e. -12 … 12
# --------------------------------------------------------------------------
def icon(kind, c):
    """Vector icon for a check-in point. `c` is the stroke/fill colour."""
    sw = 'stroke="%s" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"' % c
    if kind == "anchor":          # 1 · ท่าเรือ — the pier
        return (f'<circle cx="0" cy="-8" r="2.6" {sw}/>'
                f'<path d="M0 -5.4 V9" {sw}/><path d="M-5 -2 H5" {sw}/>'
                f'<path d="M-8.5 3.5 A8.5 8.5 0 0 0 8.5 3.5" {sw}/>')
    if kind == "shophouse":       # 2 · ห้องแถวไม้ — the 140-year-old row
        return (f'<path d="M-10 -1 L0 -9 L10 -1" {sw}/>'
                f'<path d="M-8 -1 V9 H8 V-1" {sw}/>'
                f'<path d="M-2.6 9 V2 H2.6 V9" {sw}/>'
                f'<path d="M-10 -1 H10" {sw}/>')
    if kind == "lantern":         # 3 · ศาลเจ้าอาม่า — the shrine
        return (f'<path d="M0 -11.5 V-8.6" {sw}/><path d="M-4.4 -8.6 H4.4" {sw}/>'
                f'<ellipse cx="0" cy="0" rx="7.6" ry="8.2" {sw}/>'
                f'<path d="M-3.1 -7.6 Q-5.4 0 -3.1 7.6" {sw}/>'
                f'<path d="M3.1 -7.6 Q5.4 0 3.1 7.6" {sw}/>'
                f'<path d="M-4.4 8.6 H4.4" {sw}/><path d="M0 8.6 V11.8" {sw}/>')
    if kind == "pomelo":          # 4 · โซนอาหาร — the signature product
        return (f'<circle cx="0" cy="1.5" r="7.6" {sw}/>'
                f'<path d="M1 -6 q1.6 -4.6 6.4 -5.4 q0.4 5.2 -5 6.4" {sw}/>'
                f'<path d="M-3.4 -1.4 q3.4 2.6 7 0.4" {sw}/>')
    if kind == "bread":           # 5 · ขนมปังเย็น
        return (f'<path d="M-9.6 7.2 Q-11 -1 -6 -5.2 Q0 -9.6 6 -5.2 '
                f'Q11 -1 9.6 7.2 Z" {sw}/>'
                f'<path d="M-9.2 3.4 Q0 5.4 9.2 3.4" {sw}/>'
                f'<path d="M-5.2 -3.4 l3.4 -2.6" {sw}/>'
                f'<path d="M-1 -4.6 l3.4 -2.6" {sw}/>'
                f'<path d="M3.2 -3.4 l3.4 -2.6" {sw}/>')
    if kind == "bridge":          # 6 · สะพานเก่าริมน้ำ
        return (f'<path d="M-11 4 Q0 -8 11 4" {sw}/>'
                f'<path d="M-11 4 V9" {sw}/><path d="M11 4 V9" {sw}/>'
                f'<path d="M-5.5 -0.4 V6.6" {sw}/><path d="M0 -3 V6.6" {sw}/>'
                f'<path d="M5.5 -0.4 V6.6" {sw}/><path d="M-11 6.6 H11" {sw}/>')
    if kind == "kiosk":           # 7 · ตู้จ่ายภาพ — the reward
        return (f'<rect x="-9" y="-9.5" width="18" height="15" rx="1.6" {sw}/>'
                f'<path d="M-6 1.5 L-1.6 -3.4 L1.4 -0.4 L4 -3.2 L6.4 -0.6" {sw}/>'
                f'<circle cx="-4.4" cy="-5.6" r="1.5" {sw}/>'
                f'<path d="M-5 5.5 V8.4 H5 V5.5" {sw}/><path d="M-3 8.4 H3" {sw}/>')
    raise ValueError(kind)


SPOTS = [
    ("anchor", "ท่าเรือ"),
    ("shophouse", "ห้องแถว"),
    ("lantern", "ศาลเจ้า"),
    ("pomelo", "โซนอาหาร"),
    ("bread", "ขนมปัง"),
    ("bridge", "สะพาน"),
    ("kiosk", "ตู้ภาพ"),
]


def font_face() -> str:
    """Web font import so the SVG renders correctly when opened in a browser
    or VS Code preview, without relying on Sarabun being installed."""
    return (
        "<defs><style>@import url("
        "'https://fonts.googleapis.com/css2?family=Sarabun:wght@300;400;500;600;700&amp;display=swap'"
        ");</style></defs>"
    )


def write(name: str, svg: str) -> None:
    (OUT / name).write_text(svg, encoding="utf-8")
    print("wrote", name)


# --------------------------------------------------------------------------
# Logo mark — gold arc + roof triangle over stylised water lines
# --------------------------------------------------------------------------
def logo_mark(size=42, on_green=True):
    ring = "rgba(255,255,255,.08)" if on_green else CREAM_MD
    stroke = "rgba(255,255,255,.2)" if on_green else CREAM_MD
    water = "rgba(255,255,255,.35)" if on_green else RIVER
    water2 = "rgba(255,255,255,.2)" if on_green else RIVER
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 42 42" width="{size}" height="{size}" fill="none">
  <circle cx="21" cy="21" r="20" fill="{ring}" stroke="{stroke}" stroke-width="1"/>
  <path d="M8 26 Q21 14 34 26" stroke="{GOLD}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M12 26 L21 10 L30 26 Z" fill="rgba(200,153,58,.3)" stroke="{GOLD}" stroke-width="1.5"/>
  <path d="M6 29 Q21 24 36 29" stroke="{water}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M6 32 Q21 27 36 32" stroke="{water2}" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>'''


# --------------------------------------------------------------------------
# น้องส้มโอ — the pomelo mascot
# --------------------------------------------------------------------------
def mascot(cx=0.0, cy=0.0, r=1.0, scan=False):
    s = r / 100.0
    if scan:
        arms = f'''
    <!-- left arm holding a phone, showing the mechanic -->
    <path d="M-74 22 Q-108 8 -104 -30" stroke="{GREEN}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <g transform="translate(-104,-62) rotate(-9)">
      <rect x="-24" y="-30" width="48" height="70" rx="8" fill="{CREAM_LT}" stroke="{GREEN}" stroke-width="5"/>
      <rect x="-24" y="-30" width="48" height="15" rx="8" fill="{GREEN}"/>
      <rect x="-24" y="-22" width="48" height="7" fill="{GREEN}"/>
      <circle cx="0" cy="4" r="12" fill="none" stroke="{GOLD}" stroke-width="4"/>
      <path d="M-5 4 l4 4 l7 -8" stroke="{GOLD}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M-14 26 h28" stroke="{CREAM_MD}" stroke-width="4" stroke-linecap="round"/>
      <path d="M-14 33 h17" stroke="{CREAM_MD}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <!-- right arm waving -->
    <path d="M74 22 Q104 20 106 -8" stroke="{GREEN}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="107" cy="-16" r="10" fill="{GOLD_LT}" stroke="{GREEN}" stroke-width="4.5"/>'''
    else:
        arms = f'''
    <path d="M-72 20 Q-102 36 -94 64" stroke="{GREEN}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="-95" cy="70" r="10" fill="{GOLD_LT}" stroke="{GREEN}" stroke-width="4.5"/>
    <path d="M72 20 Q102 36 94 64" stroke="{GREEN}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <circle cx="95" cy="70" r="10" fill="{GOLD_LT}" stroke="{GREEN}" stroke-width="4.5"/>'''
    return f'''<g transform="translate({cx},{cy}) scale({s})">
  <!-- leaf + stem -->
  <path d="M6 -104 q4 -22 30 -30 q2 26 -24 34 z" fill="{POMELO}" stroke="{GREEN}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M0 -96 q3 -10 8 -16" stroke="{BROWN}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <!-- body -->
  <circle cx="0" cy="0" r="94" fill="{GOLD_LT}" stroke="{GREEN}" stroke-width="6"/>
  <circle cx="0" cy="0" r="94" fill="{POMELO}" opacity=".28"/>
  <!-- rind texture -->
  <g fill="{GREEN}" opacity=".16">
    <circle cx="-46" cy="-40" r="3.4"/><circle cx="-22" cy="-58" r="2.8"/><circle cx="34" cy="-50" r="3.2"/>
    <circle cx="58" cy="-16" r="2.9"/><circle cx="46" cy="30" r="3.3"/><circle cx="-58" cy="8" r="3"/>
    <circle cx="-34" cy="48" r="2.7"/><circle cx="10" cy="62" r="3.1"/><circle cx="66" cy="52" r="2.6"/>
  </g>
  <!-- cheeks -->
  <ellipse cx="-42" cy="16" rx="15" ry="10" fill="{SHRINE_RED}" opacity=".22"/>
  <ellipse cx="42" cy="16" rx="15" ry="10" fill="{SHRINE_RED}" opacity=".22"/>
  <!-- eyes -->
  <ellipse cx="-26" cy="-10" rx="8.5" ry="10" fill="{INK}"/>
  <ellipse cx="26" cy="-10" rx="8.5" ry="10" fill="{INK}"/>
  <circle cx="-23" cy="-14" r="3" fill="{CREAM_LT}"/>
  <circle cx="29" cy="-14" r="3" fill="{CREAM_LT}"/>
  <!-- smile -->
  <path d="M-16 20 q16 16 32 0" stroke="{INK}" stroke-width="5" fill="none" stroke-linecap="round"/>
  {arms}
</g>'''


# --------------------------------------------------------------------------
# Shophouse skyline — the layout device from "Festival Timber"
# --------------------------------------------------------------------------
def skyline(x, y, w, n=7, h=54, fill=GREEN, detail=True):
    unit = w / n
    parts = []
    for i in range(n):
        ox = x + i * unit
        gable = h * (0.62 if i % 2 else 0.82)
        parts.append(
            f'<path d="M{ox:.1f} {y + h:.1f} L{ox:.1f} {y + h - gable * .42:.1f} '
            f'L{ox + unit / 2:.1f} {y + h - gable:.1f} L{ox + unit:.1f} {y + h - gable * .42:.1f} '
            f'L{ox + unit:.1f} {y + h:.1f} Z" fill="{fill}"/>'
        )
        if detail:
            parts.append(
                f'<rect x="{ox + unit * .36:.1f}" y="{y + h - gable * .30:.1f}" '
                f'width="{unit * .28:.1f}" height="{gable * .22:.1f}" fill="{GOLD}" opacity=".5"/>'
            )
    return "".join(parts)


# --------------------------------------------------------------------------
# Stamp — locked / earned
# --------------------------------------------------------------------------
def stamp(cx, cy, r, kind, earned, label=None, label_dy=15, label_fs=10):
    ring = GOLD if earned else CREAM_MD
    fill = CREAM_LT if earned else CREAM_MD
    ink = GREEN if earned else BROWN_LT
    op = "1" if earned else ".42"
    iscale = r / 15.0
    out = (
        f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{ring}" '
        f'stroke-width="{max(1.6, r * .11):.1f}"'
        + (f' stroke-dasharray="{r*.34:.1f} {r*.26:.1f}"' if not earned else "")
        + "/>"
        f'<g transform="translate({cx},{cy}) scale({iscale:.3f})" opacity="{op}">'
        f'{icon(kind, ink)}</g>'
    )
    if earned:
        out += (f'<circle cx="{cx + r * .72:.1f}" cy="{cy - r * .72:.1f}" r="{r*.28:.1f}" '
                f'fill="{GOLD}"/>')
    if label:
        out += (
            f'<text x="{cx}" y="{cy + r + label_dy}" font-family="{FONT}" font-size="{label_fs}" '
            f'font-weight="500" fill="{BROWN_LT}" text-anchor="middle">{label}</text>'
        )
    return out


# --------------------------------------------------------------------------
# QR in a shrine-niche frame
# --------------------------------------------------------------------------
def qr_matrix(url=QR_URL):
    q = qrcode.QRCode(box_size=1, border=0,
                      error_correction=qrcode.constants.ERROR_CORRECT_M)
    q.add_data(url)
    q.make(fit=True)
    return q.get_matrix()


def qr_svg(x, y, size, dark=GREEN, light=CREAM, quiet=4):
    """QR with an explicit cream quiet zone — never white (04-poster-philosophy)."""
    m = qr_matrix()
    n = len(m)
    px = size / (n + quiet * 2)
    ox, oy = x + quiet * px, y + quiet * px
    rects = [f'<rect x="{x:.2f}" y="{y:.2f}" width="{size:.2f}" height="{size:.2f}" fill="{light}"/>']
    for r, row in enumerate(m):
        run = None
        for c, v in enumerate(list(row) + [False]):
            if v and run is None:
                run = c
            elif not v and run is not None:
                rects.append(
                    f'<rect x="{ox + run * px:.2f}" y="{oy + r * px:.2f}" '
                    f'width="{(c - run) * px:.2f}" height="{px:.2f}" fill="{dark}"/>')
                run = None
    return "".join(rects)


def shrine_niche(cx, top, w, h, qr_size):
    """Arched shrine-niche frame with the QR enshrined inside."""
    x = cx - w / 2
    arch = w / 2
    qcy = top + h * 0.56
    return f'''
  <path d="M{x:.1f} {top + h:.1f} L{x:.1f} {top + arch:.1f}
           A{arch:.1f} {arch:.1f} 0 0 1 {x + w:.1f} {top + arch:.1f}
           L{x + w:.1f} {top + h:.1f} Z" fill="{GREEN}"/>
  <path d="M{x + 7:.1f} {top + h - 6:.1f} L{x + 7:.1f} {top + arch:.1f}
           A{arch - 7:.1f} {arch - 7:.1f} 0 0 1 {x + w - 7:.1f} {top + arch:.1f}
           L{x + w - 7:.1f} {top + h - 6:.1f} Z"
        fill="none" stroke="{GOLD}" stroke-width="1.8"/>
  <rect x="{x - 10:.1f}" y="{top + h:.1f}" width="{w + 20:.1f}" height="8" fill="{GREEN}"/>
  <rect x="{x - 10:.1f}" y="{top + h + 8:.1f}" width="{w + 20:.1f}" height="2.5" fill="{GOLD}"/>
  {qr_svg(cx - qr_size / 2, qcy - qr_size / 2, qr_size)}'''


# --------------------------------------------------------------------------
# A4 poster
# --------------------------------------------------------------------------
def poster():
    W, H = 595, 842
    row = "".join(
        stamp(88 + i * 70, 596, 22, k, i < 2, lb)
        for i, (k, lb) in enumerate(SPOTS)
    )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{font_face()}
  <rect width="{W}" height="{H}" fill="{CREAM}"/>

  <!-- Timber: the shophouse elevation defines the layout -->
  <rect x="0" y="0" width="{W}" height="96" fill="{GREEN}"/>
  {skyline(0, 96, W, n=9, h=40, fill=GREEN)}
  <rect x="0" y="0" width="{W}" height="6" fill="{GOLD}"/>

  <text x="{W/2}" y="54" font-family="{FONT}" font-size="40" font-weight="700"
        fill="{CREAM}" text-anchor="middle">ตลาดท่านา</text>
  <text x="{W/2}" y="78" font-family="{FONT}" font-size="11" font-weight="600"
        fill="{GOLD_LT}" text-anchor="middle" letter-spacing="4">TALAT THA NA · NAKHON CHAI SI</text>

  <!-- Festival: the character -->
  {mascot(W/2 + 22, 322, 118, scan=True)}

  <text x="{W/2}" y="486" font-family="{FONT}" font-size="27" font-weight="700"
        fill="{INK}" text-anchor="middle">สแกน · เดิน · สะสมแสตมป์</text>
  <text x="{W/2}" y="514" font-family="{FONT}" font-size="14" font-weight="400"
        fill="{BROWN_LT}" text-anchor="middle">เก็บครบ 7 จุด รับภาพศิลปะพิเศษที่ตู้จ่ายภาพ</text>

  <!-- the mechanic, shown not explained -->
  <line x1="52" y1="596" x2="62" y2="596" stroke="{CREAM_MD}" stroke-width="2"/>
  <line x1="{88 + 6*70 + 24}" y1="596" x2="{W-52}" y2="596" stroke="{CREAM_MD}" stroke-width="2"/>
  {row}

  <!-- the single action -->
  {shrine_niche(W/2, 656, 150, 132, 96)}
  <text x="{W/2}" y="820" font-family="{FONT}" font-size="15" font-weight="600"
        fill="{GREEN}" text-anchor="middle">สแกนที่นี่เพื่อเริ่มเก็บแสตมป์</text>
  <text x="{W/2}" y="836" font-family="{FONT}" font-size="7" font-weight="400"
        fill="{BROWN_LT}" text-anchor="middle" opacity=".65">REFERENCE ASSET · QR IS A PLACEHOLDER — SEE docs/05-print-assets.md</text>
</svg>'''


# --------------------------------------------------------------------------
# A6 postcard front (landscape)
# --------------------------------------------------------------------------
def postcard():
    W, H = 420, 297
    row = "".join(stamp(158 + i * 34, 238, 13, k, i < 2)
                  for i, (k, _) in enumerate(SPOTS))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{font_face()}
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <rect x="0" y="0" width="{W}" height="5" fill="{GOLD}"/>
  {skyline(0, 5, W, n=11, h=28, fill=GREEN, detail=False)}

  <text x="30" y="90" font-family="{FONT}" font-size="30" font-weight="700"
        fill="{INK}">ตลาดท่านา</text>
  <text x="31" y="108" font-family="{FONT}" font-size="9" font-weight="600"
        fill="{GOLD}" letter-spacing="3">STAMP EXCHANGE · แลกแต้ม</text>
  <text x="30" y="142" font-family="{FONT}" font-size="12" font-weight="400" fill="{BROWN_LT}">เก็บแสตมป์ครบ 7 จุด</text>
  <text x="30" y="162" font-family="{FONT}" font-size="12" font-weight="400" fill="{BROWN_LT}">นำบัตรนี้ไปที่ตู้จ่ายภาพ</text>

  {mascot(332, 148, 72)}

  <line x1="30" y1="204" x2="{W-30}" y2="204" stroke="{CREAM_MD}" stroke-width="1.5"/>
  <text x="30" y="242" font-family="{FONT}" font-size="11" font-weight="600" fill="{GREEN}">แสตมป์ของฉัน</text>
  {row}
  <text x="{W/2}" y="288" font-family="{FONT}" font-size="6.5" fill="{BROWN_LT}"
        text-anchor="middle" opacity=".6">REFERENCE ASSET · MASCOT PLACEHOLDER — SEE docs/05-print-assets.md</text>
</svg>'''


# --------------------------------------------------------------------------
# Stamp set sheet
# --------------------------------------------------------------------------
def stamp_set():
    W, H = 640, 268
    earned = "".join(stamp(64 + i * 82, 86, 29, k, True, lb)
                     for i, (k, lb) in enumerate(SPOTS))
    locked = "".join(stamp(64 + i * 82, 196, 29, k, False, lb)
                     for i, (k, lb) in enumerate(SPOTS))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{font_face()}
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <rect x="0" y="0" width="{W}" height="4" fill="{GOLD}"/>
  <text x="24" y="32" font-family="{FONT}" font-size="13" font-weight="700" fill="{INK}">Stamp states · 7 check-in points</text>
  <text x="24" y="52" font-family="{FONT}" font-size="9.5" font-weight="600"
        fill="{GOLD}" letter-spacing="2">EARNED</text>
  {earned}
  <text x="24" y="162" font-family="{FONT}" font-size="9.5" font-weight="600"
        fill="{BROWN_LT}" letter-spacing="2">LOCKED</text>
  {locked}
</svg>'''


# --------------------------------------------------------------------------
# Palette / type specimen
# --------------------------------------------------------------------------
def palette():
    swatches = [
        ("--cream", CREAM), ("--cream-lt", CREAM_LT), ("--cream-md", CREAM_MD),
        ("--green", GREEN), ("--green-lt", GREEN_LT),
        ("--gold", GOLD), ("--gold-lt", GOLD_LT),
        ("--brown", BROWN), ("--brown-lt", BROWN_LT), ("--ink", INK), ("--river", RIVER),
    ]
    W, H = 760, 430
    cells = []
    for i, (name, hexv) in enumerate(swatches):
        x, y = 32 + (i % 6) * 120, 80 + (i // 6) * 118
        cells.append(f'''<rect x="{x}" y="{y}" width="104" height="66" rx="4" fill="{hexv}"
          stroke="{CREAM_MD}" stroke-width="1"/>
      <text x="{x}" y="{y+82}" font-family="{FONT}" font-size="10" font-weight="600"
            fill="{INK}">{name}</text>
      <text x="{x}" y="{y+95}" font-family="{FONT}" font-size="9.5"
            fill="{BROWN_LT}">{hexv}</text>''')
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{font_face()}
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <rect x="0" y="0" width="{W}" height="5" fill="{GOLD}"/>
  <text x="32" y="42" font-family="{FONT}" font-size="17" font-weight="700" fill="{INK}">Minimal Thai heritage — design tokens</text>
  <text x="32" y="60" font-family="{FONT}" font-size="10" font-weight="500"
        fill="{BROWN_LT}" letter-spacing="1.5">TALAT THA NA MAP · docs/design-tokens.css</text>
  {''.join(cells)}
  <line x1="32" y1="330" x2="{W-32}" y2="330" stroke="{CREAM_MD}" stroke-width="1"/>
  <text x="32" y="360" font-family="{FONT}" font-size="24" font-weight="700" fill="{INK}">ตลาดท่านา · เก็บแสตมป์ครบ 7 จุด</text>
  <text x="32" y="386" font-family="{FONT}" font-size="14" font-weight="400" fill="{BROWN}">Sarabun 400 — ตัวอย่างการเรียงพิมพ์ภาษาไทย · The quick brown fox 0123456789</text>
  <text x="32" y="410" font-family="{FONT}" font-size="11" font-weight="600"
        fill="{GREEN}" letter-spacing="1.5">SARABUN 600 · UPPERCASE LABEL · LETTER-SPACING 0.04EM</text>
</svg>'''


# --------------------------------------------------------------------------
# Icon sheet
# --------------------------------------------------------------------------
def icon_sheet():
    W, H = 640, 150
    cells = "".join(
        f'<g transform="translate({64 + i*82},70) scale(1.9)">{icon(k, GREEN)}</g>'
        f'<text x="{64 + i*82}" y="112" font-family="{FONT}" font-size="10" font-weight="500" '
        f'fill="{BROWN_LT}" text-anchor="middle">{lb}</text>'
        f'<text x="{64 + i*82}" y="126" font-family="{FONT}" font-size="8" '
        f'fill="{BROWN_LT}" opacity=".7" text-anchor="middle">{k}</text>'
        for i, (k, lb) in enumerate(SPOTS))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
{font_face()}
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <rect x="0" y="0" width="{W}" height="4" fill="{GOLD}"/>
  <text x="24" y="30" font-family="{FONT}" font-size="12" font-weight="700" fill="{INK}">Check-in point icons — vector, not emoji</text>
  {cells}
</svg>'''


if __name__ == "__main__":
    write("logo-mark.svg", logo_mark(on_green=False))
    write("mascot-nong-somo.svg",
          f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">'
          f'{font_face()}<rect width="300" height="300" fill="{CREAM}"/>{mascot(150, 152, 108)}</svg>')
    write("icons.svg", icon_sheet())
    write("stamp-set.svg", stamp_set())
    write("palette.svg", palette())
    write("poster-a4.svg", poster())
    write("postcard-a6.svg", postcard())
    print("\nQR encodes:", QR_URL, "(placeholder — update before printing)")
