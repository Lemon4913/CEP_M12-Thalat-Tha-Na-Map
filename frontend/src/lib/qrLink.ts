/**
 * Pulls a /checkin/{poiId}?t={token} path out of whatever the camera decoded.
 * Works whether the QR encodes an absolute URL (any host — the printed
 * BASE_URL can change once hosting is decided, this never hardcodes it) or a
 * bare relative path. Returns null for anything that isn't one of our own
 * check-in links, so the scanner can just keep looking instead of navigating
 * somewhere wrong.
 */
export function resolveCheckInPath(decoded: string): string | null {
  let url: URL;
  try {
    url = decoded.includes("://") ? new URL(decoded) : new URL(decoded, window.location.origin);
  } catch {
    return null;
  }

  const match = url.pathname.match(/\/checkin\/([^/]+)\/?$/);
  if (!match) return null;

  const token = url.searchParams.get("t") ?? "";
  return `/checkin/${match[1]}?t=${encodeURIComponent(token)}`;
}
