import { Link } from "react-router-dom";
import type { POI } from "../types";

interface Props {
  poi: POI;
  index: number;
  done: boolean;
}

// Owner: Person A. Used in the map page's "all check-in points" list.
function POICard({ poi, index, done }: Props) {
  return (
    <Link to={`/poi/${poi.id}`} className={`checkin-card${done ? " done" : ""}`}>
      <div className="card-num">{done ? "✓" : index}</div>
      <div className="card-text">
        <div className="card-name">{poi.name}</div>
        <div className="card-desc">{poi.description}</div>
      </div>
      <span className="card-check">✓</span>
    </Link>
  );
}

export default POICard;
