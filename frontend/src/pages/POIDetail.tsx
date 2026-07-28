import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { POI } from "../types";
import { fetchPOI } from "../api/pois";
import { fetchCheckIns } from "../api/checkins";
import { getVisitorId } from "../lib/visitor";

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
  const [stamped, setStamped] = useState(false);

  useEffect(() => {
    if (!poiId) return;
    fetchPOI(poiId)
      .then(setPoi)
      .catch(() => {
        // backend not ready yet
      });
    fetchCheckIns(getVisitorId())
      .then((checkins) => setStamped(checkins.some((c) => c.poi_id === poiId)))
      .catch(() => {
        // backend not ready yet
      });
  }, [poiId]);

  if (!poi) {
    return (
      <main className="page-inner">
        <p>กำลังโหลดข้อมูล...</p>
      </main>
    );
  }

  return (
    <main className="page-inner">
      <div className="poi-detail-header">
        <span className="poi-detail-category">{CATEGORY_LABEL_TH[poi.category]}</span>
        <h1 className="poi-detail-name">{poi.name}</h1>
        {stamped && <div className="poi-detail-stamped">✅ เก็บแสตมป์จุดนี้แล้ว</div>}
      </div>
      <p className="poi-detail-desc">{poi.description}</p>
    </main>
  );
}

export default POIDetail;
