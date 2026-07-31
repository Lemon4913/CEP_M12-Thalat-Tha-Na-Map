# 06 — Roadmap

Ordered by dependency, not by preference. Each item says what unblocks it and what it unblocks.

---

## Now

### 1. Decide hosting — this blocks almost everything

The static prototype would run happily on GitHub Pages. The FastAPI backend will not. Since stamp persistence and redemption validation both need a server, GitHub Pages alone is a dead end.

Options:

| Option | Trade-off |
|---|---|
| GitHub Pages + external BaaS (Firebase / Supabase) | Keeps the current static deploy; drops the FastAPI backend that's already scaffolded |
| Vercel / Render / Fly for the whole thing | Keeps FastAPI and the encryption work; slightly more setup, and needs to survive the team handover |
| Split: Pages for frontend, hosted API elsewhere | CORS and two deploy targets to maintain |

**Constraint that should drive this:** after the student team moves on, this has to keep working with near-zero maintenance and near-zero budget. Pick for a five-year unattended lifespan, not for developer convenience.

**Blocks:** real QR URLs → poster print run → the rally actually functioning.

### 2. Port the prototype into React

The design is finished and approved; this is transcription, not design work. Checklist in [`02-product-spec.md`](02-product-spec.md#porting-checklist-prototype--react).

Suggested order: tokens and font → bottom nav and routing → stamps tab (simplest) → history tab → map SVG → kiosk → modal. Map last of the visual work; it's the fiddliest.

### 3. Stamp persistence

The single biggest functional gap. Needs:

- Anonymous visitor session — random opaque id, no login, no personal data
- `POST` stamp event → backend, encrypted at rest (`backend/app/crypto/`)
- Client cache so progress survives a dropped connection; queue and reconcile
- Idempotent scans — re-scanning must not double-count

**Blocked by:** hosting decision.

---

## Next

### 4. Redemption validation

Server is the authority on 7/7. Single-use codes, marked consumed server-side, resistant to screenshot replay. The reward is a physical print with real cost, so client-side trust isn't acceptable.

**Blocked by:** stamp persistence.

### 5. Update poster QR and print

Update `QR_URL`, regenerate, verify with `pyzbar`, run the print checklist in [`05-print-assets.md`](05-print-assets.md), then print.

**Blocked by:** hosting decision. **Blocks:** the physical rally existing at all.

### 6. Produce the 7 QR point signs

Currently only the poster and postcard exist. Each of the 7 physical points needs its own weather-durable sign with its own QR in the shrine-niche frame. These live outdoors on a riverside — specify material accordingly.

### 7. Postcard back design

Classic postcard back: stamp box top-right, address rules, divider, and the 7-stamp grid.

### 8. Mascot integration

Replace the generic pomelo mark on the postcard with the actual **น้องส้มโอ** character. Also produce a small mascot asset set for reuse across signage and the app's empty/locked states.

---

## Later

### 9. Analytics layer

The visit-distribution data is the evidence base for whether the intervention worked — it's what turns this from a nice app into a defensible CEP result. `analytics/` reads from the DB and produces:

- Scans per point over time — where do visitors actually stop?
- **Drop-off between points** — the key metric. If everyone gets stamps 1–3 and nobody reaches 6–7, the route is failing and the far-end vendors still aren't getting traffic.
- Weekday vs weekend footfall — the original problem
- Completion rate and redemption rate

Read-only. Never writes to production data.

### 10. Vendor-facing outcome

Currently the vendors are beneficiaries of the system but have no window into it. A simple periodic summary — even a printed sheet — showing footfall trends would make the project's value visible to the people it's for, and materially improve the odds the community keeps it alive after handover.

### 11. Lighting and parking

Two of the six problems in [`01-concept.md`](01-concept.md) — dark walkways and no parking map — are not solved by the app. The parking map is at least partly a software problem and could fold into the map tab. Lighting isn't, but it should stay on the record rather than quietly disappear because it's not code.

---

## Handover risk

The largest long-term risk isn't technical. It's that this is a student project with a fixed team and a graduation date. Anything that requires ongoing paid infrastructure, credential rotation, or an active maintainer is likely to stop working. Prefer boring, cheap and static wherever the mechanic allows it.

---

*Related: [`01-concept.md`](01-concept.md) · [`02-product-spec.md`](02-product-spec.md) · [`../CLAUDE.md`](../CLAUDE.md)*
