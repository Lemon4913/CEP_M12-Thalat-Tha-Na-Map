import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { POI } from "../types";
import { MARKET_CENTER, poiLatLng } from "../lib/geo";

/**
 * The real, surveyed views — actual map tiles with markers placed from each
 * POI's real GPS. This is the "ground truth" counterpart to MarketMap.tsx's
 * illustrated top-down plan; all three sit behind the same toggle on MapPage
 * so switching feels like a style swap, not a different map.
 *
 * Two tile sources, picked via the `layer` prop:
 * - "street": OSM's public tile server. Read their tile usage policy
 *   (operations.osmfoundation.org/policies/tiles/) before this sees real
 *   signage traffic; a self-hosted tile cache may be worth it at scale.
 * - "satellite": Esri World Imagery, free with no API key/billing — kept
 *   deliberately off Google Maps satellite, which needs a billing-enabled
 *   key (see the hosting notes on why this project avoids that). Checked
 *   this market's own tiles directly: real (non-upscaled) imagery runs out
 *   past z19 here (tile byte size drops off a cliff — a generic blurred
 *   fallback, not real detail), so both layers share the same maxZoom/
 *   maxNativeZoom of 19 rather than letting the map zoom further than the
 *   tiles actually support.
 */

const TILE_LAYERS = {
  street: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
  },
} as const;

interface Props {
  pois: POI[];
  earnedIds: Set<string>;
  layer: keyof typeof TILE_LAYERS;
}

function markerIcon(index: number, done: boolean) {
  return L.divIcon({
    className: "leaflet-poi-icon",
    html: `<span class="leaflet-poi-dot${done ? " is-done" : ""}">${
      done ? "✓" : index + 1
    }</span>`,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    tooltipAnchor: [0, -20],
  });
}

/** Fits the view to every POI whenever the list changes (e.g. first load). */
function FitToPois({ pois }: { pois: POI[] }) {
  const map = useMap();
  useEffect(() => {
    if (pois.length === 0) return;
    const bounds = L.latLngBounds(pois.map((poi) => poiLatLng(poi)));
    map.fitBounds(bounds, { padding: [36, 36], maxZoom: 19 });
  }, [pois, map]);
  return null;
}

function LeafletMarketMap({ pois, earnedIds, layer }: Props) {
  const navigate = useNavigate();
  const center = useMemo<[number, number]>(() => MARKET_CENTER, []);
  const tile = TILE_LAYERS[layer];

  return (
    <div className={`market-map leaflet-market-map leaflet-market-map--${layer}`}>
      <div className="market-map-stage">
        <MapContainer
          center={center}
          zoom={18}
          maxZoom={19}
          scrollWheelZoom={false}
          className="leaflet-market-map-container"
        >
          <TileLayer
            key={layer}
            attribution={tile.attribution}
            url={tile.url}
            maxZoom={19}
            maxNativeZoom={19}
          />
          <FitToPois pois={pois} />
          {pois.map((poi, index) => {
            const done = earnedIds.has(poi.id);
            return (
              <Marker
                key={poi.id}
                position={poiLatLng(poi)}
                icon={markerIcon(index, done)}
                eventHandlers={{ click: () => navigate(`/poi/${poi.id}`) }}
              >
                <Tooltip direction="top" offset={[0, -6]}>
                  {poi.name}
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default LeafletMarketMap;
