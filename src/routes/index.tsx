import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Blend,
  Circle,
  Sparkles,
  BookOpen,
  GraduationCap,
  Target,
  Gauge,
  Image as ImageIcon,
  Layers,
} from "lucide-react";
import type { ComponentType } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SagaCSS — Free Visual CSS Toolkit for Developers" },
      {
        name: "description",
        content:
          "Free visual CSS toolkit: design gradients, shadows, animations, palettes, easing curves and more with live previews and copy-ready CSS, Tailwind and Bootstrap code.",
      },
      { property: "og:title", content: "SagaCSS — Free Visual CSS Toolkit" },
      {
        property: "og:description",
        content: "Design UI visually and copy production-ready CSS, Tailwind and Bootstrap code.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  const featured: {
    name: string;
    path: string;
    desc: string;
    Icon: ComponentType<{ className?: string }>;
  }[] = [
    {
      name: "Gradient Generator",
      path: "/tools/gradient",
      desc: "Design linear, radial and conic gradients with live preview and copy-ready CSS.",
      Icon: Blend,
    },
    {
      name: "Border Radius",
      path: "/tools/border-radius",
      desc: "Craft smooth corners and organic blob shapes with per-corner control.",
      Icon: Circle,
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 md:p-12">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 text-xs font-medium text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> Free · Open source friendly
        </div>
        <h1 className="max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
          Design UI visually.{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Copy production-ready CSS.
          </span>
        </h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          SagaCSS is a growing toolkit of visual generators for gradients, radii, shadows and more.
          Tweak, preview and paste — no sign-in, no cost.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            to="/tools/gradient"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-transform hover:scale-[1.02]"
          >
            Try Gradient Generator <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/tools/border-radius"
            className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Border Radius Tool
          </Link>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Featured tools</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {featured.map(({ name, path, desc, Icon }) => (
            <Link
              key={path}
              to={path}
              className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">{name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Open{" "}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Coming soon</h2>
        <p className="mb-4 text-sm text-muted-foreground">Advanced CSS tooling on the roadmap.</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              name: "CSS Performance Auditor",
              desc: "Paste your CSS and get an instant audit flagging unused rules, overly specific selectors, expensive properties, and optimization suggestions.",
              Icon: Gauge,
            },
            {
              name: "Design-to-Code Snapshot",
              desc: "Upload a screenshot of any UI element and get a best-effort CSS starting point to recreate its layout, spacing, and colors.",
              Icon: ImageIcon,
            },
            {
              name: "CSS Architecture Advisor",
              desc: "Answer a few questions about your project and get a tailored recommendation on CSS methodology — BEM, utility-first, CSS Modules, or a hybrid — with reasoning.",
              Icon: Layers,
            },
          ].map(({ name, desc, Icon }) => (
            <div
              key={name}
              className="rounded-lg border border-dashed border-border bg-card/50 p-4"
              aria-label={`${name} — planned feature`}
            >
              <div className="mb-2 flex items-center justify-between">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <span className="rounded-full border border-border bg-background px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  Planned
                </span>
              </div>
              <div className="text-sm font-medium">{name}</div>
              <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-1 text-lg font-semibold">Now live: Learn</h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Level up with interview prep, practice challenges and in-depth articles.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/interview-prep"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <GraduationCap className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">Interview Prep Hub</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              200+ HTML &amp; CSS questions with in-depth answers, filters, progress tracking and
              PDF export.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/practice"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">CSS Practice Challenges</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              150+ hands-on challenges with a live editor, target preview and reveal-solution
              learning flow.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
          <Link
            to="/blog"
            className="group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-5 w-5" />
            </div>
            <h3 className="font-semibold">SagaCSS Blog</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Practical CSS articles on layout, performance, accessibility, dark mode, and modern
              design trends.
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
              Open{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>
        </div>
      </section>
    </div>
  );
}
