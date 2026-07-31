interface Props {
  className?: string;
  /** Renders light-on-dark (over the green header / hero) or dark-on-cream. */
  tone?: "light" | "dark";
}

/**
 * The project mark: a stylised pagoda roof over river water — the market's two
 * defining features. Revived from the approved prototype's header logo
 * (docs/mockups/talat-thana-map.html) and rebuilt as a component so the hero,
 * header and stamp screens can all share one badge.
 */
function LogoMark({ className, tone = "light" }: Props) {
  const ring = tone === "light" ? "rgba(255,255,255,.22)" : "var(--cream-md)";
  const ringFill = tone === "light" ? "rgba(255,255,255,.08)" : "var(--cream-lt)";
  const water = tone === "light" ? "rgba(255,255,255,.38)" : "var(--river)";
  const waterSoft = tone === "light" ? "rgba(255,255,255,.2)" : "var(--river)";

  return (
    <svg
      className={className ? `logo-mark ${className}` : "logo-mark"}
      viewBox="0 0 42 42"
      fill="none"
      role="img"
      aria-label="ตลาดท่านา"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="21" cy="21" r="20" fill={ringFill} stroke={ring} strokeWidth="1" />
      <path d="M8 26 Q21 14 34 26" stroke="var(--gold)" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M12 26 L21 10 L30 26 Z" fill="var(--gold)" fillOpacity="0.3" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M6 29 Q21 24 36 29" stroke={water} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M6 32.5 Q21 27.5 36 32.5" stroke={waterSoft} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export default LogoMark;
