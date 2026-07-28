import { useMarketProgress } from "../hooks/useMarketProgress";
import StampGrid from "../components/StampGrid";

// Owner: Person B (Check-in & Stamp book)
function Stamps() {
  const { pois, checkins } = useMarketProgress();

  const total = pois.length;
  const collected = checkins.length;
  const pct = total === 0 ? 0 : (collected / total) * 100;
  const remaining = total - collected;

  return (
    <main className="page-inner">
      <div className="stamps-hero">
        <div className="stamps-hero-label">แสตมป์ของฉัน</div>
        <div className="stamps-hero-count">
          {collected} <span>/ {total || 7}</span>
        </div>
        <div className="stamps-hero-sub">
          {total > 0 && remaining === 0
            ? "🎉 ครบแล้ว! ไปรับภาพที่ตู้ได้เลย"
            : `เก็บอีก ${total > 0 ? remaining : 7} จุด รับภาพ exclusive`}
        </div>
        <div className="stamps-hero-bar">
          <div className="stamps-hero-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="section-eyebrow">แสตมป์ที่เก็บได้</div>
      <StampGrid pois={pois} checkins={checkins} />

      <div className="section-eyebrow">ประวัติการ check-in</div>
      <div className="history-list">
        {checkins.length === 0 ? (
          <div className="history-item">
            <div className="history-dot pending" />
            <div className="history-text">
              <div className="history-name">ยังไม่มีการ check-in</div>
              <div className="history-time">สแกน QR code ที่จุดต่างๆ ในตลาดเพื่อเริ่มเก็บแสตมป์</div>
            </div>
          </div>
        ) : (
          checkins.map((c) => {
            const poi = pois.find((p) => p.id === c.poi_id);
            return (
              <div className="history-item" key={c.id}>
                <div className="history-dot" />
                <div className="history-text">
                  <div className="history-name">{poi?.name ?? c.poi_id}</div>
                  <div className="history-time">
                    {new Date(c.created_at).toLocaleString("th-TH", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </div>
                </div>
                <span className="history-badge">+1 แสตมป์</span>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}

export default Stamps;
