# 04 — Poster Philosophy: "Festival Timber"

The design position for **physical** materials — posters, postcards, QR signage, kiosk graphics. The screen design system ([`03-design-system.md`](03-design-system.md)) governs the app; this governs everything printed and hung in the market.

---

## The name

**Festival Timber.** Two words holding the tension the material has to hold:

- **Timber** — the market itself. 140-year-old teak shophouses, an old footbridge, carved fretwork, sun-faded paint. Weight, age, warmth, grain. The thing worth preserving.
- **Festival** — the reason to come *today*. Shrine banners, market signage, temple-fair colour. Movement, invitation, a bit of noise.

Heritage material that leans only on Timber becomes a museum plaque — respectful, and ignored. Material that leans only on Festival becomes a supermarket promo — noticed, and forgettable. The market is genuinely both: a very old place that is also a working, noisy, commercial one.

---

## Principles

### 1. The building is the layout

Compositions are structured like a shophouse elevation, not like a magazine page. A roofline or gable defines the top, a horizontal band acts as the shop sign, the body is the shopfront, and the base is the street. This gives every piece the same silhouette without needing a logo lockup to carry the identity.

### 2. Warm paper, never white

Everything sits on `--cream #F5EDD8`. No pure white anywhere, including inside QR quiet zones — white reads as a photocopy and breaks the material feel. Print on uncoated or lightly textured stock; gloss fights the whole idea.

### 3. Gold is earned, not decorative

Same rule as the app. Rice-gold `#C8993A` marks the reward, the stamp, the call to action. When gold appears on a poster it should be pointing at the thing the visitor gets. Spread it around and the stamp mechanic stops feeling like a prize.

### 4. One character, one mechanic, one action

A poster in a market competes with fruit, noise and traffic. It gets about two seconds. So each piece carries exactly three things:

- **น้องส้มโอ**, the pomelo mascot — the face, the emotional hook
- **The 7-stamp mechanic** — shown as a visual row, not explained in a paragraph
- **One action** — scan this code

Anything beyond those three gets cut. Explanation is the app's job.

### 5. The QR is enshrined, not pasted

QR codes are framed inside a **shrine-niche** motif — an arched frame borrowed from the Ama shrine, in green with gold detail. This does real work: it makes the code look intentional and permanent rather than like a taped-on sticker, it tells the visitor the code belongs to the market, and the frame survives being weathered in a way a bare code doesn't.

Non-negotiables: quiet zone stays cream, contrast stays high, **and every generated code gets verified before printing** (see [`05-print-assets.md`](05-print-assets.md)). A poster with an unscannable QR is a wasted print run and a broken rally.

### 6. Thai first, and give it room

Thai is the primary language on all physical material. Thai needs more vertical space than Latin — tone marks and vowels stack above and below the line. Never tighten leading to fit; cut copy instead. Sarabun throughout, matching the app.

### 7. Illustration over photography

Hand-illustrated, warm, slightly imperfect. Photographs of the market date fast — a stall changes, a shop closes, and the poster is instantly stale. Illustration also lets the piece show an idealised, inviting version of a walk through the market without lying about any specific shop.

The established illustration voice is **watercolour-adjacent**: soft edges, visible texture, limited palette, nothing vector-crisp.

### 8. Physical materials get the extended palette

Beyond the core tokens, print may use **mustard yellow**, **shrine red** and **pomelo green-gold**. These come from the market's own signage and the shrine. They stay in print — do not carry them into the app UI.

---

## The mascot: น้องส้มโอ

The pomelo mascot is the established character for the market. Nakhon Chai Si pomelo is the market's nationally-known product, so the mascot is both a friendly face and an accurate claim about the place.

Guidelines:

- Warm, round, a little clumsy. Approachable to children, not embarrassing to adults.
- น้องส้มโอ **demonstrates** — scanning, walking, holding a stamp card, standing at the kiosk. Showing the mechanic beats captioning it.
- Never as a floating decorative sticker with no role in the composition.
- Currently under-integrated: the postcard still uses a generic pomelo mark where the mascot should be. See [`06-roadmap.md`](06-roadmap.md).

---

## Applying it — quick check

Before a physical piece ships, ask:

1. Does it read as *this market* from three metres away?
2. Is there exactly one action?
3. Is gold pointing at the reward?
4. Does the Thai have enough room?
5. Is the QR framed, and **has it been scan-verified**?
6. Would this still look right nailed to a 140-year-old wooden wall?

If (6) fails, it's too Festival. If a visitor walks past without registering it, it's too Timber.

---

*Related: [`05-print-assets.md`](05-print-assets.md) for specs and the render pipeline*
