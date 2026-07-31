# 02 — Product Spec

Behaviour spec for the app. The approved reference implementation is [`mockups/talat-thana-map.html`](mockups/talat-thana-map.html) — when this document and the prototype disagree about a visual detail, the prototype wins. When they disagree about *behaviour*, this document wins (the prototype fakes state for demo purposes).

---

## Platform assumptions

- **Mobile-first, one-handed.** The user is standing in a market, in daylight, holding a phone in one hand and possibly a bag of pomelo in the other.
- **No login.** Asking a day visitor to create an account kills the rally before it starts.
- **Patchy connectivity.** Riverside 4G is unreliable. Stamp state must survive a dropped connection and reconcile later.
- **Sunlight legibility.** High contrast, generous type. This is why the palette is cream-on-green rather than a light-grey UI.
- Tap targets **≥ 44px**, always.

---

## Information architecture

Four tabs in a fixed bottom nav, plus a bottom-sheet modal for detail.

| Tab id | Thai label | Icon | Purpose |
|---|---|---|---|
| `map` | แผนที่ | 🗺 | Interactive SVG market map with 7 numbered pins + progress strip |
| `stamps` | แต้มของฉัน | ⭐ | The stamp collection — earned vs locked |
| `history` | ประวัติ | 📖 | Cultural storytelling per location |
| `kiosk` | ตู้ภาพ | 🖼 | Redemption — locked until 7/7 |

The header title stays `ตลาดท่านา`; the subtitle changes per tab (`TALAT THA NA · CHECK-IN MAP`, `· MY STAMPS`, etc.).

---

## The 7 check-in points

Canonical data lives in [`data/spots.json`](data/spots.json). Use that file — do not re-copy the array out of the prototype HTML.

| # | Name | Icon | Role in the route |
|---|---|---|---|
| 1 | ท่าเรือท่านา | ⚓ | Entry point. Usually pre-stamped as the arrival scan. |
| 2 | ตลาดเก่าห้องแถวไม้ | 🏠 | The 140-year-old shophouses — the heritage anchor |
| 3 | ศาลเจ้าอาม่า | 🏮 | The Chinese shrine — Thai-Chinese roots |
| 4 | โซนอาหาร | 🍊 | Food zone. Highest-value stop for vendors. |
| 5 | ร้านขนมปังเย็น | 🍞 | Signature food item, deliberately mid-route |
| 6 | สะพานเก่าริมน้ำ | 🌉 | The photo spot — social sharing driver |
| 7 | ตู้ภาพตลาดท่านา | 🖼 | The kiosk. Deliberately last and deliberately deep. |

Each spot carries: `id`, `name`, `sub` (one-line descriptor), `icon`, `fact` (the history shown on unlock), and `tips` (2 local recommendations — this is where vendor traffic actually gets driven).

**Route design principle:** the ordering is not arbitrary. Point 7 sits at the far end so the visitor must pass 2–6 to reach the reward. Do not renumber or reorder without re-walking the market.

---

## The stamp mechanic

### Earning

1. Visitor arrives at a physical point and finds a printed QR code (shrine-niche frame, see [`05-print-assets.md`](05-print-assets.md)).
2. Scanning opens the web app at that spot's check-in route.
3. The spot's stamp flips from **locked** to **earned**, with a brief celebratory transition.
4. Progress strip updates: `n / 7 จุด`, fill bar to `n/7 × 100%`.
5. That spot's `fact` and `tips` unlock in the ประวัติ tab.

### States

| State | Visual | Meaning |
|---|---|---|
| **Locked** | `--cream-md` fill, muted icon, no border | Not yet visited |
| **Earned** | `--gold` accent, full-colour icon, gold border | Visited and stamped |
| **Just earned** | Brief gold glow / scale transition, then settles to Earned | Feedback for the scan |
| **Kiosk locked** | Dimmed panel, badge shows `n/7` | Fewer than 7 stamps |
| **Kiosk ready** | Full colour, redemption code visible | All 7 collected |

### Rules

- **A stamp cannot be un-earned.** No undo, no reset button in the UI.
- **Idempotent scanning.** Re-scanning an already-earned QR shows that spot's detail; it must not error, and must not double-count in analytics.
- **No skipping.** Stamps can only come from a scan. There is no "mark as visited" affordance — that would break both the vendor benefit and the visit-distribution data.
- **Order is free.** Visitors may collect in any sequence. Only the count matters for redemption.

### Persistence — the main open problem

The prototype uses `let checkedIn = new Set([1])`, purely in memory. Production needs:

- An **anonymous visitor session** — a random opaque id, created on first scan, stored client-side. No login, no personal data.
- Stamp events **written to the backend** so the analytics layer can measure distribution.
- **Client-side cache** (localStorage or IndexedDB) so a visitor with a dropped connection still sees their progress and can keep scanning; queue writes and reconcile when connectivity returns.
- Server is the authority for redemption eligibility. Never let the client alone decide 7/7 — the reward is a physical print with real cost.

---

## The kiosk flow (ตู้จ่ายภาพ)

The physical payoff, sitting at point 7 at the far end of the market.

**Locked (n < 7):** panel dimmed, badge shows current count, copy explains how many remain. No path to redemption.

**Ready (n = 7):**

1. Redemption screen becomes available with a one-time code / QR.
2. Visitor presents it at the physical kiosk.
3. Kiosk prints the exclusive art print — 4 designs to choose from, printed on the spot, no waiting.
4. Redemption is **single-use** and must be marked consumed server-side.

**Constraints to design around:** prints cost money and the kiosk can run out of paper. Redemption must be verifiable offline-ish by the person staffing the kiosk, and abuse (screenshotting a code, replaying it) must fail.

---

## Detail modal

Tapping a map pin or a stamp opens a bottom sheet:

- Drag handle at top, dismissible by tap-outside or swipe-down
- Header: icon, `name`, `sub`
- Body: the `fact` (history), then `tips` as a short list
- Primary action button in `--green`, full width

If the spot is not yet earned, the `fact` should be teased or hidden — unlocking history is part of the reward loop.

---

## Porting checklist (prototype → React)

- [ ] Import `styles/tokens.css`; replace the placeholder `main.css` body font with `--font`
- [ ] Load Sarabun (300–700) — do not fall back to a system stack
- [ ] `spots.json` → typed module (`Spot` interface) consumed by all four tabs
- [ ] Bottom nav + tab routing
- [ ] SVG map component with 7 pin components driven by earned state
- [ ] Progress strip (count, fill %, stamp row)
- [ ] Stamps grid with locked/earned states
- [ ] History list gated on earned state
- [ ] Kiosk panel with locked/ready states
- [ ] Bottom-sheet modal
- [ ] Anonymous session + stamp persistence against the FastAPI backend
- [ ] Offline queue and reconcile
- [ ] Server-side redemption validation and single-use enforcement

---

*Related: [`03-design-system.md`](03-design-system.md) · [`06-roadmap.md`](06-roadmap.md)*
