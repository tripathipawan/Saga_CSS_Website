// Client-side Core Web Vitals + global error monitoring. Loaded from the
// root shell via a dynamic import so it never runs during SSR.
import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from "web-vitals";
import { reportLovableError } from "./lovable-error-reporting";

const ENDPOINT = "/api/public/vitals";

function send(payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" },
      keepalive: true,
    });
  } catch {
    /* swallow — telemetry must never break the app */
  }
}

function handleMetric(metric: Metric) {
  send({
    kind: "web-vital",
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    id: metric.id,
    path: window.location.pathname,
    ts: Date.now(),
  });
}

let started = false;
export function startWebVitals() {
  if (started || typeof window === "undefined") return;
  started = true;

  onCLS(handleMetric);
  onFCP(handleMetric);
  onINP(handleMetric);
  onLCP(handleMetric);
  onTTFB(handleMetric);

  window.addEventListener("error", (e) => {
    reportLovableError(e.error ?? new Error(e.message), { source: "window.onerror" });
    send({
      kind: "error",
      message: String(e.message),
      filename: e.filename,
      lineno: e.lineno,
      colno: e.colno,
      path: window.location.pathname,
      ts: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", (e) => {
    const reason = e.reason instanceof Error ? e.reason : new Error(String(e.reason));
    reportLovableError(reason, { source: "unhandledrejection" });
    send({
      kind: "unhandledrejection",
      message: reason.message,
      stack: reason.stack,
      path: window.location.pathname,
      ts: Date.now(),
    });
  });
}
