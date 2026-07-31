import type { POI } from "../types";

/**
 * Real centre of Talat Tha Na, Nakhon Chai Si, Nakhon Pathom.
 * Origin of the local metre grid the illustrated map projects its pins onto.
 */
export const MARKET_CENTER: [number, number] = [13.80187, 100.18711];

/** [lat, lng] ordering in one place; the API stores lat in map_y and lng in map_x. */
export function poiLatLng(poi: POI): [number, number] {
  return [poi.map_y, poi.map_x];
}
