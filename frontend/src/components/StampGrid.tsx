import type { CheckIn, POI } from "../types";
import StampBadge from "./StampBadge";

interface Props {
  pois: POI[];
  checkins: CheckIn[];
}

// Owner: Person B. Renders every POI (earned + locked), not just collected ones,
// so visitors can see what's left to check in on.
function StampGrid({ pois, checkins }: Props) {
  const earnedIds = new Set(checkins.map((c) => c.poi_id));

  return (
    <div className="stamp-grid-big">
      {pois.map((poi, i) => (
        <StampBadge
          key={poi.id}
          poiId={poi.id}
          name={poi.name}
          category={poi.category}
          index={i + 1}
          collected={earnedIds.has(poi.id)}
        />
      ))}
    </div>
  );
}

export default StampGrid;
