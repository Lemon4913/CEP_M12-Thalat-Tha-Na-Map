import { useEffect, useState } from "react";
import type { CheckIn, POI } from "../types";
import { fetchCheckIns } from "../api/checkins";
import { fetchPOIs } from "../api/pois";
import { getVisitorId } from "../lib/visitor";

// Shared by any page that needs "which POIs exist" + "which has this visitor stamped".
export function useMarketProgress() {
  const [pois, setPois] = useState<POI[]>([]);
  const [checkins, setCheckins] = useState<CheckIn[]>([]);

  useEffect(() => {
    fetchPOIs()
      .then(setPois)
      .catch(() => {
        // backend not ready yet
      });
    fetchCheckIns(getVisitorId())
      .then(setCheckins)
      .catch(() => {
        // backend not ready yet
      });
  }, []);

  return { pois, checkins };
}
