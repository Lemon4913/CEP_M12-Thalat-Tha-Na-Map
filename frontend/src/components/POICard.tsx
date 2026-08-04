import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

interface POICardProps {
  id: number;
  name: string;
  description: string;
  category?: string;
  openTime?: string;
}

function POICard({ id, name, description, category, openTime }: POICardProps) {
  return (
    <div className="poi-card">
      <div className="poi-badges">
        <span className="poi-tag">{category || 'สถานที่'}</span>
        {openTime ? <span className="poi-time">{openTime}</span> : null}
      </div>
      <h3>{name}</h3>
      <p>{description}</p>

      <Link to={`/poi/${id}`} className="card-link">
        <button className="btn-primary">ดูรายละเอียด</button>
      </Link>
    </div>
  );
}

export default POICard;