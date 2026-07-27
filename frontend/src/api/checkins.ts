import { apiGet, apiPost } from "./client";
import type { CheckIn } from "../types";

interface CheckInResponse {
  stamped: boolean;
  checkins: CheckIn[];
}

export function submitCheckIn(poiId: string, token: string, visitorId: string): Promise<CheckInResponse> {
  return apiPost<CheckInResponse>("/api/checkins", { poi_id: poiId, t: token, visitor_id: visitorId });
}

export function fetchCheckIns(visitorId: string): Promise<CheckIn[]> {
  return apiGet<CheckIn[]>(`/api/checkins?visitor_id=${encodeURIComponent(visitorId)}`);
}
