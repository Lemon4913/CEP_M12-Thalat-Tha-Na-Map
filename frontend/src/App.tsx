import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";
import POIDetail from "./pages/POIDetail";
import CheckIn from "./pages/CheckIn";
import Scan from "./pages/Scan";
import Stamps from "./pages/Stamps";
import About from "./pages/About";
import LogoMark from "./components/LogoMark";

const NAV_ITEMS = [
  { to: "/map", label: "แผนที่", icon: MapIcon },
  { to: "/scan", label: "สแกน", icon: ScanIcon },
  { to: "/stamps", label: "แสตมป์", icon: StampIcon },
  { to: "/about", label: "เกี่ยวกับ", icon: InfoIcon },
];

/**
 * The landing page is a full-bleed hero and carries its own badge, so the
 * standard header would only compete with it.
 */
function AppHeader() {
  const { pathname } = useLocation();
  if (pathname === "/") return null;

  return (
    <header className="app-header">
      <NavLink to="/" className="app-header-inner">
        <LogoMark className="app-header-logo" tone="light" />
        <span className="app-header-text">
          <span className="app-header-title">ตลาดท่านา</span>
          <span className="app-header-sub">TALAT THA NA · CHECK-IN MAP</span>
        </span>
      </NavLink>
    </header>
  );
}

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="เมนูหลัก">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `bottom-nav-item${isActive ? " is-active" : ""}`}
        >
          <Icon />
          <span className="bottom-nav-label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <AppHeader />
        <div className="app-body">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/poi/:poiId" element={<POIDetail />} />
            <Route path="/checkin/:poiId" element={<CheckIn />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/stamps" element={<Stamps />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

/* ── Nav glyphs: inline so the nav needs no icon font or network request ── */

function MapIcon() {
  return (
    <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ScanIcon() {
  return (
    <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="9" y="9" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function StampIcon() {
  return (
    <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M8.4 12.2l2.6 2.6 4.6-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg className="bottom-nav-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="8.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11v5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export default App;
