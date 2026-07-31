import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import type { POI } from "../types";
import { submitCheckIn } from "../api/checkins";
import { fetchPOI } from "../api/pois";
import { getVisitorId } from "../lib/visitor";
import PoiArt, { artVariantFor } from "../components/PoiArt";

type Status = "pending" | "stamped" | "invalid" | "error";

// Owner: Person B (Check-in & Stamp book)
// This is the page a printed QR code opens: /checkin/{poiId}?t={secret}
// It is the first thing a visitor sees after scanning a sign in the market, so
// it has to read clearly on a phone in bright sun, one-handed.
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
        <div className="checkin-result is-pending">
          <div className="checkin-spinner" aria-hidden="true" />
          <div className="checkin-result-title">กำลัง check-in...</div>
        </div>
      </main>
    );
  }

  if (status === "stamped") {
    return (
      <main className="page-inner">
        <div className="checkin-result success">
          {poi && (
            <div className="checkin-result-art">
              <PoiArt variant={artVariantFor(poi.id, poi.category)} />
            </div>
          )}
          <div className="checkin-result-seal" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M6.5 12.6l3.4 3.4L17.5 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="checkin-result-title">ได้แสตมป์แล้ว!</div>
          <div className="checkin-result-desc">
            {poi ? poi.name : "จุดนี้"} ถูกบันทึกในสมุดแสตมป์ของคุณแล้ว
          </div>
          <Link to="/stamps" className="btn-pill btn-pill-gold">
            ดูสมุดแสตมป์
          </Link>
          <Link to="/map" className="checkin-result-link">
            ไปจุดถัดไป
          </Link>
        </div>
      </main>
    );
  }

  if (status === "invalid") {
    return (
      <main className="page-inner">
        <div className="checkin-result error">
          <div className="checkin-result-title">QR code นี้ใช้ไม่ได้</div>
          <div className="checkin-result-desc">
            {poi
              ? `นี่คือ ${poi.name} — แต่ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR ที่จุดนี้อีกครั้ง`
              : "ลิงก์นี้ไม่ถูกต้องหรือหมดอายุ ลองสแกนป้าย QR อีกครั้ง"}
          </div>
          <Link to="/map" className="btn-pill btn-pill-green">
            กลับไปที่แผนที่
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-inner">
      <div className="checkin-result error">
        <div className="checkin-result-title">เชื่อมต่อไม่สำเร็จ</div>
        <div className="checkin-result-desc">
          สัญญาณอาจไม่เสถียร ลองใหม่อีกครั้งในอีกสักครู่
        </div>
        <Link to="/map" className="btn-pill btn-pill-green">
          กลับไปที่แผนที่
        </Link>
      </div>
    </main>
  );
}

export default CheckIn;
