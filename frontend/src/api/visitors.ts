import { apiGet, apiPost } from "./client";

interface VisitorStatus {
  registered: boolean;
}

export function fetchVisitorStatus(visitorId: string): Promise<VisitorStatus> {
  return apiGet<VisitorStatus>(`/api/visitors/${encodeURIComponent(visitorId)}/status`);
}

export function registerVisitor(visitorId: string, name: string, phone: string): Promise<VisitorStatus> {
  return apiPost<VisitorStatus>("/api/visitors/register", { visitor_id: visitorId, name, phone });
}
