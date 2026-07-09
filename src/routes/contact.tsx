import { createFileRoute } from "@tanstack/react-router";
import { Facebook, Github, Instagram, Linkedin, MessageCircle, Youtube } from "lucide-react";
import { ToolHeader } from "@/components/tool-header";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SagaCSS" },
      {
        name: "description",
        content:
          "Reach out to Pawan Tripathi, the maker of SagaCSS, via LinkedIn, GitHub, YouTube, Instagram, WhatsApp and Facebook.",
      },
      { property: "og:title", content: "Contact — SagaCSS" },
      { property: "og:description", content: "Get in touch with the maker of SagaCSS." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: ContactPage,
});

const CHANNELS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/pawantripathi/",
    Icon: Linkedin,
    blurb: "Professional network and DMs.",
  },
  {
    label: "GitHub",
    href: "https://github.com/tripathipawan",
    Icon: Github,
    blurb: "Open issues, PRs and feature requests.",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@tripathidevlab",
    Icon: Youtube,
    blurb: "Tutorials and dev logs.",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/tripathidevlab",
    Icon: Instagram,
    blurb: "Short-form dev content.",
  },
  {
    label: "WhatsApp Channel",
    href: "https://www.whatsapp.com/channel/0029Vb7sg2V3bbV4NpadBX1m",
    Icon: MessageCircle,
    blurb: "Announcements and updates.",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/people/Pawan-Tripathi/pfbid0jkY7FJJFu4r7gnVGo3JtTETbbKkKe2s7AArUwAMjdYF3ELxLpaL95CdT82vBsKKol/",
    Icon: Facebook,
    blurb: "Community and posts.",
  },
];

function ContactPage() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <ToolHeader
        title="Contact & feedback"
        description="SagaCSS has no backend and no contact form. Reach the maker directly on any of these channels."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {CHANNELS.map(({ label, href, Icon, blurb }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/60 hover:bg-accent/40"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <div className="text-sm font-semibold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{blurb}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
