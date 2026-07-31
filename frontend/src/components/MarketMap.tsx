import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { POI } from "../types";
import { MARKET_CENTER, poiLatLng } from "../lib/geo";
import isoMapArt from "../assets/market-map-isometric.webp";

/**
 * The illustrated market map — an isometric bird's-eye illustration of Talat
 * Tha Na, with the seven check-point badges laid over it.
 *
 * This used to be hand-coded SVG: flat traced polygons, correct but plain. The
 * drawing is now a single generated illustration (see `isoMapArt`), and the
 * only geometry left in this file is the transform that decides where each
 * check-point badge sits on top of it. That split is deliberate — the art is
 * fixed pixels, the pins stay data-driven, so adding or moving a check-point
 * needs no new artwork.
 *
 * ── how the art was made ─────────────────────────────────────────────────
 * Not prompted freehand. A massing model was rendered offline from this
 * project's own surveyed data — the 26 satellite-traced building footprints
 * the previous version of this file drew, the real OSM road/river centre lines
 * in lib/marketGeo.ts, and the parking apron and market lanes — projected
 * through exactly the ISO_* transform below. That block model was then handed
 * to an image model as a layout reference and re-rendered as the finished
 * illustration, so the picture's massing, street pattern and proportions are
 * the real ones and the pin transform below lands on them.
 *
 * The illustration is synthesised original art committed as a project asset,
 * the same standing as PoiArt.tsx's hand-drawn illustrations. The satellite
 * imagery it was ultimately traced from stays a local reference only — never
 * committed, hotlinked or embedded, and nothing here fetches a third-party
 * tile server (that is LeafletMarketMap.tsx's job, behind the map toggle).
 *
 * ── the projection ───────────────────────────────────────────────────────
 * A dimetric ("isometric") camera standing to the south-west and looking
 * north-east, so the Tha Chin river is the far edge of the picture and
 * ถนนธรรมสพน์ the near one:
 *
 *   1. take metres east/north of MARKET_CENTER,
 *   2. rotate the world 45° so north-east points away from the camera,
 *   3. squash the ground plane by sin(elevation) = 0.75 (a ~49° camera).
 *
 * Everything lands in one square frame, FRAME_SPAN metres wide, whose corner
 * is (FRAME_X0, FRAME_Y0) in projected units. Those three numbers are the
 * contract with the artwork: change them and the pins slide off the buildings.
 */

interface Props {
  pois: POI[];
  earnedIds: Set<string>;
}

/* ── canvas ──────────────────────────────────────────────────── */

/** The art is square, so the overlay is one square coordinate space too. */
const VIEW = 1000;

/**
 * Badges are kept this far inside the frame. A badge is 48px wide and the
 * stage is ~360px on the narrowest phone the app targets, so half a badge is
 * roughly 67 view units — 70 keeps a badge whole even in the corners.
 */
const PIN_BOX = { x0: 70, x1: 930, y0: 70, y1: 930 };

/**
 * Minimum gap between two badge centres, in view units.
 *
 * 48px tap target (CLAUDE.md: never below 44px) at ~0.36 view units per CSS
 * pixel on a 360px stage — 150 units ≈ 54px, one badge plus a little air.
 */
const MIN_PIN_GAP = 150;

/* ── isometric projection ────────────────────────────────────── */

const M_PER_DEG_LAT = 111320;
const M_PER_DEG_LNG =
  M_PER_DEG_LAT * Math.cos((MARKET_CENTER[0] * Math.PI) / 180);

/** cos 45° = sin 45°, the world rotation that puts north-east "away". */
const ISO_ROT = Math.SQRT1_2;
/** sin(camera elevation). 0.75 ≈ a 49° camera: readable streets, real depth. */
const ISO_SQUASH = 0.75;
/** Frame the artwork was rendered in, in projected units (≈ metres). */
const FRAME_X0 = -132.5;
const FRAME_Y0 = -57.2;
const FRAME_SPAN = 185;

interface Point {
  x: number;
  y: number;
}

interface Pin {
  poi: POI;
  index: number;
  /** Badge position — decluttered, so it can sit a few metres off the truth. */
  x: number;
  y: number;
  /** Anchor position — where the checkpoint really is, never nudged. */
  ax: number;
  ay: number;
}

function eastNorth(lat: number, lng: number) {
  return {
    east: (lng - MARKET_CENTER[1]) * M_PER_DEG_LNG,
    north: (lat - MARKET_CENTER[0]) * M_PER_DEG_LAT,
  };
}

/** Metres east/north of MARKET_CENTER → view units on the illustration. */
function isoProject(east: number, north: number): Point {
  const u = (east - north) * ISO_ROT;
  const v = (east + north) * ISO_ROT;
  return {
    x: ((u - FRAME_X0) / FRAME_SPAN) * VIEW,
    y: ((-v * ISO_SQUASH - FRAME_Y0) / FRAME_SPAN) * VIEW,
  };
}

function projectPins(pois: POI[]): Pin[] {
  const pins: Pin[] = pois.map((poi, index) => {
    const [lat, lng] = poiLatLng(poi);
    const { east, north } = eastNorth(lat, lng);
    const { x, y } = isoProject(east, north);
    return { poi, index, x, y, ax: x, ay: y };
  });
  declutter(pins);
  return pins;
}

/**
 * Nudges overlapping badges apart.
 *
 * Some checkpoints genuinely stand a few metres from each other — Aya Coffee
 * and ร้านแม่จำเริญ are doors apart on the same shophouse terrace — which at
 * this scale puts their badges on top of one another. A fixed number of damped
 * repulsion passes, clamped back into `PIN_BOX`, spreads them without
 * randomness, so the same coordinates always produce the same picture. A badge
 * that has drifted keeps a leader line back to its untouched anchor (see
 * `LEADER_MIN`), so the map stays honest about where the checkpoint really is.
 */
function declutter(pins: Pin[]) {
  for (let pass = 0; pass < 400; pass++) {
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const dx = pins[j].x - pins[i].x;
        const dy = pins[j].y - pins[i].y;
        const dist = Math.hypot(dx, dy) || 0.001;
        if (dist >= MIN_PIN_GAP) continue;
        const push = ((MIN_PIN_GAP - dist) / dist) * 0.25;
        pins[i].x -= dx * push;
        pins[i].y -= dy * push;
        pins[j].x += dx * push;
        pins[j].y += dy * push;
      }
    }
    for (const pin of pins) {
      pin.x = Math.min(PIN_BOX.x1, Math.max(PIN_BOX.x0, pin.x));
      pin.y = Math.min(PIN_BOX.y1, Math.max(PIN_BOX.y0, pin.y));
    }
  }
}

/** Draw a leader back to the anchor only once the badge has really drifted. */
const LEADER_MIN = 26;

/**
 * Compass rose.
 *
 * North is *not* up here — the camera is rotated 45°, so north runs up and to
 * the left. The needle is computed from the same transform as the pins rather
 * than eyeballed, so it can never disagree with the drawing underneath it.
 */
function Compass() {
  const n = isoProject(0, 1);
  const o = isoProject(0, 0);
  const dx = n.x - o.x;
  const dy = n.y - o.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  const r = 30;
  const w = 8;
  const tip = `${ux * r},${uy * r}`;
  const left = `${-px * w},${-py * w}`;
  const right = `${px * w},${py * w}`;
  const tail = `${-ux * r},${-uy * r}`;
  return (
    <g transform="translate(112 112)" opacity="0.9">
      <circle r="40" fill="var(--cream-lt)" fillOpacity="0.82" />
      <circle r="40" fill="none" stroke="var(--brown-lt)" strokeOpacity="0.3" strokeWidth="1.5" />
      <polygon points={`${tip} ${left} ${right}`} fill="var(--green)" />
      <polygon points={`${tail} ${left} ${right}`} fill="var(--brown-lt)" fillOpacity="0.35" />
      <circle r="3.5" fill="var(--gold)" />
      <text
        x={ux * 52}
        y={uy * 52 + 6}
        textAnchor="middle"
        fontFamily="var(--font)"
        fontSize="17"
        fontWeight="700"
        fill="var(--green)"
      >
        N
      </text>
    </g>
  );
}

/* ── component ───────────────────────────────────────────────── */

function MarketMap({ pois, earnedIds }: Props) {
  const navigate = useNavigate();
  const pins = useMemo(() => projectPins(pois), [pois]);

  return (
    <div className="market-map">
      <div className="market-map-stage">
        <img
          className="market-map-canvas"
          src={isoMapArt}
          alt=""
          aria-hidden="true"
          width={1200}
          height={1200}
          decoding="async"
        />

        {/* Leader lines and true-position anchors, in the same square space as
            the badge percentages so the two can never drift apart. */}
        <svg
          className="market-map-canvas"
          viewBox={`0 0 ${VIEW} ${VIEW}`}
          preserveAspectRatio="none"
          role="presentation"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
        >
          {pins.map((pin) => {
            const drift = Math.hypot(pin.x - pin.ax, pin.y - pin.ay);
            if (drift <= LEADER_MIN) return null;
            return (
              <g key={pin.poi.id}>
                <line
                  x1={pin.ax}
                  y1={pin.ay}
                  x2={pin.x}
                  y2={pin.y}
                  stroke="var(--brown)"
                  strokeWidth="2.5"
                  strokeOpacity="0.45"
                  strokeDasharray="7 8"
                  strokeLinecap="round"
                />
                <circle
                  cx={pin.ax}
                  cy={pin.ay}
                  r="7"
                  fill="var(--cream-lt)"
                  fillOpacity="0.9"
                  stroke="var(--brown)"
                  strokeOpacity="0.5"
                  strokeWidth="2"
                />
                <circle cx={pin.ax} cy={pin.ay} r="3" fill="var(--gold)" />
              </g>
            );
          })}
          <Compass />
        </svg>

        {pins.map(({ poi, index, x, y }) => {
          const done = earnedIds.has(poi.id);
          return (
            <button
              key={poi.id}
              type="button"
              className={`poi-marker${done ? " is-done" : ""}`}
              // The map crops its own overflow, so a badge close to an edge
              // hangs its name label off that edge rather than centring it.
              data-align={x < 300 ? "start" : x > 700 ? "end" : "center"}
              style={{
                left: `${(x / VIEW) * 100}%`,
                top: `${(y / VIEW) * 100}%`,
              }}
              title={poi.name}
              aria-label={`จุดที่ ${index + 1} ${poi.name}${
                done ? " (เก็บแสตมป์แล้ว)" : ""
              }`}
              onClick={() => navigate(`/poi/${poi.id}`)}
            >
              <span className="poi-marker-pulse" aria-hidden="true" />
              <span className="poi-marker-dot" aria-hidden="true">
                {done ? "✓" : index + 1}
              </span>
              <span className="poi-marker-label" aria-hidden="true">
                {poi.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default MarketMap;
