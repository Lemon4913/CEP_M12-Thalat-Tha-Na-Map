import { useState } from "react";
import { useMarketProgress } from "../hooks/useMarketProgress";
import MarketMap from "../components/MarketMap";
import LeafletMarketMap from "../components/LeafletMarketMap";
import POICard from "../components/POICard";

type MapView = "illustrated" | "real" | "satellite";

// Owner: Person A (Map & POI pages)
// Three map views share one toggle: "illustrated" is a hand-drawn isometric
// illustration (MarketMap.tsx, same genre as the printed flyer the market's
// organisers hand out), "real" is OSM street tiles and "satellite" is Esri
// World Imagery (both LeafletMarketMap.tsx, picked via its `layer` prop).
// All three project every POI from its real lat/lng (poi.map_y / poi.map_x),
// so switching between them reads as a style swap, not a different map.
function MapPage() {
  const { pois, checkins } = useMarketProgress();
  const [view, setView] = useState<MapView>("illustrated");
  const earnedIds = new Set(checkins.map((c) => c.poi_id));
  const total = pois.length;
  const collected = checkins.length;
  const pct = total === 0 ? 0 : (collected / total) * 100;
  const complete = total > 0 && collected === total;

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
        <div className="section-head">
          <div className="section-eyebrow">แผนที่ตลาด</div>
          <p className="section-note">แตะหมุดเพื่อดูรายละเอียดจุดนั้น</p>
        </div>

        <div className="map-view-toggle" role="tablist" aria-label="รูปแบบแผนที่">
          <button
            type="button"
            role="tab"
            aria-selected={view === "illustrated"}
            className={`map-view-toggle-btn${view === "illustrated" ? " is-active" : ""}`}
            onClick={() => setView("illustrated")}
          >
            แผนที่วาด
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "real"}
            className={`map-view-toggle-btn${view === "real" ? " is-active" : ""}`}
            onClick={() => setView("real")}
          >
            แผนที่จริง
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={view === "satellite"}
            className={`map-view-toggle-btn${view === "satellite" ? " is-active" : ""}`}
            onClick={() => setView("satellite")}
          >
            ภาพถ่ายดาวเทียม
          </button>
        </div>

        {view === "illustrated" && <MarketMap pois={pois} earnedIds={earnedIds} />}
        {view === "real" && (
          <LeafletMarketMap pois={pois} earnedIds={earnedIds} layer="street" />
        )}
        {view === "satellite" && (
          <LeafletMarketMap pois={pois} earnedIds={earnedIds} layer="satellite" />
        )}

        {complete && (
          <div className="notice notice-gold">
            <strong>ครบ {total} จุดแล้ว!</strong>
            <span>นำหน้าจอสมุดแสตมป์ไปแสดงที่ตู้จ่ายภาพเพื่อรับภาพ exclusive</span>
          </div>
        )}

        <div className="section-head">
          <div className="section-eyebrow">จุด check-in ทั้งหมด</div>
          {total > 0 && <p className="section-note">{total} จุด</p>}
        </div>

        <div className="checkin-grid">
          {pois.length === 0 ? (
            <div className="empty-state">กำลังโหลดจุด check-in...</div>
          ) : (
            pois.map((poi, i) => (
              <POICard key={poi.id} poi={poi} index={i + 1} done={earnedIds.has(poi.id)} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default MapPage;
