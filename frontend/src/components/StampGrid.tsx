import type { CheckIn } from "../types";
import StampBadge from "./StampBadge";

interface Props {
  checkins: CheckIn[];
}

// Owner: Person B. TODO: cross-reference against the full POI list (Person A's fetchPOIs)
// so unstamped POIs also render, greyed out, instead of only showing collected ones.
function StampGrid({ checkins }: Props) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: "8px" }}>
      {checkins.map((c) => (
        <StampBadge key={c.id} poiId={c.poi_id} collected />
      ))}
    </div>
  );
}

export default StampGrid;
