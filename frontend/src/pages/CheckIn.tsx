import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { submitCheckIn } from "../api/checkins";
import { getVisitorId } from "../lib/visitor";

// Owner: Person B (Check-in & Stamp book)
// This is the page a printed QR code opens: /checkin/{poiId}?t={secret}
// TODO: once POST /api/checkins is live (Person D), show a "stamp collected!" state on success,
// and fall back to plain POI info (no stamp) if the token is missing/invalid.
function CheckIn() {
  const { poiId } = useParams<{ poiId: string }>();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("t") ?? "";
  const [status, setStatus] = useState<"pending" | "stamped" | "error">("pending");

  useEffect(() => {
    if (!poiId) return;
    submitCheckIn(poiId, token, getVisitorId())
      .then(() => setStatus("stamped"))
      .catch(() => setStatus("error"));
  }, [poiId, token]);

  return (
    <main>
      <h1>Checking in...</h1>
      <p>Status: {status}</p>
    </main>
  );
}

export default CheckIn;
