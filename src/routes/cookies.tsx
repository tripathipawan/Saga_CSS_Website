import { createFileRoute } from "@tanstack/react-router";
import { ToolHeader } from "@/components/tool-header";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: "Cookie Policy — SagaCSS" },
      { name: "description", content: "SagaCSS does not use tracking cookies. Preferences are saved in localStorage on your device only." },
      { property: "og:title", content: "Cookie Policy — SagaCSS" },
      { property: "og:description", content: "No tracking cookies. Just local browser storage for your preferences." },
      { property: "og:url", content: "https://csscraft.lovable.app/cookies" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/cookies" }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ToolHeader
        title="Cookie Policy"
        description="Short and honest — SagaCSS doesn't track you."
      />
      <div className="rounded-xl border border-border bg-card p-6 text-sm leading-7 text-foreground">
        <p className="text-base font-medium">
          SagaCSS does not use tracking cookies.
        </p>
        <p className="mt-3 text-muted-foreground">
          We only use <code className="rounded bg-muted px-1.5 py-0.5 text-xs">localStorage</code>{" "}
          on your device to save your preferences and saved snippets — this data never leaves your
          browser and is never sent to a server.
        </p>

        <h2 className="mt-6 text-base font-semibold">What we store locally</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>Theme preference (light / dark).</li>
          <li>Preferred code format (CSS / Tailwind / Bootstrap).</li>
          <li>Items you saved to My Kit.</li>
          <li>Recent tool settings so you don&apos;t lose work between visits.</li>
        </ul>

        <h2 className="mt-6 text-base font-semibold">What we do not use</h2>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
          <li>No analytics cookies.</li>
          <li>No advertising cookies.</li>
          <li>No cross-site tracking pixels.</li>
          <li>No third-party trackers.</li>
        </ul>

        <h2 className="mt-6 text-base font-semibold">Clearing your data</h2>
        <p className="mt-2 text-muted-foreground">
          You can clear SagaCSS&apos;s local data at any time from your browser&apos;s site-data
          settings, or by clearing site data from within SagaCSS&apos;s Settings page. Doing so
          removes your saved kit and preferences from this device.
        </p>

        <p className="mt-6 text-xs text-muted-foreground">
          This is app-owner editable content and is not legal advice. Questions? Reach out via the
          Contact page.
        </p>
      </div>
    </div>
  );
}