#!/usr/bin/env python3
"""
Talat Tha Na Map — QR point signage generator.

Generates one print-ready SVG per real check-in point (docs/05-print-assets.md's
"QR point signage x7", currently not produced). Encodes
{BASE_URL}/checkin/{poi_id}?t={qr_secret} using the real POIs and tokens straight
from backend/app/main.py's SEED_POIS — never hand-copy these into a separate list,
they must match exactly what the API validates against or the signage won't grant
stamps.

⚠️ BASE_URL below is a placeholder, same convention as make_assets.py's QR_URL.
Regenerate once hosting is decided, and re-verify every code with a real phone
scan before any print run. See docs/06-roadmap.md item 5.

Usage:
    pip install qrcode
    python3 make_qr_signage.py

Then rasterise per docs/05-print-assets.md (rsvg-convert, NOT cairosvg, which
mis-stacks Thai tone marks):
    for f in qr-signage/*.svg; do
      rsvg-convert -w 1748 -h 2481 "$f" -o "${f%.svg}.png"
    done
"""

import pathlib
import sys

import qrcode

sys.stdout.reconfigure(encoding="utf-8")  # Windows console defaults to cp1252, breaks on Thai

# Import the real seeded checkpoints so signage can never drift from what the
# API actually validates (id + qr_secret must match exactly).
sys.path.insert(0, str(pathlib.Path(__file__).resolve().parents[2] / "backend"))
from app.main import SEED_POIS  # noqa: E402

OUT = pathlib.Path(__file__).parent / "qr-signage"
OUT.mkdir(exist_ok=True)

# Design tokens (mirror of docs/design-tokens.css)
CREAM, GREEN, GOLD, BROWN, INK = "#F5EDD8", "#2C5E42", "#C8993A", "#3D2B1A", "#1E1408"
FONT = "Sarabun, 'Noto Sans Thai', sans-serif"

# PLACEHOLDER — update once the site is hosted, then regenerate + re-verify.
BASE_URL = "https://example.invalid/talat-tha-na"

# A5 portrait, mm. Big enough to scan comfortably from ~1m at a physical point.
W, H = 148, 210


def qr_matrix(data: str):
    q = qrcode.QRCode(box_size=1, border=0, error_correction=qrcode.constants.ERROR_CORRECT_H)
    q.add_data(data)
    q.make(fit=True)
    return q.get_matrix()


def qr_svg_group(data: str, x: float, y: float, size: float, quiet: int = 3) -> str:
    """QR with a cream quiet zone (never white — 04-poster-philosophy.md)."""
    m = qr_matrix(data)
    n = len(m)
    px = size / (n + quiet * 2)
    ox, oy = x + quiet * px, y + quiet * px
    parts = [f'<rect x="{x:.2f}" y="{y:.2f}" width="{size:.2f}" height="{size:.2f}" fill="{CREAM}"/>']
    for r, row in enumerate(m):
        for c, dark in enumerate(row):
            if dark:
                parts.append(
                    f'<rect x="{ox + c * px:.2f}" y="{oy + r * px:.2f}" '
                    f'width="{px:.2f}" height="{px:.2f}" fill="{GREEN}"/>'
                )
    return "".join(parts)


def sign_svg(poi, total: int) -> str:
    url = f"{BASE_URL}/checkin/{poi.id}?t={poi.qr_secret}"
    qr_size = W - 40
    qr_x, qr_y = (W - qr_size) / 2, 70
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="{W}mm" height="{H}mm" viewBox="0 0 {W} {H}">
  <rect width="{W}" height="{H}" fill="{CREAM}"/>
  <rect x="0" y="0" width="{W}" height="34" fill="{GREEN}"/>
  <text x="{W / 2}" y="14" text-anchor="middle" font-family="{FONT}" font-size="7" fill="{GOLD}" font-weight="600">ตลาดท่านา &#183; TALAT THA NA</text>
  <text x="{W / 2}" y="27" text-anchor="middle" font-family="{FONT}" font-size="11" fill="{CREAM}" font-weight="700">จุดที่ {poi.id} จาก {total}</text>

  <circle cx="{W / 2}" cy="52" r="14" fill="{GOLD}"/>
  <text x="{W / 2}" y="57" text-anchor="middle" font-family="{FONT}" font-size="14" fill="{INK}" font-weight="700">{poi.id}</text>

  {qr_svg_group(url, qr_x, qr_y, qr_size)}

  <text x="{W / 2}" y="{qr_y + qr_size + 14}" text-anchor="middle" font-family="{FONT}" font-size="8.5" fill="{INK}" font-weight="600">{poi.name}</text>
  <text x="{W / 2}" y="{qr_y + qr_size + 24}" text-anchor="middle" font-family="{FONT}" font-size="6" fill="{BROWN}">สแกน QR เพื่อสะสมแสตมป์ดิจิทัล</text>
</svg>"""


if __name__ == "__main__":
    total = len(SEED_POIS)
    print(f"BASE_URL = {BASE_URL}  (placeholder — see docstring)\n")
    for poi in SEED_POIS:
        svg = sign_svg(poi, total)
        out_path = OUT / f"checkpoint-{poi.id}.svg"
        out_path.write_text(svg, encoding="utf-8")
        print(f"wrote {out_path.name:<20} {poi.name:<30} -> {BASE_URL}/checkin/{poi.id}?t={poi.qr_secret}")
    print(f"\n{total} signs written to {OUT}")
    print("PLACEHOLDER domain encoded — regenerate + re-verify with a real phone scan before printing.")
