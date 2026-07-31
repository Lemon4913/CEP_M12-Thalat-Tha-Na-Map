# CLAUDE.md — Talat Tha Na Map (CEP_M12)

Context file for Claude Code / Claude in VS Code. Read this before writing any code in this repo.

---

## What this project is

A digital wayfinding map + QR "digital stamp" walk-rally web app for **Talat Tha Na (ตลาดท่านา)**, a 140-year-old riverside community market in Nakhon Chai Si, Nakhon Pathom, Thailand.

Built as a Community Engagement Program (CEP) project by students of Mahidol Wittayanusorn School (MWIT). The goal is not a tech demo — it is to move real foot traffic and real money deeper into the market, to vendors who currently get skipped.

**Problems being solved:**

1. No wayfinding — visitors don't know what each shop sells or where to go next
2. Low weekday foot traffic; visitors cluster near the entrance and leave
3. Dark walkways discourage exploring the far end of the market
4. No parking map
5. Market history and Thai-Chinese heritage are invisible to visitors

**Core mechanic:** visitor scans QR codes at **7 physical points** around the market → each scan awards a digital stamp on the web map → collecting all 7 unlocks redemption at a physical photo kiosk (**ตู้จ่ายภาพ**) for an exclusive art print.

Full background, objectives and beneficiaries: [`README.md`](README.md) · Thai: [`README.th.md`](README.th.md) · Proposal: [`CEP_ข้อเสนอโครงการ.md`](CEP_ข้อเสนอโครงการ.md)

---

## Repo state — read this before assuming

There are **two parallel implementations** in this project. Do not confuse them.

| | Path | Status |
|---|---|---|
| **Design prototype** | `docs/mockups/talat-thana-map.html` | ✅ Complete and visually finished. Single-file HTML/CSS/JS, no build step, no dependencies except Google Fonts. This is the **source of truth for design and UX.** |
| **Production app** | `frontend/` + `backend/` | 🚧 Bare scaffold only. `App.tsx` renders one `<h1>`. `routes.py` has one `/health` endpoint. Nothing else is implemented. |

**The current job is porting the prototype into the React app.** When asked to build a feature, look at how the prototype does it first — the visual language, spacing, copy, and interaction are already decided and approved. Don't reinvent them.

The prototype uses in-memory state (`let checkedIn = new Set([1])`) purely for demo purposes. The production app must persist stamps via the backend.

---

## Stack

| Layer | Stack |
|---|---|
| Frontend | TypeScript + React 18 + Vite |
| Backend | Python + FastAPI, Fernet encryption for collected visitor data |
| DB | PostgreSQL (`DATABASE_URL` in `backend/.env`) |
| Analytics | Python (pandas, matplotlib) — read-only, post-process |
| Print assets | Python → SVG → `rsvg-convert` |

Layout rationale: [`PROJECT_STRUCTURE.md`](PROJECT_STRUCTURE.md)

```bash
cd frontend && npm install && npm run dev
cd backend  && pip install -r requirements.txt && uvicorn app.main:app --reload
```

---

## Design system — non-negotiable

"Minimal Thai heritage." These tokens are already used across the web app, the A4 poster, and the A6 postcard. Keep them identical everywhere.

```
--cream    #F5EDD8   page background
--cream-lt #FAF5EA   raised surfaces / cards
--cream-md #EAE0CC   borders, dividers, inactive
--green    #2C5E42   shophouse green — primary, header, CTA
--green-lt #3D7A57   hover / active
--gold     #C8993A   rice-gold — accent, earned stamps, highlights
--gold-lt  #E0B84A   gold hover / glow
--brown    #3D2B1A   body text
--brown-lt #6B4C30   secondary text, map labels
--ink      #1E1408   headings
```

**Typeface: Sarabun only** (300/400/500/600/700). It is the only font in the system and handles Thai and Latin. Never substitute a system font stack — Thai tone marks and diacritics break.

Machine-readable copies: [`docs/design-tokens.css`](docs/design-tokens.css), [`docs/design-tokens.json`](docs/design-tokens.json), and importable at `frontend/src/styles/tokens.css`.

Full rules incl. component specs: [`docs/03-design-system.md`](docs/03-design-system.md)

---

## App structure (from the prototype)

Four tabs, bottom nav, mobile-first — visitors use this one-handed while walking:

| Tab | Thai label | Purpose |
|---|---|---|
| `map` | แผนที่ | Interactive SVG market map, 7 numbered pins, progress strip |
| `stamps` | แต้มของฉัน | Stamp collection grid, earned vs locked states |
| `history` | ประวัติ | Per-location cultural storytelling, unlocked by visiting |
| `kiosk` | ตู้ภาพ | Redemption screen — locked until 7/7 |

A bottom-sheet modal shows detail for a tapped pin: name, icon, historical `fact`, and local `tips`.

The 7 locations, with Thai names, icons, facts and tips, are extracted to [`docs/data/spots.json`](docs/data/spots.json) — **use that file as the data source when porting to React**, don't re-copy the array out of the prototype HTML.

Full behaviour spec incl. states and edge cases: [`docs/02-product-spec.md`](docs/02-product-spec.md)

---

## Conventions

- **UI copy is Thai.** Code, comments, commit messages, and docs are English. Don't translate UI strings to English "for clarity" — the users are Thai visitors.
- **Mobile-first.** Design for a phone held one-handed in sunlight. Tap targets ≥ 44px. Assume patchy 4G at the riverside.
- **Never commit** real visitor data, `.env` files, or generated analytics reports. Already covered in `.gitignore`.
- Encryption logic stays in `backend/app/crypto/` — do not scatter key handling into route handlers.
- `analytics/` reads from the DB or exports. It must never write to production data.
- Data collected from scans is from members of the public in a real community. Store the minimum needed to count visits and distribution. Don't add tracking fields "because they might be useful later."

---

## Known open items

- **QR URLs are placeholders.** The poster and physical signage QR codes point to a placeholder until the site is hosted. Update `QR_URL` in the poster generator and regenerate before printing.
- **Stamp persistence is unimplemented.** Prototype state is in-memory. Needs backend endpoints + a visitor session identifier that doesn't require login.
- **Hosting undecided.** GitHub Pages suits the static prototype but cannot serve the FastAPI backend; a split deploy or a move to Vercel/Render is needed.
- **Postcard back design** (stamp box + address lines) not yet done.
- **Mascot integration** — น้องส้มโอ, the pomelo mascot, should replace the generic pomelo mark on the postcard.

Detail and sequencing: [`docs/06-roadmap.md`](docs/06-roadmap.md)

---

## Where to look

```
docs/
├── 01-concept.md          why this project exists, who it serves
├── 02-product-spec.md     tabs, stamp mechanic, kiosk flow, states
├── 03-design-system.md    palette, type scale, components
├── 04-poster-philosophy.md "Festival Timber" — physical material design
├── 05-print-assets.md     poster/postcard specs + render pipeline
├── 06-roadmap.md          what's next, in order
├── data/spots.json        the 7 check-in locations
├── design-tokens.css/.json
├── mockups/               the approved prototype + component reference
└── assets/                logo, mascot, stamp icons, poster, postcard
```
