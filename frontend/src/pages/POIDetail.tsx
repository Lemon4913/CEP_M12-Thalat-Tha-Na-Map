import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { POI } from "../types";
import { fetchPOI } from "../api/pois";
import samplePOIs from "../data/pois.sample.json";

// Owner: Person A (Map & POI pages)
// TODO: swap the sample-data fallback for fetchPOI(poiId) once GET /api/pois/{id} is live (Person C).
function POIDetail() {
  const { poiId } = useParams<{ poiId: string }>();
  const [poi, setPoi] = useState<POI | undefined>(
    (samplePOIs as POI[]).find((p) => p.id === poiId)
  );

  useEffect(() => {
    if (!poiId) return;
    fetchPOI(poiId)
      .then(setPoi)
      .catch(() => {
        // backend not ready yet — keep showing sample data
      });
  }, [poiId]);

  if (!poi) return <main>POI not found.</main>;

  return (
    <main>
      <h1>{poi.name}</h1>
      <p>{poi.description}</p>
    </main>
  );
}

export default POIDetail;
