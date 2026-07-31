# 01 — Concept

## The place

**Talat Tha Na (ตลาดท่านา)** is a riverside community market in Nakhon Chai Si district, Nakhon Pathom. It has existed since the reign of Rama I and grew into a significant trading community by the reign of Rama V, taking its name from the pier — *ท่า* — where rice was once loaded onto boats bound for the whole Nakhon Chai Si river basin.

What the market still has:

- Roughly 140-year-old **Thai-Chinese wooden shophouses**, largely original, with carved fretwork above the doors
- A **Chinese Ama shrine (ศาลเจ้าอาม่า)** tucked between buildings, still holding annual rites
- **Riverside and canal scenery**, and an old timber footbridge still in daily use
- **Nakhon Chai Si pomelo (ส้มโอ)** — nationally known, thin-skinned and not bitter, credited to the riverside soil
- Multi-generation food vendors: braised duck, cold bread, bua loi in ginger syrup

## The problem

The market has been losing visitors. A well-known local restaurant relocated, and nothing replaced the draw. But the deeper problem is structural, not a single closure:

1. **No wayfinding.** Visitors can't tell what each shop sells, and there's no suggested route. They walk in, look at the first few stalls, and leave.
2. **Uneven distribution.** Money concentrates near the entrance. Vendors deeper in the market get skipped entirely — the ones who most need the traffic.
3. **Low weekday footfall.** Weekends are viable; Monday to Friday is not.
4. **Dark walkways** discourage anyone from exploring the far end.
5. **No parking map**, so arriving is friction before the visit even starts.
6. **The heritage is invisible.** A visitor can stand in front of a 140-year-old shophouse or the Ama shrine and have no idea what they're looking at.

## The intervention

A mobile web app combining three things that reinforce each other:

- **Wayfinding** — an interactive map of the market showing where things are
- **A reason to walk the whole market** — a QR walk-rally: 7 check-in points, 7 digital stamps, one physical reward at the end
- **Cultural storytelling** — each point unlocks the history behind it, so walking the route also teaches the market

The reward is deliberately physical: a photo kiosk (**ตู้จ่ายภาพ**) at the far end of the market prints an exclusive art print, available nowhere else. This does two jobs — it gives the rally a tangible payoff, and it places the payoff at the end of the route, so visitors have to walk past every vendor to get there.

## Who it's for

| | |
|---|---|
| **Users** | Tourists and day visitors unfamiliar with Talat Tha Na |
| **Beneficiaries** | Local vendors and shop owners, especially those away from the entrance |

The user and the beneficiary are not the same people. Every design decision should be checked against the beneficiary: *does this move a visitor further into the market, and does it make them more likely to buy something?*

## Intended outcomes

1. **Income distribution** — more time in the market means more spend, spread across more vendors rather than concentrated at the front.
2. **Navigation and measurement** — the map and QR points let visitors explore without getting lost, and simultaneously produce data on how visitors distribute across the market. That data is the evidence base for whether the intervention worked.
3. **Heritage tourism** — communicating the market's history, culture and way of life, so the visit is a cultural experience rather than a shopping errand.

## What this is not

- Not an e-commerce platform. No transactions happen in the app.
- Not a social network. No accounts, no profiles, no feed.
- Not a general-purpose tourism app for Nakhon Pathom. Scope is this one market.
- Not a permanent product with a maintenance budget. It has to keep working with minimal upkeep after the student team moves on — which is a real constraint on architecture choices.

## Ethical note

The scan data comes from members of the public in a real community, gathered to help that community. Collect the minimum needed to count visits and measure distribution across the 7 points. No accounts, no personal identifiers, no location tracking beyond the scan events themselves. Encryption for stored data is a requirement, not a nice-to-have — see `backend/app/crypto/`.

---

*Related: [`02-product-spec.md`](02-product-spec.md) for how this becomes an app · [`README.md`](../README.md) for team and objectives · [`CEP_ข้อเสนอโครงการ.md`](../CEP_ข้อเสนอโครงการ.md) for the full proposal, timeline and budget.*
