export type POICategory = "shop" | "history" | "art" | "food";

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  image_url: string;
  /**
   * Real-world position in WGS84 decimal degrees, projected onto the
   * illustrated isometric map.
   * The x/y names are historical — they used to hold 0-100 layout percentages
   * for the old illustrated SVG map — and are kept to match the DB columns.
   * Use `poiLatLng()` from lib/geo rather than reading these directly, so the
   * (y = lat, x = lng) ordering lives in exactly one place.
   */
  map_x: number; // longitude
  map_y: number; // latitude
  status: "active" | "closed" | "relocated";
}

export interface CheckIn {
  id: string;
  poi_id: string;
  visitor_id: string;
  created_at: string;
}
