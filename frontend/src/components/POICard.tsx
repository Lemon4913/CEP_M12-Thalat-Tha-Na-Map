import { Link } from "react-router-dom";
import type { POI } from "../types";
import PoiArt, { artVariantFor } from "./PoiArt";

interface Props {
  poi: POI;
  index: number;
  done: boolean;
}

// Owner: Person A. Used in the map page's "all check-in points" list.
function POICard({ poi, index, done }: Props) {
  return (
    <Link to={`/poi/${poi.id}`} className={`checkin-card${done ? " done" : ""}`}>
      <span className="checkin-card-thumb">
        <PoiArt variant={artVariantFor(poi.id, poi.category)} />
        <span className="card-num">{done ? "✓" : index}</span>
      </span>

      <span className="card-text">
        <span className="card-name">{poi.name}</span>
        <span className="card-desc">{poi.description}</span>
      </span>

      <span className="card-chevron" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path
            d="M9 5l7 7-7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}

export default POICard;
