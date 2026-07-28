import { Link } from "react-router-dom";
import { useMarketProgress } from "../hooks/useMarketProgress";

// Owner: Person A (Map & POI pages)
function Landing() {
  const { pois, checkins } = useMarketProgress();
  const total = pois.length;
  const collected = checkins.length;

  return (
    <main className="page-inner">
      <div className="landing-hero">
        <div className="landing-title">ตลาดท่านา</div>
        <p className="landing-desc">
          ตลาดริมน้ำอายุกว่า 140 ปี สแกน QR code ที่จุดต่างๆ ในตลาดเพื่อสะสมแสตมป์ดิจิทัล
          ครบ 7 จุด รับภาพ exclusive ที่ตู้จ่ายภาพ
        </p>
        {collected > 0 && (
          <div className="landing-progress">
            เก็บแสตมป์แล้ว {collected} / {total || 7} จุด
          </div>
        )}
        <Link to="/map" className="landing-cta">
          เปิดแผนที่
        </Link>
      </div>
    </main>
  );
}

export default Landing;
