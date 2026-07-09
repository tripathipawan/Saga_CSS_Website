import { createFileRoute } from "@tanstack/react-router";
import { ToolHeader } from "@/components/tool-header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — SagaCSS" },
      {
        name: "description",
        content:
          "Frequently asked questions about SagaCSS — pricing, privacy, licensing, browser support.",
      },
      { property: "og:title", content: "FAQ — SagaCSS" },
      { property: "og:description", content: "Answers to common questions about SagaCSS." },
      { property: "og:url", content: "/faq" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
  }),
  component: FaqPage,
});

const QAS = [
  { q: "Is SagaCSS free?", a: "Yes, completely free. No paywalls, no ads, no upsells." },
  {
    q: "Do I need to sign up?",
    a: "No. Everything runs locally in your browser — no account required.",
  },
  {
    q: "Is my data saved anywhere?",
    a: "Only in your own browser. Preferences like theme and code format live in localStorage on your device. Nothing is sent to a server.",
  },
  {
    q: "Can I use the generated code commercially?",
    a: "Yes. The output is plain CSS/HTML you can use in any project, personal or commercial, with no attribution required.",
  },
  {
    q: "Which browsers are supported?",
    a: "Any modern evergreen browser (Chrome, Edge, Firefox, Safari). Some generated effects rely on modern CSS features like backdrop-filter and preserve-3d.",
  },
  {
    q: "How do I request a new tool?",
    a: "Open an issue on GitHub or send a message via the Contact page.",
  },
  {
    q: "Does it work offline?",
    a: "After the first load most tools work without a network connection since everything runs client-side.",
  },
  {
    q: "Why are there Tailwind and Bootstrap tabs?",
    a: "So you can copy the same visual result in the format your project actually uses. For values that don’t map cleanly, we fall back to a labeled custom class.",
  },
];

function FaqPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ToolHeader
        title="Frequently asked questions"
        description="Everything worth knowing before you use SagaCSS."
      />
      <div className="rounded-xl border border-border bg-card p-4">
        <Accordion type="single" collapsible className="w-full">
          {QAS.map((item, i) => (
            <AccordionItem key={item.q} value={`item-${i}`}>
              <AccordionTrigger className="text-left text-sm font-medium">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-muted-foreground">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
