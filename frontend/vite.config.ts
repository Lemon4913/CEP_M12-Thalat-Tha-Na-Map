import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// HTTPS is opt-in (see package.json's "dev:phone" script) — camera access
// needs a secure context on anything that isn't localhost, e.g. testing over
// LAN on a real phone, but the self-signed cert warning is unwanted noise for
// normal `npm run dev`.
export default defineConfig({
  plugins: [react(), ...(process.env.HTTPS === "true" ? [basicSsl()] : [])],
  server: {
    // Lets a Cloudflare quick tunnel (dev:phone) reach this dev server —
    // Vite otherwise rejects unrecognised Host headers (DNS-rebinding guard).
    allowedHosts: [".trycloudflare.com"],
  },
});
