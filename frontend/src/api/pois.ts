import { apiGet } from "./client";
import type { POI } from "../types";

export function fetchPOIs(): Promise<POI[]> {
  return apiGet<POI[]>("/api/pois");
}

export function fetchPOI(id: string): Promise<POI> {
  return apiGet<POI>(`/api/pois/${id}`);
}
