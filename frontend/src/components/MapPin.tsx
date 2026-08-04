import React from 'react';
import { Link } from 'react-router-dom';

interface MapPinProps {
  id: number;
  name: string;
  x: number;
  y: number;
}

function MapPin({ id, name, x, y }: MapPinProps) {
  return (
    <Link
      to={`/poi/${id}`}
      className="map-pin"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      <div className="pin-bubble">📍</div>
      <div className="pin-label">{name}</div>
    </Link>
  );
}

export default MapPin;