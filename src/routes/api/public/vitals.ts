import { createFileRoute } from "@tanstack/react-router";

// Lightweight sink for Core Web Vitals + client-side error beacons.
// We log to stdout (visible in Cloudflare Worker tail / your log drain).
// Swap for a persistent store later if you want dashboards.
export const Route = createFileRoute("/api/public/vitals")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const text = await request.text();
          // Cap payload size so a broken client cannot spam huge blobs.
          if (text.length > 8_000) return new Response("payload too large", { status: 413 });
          // Log a single line — easy to parse from CF Worker logs / drains.
          console.log(`[vitals] ${text}`);
        } catch (e) {
          console.error("[vitals] parse error", e);
        }
        // Beacon requests do not read the body — 204 keeps them cheap.
        return new Response(null, { status: 204 });
      },
      // Health check for uptime monitors.
      GET: async () => new Response("ok", { status: 200 }),
    },
  },
});
