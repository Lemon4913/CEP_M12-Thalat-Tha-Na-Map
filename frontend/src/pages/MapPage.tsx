import { useEffect, useState } from "react";
import type { POI } from "../types";
import { fetchPOIs } from "../api/pois";
import MapPin from "../components/MapPin";
import samplePOIs from "../data/pois.sample.json";

// Owner: Person A (Map & POI pages)
// TODO: swap the samplePOIs fallback for fetchPOIs() once GET /api/pois is live (Person C).
// TODO: render an actual market map image behind the pins (map_x/map_y are percentages, 0-100).
function MapPage() {
  const [pois, setPois] = useState<POI[]>(samplePOIs as POI[]);

  useEffect(() => {
    fetchPOIs()
      .then(setPois)
      .catch(() => {
        // backend not ready yet — keep showing sample data
      });
  }, []);

  return (
    <main>
      <h1>Market Map</h1>
      <div style={{ position: "relative", width: "100%", aspectRatio: "4 / 3", background: "#eee" }}>
        {pois.map((poi) => (
          <MapPin key={poi.id} poi={poi} />
        ))}
      </div>
    </main>
  );
}

export default MapPage;
