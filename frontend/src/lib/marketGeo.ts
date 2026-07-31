/**
 * Real road/water geometry near the market, queried once from OpenStreetMap's
 * Overpass API (overpass-api.de) and projected into local metres relative to
 * MARKET_CENTER (see geo.ts) using the same equirectangular approximation as
 * MarketMap's pin projection — flat-earth is fine at this scale (~500m).
 *
 * OSM has zero building footprints for the market itself (checked directly),
 * so only road/waterway geometry is "real" here; building shapes on the map
 * are still hand-drawn, traced from satellite imagery for proportion only
 * (never hotlinked/embedded — same copyright reasoning as PoiArt.tsx).
 *
 * Each point is [east, north] metres from MARKET_CENTER. Re-run the Overpass
 * query below to refresh (fall back to overpass.kumi.systems if overpass-api.de
 * 504s):
 *
 *   [out:json][timeout:25];
 *   (
 *     way["highway"](around:600,13.80187,100.18711);
 *     way["waterway"](around:800,13.80187,100.18711);
 *     way["building"](around:300,13.80187,100.18711);
 *   );
 *   out body geom;
 */

export type GeoPoint = [east: number, north: number];

/** ถนนธรรมสพน์ — the street along the market's front, two joined OSM ways. */
export const ROAD_LINE: GeoPoint[] = [
  [138.91, 26.66],
  [39.59, -42.65],
  [33.09, -46.61],
  [27.84, -49.59],
  [10.48, -57.7],
  [0.17, -61.33],
  [-128.88, -99.48],
  [-159.14, -108.79],
];

/** แม่น้ำท่าจีน (Tha Chin river), the portion within ~500m of the market. */
export const RIVER_LINE: GeoPoint[] = [
  [-92.23, 372.38],
  [-65.96, 293.74],
  [-9.3, 146.85],
  [231.89, -187.89],
];

/** คลองเจดีย์บูชา (canal), the portion within ~500m — it only clips the frame. */
export const CANAL_LINE: GeoPoint[] = [
  [-365.92, 327.23],
  [-197.16, 310.4],
  [-65.96, 293.74],
];
