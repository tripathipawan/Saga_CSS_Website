import { createFileRoute } from "@tanstack/react-router";
import { ToolHeader } from "@/components/tool-header";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SagaCSS" },
      {
        name: "description",
        content:
          "SagaCSS is local-first. No accounts, no cookies, no analytics, no server-side data collection.",
      },
      { property: "og:title", content: "Privacy Policy — SagaCSS" },
      {
        property: "og:description",
        content: "How SagaCSS handles your data — short version: it doesn't.",
      },
      { property: "og:url", content: "/privacy" },
    ],
    links: [{ rel: "canonical", href: "/privacy" }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ToolHeader title="Privacy Policy" description="Short and honest — SagaCSS is local-first." />
      <div className="rounded-xl border border-border bg-card p-6 text-sm leading-7 text-foreground">
        <p>
          SagaCSS runs entirely in your browser. This page is maintained by the app owner to answer
          common privacy questions about the app.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>No accounts, sign-in or profile.</li>
          <li>No cookies used for tracking.</li>
          <li>No analytics scripts or third-party trackers.</li>
          <li>No server-side storage of anything you design.</li>
          <li>
            Preferences (theme, code format) are saved to your browser's localStorage on your device
            only.
          </li>
          <li>
            External links to social networks are opened at your own discretion — those sites have
            their own privacy policies.
          </li>
        </ul>
        <p className="mt-6 text-xs text-muted-foreground">
          This is app-owner editable content and is not a legal certification. If you have a
          specific compliance question, please reach out via the Contact page.
        </p>
      </div>
    </div>
  );
}
