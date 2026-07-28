import { useMarketProgress } from "../hooks/useMarketProgress";
import MapPin from "../components/MapPin";
import POICard from "../components/POICard";

// Owner: Person A (Map & POI pages)
// The market illustration below is decorative/schematic, not a geographically
// accurate map — matches docs/mockups/talat-thana-map.html. Pins are placed
// using each POI's map_x/map_y (0-100 percentages) scaled into the 360x280 viewBox.
function MapPage() {
  const { pois, checkins } = useMarketProgress();
  const earnedIds = new Set(checkins.map((c) => c.poi_id));
  const total = pois.length;
  const collected = checkins.length;
  const pct = total === 0 ? 0 : (collected / total) * 100;

  return (
    <main>
      <div className="progress-strip">
        <div className="progress-strip-inner">
          <div className="progress-label">
            <span>เก็บแสตมป์</span>
            <strong>
              {collected} / {total || 7} จุด
            </strong>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <div className="progress-stamp-row">
            {total > 0
              ? pois.map((poi) => (
                  <div
                    key={poi.id}
                    className={`progress-stamp ${earnedIds.has(poi.id) ? "earned" : "empty"}`}
                  />
                ))
              : Array.from({ length: 7 }, (_, i) => <div key={i} className="progress-stamp empty" />)}
          </div>
        </div>
      </div>

      <div className="page-inner">
        <div className="section-eyebrow">แผนที่ตลาด</div>
        <div className="map-container">
          <svg viewBox="0 0 360 280" xmlns="http://www.w3.org/2000/svg">
            <path
              className="map-river"
              d="M0 220 Q40 210 80 218 Q120 226 160 215 Q200 204 240 212 Q280 220 320 210 Q340 206 360 208 L360 280 L0 280 Z"
            />
            <text className="map-label-river" x="140" y="248" textAnchor="middle">
              แม่น้ำนครชัยศรี
            </text>
            <path className="map-road" d="M0 145 L360 145" />
            <path className="map-road" d="M120 60 L120 220" />
            <path className="map-road-sm" d="M200 80 L200 220" />
            <path className="map-road-sm" d="M50 100 L50 220" />
            <path className="map-road-sm" d="M280 100 L280 220" />
            <path className="map-road-sm" d="M0 100 L360 100" />
            <rect className="map-building-main" x="60" y="108" width="50" height="28" rx="2" />
            <rect className="map-building" x="62" y="110" width="10" height="8" rx="1" />
            <rect className="map-building" x="75" y="110" width="10" height="8" rx="1" />
            <rect className="map-building" x="88" y="110" width="10" height="8" rx="1" />
            <rect className="map-building-main" x="130" y="60" width="60" height="32" rx="2" />
            <rect className="map-building" x="132" y="62" width="12" height="10" rx="1" />
            <rect className="map-building" x="148" y="62" width="12" height="10" rx="1" />
            <rect className="map-building" x="164" y="62" width="12" height="10" rx="1" />
            <rect className="map-building" x="210" y="108" width="60" height="26" rx="2" />
            <rect className="map-building" x="295" y="110" width="45" height="25" rx="2" />
            <rect className="map-building" x="60" y="155" width="50" height="28" rx="2" />
            <rect className="map-building" x="210" y="155" width="50" height="28" rx="2" />
            <rect className="map-building" x="130" y="155" width="60" height="28" rx="2" />
            <circle cx="30" cy="80" r="7" fill="#B8CEBC" opacity=".6" />
            <circle cx="310" cy="80" r="6" fill="#B8CEBC" opacity=".6" />
            <circle cx="335" cy="160" r="5" fill="#B8CEBC" opacity=".6" />
            <text className="map-label" x="85" y="101" textAnchor="middle">
              ตลาดเก่า
            </text>
            <text className="map-label" x="160" y="56" textAnchor="middle">
              ถนนหลัก
            </text>
            <text className="map-label" x="240" y="101" textAnchor="middle">
              โซนอาหาร
            </text>
            <rect fill="#C8B898" stroke="#A89878" strokeWidth="1" x="155" y="205" width="50" height="12" rx="2" />
            <text className="map-label" x="180" y="214" textAnchor="middle" fontSize="7">
              ท่าเรือ
            </text>

            {pois.map((poi) => (
              <MapPin
                key={poi.id}
                poi={poi}
                x={(poi.map_x / 100) * 360}
                y={(poi.map_y / 100) * 280}
                done={earnedIds.has(poi.id)}
              />
            ))}

            <g transform="translate(330,40)">
              <circle cx="0" cy="0" r="14" fill="rgba(245,237,216,.8)" stroke="#C8B898" strokeWidth="1" />
              <text fontFamily="Sarabun,sans-serif" fontSize="7" fill="#6B4C30" textAnchor="middle" y="-5">
                N
              </text>
              <path d="M0,-11 L2.5,-2 L0,-5 L-2.5,-2 Z" fill="#2C5E42" />
              <path d="M0,11 L2.5,2 L0,5 L-2.5,2 Z" fill="#C8B898" />
              <text fontFamily="Sarabun,sans-serif" fontSize="5" fill="#6B4C30" textAnchor="middle" y="9">
                S
              </text>
              <text fontFamily="Sarabun,sans-serif" fontSize="5" fill="#6B4C30" textAnchor="middle" x="-10" y="2">
                W
              </text>
              <text fontFamily="Sarabun,sans-serif" fontSize="5" fill="#6B4C30" textAnchor="middle" x="10" y="2">
                E
              </text>
            </g>
          </svg>
        </div>

        <div className="section-eyebrow">จุด check-in ทั้งหมด</div>
        <div className="checkin-grid">
          {pois.map((poi, i) => (
            <POICard key={poi.id} poi={poi} index={i + 1} done={earnedIds.has(poi.id)} />
          ))}
        </div>
      </div>
    </main>
  );
}

export default MapPage;
