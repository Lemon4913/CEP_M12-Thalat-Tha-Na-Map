import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { POI } from "../types";
import { fetchPOI } from "../api/pois";
import { useMarketProgress } from "../hooks/useMarketProgress";
import PoiArt, { artVariantFor } from "../components/PoiArt";
import { CHECKPOINT_PHOTO_ART } from "../lib/checkpointArt";

const CATEGORY_LABEL_TH: Record<POI["category"], string> = {
  shop: "ร้านค้า",
  history: "ประวัติศาสตร์",
  art: "งานศิลปะ",
  food: "อาหาร",
};

// Owner: Person A (Map & POI pages)
function POIDetail() {
  const { poiId } = useParams<{ poiId: string }>();
  const [poi, setPoi] = useState<POI | undefined>(undefined);
  const [notFound, setNotFound] = useState(false);
  const { pois, checkins } = useMarketProgress();

  // The list drives the checkpoint number and stamp state; the single fetch is
  // what actually renders the page, so a POI that isn't "active" still opens.
  useEffect(() => {
    if (!poiId) return;
    let cancelled = false;
    fetchPOI(poiId)
      .then((p) => {
        if (!cancelled) setPoi(p);
      })
      .catch(() => {
        if (!cancelled) setNotFound(true);
      });
    return () => {
      cancelled = true;
    };
  }, [poiId]);

  const stamped = checkins.some((c) => c.poi_id === poiId);
  const index = pois.findIndex((p) => p.id === poiId);

  if (notFound) {
    return (
      <main className="page-inner">
        <div className="notice">
          <strong>ไม่พบจุดนี้</strong>
          <span>ลิงก์อาจไม่ถูกต้อง ลองกลับไปเลือกจุดจากแผนที่</span>
        </div>
        <Link to="/map" className="btn-pill btn-pill-green">
          กลับไปที่แผนที่
        </Link>
      </main>
    );
  }

  if (!poi) {
    return (
      <main className="page-inner">
        <div className="empty-state">กำลังโหลดข้อมูล...</div>
      </main>
    );
  }

  return (
    <main className="poi-detail">
      <div className="poi-hero">
        {CHECKPOINT_PHOTO_ART[poi.id] ? (
          <img
            src={CHECKPOINT_PHOTO_ART[poi.id]}
            alt=""
            aria-hidden="true"
            className="poi-hero-art poi-hero-photo"
          />
        ) : (
          <PoiArt variant={artVariantFor(poi.id, poi.category)} className="poi-hero-art" />
        )}
        <div className="poi-hero-scrim" />

        <div className="poi-hero-content">
          <div className="poi-hero-tags">
            <span className="chip chip-solid">{CATEGORY_LABEL_TH[poi.category]}</span>
            {index >= 0 && <span className="chip">จุดที่ {index + 1}</span>}
          </div>
          <h1 className="poi-hero-title">{poi.name}</h1>
        </div>
      </div>

      <div className="page-inner poi-detail-body">
        {stamped ? (
          <div className="stamp-flag is-earned">
            <CheckCircle />
            <span>เก็บแสตมป์จุดนี้แล้ว</span>
          </div>
        ) : (
          <div className="stamp-flag">
            <QrIcon />
            <span>ยังไม่ได้เก็บ — สแกน QR code ที่ป้ายหน้าจุดนี้</span>
          </div>
        )}

        <p className="poi-detail-desc">{poi.description}</p>

        <div className="poi-detail-actions">
          <Link to="/map" className="btn-pill btn-pill-green">
            กลับไปที่แผนที่
          </Link>
          <Link to="/stamps" className="btn-pill btn-pill-ghost">
            สมุดแสตมป์
          </Link>
        </div>
      </div>
    </main>
  );
}

function CheckCircle() {
  return (
    <svg viewBox="0 0 24 24" className="stamp-flag-icon" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="currentColor" opacity="0.15" />
      <path
        d="M8 12.4l2.8 2.8L16 9.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QrIcon() {
  return (
    <svg viewBox="0 0 24 24" className="stamp-flag-icon" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="4" y="4" width="6" height="6" rx="1" />
        <rect x="14" y="4" width="6" height="6" rx="1" />
        <rect x="4" y="14" width="6" height="6" rx="1" />
        <path d="M14 14h3v3h-3zM19 19h1M17 20v-1" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export default POIDetail;
