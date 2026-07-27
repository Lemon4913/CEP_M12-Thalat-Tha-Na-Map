import { useEffect, useState } from "react";
import type { CheckIn } from "../types";
import { fetchCheckIns } from "../api/checkins";
import { getVisitorId } from "../lib/visitor";
import StampGrid from "../components/StampGrid";

// Owner: Person B (Check-in & Stamp book)
// TODO: once GET /api/checkins?visitor_id=... is live (Person D), this will show real progress.
function Stamps() {
  const [checkins, setCheckins] = useState<CheckIn[]>([]);

  useEffect(() => {
    fetchCheckIns(getVisitorId())
      .then(setCheckins)
      .catch(() => {
        // backend not ready yet
      });
  }, []);

  return (
    <main>
      <h1>Stamp Book</h1>
      <p>{checkins.length} stamps collected</p>
      <StampGrid checkins={checkins} />
    </main>
  );
}

export default Stamps;
