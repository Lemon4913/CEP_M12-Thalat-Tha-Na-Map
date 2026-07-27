import { Link } from "react-router-dom";
import type { POI } from "../types";

interface Props {
  poi: POI;
}

// Owner: Person A. Used in list/grid views of POIs.
function POICard({ poi }: Props) {
  return (
    <Link to={`/poi/${poi.id}`}>
      <h3>{poi.name}</h3>
      <p>{poi.category}</p>
    </Link>
  );
}

export default POICard;
