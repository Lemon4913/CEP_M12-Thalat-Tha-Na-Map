import { useId } from "react";
import type { POICategory } from "../types";

/**
 * Original, flat vector artwork for each check-in point.
 *
 * These are drawn here on purpose: the real businesses (Aya Coffee, the pomelo
 * shop, ...) are other people's premises and the photos of them online are
 * other people's copyright. Nothing in this app hotlinks or embeds an external
 * image — every motif below is geometry we own, in the project palette.
 *
 * All fills reference design tokens through CSS custom properties, so the
 * artwork can never drift away from the "Minimal Thai heritage" system.
 */

export type ArtVariant =
  | "shrine"
  | "pier"
  | "shopfront"
  | "walkway"
  | "coffee"
  | "pomelo"
  | "banana";

/**
 * The 7 real checkpoints keyed by their stable POI id. Anything added later
 * falls back to a sensible motif for its category.
 */
const VARIANT_BY_POI_ID: Record<string, ArtVariant> = {
  "1": "shrine",
  "2": "pier",
  "3": "shopfront",
  "4": "walkway",
  "5": "coffee",
  "6": "pomelo",
  "7": "banana",
};

const VARIANT_BY_CATEGORY: Record<POICategory, ArtVariant> = {
  history: "shrine",
  shop: "shopfront",
  food: "coffee",
  art: "walkway",
};

export function artVariantFor(poiId: string, category: POICategory): ArtVariant {
  return VARIANT_BY_POI_ID[poiId] ?? VARIANT_BY_CATEGORY[category];
}

interface Props {
  variant: ArtVariant;
  className?: string;
}

function PoiArt({ variant, className }: Props) {
  // useId keeps gradient/clip ids unique when several illustrations share a page.
  const uid = useId().replace(/:/g, "");
  const skyId = `sky-${uid}`;

  return (
    <svg
      className={className ? `poi-art ${className}` : "poi-art"}
      viewBox="0 0 400 240"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={skyId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--cream-lt)" />
          <stop offset="100%" stopColor="var(--cream-md)" />
        </linearGradient>
      </defs>

      {/* Shared backdrop: warm wash + low sun, so every motif reads as one set. */}
      <rect width="400" height="240" fill={`url(#${skyId})`} />
      <circle cx="316" cy="62" r="44" fill="var(--gold)" opacity="0.16" />
      <circle cx="316" cy="62" r="26" fill="var(--gold)" opacity="0.14" />

      {variant === "shrine" && <Shrine />}
      {variant === "pier" && <Pier />}
      {variant === "shopfront" && <Shopfront />}
      {variant === "walkway" && <Walkway />}
      {variant === "coffee" && <Coffee />}
      {variant === "pomelo" && <Pomelo />}
      {variant === "banana" && <Banana />}
    </svg>
  );
}

/* ── 1. ศาลเจ้าแม่เบิกไพร — Thai-Chinese shrine ───────────────── */
function Shrine() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />
      <rect y="196" width="400" height="3" fill="var(--brown-lt)" opacity="0.18" />

      {/* body */}
      <rect x="132" y="126" width="136" height="70" fill="var(--cream-lt)" />
      <rect x="132" y="126" width="136" height="70" fill="none" stroke="var(--green)" strokeWidth="2.5" />
      <rect x="176" y="150" width="48" height="46" fill="var(--green)" />
      <circle cx="214" cy="174" r="2.5" fill="var(--gold)" />
      <rect x="140" y="140" width="26" height="26" fill="var(--green)" opacity="0.16" />
      <rect x="234" y="140" width="26" height="26" fill="var(--green)" opacity="0.16" />

      {/* lower sweeping roof */}
      <path
        d="M64 122 Q200 84 336 122 L316 134 Q200 100 84 134 Z"
        fill="var(--green)"
      />
      {/* upper tier */}
      <path
        d="M108 92 Q200 62 292 92 L276 102 Q200 76 124 102 Z"
        fill="var(--green-lt)"
      />
      {/* finial */}
      <rect x="196" y="52" width="8" height="18" fill="var(--gold)" />
      <circle cx="200" cy="48" r="7" fill="var(--gold)" />

      {/* hanging lanterns */}
      <line x1="104" y1="128" x2="104" y2="146" stroke="var(--brown-lt)" strokeWidth="1.5" />
      <ellipse cx="104" cy="154" rx="9" ry="11" fill="var(--gold)" />
      <line x1="296" y1="128" x2="296" y2="146" stroke="var(--brown-lt)" strokeWidth="1.5" />
      <ellipse cx="296" cy="154" rx="9" ry="11" fill="var(--gold)" />
    </g>
  );
}

/* ── 2. ท่าเรือริมน้ำ — riverside pier ────────────────────────── */
function Pier() {
  return (
    <g>
      {/* river */}
      <rect y="160" width="400" height="80" fill="var(--river)" opacity="0.55" />
      <path d="M0 176 Q50 170 100 176 T200 176 T300 176 T400 176" stroke="var(--cream-lt)" strokeWidth="2" fill="none" opacity="0.5" />
      <path d="M0 200 Q60 194 120 200 T240 200 T360 200 T400 200" stroke="var(--cream-lt)" strokeWidth="2" fill="none" opacity="0.35" />

      {/* far bank */}
      <rect y="150" width="400" height="12" fill="var(--green)" opacity="0.25" />

      {/* pier deck + posts */}
      <rect x="40" y="146" width="210" height="10" fill="var(--brown-lt)" />
      <rect x="40" y="146" width="210" height="3" fill="var(--gold)" opacity="0.6" />
      <rect x="58" y="156" width="8" height="40" fill="var(--brown-lt)" opacity="0.8" />
      <rect x="130" y="156" width="8" height="46" fill="var(--brown-lt)" opacity="0.8" />
      <rect x="222" y="156" width="8" height="42" fill="var(--brown-lt)" opacity="0.8" />

      {/* pier shelter */}
      <path d="M52 146 L108 108 L164 146 Z" fill="var(--green)" />
      <rect x="104" y="112" width="8" height="34" fill="var(--brown-lt)" />

      {/* long-tail boat */}
      <path d="M250 186 Q300 200 358 186 L350 196 Q300 208 258 196 Z" fill="var(--brown)" />
      <rect x="292" y="172" width="26" height="14" fill="var(--gold)" />
      <line x1="352" y1="186" x2="382" y2="168" stroke="var(--brown)" strokeWidth="4" strokeLinecap="round" />
    </g>
  );
}

/* ── 3. โซนร้านค้าสามแยก — shophouse row with awning ──────────── */
function Shopfront() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />

      {/* building */}
      <rect x="70" y="72" width="260" height="124" fill="var(--cream-lt)" stroke="var(--brown-lt)" strokeWidth="2" />
      {/* upper shutters */}
      <rect x="98" y="90" width="42" height="34" fill="var(--green)" opacity="0.2" stroke="var(--green)" strokeWidth="1.5" />
      <rect x="180" y="90" width="42" height="34" fill="var(--green)" opacity="0.2" stroke="var(--green)" strokeWidth="1.5" />
      <rect x="262" y="90" width="42" height="34" fill="var(--green)" opacity="0.2" stroke="var(--green)" strokeWidth="1.5" />

      {/* striped awning */}
      <path d="M56 136 L344 136 L326 166 L74 166 Z" fill="var(--green)" />
      <path d="M110 136 L96 166 L124 166 L138 136 Z" fill="var(--cream-lt)" opacity="0.85" />
      <path d="M194 136 L180 166 L208 166 L222 136 Z" fill="var(--cream-lt)" opacity="0.85" />
      <path d="M278 136 L264 166 L292 166 L306 136 Z" fill="var(--cream-lt)" opacity="0.85" />

      {/* stalls under the awning */}
      <rect x="96" y="170" width="60" height="26" fill="var(--gold)" opacity="0.45" />
      <rect x="170" y="170" width="60" height="26" fill="var(--gold)" opacity="0.3" />
      <rect x="244" y="170" width="60" height="26" fill="var(--gold)" opacity="0.45" />

      {/* hanging sign */}
      <rect x="168" y="46" width="64" height="22" fill="var(--gold)" />
      <rect x="196" y="68" width="8" height="6" fill="var(--brown-lt)" />
    </g>
  );
}

/* ── 4. โซนเดินเล่นทางเข้า — strolling lane, lanterns, seating ── */
function Walkway() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />

      {/* receding lane */}
      <path d="M150 118 L250 118 L330 240 L70 240 Z" fill="var(--cream-lt)" />
      <path d="M186 118 L214 118 L214 240 L186 240 Z" fill="var(--brown-lt)" opacity="0.08" />

      {/* left shop faces */}
      <rect x="34" y="96" width="116" height="100" fill="var(--cream-lt)" stroke="var(--brown-lt)" strokeWidth="2" />
      <path d="M28 132 L152 132 L146 156 L34 156 Z" fill="var(--green)" />
      <rect x="56" y="162" width="34" height="34" fill="var(--gold)" opacity="0.4" />
      <rect x="102" y="162" width="34" height="34" fill="var(--gold)" opacity="0.25" />

      {/* right shop faces */}
      <rect x="250" y="96" width="116" height="100" fill="var(--cream-lt)" stroke="var(--brown-lt)" strokeWidth="2" />
      <path d="M248 132 L372 132 L366 156 L254 156 Z" fill="var(--green)" />
      <rect x="264" y="162" width="34" height="34" fill="var(--gold)" opacity="0.25" />
      <rect x="310" y="162" width="34" height="34" fill="var(--gold)" opacity="0.4" />

      {/* lantern string across the lane */}
      <path d="M150 106 Q200 128 250 106" stroke="var(--brown-lt)" strokeWidth="1.5" fill="none" />
      <circle cx="172" cy="117" r="7" fill="var(--gold)" />
      <circle cx="200" cy="122" r="7" fill="var(--gold-lt)" />
      <circle cx="228" cy="117" r="7" fill="var(--gold)" />

      {/* bench */}
      <rect x="168" y="204" width="64" height="7" fill="var(--brown-lt)" />
      <rect x="174" y="211" width="6" height="14" fill="var(--brown-lt)" opacity="0.8" />
      <rect x="220" y="211" width="6" height="14" fill="var(--brown-lt)" opacity="0.8" />
    </g>
  );
}

/* ── 5. ร้าน Aya Coffee — cup and saucer ──────────────────────── */
function Coffee() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />

      {/* steam */}
      <path d="M178 92 Q168 74 178 56 Q188 40 178 26" stroke="var(--brown-lt)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.4" />
      <path d="M206 92 Q196 76 206 60 Q216 46 206 34" stroke="var(--brown-lt)" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.28" />

      {/* cup */}
      <path d="M132 106 L268 106 L256 176 Q252 192 236 192 L164 192 Q148 192 144 176 Z" fill="var(--green)" />
      <path d="M138 106 L262 106 L258 126 L142 126 Z" fill="var(--cream-lt)" opacity="0.9" />
      {/* handle */}
      <path d="M268 122 Q302 122 302 146 Q302 170 268 170" stroke="var(--green)" strokeWidth="12" fill="none" strokeLinecap="round" />

      {/* saucer */}
      <ellipse cx="200" cy="198" rx="106" ry="16" fill="var(--brown-lt)" opacity="0.25" />
      <ellipse cx="200" cy="194" rx="106" ry="15" fill="var(--cream-lt)" stroke="var(--green)" strokeWidth="2" />

      {/* bean mark */}
      <ellipse cx="200" cy="150" rx="15" ry="21" fill="var(--gold)" />
      <path d="M200 132 Q192 150 200 168" stroke="var(--green)" strokeWidth="2.5" fill="none" />
    </g>
  );
}

/* ── 6. ร้านบ้านส้มโอหวาน — pomelo ────────────────────────────── */
function Pomelo() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />

      {/* whole fruit */}
      <circle cx="158" cy="140" r="66" fill="var(--green)" />
      <circle cx="158" cy="140" r="66" fill="var(--green-lt)" opacity="0.5" />
      <path d="M118 96 Q158 84 198 96" stroke="var(--cream-lt)" strokeWidth="4" fill="none" opacity="0.35" strokeLinecap="round" />

      {/* leaf + stem */}
      <path d="M158 74 L158 60" stroke="var(--brown)" strokeWidth="4" strokeLinecap="round" />
      <path d="M158 64 Q192 42 216 58 Q192 82 158 64 Z" fill="var(--green)" />

      {/* cut half */}
      <circle cx="288" cy="162" r="48" fill="var(--cream-lt)" stroke="var(--green)" strokeWidth="4" />
      <circle cx="288" cy="162" r="36" fill="var(--gold)" opacity="0.35" />
      <g stroke="var(--cream-lt)" strokeWidth="3">
        <line x1="288" y1="126" x2="288" y2="198" />
        <line x1="252" y1="162" x2="324" y2="162" />
        <line x1="262" y1="136" x2="314" y2="188" />
        <line x1="314" y1="136" x2="262" y2="188" />
      </g>
      <circle cx="288" cy="162" r="7" fill="var(--cream-lt)" />
    </g>
  );
}

/* ── 7. ร้านแม่จำเริญ กล้วยอบน้ำผึ้งทอด — honey banana ────────── */
function Banana() {
  return (
    <g>
      <rect y="196" width="400" height="44" fill="var(--cream-md)" />

      {/* banana leaf backdrop */}
      <path d="M40 176 Q108 66 216 60 Q180 168 66 190 Z" fill="var(--green)" opacity="0.22" />
      <path d="M40 176 Q108 66 216 60" stroke="var(--green)" strokeWidth="2.5" fill="none" opacity="0.5" />

      {/* bananas */}
      <path d="M112 108 Q206 86 286 140 Q292 156 274 154 Q198 112 118 124 Q104 122 112 108 Z" fill="var(--gold)" />
      <path d="M124 136 Q216 118 290 168 Q296 184 278 182 Q206 142 130 152 Q116 150 124 136 Z" fill="var(--gold-lt)" />
      <path d="M136 164 Q220 150 292 194 Q298 210 280 208 Q214 172 142 180 Q128 178 136 164 Z" fill="var(--gold)" />

      {/* stem tips */}
      <rect x="104" y="102" width="16" height="10" rx="3" fill="var(--brown)" transform="rotate(-14 112 107)" />

      {/* honey drizzle */}
      <path d="M300 150 Q314 168 302 184 Q290 194 296 206" stroke="var(--gold)" strokeWidth="5" fill="none" strokeLinecap="round" opacity="0.8" />
      <circle cx="298" cy="212" r="6" fill="var(--gold)" opacity="0.8" />
    </g>
  );
}

export default PoiArt;
