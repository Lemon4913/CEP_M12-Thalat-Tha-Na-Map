import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function LandingPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1 style={{ color: '#d35400' }}>ยินดีต้อนรับสู่ ตลาดท่านา 🇹🇭</h1>
      <p style={{ fontSize: '18px', color: '#666', marginBottom: '30px' }}>แหล่งรวมของอร่อยและบรรยากาศสุดคลาสสิก</p>
      
      <Link to="/map" style={{ textDecoration: 'none' }}>
        <button className="btn-primary">
          🗺️ ไปดูแผนที่ตลาดกันเลย!
        </button>
      </Link>
    </div>
  );
}

export default LandingPage;