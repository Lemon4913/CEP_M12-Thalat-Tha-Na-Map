import { Link } from "react-router-dom";
import { useMarketProgress } from "../hooks/useMarketProgress";
import LogoMark from "../components/LogoMark";

// Owner: Person A (Map & POI pages)
// Full-bleed hero: original vector scene of the market on the river, with the
// copy sitting on a frosted panel over it. No photography — see PoiArt.tsx.
function Landing() {
  const { pois, checkins } = useMarketProgress();
  const total = pois.length || 7;
  const collected = checkins.length;
  const started = collected > 0;

  return (
    <main className="landing">
      <HeroScene />

      <div className="landing-veil" />

      <div className="landing-content">
        <LogoMark className="landing-badge" tone="light" />

        <p className="landing-eyebrow">ตลาดริมน้ำอายุกว่า 140 ปี</p>
        <h1 className="landing-title">ตลาดท่านา</h1>
        <p className="landing-sub">นครชัยศรี · นครปฐม</p>

        <div className="landing-panel">
          <p className="landing-desc">
            สแกน QR code ตามจุดต่างๆ ในตลาดเพื่อสะสมแสตมป์ดิจิทัล ครบ {total} จุด
            รับภาพ exclusive ที่ตู้จ่ายภาพ
          </p>

          {started && (
            <div className="landing-progress">
              <div className="landing-progress-row">
                <span>เก็บแสตมป์แล้ว</span>
                <strong>
                  {collected} / {total} จุด
                </strong>
              </div>
              <div className="landing-progress-track">
                <div
                  className="landing-progress-fill"
                  style={{ width: `${(collected / total) * 100}%` }}
                />
              </div>
            </div>
          )}

          <Link to="/map" className="btn-pill btn-pill-gold landing-cta">
            {started ? "เดินตลาดต่อ" : "เริ่มเดินตลาด"}
            <ArrowIcon />
          </Link>

          <Link to="/stamps" className="landing-secondary">
            ดูสมุดแสตมป์ของฉัน
          </Link>
        </div>
      </div>
    </main>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="btn-pill-icon" aria-hidden="true">
      <path
        d="M5 12h13m0 0-5-5m5 5-5 5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Original artwork: shophouse roofline over the Nakhon Chai Si river.
 * Drawn from design tokens only, so it can never drift from the palette.
 */
function HeroScene() {
  return (
    <svg
      className="landing-art"
      viewBox="0 0 420 760"
      preserveAspectRatio="xMidYMid slice"
      role="presentation"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="heroSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" />
          <stop offset="55%" stopColor="var(--green-lt)" />
          <stop offset="100%" stopColor="var(--green)" />
        </linearGradient>
      </defs>

      <rect width="420" height="760" fill="url(#heroSky)" />

      {/* sun */}
      <circle cx="316" cy="150" r="62" fill="var(--gold)" opacity="0.28" />
      <circle cx="316" cy="150" r="36" fill="var(--gold-lt)" opacity="0.32" />

      {/* distant treeline */}
      <path
        d="M0 430 q40 -26 78 -6 q34 -30 74 -8 q40 -26 80 -4 q38 -28 80 -6 q46 -22 108 0 L420 470 L0 470 Z"
        fill="var(--green)"
        opacity="0.45"
      />

      {/* shophouse row */}
      <g opacity="0.9">
        <rect x="24" y="392" width="96" height="86" fill="var(--green)" />
        <path d="M14 396 L72 356 L130 396 Z" fill="var(--gold)" opacity="0.25" />
        <rect x="150" y="374" width="112" height="104" fill="var(--green)" />
        <path d="M138 380 L206 336 L274 380 Z" fill="var(--gold)" opacity="0.3" />
        <rect x="292" y="400" width="104" height="78" fill="var(--green)" />
        <path d="M282 404 L344 366 L406 404 Z" fill="var(--gold)" opacity="0.22" />

        {/* lit windows */}
        <rect x="44" y="418" width="20" height="24" fill="var(--gold)" opacity="0.55" />
        <rect x="82" y="418" width="20" height="24" fill="var(--gold)" opacity="0.35" />
        <rect x="172" y="404" width="24" height="28" fill="var(--gold)" opacity="0.5" />
        <rect x="216" y="404" width="24" height="28" fill="var(--gold)" opacity="0.6" />
        <rect x="312" y="426" width="22" height="24" fill="var(--gold)" opacity="0.4" />
        <rect x="352" y="426" width="22" height="24" fill="var(--gold)" opacity="0.55" />
      </g>

      {/* pier posts */}
      <g fill="var(--brown)" opacity="0.5">
        <rect x="60" y="478" width="9" height="52" />
        <rect x="196" y="478" width="9" height="58" />
        <rect x="340" y="478" width="9" height="50" />
      </g>

      {/* river */}
      <rect y="500" width="420" height="260" fill="var(--river)" opacity="0.55" />
      <path d="M0 540 q52 -12 104 0 t104 0 t104 0 t108 0" stroke="var(--cream-lt)" strokeWidth="3" fill="none" opacity="0.28" />
      <path d="M0 592 q60 -12 120 0 t120 0 t120 0 t60 0" stroke="var(--cream-lt)" strokeWidth="3" fill="none" opacity="0.2" />
      <path d="M0 648 q52 -12 104 0 t104 0 t104 0 t108 0" stroke="var(--cream-lt)" strokeWidth="3" fill="none" opacity="0.14" />

      {/* boat */}
      <path d="M120 570 q56 16 116 0 l-10 14 q-48 14 -96 0 Z" fill="var(--brown)" opacity="0.65" />
    </svg>
  );
}

export default Landing;
