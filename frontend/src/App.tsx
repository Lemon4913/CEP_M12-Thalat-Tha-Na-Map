import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // นำเข้าสไตล์ CSS

// นำเข้าหน้าต่างๆ
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import POIDetailPage from './pages/POIDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/poi/:id" element={<POIDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;