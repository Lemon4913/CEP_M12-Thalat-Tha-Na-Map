# Webapp Plan — Talat Tha Na Map

*[อ่านเป็นภาษาไทย](webapp-plan.th.md)*

Working plan for how the app functions end to end, derived from the project
proposal ([CEP_ข้อเสนอโครงการ.md](../CEP_ข้อเสนอโครงการ.md)) and the current
scaffold in `frontend/`, `backend/`, and `tools/`. Assumptions made where the
proposal doesn't specify are flagged with **[assumption]** — flip those before
building if the team wants something different.

**Revision note**: this pass re-reads the plan as a set of processes playing
out in a real, still-lived-in 140-year-old market, not just a system diagram.
A technically clean design can still recreate the market's original problem
in digital form, or create a new social friction while fixing an old one —
four such spots turned up (signage consent, POI staleness, who maintains
content after handoff, and analytics being read as a vendor scoreboard) and
are called out inline below, plus a new §6.

## 1. Core loop

1. A visitor walks up to a point of interest (POI) — a shop, historic
   building, or art installation — and finds a printed QR sticker there.
2. They scan it with their phone camera (no app install — it opens a URL in
   the browser).
3. The URL lands on a **check-in page** for that POI: it shows the POI's
   info (name, history/culture blurb, what's sold there for shops) and
   records a "digital stamp" for that POI against the visitor's session.
4. The visitor can also open the **map** directly (no scan needed) to browse
   POIs, see which ones they've already stamped, and get a sense of what's
   left to explore.
5. A **stamp book / progress view** shows collected vs. total stamps,
   turning the walk into a completionist mini-game that pulls visitors
   through the whole market instead of just the one famous stretch.

This directly serves the three proposal outcomes: wayfinding, dwell-time /
spend distribution across vendors, and cultural storytelling.

**Guardrail**: keep the stamp mechanic purely self-paced — no countdown, no
live leaderboard, no "most stamps this week" ranking. A small, dense heritage
market can't absorb a rush of visitors converging on the same POI at the
same time chasing a score; unhurried, self-paced exploration is what
actually spreads foot traffic evenly, which is the entire point of outcome
#1. Anything that turns exploration into a race works against it.

## 2. Frontend — pages & routes

| Route | Purpose |
|---|---|
| `/` | Landing: market intro, link into map, current stamp count |
| `/map` | Interactive market map with POI pins; pins show stamped/unstamped state |
| `/poi/:poiId` | POI detail (history, photos, what's sold) — reachable by browsing, no scan required |
| `/checkin/:poiId` | QR landing target — validates the scan, records the stamp, then shows the same POI detail with a "stamp collected!" state |
| `/stamps` | Stamp book: grid of all POIs, collected vs. missing, completion % |
| `/about` | Market history + project credits (content from the proposal's background section) |

`frontend/src/pages/` currently only has a `.gitkeep` — these six pages are
the first real build target. `frontend/src/components/` should hold the
reusable bits: `MapPin`, `POICard`, `StampGrid`, `StampBadge`.

**Map rendering — [assumption]**: use a custom illustrated map image (matches
the mural/art-focused branding mentioned in the proposal) with POIs placed as
`{x%, y%}` pins over the image, not a geo/GPS map (Leaflet etc.). The market
is small and pedestrian, so real GPS accuracy isn't needed, and an
illustrated map is more in keeping with the postcard/graphic-design budget
line. If the team wants real GPS positioning instead, that changes the POI
data model (lat/lng) and adds a map-tile dependency — worth deciding early
since it's a bigger frontend lift.

**Visitor identity — [assumption]**: no login. On first visit, the client
generates a random visitor ID, stores it in `localStorage`, and sends it with
every check-in. This is enough to track "has this browser stamped this POI"
and to count unique visitors in analytics, without collecting PII. If the
team wants a prize/redemption mechanism for completing the walk-rally (not
in the current budget, but a natural next step), that's the point where
you'd need an optional name/phone capture — worth flagging to the team now
rather than retrofitting later. One consequence to watch: today `visitor_id`
carries no personal meaning, so passing it as a query-string parameter (§5)
is harmless. The moment any PII gets attached to it, it needs to move out of
URLs — query strings land in server logs and leak via the `Referer` header —
and into a header or cookie instead.

**Offline resilience — [assumption]**: `/map` and `/poi/:id` should read from
a POI list fetched once and cached client-side, not from a fresh network
call per screen. Talat Tha Na is an old riverside market — narrow lanes,
dense old construction, no guaranteed signal — and a design that needs a
live round-trip to read *any* POI page will fail exactly where it's needed
most. Only the check-in write (`POST /api/checkins`) genuinely needs
connectivity at that moment; queue it locally and retry silently if it fails
rather than blocking the stamp animation on a signal bar.

## 3. QR code scheme

Each POI gets one QR code encoding a URL of the form:

```
https://<domain>/checkin/{poi_id}?t={poi_secret}
```

- `poi_id` identifies which POI this is.
- `poi_secret` is a short per-POI token (generated once, stored with the POI
  record) so a visitor can't just guess `/checkin/2`, `/checkin/3`, ... and
  farm stamps without visiting. It doesn't need to be cryptographically
  strong — this is a walk-rally, not a security boundary — just enough
  friction that typing URLs by hand isn't a shortcut.
- `tools/qr-generator.html` (already built) generates the printable QR/logo
  composite from this URL — the team pastes in the `/checkin/{id}?t=...`
  link per POI and prints. That tool stays a standalone offline utility; it
  doesn't need to talk to the backend.

Check-in flow on the backend: `POST /api/checkins` validates `poi_id` +
`t` against the stored secret, then records `(poi_id, visitor_id,
timestamp)`. Invalid/missing token → check-in page still shows the POI info
(so a broken/copied link doesn't dead-end the visitor) but doesn't grant a
stamp.

**Physical signage is a social decision, not just a print job.** Each
sticker is permanent and attached to someone else's building or storefront,
in a market that already has a beautification effort under way (the
existing murals). Before printing, each POI needs a placement-and-design
sign-off from its owner and from the team's fine-arts advisor — not a
decision made solely inside the app team. Skipping this risks the same
friction as any unwanted signage on a heritage property and spends down the
trust the project needs from vendors before it's even launched.

**The domain and hosting have to outlive the sticker.** The budget covers
one year of hosting on the school's server, but the printed QR codes
(especially the acrylic production run in step 5 of the build sequence) are
meant to last well past that. If the domain lapses or the school server is
retired after handoff, every sticker in the market points at a dead link —
recreating, in printed acrylic that can't be quietly removed, the exact
"no wayfinding, visitor left confused" problem this project exists to fix.
Two things follow: (1) use a domain the community/school commits to renewing
long-term, not one scoped to the CEP funding cycle, and (2) make sure the
check-in page still renders a POI's cached info even during a backend/DB
outage, so a hosting hiccup doesn't strand a sticker mid-market — a full
outage is the one failure mode a visitor standing in front of a sign can't
work around themselves, so it's worth designing against from day one.

## 4. Data model

| Entity | Fields |
|---|---|
| `POI` | `id`, `name`, `category` (shop / history / art / food), `description`, `image_url`, `map_x`, `map_y`, `qr_secret`, `status` (active / closed / relocated) |
| `CheckIn` | `id`, `poi_id`, `visitor_id`, `created_at` |
| `Visitor` *(implicit)* | random UUID minted client-side, never stored as its own row — just the foreign key on `CheckIn` |

`backend/app/models/` is currently empty — this is the first backend build
target, likely as SQLAlchemy models backing the `DATABASE_URL` already
stubbed in `.env.example`.

`status` exists because the market's turnover is already documented in the
proposal itself (a well-known restaurant relocated). A POI page and a
printed sticker that still describe a shop that's gone recreates the
original problem digitally — with less excuse this time, since nobody has
to guess. `/api/pois` should exclude or clearly flag non-`active` POIs so
the map never routes a visitor to a dead end; see §6 for who's actually
allowed to flip that field.

**Where encryption fits**: `backend/app/crypto/encryption.py` already has a
working Fernet encrypt/decrypt helper. Use it on any field that could
identify a real person if the DB were ever exposed — under the no-login
design above, that's minimal (no name/phone yet), but if the team adds
prize redemption later (visitor name/phone/LINE ID), those columns should
be encrypted at rest via this helper before being written by
`app/services/`.

## 5. Backend API

| Method | Path | Purpose |
|---|---|---|
| GET | `/health` | already implemented |
| GET | `/api/pois` | list all POIs (for the map + stamp book) |
| GET | `/api/pois/{id}` | single POI detail |
| POST | `/api/checkins` | body `{poi_id, t, visitor_id}` — validates token, records stamp, returns updated stamp state |
| GET | `/api/checkins?visitor_id=...` | a visitor's collected stamps (so `/stamps` works across page reloads without re-deriving from localStorage alone) |

`app/services/` holds the check-in validation + stamp-recording logic;
`app/api/routes.py` stays thin (route → service call), consistent with the
separation the repo structure doc already calls for.

Note: `GET /api/checkins?visitor_id=...` passes `visitor_id` as a query
parameter — fine while it's an anonymous UUID (§2), but revisit if it ever
doubles as a lookup key for anything personal. There's deliberately no
`PATCH /api/pois/{id}` here yet, even though something needs to flip
`status` and edit content — see §6 for why a raw CRUD endpoint isn't the
right shape for who'll actually be doing that editing.

## 6. Content lifecycle, fairness & handoff

Two processes the earlier draft of this plan skipped, both because they're
social before they're technical.

**Which shops become POIs, and how new ones get added.** If the initial POI
list is just "whichever dozen shops the team happened to photograph during
the first field visit" (§8, step 1), the app quietly recreates the fairness
problem outcome #1 is meant to fix: some vendors get the traffic boost,
others don't, with no visible reason why. Fix: agree a simple, published
inclusion rule with the village headman advisor before the first field
visit locks in the list — e.g. "every shop that wants a QR code gets one,"
or an explicitly rotating set — and give any vendor a way to ask to be added
later, since the list will need to grow after handoff anyway. This is a
short conversation now that avoids a credibility problem later; there's
nothing to build for it.

**Who updates a POI after the student team is gone.** The proposal's
sustainability plan hands the system to the municipality and community
foundation after 1–2 years. As designed so far, the only way to mark a POI
`closed`, fix a wrong description, or add a new POI is to touch the database
directly — which means in practice only whoever wrote the backend can
maintain it. That's a single point of failure that expires the day this
team graduates, and it directly undercuts the handoff the proposal promises.
It doesn't need a full admin dashboard — that would be over-building for an
eight-student team and a village-level handoff — but it does need
*something* a non-developer can operate: a shared spreadsheet that a small
script syncs into the database on a schedule is enough, and matches the
project's actual scale. Whatever the mechanism, document it as its own item
in the handoff materials (already planned for step 8 of the proposal's
timeline), not folded silently into "here's the codebase."

**Who holds `ENCRYPTION_KEY` after handoff** is the same question in
miniature: decide now whether the municipality/foundation takes custody of
it or the school keeps it in trust, so it isn't simply sitting in whichever
laptop last had `.env` on it when the team graduates.

## 7. Analytics (post-processing)

Feeds the proposal's evaluation metrics directly:

- **Quantitative**: count of active QR POIs, total unique visitors
  (`distinct visitor_id`), check-ins per POI over time → which spots get
  skipped, visitor flow patterns.
- **Qualitative**: this part isn't in-app — it's the interview/survey work
  in the proposal's field visits — but `analytics/notebooks` can still hold
  the write-up alongside the quantitative charts for the final report.

Two cautions on using these numbers, both because they'll end up in a report
read by people outside the team. `distinct visitor_id` is a proxy for
unique visitors, not a headcount — clearing localStorage and sharing a
phone within a family distort it in opposite directions — so present it as
an estimate in the evaluation report, not a precise figure; that keeps
outcome #2's own measurement honest. And per-POI check-in counts should stay
aggregated when shared outside the dev team: a public or semi-public
ranking of "which shops nobody visits" turns a wayfinding tool into a source
of friction between vendors, which is the opposite of what outcome #1 is
for. Use the per-POI breakdown internally, to decide where to add signage or
content — not as a scoreboard.

`analytics/scripts/` reads from the same Postgres DB (read-only, per
`PROJECT_STRUCTURE.md`'s existing rule) and `analytics/notebooks/` produces
the check-in heatmaps / completion-funnel charts for the sponsor report.

## 8. Build sequence (maps onto the proposal's Jul–Sep timeline)

1. **POI data + map UI** — static POI list (seeded from the first field
   visit's photos, using the inclusion rule agreed in §6), map page with
   pins, POI detail pages, cached client-side per §2. No backend needed yet
   beyond serving static JSON.
2. **Check-in flow** — backend models + `/api/checkins`, wire up
   `/checkin/:poiId`, localStorage visitor ID, stamp book page.
3. **Field test round 1** (paper QR codes, per proposal step 3) — point
   `qr-generator.html` at real `/checkin/{id}?t=...` URLs, print, test
   on-site.
4. **Refine from field feedback**, expert consultation round 2.
5. **Production QR codes** (acrylic signage) once the flow is validated and
   per-POI placement sign-off (§3) is in hand.
6. **Analytics pass and handoff** — final report, plus the non-technical
   content-update mechanism and `ENCRYPTION_KEY` custody decision from §6,
   handed over alongside the code, per the proposal's step 8 field visit.

## 9. Open decisions for the team

- Illustrated map vs. real GPS map (§2) — affects POI schema and frontend
  dependencies.
- Any reward for completing the full stamp book? Affects whether visitor
  identity stays fully anonymous or needs an opt-in contact field.
- Thai/English bilingual content — the proposal targets tourists broadly;
  worth deciding now since it affects every POI's content fields (`name_th`/
  `name_en` vs. a single field).
- POI inclusion criteria (§6) — who's in the first list, and how a vendor
  asks to be added later.
- Domain ownership and hosting continuity past the first funded year (§3) —
  someone specific needs to own renewing it.
- Per-POI signage consent (§3) — confirmed with each shop and the fine-arts
  advisor before printing, not just before installing.
