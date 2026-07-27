import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Landing from "./pages/Landing";
import MapPage from "./pages/MapPage";
import POIDetail from "./pages/POIDetail";
import CheckIn from "./pages/CheckIn";
import Stamps from "./pages/Stamps";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/map">Map</Link>
        <Link to="/stamps">Stamps</Link>
        <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/poi/:poiId" element={<POIDetail />} />
        <Route path="/checkin/:poiId" element={<CheckIn />} />
        <Route path="/stamps" element={<Stamps />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
