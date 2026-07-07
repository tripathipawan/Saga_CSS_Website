import {
  Facebook,
  Github,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Sparkles,
  Twitter,
  Youtube,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SOCIAL_PROFILES } from "@/lib/socials";

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  "X (Twitter)": Twitter,
  YouTube: Youtube,
  Instagram: Instagram,
  "WhatsApp Channel": MessageCircle,
  Facebook: Facebook,
};
const SOCIALS = SOCIAL_PROFILES.map((s) => ({
  ...s,
  Icon: SOCIAL_ICONS[s.label] ?? MessageCircle,
}));

const COMPANY_LINKS = [
  { to: "/about", label: "About Us" },
  { to: "/blog", label: "Blog" },
  { to: "/contact", label: "Contact Us" },
  { to: "/faq", label: "FAQ" },
] as const;

const LEGAL_LINKS = [
  { to: "/privacy", label: "Privacy Policy" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/cookies", label: "Cookie Policy" },
] as const;

const TOOL_LINKS = [
  { to: "/tools/gradient", label: "Gradient Generator" },
  { to: "/tools/border-radius", label: "Border Radius" },
  { to: "/tools/box-shadow", label: "Box Shadow" },
  { to: "/tools/color-palette", label: "Color Palette" },
  { to: "/tools/grid", label: "Grid Layout" },
  { to: "/tools/button", label: "Button Style" },
  { to: "/tools/animation", label: "Animation" },
  { to: "/tools/clip-path", label: "Clip Path" },
] as const;

const RESOURCE_LINKS = [
  { to: "/cheat-sheet", label: "CSS Cheat Sheet" },
  { to: "/my-kit", label: "My Kit" },
  { to: "/settings", label: "Settings" },
] as const;

function ColumnHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground">
      {children}
    </h3>
  );
}

function FooterLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="inline-block text-sm text-muted-foreground transition-colors hover:text-foreground"
    >
      {children}
    </Link>
  );
}

function NewsletterForm() {
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = email.trim();
    if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      toast.error("Please enter a valid email address");
      return;
    }
    toast.success(
      "Thanks! Email subscriptions are launching soon — follow us on social media for updates in the meantime.",
    );
    setEmail("");
  };

  return (
    <form
      onSubmit={onSubmit}
      className="flex w-full flex-col gap-2 sm:flex-row"
      aria-label="Subscribe to updates"
    >
      <label htmlFor="footer-newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="footer-newsletter-email"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="h-10 flex-1"
      />
      <Button type="submit" className="h-10 gap-1.5 sm:shrink-0">
        <Send className="h-4 w-4" /> Subscribe
      </Button>
    </form>
  );
}

export function AppFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:px-8 md:py-12">
        {/* Newsletter row */}
        <div className="mb-10 grid gap-4 rounded-xl border border-border bg-gradient-to-br from-primary/10 via-card/60 to-card/60 p-5 md:mb-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center md:gap-6 md:p-6">
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-foreground md:text-xl">Stay updated</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Get notified about new tools and features.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* Column grid */}
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-base font-semibold text-foreground"
            >
              <span className="grid h-8 w-8 place-items-center rounded-md bg-primary/15 text-primary">
                <Sparkles className="h-4 w-4" />
              </span>
              SagaCSS
            </Link>
            <p className="mt-3 max-w-sm text-sm text-muted-foreground">
              Free CSS tools for developers — no sign-up required.
            </p>

            <address className="mt-4 flex items-start gap-2 text-sm not-italic text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary/80" aria-hidden="true" />
              <span>
                Pawan Tripathi
                <br />
                Khatima, Uttarakhand
                <br />
                India — 262308
              </span>
            </address>

            <div className="mt-4 flex flex-col gap-3">
              <a
                href="mailto:sagacss.ind@gmail.com"
                className="inline-flex max-w-full items-center gap-2 break-all text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <Mail className="h-4 w-4 text-primary/80" aria-hidden="true" />
                sagacss.ind@gmail.com
              </a>

              <a
                href="mailto:sagacss.ind@gmail.com"
                className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:w-fit sm:justify-start"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
                Contact us
              </a>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1">
              {SOCIALS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <ColumnHeading>Company</ColumnHeading>
            <ul className="flex flex-col gap-2">
              {COMPANY_LINKS.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <ColumnHeading>Legal</ColumnHeading>
            <ul className="flex flex-col gap-2">
              {LEGAL_LINKS.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Tools */}
          <div>
            <ColumnHeading>Tools</ColumnHeading>
            <ul className="flex flex-col gap-2">
              {TOOL_LINKS.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
              <li className="pt-1">
                <Link
                  to="/"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                >
                  View All Tools →
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <ColumnHeading>Resources</ColumnHeading>
            <ul className="flex flex-col gap-2">
              {RESOURCE_LINKS.map((l) => (
                <li key={l.to}>
                  <FooterLink to={l.to}>{l.label}</FooterLink>
                </li>
              ))}
              <li>
                <span
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground/80"
                  aria-disabled="true"
                >
                  Interview Prep Hub
                  <span className="rounded-full border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                    Soon
                  </span>
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center gap-2 border-t border-border pt-6 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:gap-4">
          <p className="flex flex-wrap items-center justify-center gap-1.5 text-center sm:justify-start sm:text-left">
            © 2026 SagaCSS. Made with
            <Heart className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            care by Pawan Tripathi
          </p>
          <p className="text-center text-xs sm:text-right">
            Runs entirely in your browser · No sign-in required
          </p>
        </div>
      </div>
    </footer>
  );
}
