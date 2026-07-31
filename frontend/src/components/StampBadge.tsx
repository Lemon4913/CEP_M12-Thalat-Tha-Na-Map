import type { POICategory } from "../types";
import PoiArt, { artVariantFor } from "./PoiArt";

interface Props {
  poiId: string;
  name: string;
  category: POICategory;
  index: number;
  collected: boolean;
}

// Owner: Person B.
// A locked stamp still shows its artwork, dimmed — a visitor should be able to
// see what is left to collect, not just an anonymous grey box.
function StampBadge({ poiId, name, category, index, collected }: Props) {
  return (
    <div className={`stamp-cell ${collected ? "earned" : "locked"}`}>
      <div className="stamp-cell-art">
        <PoiArt variant={artVariantFor(poiId, category)} />
        {collected ? (
          <span className="stamp-cell-seal" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path
                d="M6.5 12.6l3.4 3.4L17.5 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        ) : (
          <span className="stamp-cell-lock" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <rect x="5.5" y="10.5" width="13" height="9" rx="1.6" fill="currentColor" />
              <path
                d="M8.5 10.5V8a3.5 3.5 0 1 1 7 0v2.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </div>

      <div className="stamp-cell-num">จุดที่ {index}</div>
      <div className="stamp-cell-name">{name}</div>
    </div>
  );
}

export default StampBadge;
