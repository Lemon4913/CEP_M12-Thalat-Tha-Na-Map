import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { POI } from "../types";
import { submitCheckIn } from "../api/checkins";
import { fetchPOI } from "../api/pois";
import { getVisitorId } from "../lib/visitor";

type Status = "pending" | "stamped" | "invalid" | "error";

// Owner: Person B (Check-in & Stamp book)
// This is the page a printed QR code opens: /checkin/{poiId}?t={secret}
function CheckIn() {
  const { poiId } = useParams<{ poiId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const [status, setStatus] = useState<Status>("pending");
  const [poi, setPoi] = useState<POI | undefined>(undefined);

  useEffect(() => {
    if (!poiId) return;
    fetchPOI(poiId)
      .then(setPoi)
      .catch(() => {
        // POI info is a nice-to-have here; missing it shouldn't block check-in
      });
    submitCheckIn(poiId, token, getVisitorId())
      .then((res) => setStatus(res.stamped ? "stamped" : "invalid"))
      .catch(() => setStatus("error"));
  }, [poiId, token]);

  if (status === "pending") {
    return (
      <main className="page-inner">
        <div className="checkin-result">
          <p>กำลัง check-in...</p>
        </div>
      </main>
    );
  }

  if (status === "stamped") {
    return (
      <main className="page-inner">
        <div className="checkin-result success">
          <div className="checkin-result-icon">✅</div>
          <div className="checkin-result-title">ได้แสตมป์แล้ว!</div>
          <div className="checkin-result-desc">
            {poi ? poi.name : "จุดนี้"} ถูกบันทึกในสมุดแสตมป์ของคุณแล้ว
          </div>
          <Link to="/stamps" className="checkin-result-btn">
            ดูสมุดแสตมป์
          </Link>
        </div>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className="page-inner">
        <div className="checkin-result error">
          <div className="checkin-result-icon">🔍</div>
          <div className="checkin-result-title">QR code นี้ใช้ไม่ได้</div>
          <div className="checkin-result-desc">
            {poi
              ? `นี่คือ ${poi.name} — แต่ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR ที่จุดนี้อีกครั้ง`
              : "ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR อีกครั้ง"}
          </div>
          <Link to="/map" className="checkin-result-btn">
            กลับไปที่แผนที่
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-inner">
      <div className="checkin-result error">
        <div className="checkin-result-icon">⚠️</div>
        <div className="checkin-result-title">เชื่อมต่อไม่สำเร็จ</div>
        <div className="checkin-result-desc">ลองใหม่อีกครั้งในอีกสักครู่</div>
        <Link to="/map" className="checkin-result-btn">
          กลับไปที่แผนที่
        </Link>
      </div>
    </main>
  );
}

export default CheckIn;
