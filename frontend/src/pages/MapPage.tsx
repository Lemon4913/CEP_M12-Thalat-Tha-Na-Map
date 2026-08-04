import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import POICard from '../components/POICard';
import MapPin from '../components/MapPin';
import '../App.css';

function MapPage() {
  const mockPOIs = [
    { id: 1, name: 'ร้านเป็ดพะโล้', description: 'สูตรโบราณ 50 ปี พร้อมน้ำจิ้มแซ่บ', category: 'อาหาร', openTime: 'เปิด 08:00-18:00', x: 22, y: 32 },
    { id: 2, name: 'ร้านกาแฟคุณยาย', description: 'กาแฟหอมกรุ่นยามเช้าและขนมหวานอร่อย', category: 'กาแฟ', openTime: 'เปิด 07:00-17:00', x: 58, y: 54 },
    { id: 3, name: 'จุดถ่ายรูปสะพาน', description: 'วิวแม่น้ำสวยมาก เหมาะกับภาพคาเฟ่', category: 'ถ่ายรูป', openTime: 'เปิดทุกวัน', x: 80, y: 24 },
    { id: 4, name: 'ร้านข้าวเหนียวทุเรียน', description: 'ของหวานท้องตลาดที่อร่อยและคุ้มค่า', category: 'อาหาร', openTime: 'เปิด 09:00-19:00', x: 70, y: 68 },
  ];

  const [pois] = useState<any[]>(mockPOIs);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');

  const categories = ['ทั้งหมด', 'อาหาร', 'กาแฟ', 'ถ่ายรูป'];
  const filteredPois = selectedCategory === 'ทั้งหมด'
    ? pois
    : pois.filter((poi) => poi.category === selectedCategory);

  return (
    <div className="map-page">
      <div className="page-shell">
        <div className="map-hero">
          <div className="hero-content">
            <span className="eyebrow">🌿 ตลาดท่านา • แผนที่เชื่อมโยงร้านค้า</span>
            <h1>สำรวจสถานที่ที่น่าสนใจในตลาดท่านาแบบง่าย ๆ</h1>
            <p>เลือกจุดหมายที่คุณอยากไปและเพลิดเพลินกับบรรยากาศตลาดท่านาอย่างใกล้ชิด</p>

            <div className="hero-actions">
              <Link to="/" className="back-link">
                <button className="btn-secondary">⬅️ กลับหน้าแรก</button>
              </Link>
              <div className="hero-badges">
                <span className="stat-chip">📍 {pois.length} สถานที่</span>
                <span className="stat-chip">⭐ แนะนำสำหรับนักท่องเที่ยว</span>
              </div>
            </div>
          </div>
        </div>

        <div className="map-panel">
          <div className="panel-header">
            <div>
              <h2>แผนที่ตลาดท่านา</h2>
              <p>แตะหมุดเพื่อดูรายละเอียดของแต่ละจุด</p>
            </div>
            <div className="legend">
              <span className="legend-item">🍜 อาหาร</span>
              <span className="legend-item">☕ กาแฟ</span>
              <span className="legend-item">📸 ถ่ายรูป</span>
            </div>
          </div>

          <div className="filter-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-pill ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="map-surface">
            <div className="map-overlay">
              <span className="overlay-badge">🗺️ การเดินทางสะดวก</span>
              <span className="overlay-badge soft">🌤️ บรรยากาศคึกคัก</span>
            </div>
            {filteredPois.map((poi) => (
              <MapPin key={poi.id} id={poi.id} name={poi.name} x={poi.x} y={poi.y} />
            ))}
          </div>
        </div>

        <div className="results-section">
          <div className="section-title-row">
            <div>
              <h3>ร้านค้าที่น่าสนใจ</h3>
              <p>เลือกสถานที่ที่คุณอยากเข้าชมวันนี้</p>
            </div>
          </div>

          <div className="poi-grid">
            {filteredPois.map((poi) => (
              <POICard
                key={poi.id}
                id={poi.id}
                name={poi.name}
                description={poi.description}
                category={poi.category}
                openTime={poi.openTime}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;