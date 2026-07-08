import * as React from "react";
import { Facebook, Linkedin, Link2, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

type Props = {
  slug: string;
  title: string;
  description: string;
};

// X / Twitter isn't in lucide-react as a filled icon; use inline SVG.
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.75l-4.7-6.15L4.9 22H2.14l6.98-7.98L2 2h6.9l4.24 5.62L18.244 2Zm-2.37 18h1.86L8.22 4H6.24l9.634 16Z" />
    </svg>
  );
}

export function ShareButtons({ slug, title, description }: Props) {
  const [copied, setCopied] = React.useState(false);

  // Build absolute URL on the client so shares always resolve; fall back to
  // the canonical path when rendered on the server.
  const url =
    typeof window !== "undefined" ? `${window.location.origin}/blog/${slug}` : `/blog/${slug}`;

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const targets = [
    {
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      Icon: XIcon,
    },
    {
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      Icon: Linkedin,
    },
    {
      label: "Share on Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&t=${encodedTitle}`,
      Icon: Facebook,
    },
    {
      label: "Share on WhatsApp",
      href: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      Icon: MessageCircle,
    },
  ];

  const onCopy = async () => {
    try {
      if (navigator.share) {
        // Prefer native share sheet on mobile
        await navigator.share({ title, text: description, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // User cancelled share sheet or clipboard blocked; stay silent.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Share
      </span>
      {targets.map(({ label, href, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          aria-label={label}
          title={label}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Icon className="h-4 w-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={onCopy}
        aria-label="Copy link to this post"
        title="Copy link"
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {copied ? <Check className="h-4 w-4 text-primary" /> : <Link2 className="h-4 w-4" />}
      </button>
    </div>
  );
}
