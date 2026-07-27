import { Link } from "react-router-dom";
import type { POI } from "../types";

interface Props {
  poi: POI;
}

// Owner: Person A. Positioned absolutely over the map image using map_x/map_y (0-100%).
function MapPin({ poi }: Props) {
  return (
    <Link
      to={`/poi/${poi.id}`}
      title={poi.name}
      style={{
        position: "absolute",
        left: `${poi.map_x}%`,
        top: `${poi.map_y}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      📍
    </Link>
  );
}

export default MapPin;
