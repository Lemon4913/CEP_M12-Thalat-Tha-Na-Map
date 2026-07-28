import { useNavigate } from "react-router-dom";
import type { POI } from "../types";

interface Props {
  poi: POI;
  x: number;
  y: number;
  done: boolean;
}

// Owner: Person A. An SVG pin positioned at (x, y) in the map's viewBox units
// (already converted from poi.map_x/map_y percentages by the parent map).
function MapPin({ poi, x, y, done }: Props) {
  const navigate = useNavigate();

  return (
    <g
      className={`pin-group${done ? " pin-done" : ""}`}
      onClick={() => navigate(`/poi/${poi.id}`)}
    >
      <circle className="pin-pulse" cx={x} cy={y} r={10} />
      <circle className="pin-outer" cx={x} cy={y} r={9} />
      <text className="pin-num" x={x} y={y}>
        {done ? "✓" : poi.id}
      </text>
      <title>{poi.name}</title>
    </g>
  );
}

export default MapPin;
