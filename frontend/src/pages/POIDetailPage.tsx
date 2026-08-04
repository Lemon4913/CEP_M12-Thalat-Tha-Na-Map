import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import '../App.css';

function POIDetailPage() {
  const { id } = useParams();
  const [poiData, setPoiData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/pois/${id}`)
      .then((res) => res.json())
      .then((data) => setPoiData(data))
      .catch((err) => console.error('Error:', err));
  }, [id]);

  if (!poiData) {
    return <div style={{ padding: '50px', textAlign: 'center' }}>กำลังโหลดข้อมูลร้าน... ⏳</div>;
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <Link to="/map" style={{ textDecoration: 'none' }}>
        <button className="btn-secondary">🔙 กลับไปแผนที่</button>
      </Link>
      
      <div style={{ marginTop: '20px', border: '1px solid #ddd', padding: '30px', borderRadius: '12px', backgroundColor: '#fff' }}>
        <h2 style={{ color: '#d35400', margin: '0 0 15px 0' }}>{poiData.name}</h2>
        
        {poiData.imageUrl && (
          <img 
            src={poiData.imageUrl} 
            alt={poiData.name} 
            style={{ width: '100%', borderRadius: '8px', marginBottom: '20px' }} 
          />
        )}
        
        <p style={{ fontSize: '18px', lineHeight: '1.6', color: '#444' }}>{poiData.description}</p>
        <p style={{ color: '#888', marginTop: '20px', fontSize: '0.9rem' }}>หมวดหมู่: {poiData.category}</p>
      </div>
    </div>
  );
}

export default POIDetailPage;