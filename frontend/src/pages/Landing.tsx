import { Link } from "react-router-dom";

// Owner: Person A (Map & POI pages)
// TODO: once /api/checkins is live, show "X / N stamps collected" here using getVisitorId() + fetchCheckIns().
function Landing() {
  return (
    <main>
      <h1>Talat Tha Na Map</h1>
      <p>A 140-year-old riverside market. Scan a QR code at any shop to collect a digital stamp.</p>
      <Link to="/map">Open the map</Link>
    </main>
  );
}

export default Landing;
