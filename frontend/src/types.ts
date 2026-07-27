export type POICategory = "shop" | "history" | "art" | "food";

export interface POI {
  id: string;
  name: string;
  category: POICategory;
  description: string;
  image_url: string;
  map_x: number;
  map_y: number;
  status: "active" | "closed" | "relocated";
}

export interface CheckIn {
  id: string;
  poi_id: string;
  visitor_id: string;
  created_at: string;
}
