import { Link } from "react-router-dom";
import { useMarketProgress } from "../hooks/useMarketProgress";
import StampGrid from "../components/StampGrid";
import LogoMark from "../components/LogoMark";

// Owner: Person B (Check-in & Stamp book)
function Stamps() {
  const { pois, checkins } = useMarketProgress();

  const total = pois.length;
  const collected = checkins.length;
  const target = total || 7;
  const pct = total === 0 ? 0 : (collected / total) * 100;
  const remaining = total - collected;
  const complete = total > 0 && remaining === 0;

  return (
    <main className="page-inner">
      <section className={`stamps-hero${complete ? " is-complete" : ""}`}>
        <LogoMark className="stamps-hero-badge" tone="light" />

        <div className="stamps-hero-label">แสตมป์ของฉัน</div>
        <div className="stamps-hero-count">
          {collected} <span>/ {target}</span>
        </div>
        <div className="stamps-hero-sub">
          {complete
            ? "ครบแล้ว! ไปรับภาพที่ตู้จ่ายภาพได้เลย"
            : `เก็บอีก ${total > 0 ? remaining : 7} จุด รับภาพ exclusive`}
        </div>
        <div className="stamps-hero-bar">
          <div className="stamps-hero-fill" style={{ width: `${pct}%` }} />
        </div>
      </section>

      {complete && (
        <div className="notice notice-gold">
          <strong>นำหน้าจอนี้ไปแสดงที่ตู้จ่ายภาพ</strong>
          <span>เจ้าหน้าที่จะตรวจสอบแสตมป์ครบ {target} จุด แล้วพิมพ์ภาพ exclusive ให้</span>
        </div>
      )}

      <div className="section-head">
        <div className="section-eyebrow">แสตมป์ที่เก็บได้</div>
        {total > 0 && (
          <p className="section-note">
            {collected} / {target}
          </p>
        )}
      </div>

      {total === 0 ? (
        <div className="empty-state">กำลังโหลดแสตมป์...</div>
      ) : (
        <StampGrid pois={pois} checkins={checkins} />
      )}

      <div className="section-head">
        <div className="section-eyebrow">ประวัติการ check-in</div>
      </div>

      <div className="history-list">
        {checkins.length === 0 ? (
          <div className="empty-state">
            <p>ยังไม่มีการ check-in</p>
            <p className="empty-state-sub">
              สแกน QR code ที่จุดต่างๆ ในตลาดเพื่อเริ่มเก็บแสตมป์
            </p>
            <Link to="/map" className="btn-pill btn-pill-green">
              ดูจุด check-in
            </Link>
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
