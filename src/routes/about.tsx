import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SagaCSS — Our Story | SagaCSS" },
      {
        name: "description",
        content:
          "The story behind SagaCSS — how a small calculator project grew into a free, no-signup visual CSS toolkit built and maintained solo by Pawan Tripathi.",
      },
      { property: "og:title", content: "About SagaCSS — Our Story" },
      {
        property: "og:description",
        content:
          "How SagaCSS started, what it offers, who built it, and the philosophy behind keeping developer tools free, fast and local-first.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/about" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/about" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto flex w-full max-w-3xl flex-col gap-10 pb-16">
      {/* Page header */}
      <header className="flex flex-col gap-3 pt-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Our story</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          The story behind SagaCSS
        </h1>
        <p className="text-base leading-7 text-muted-foreground md:text-lg">
          A free, no-signup visual CSS toolkit — built one tool at a time, in the open, by a
          developer who got tired of jumping between a dozen tabs to ship a button.
        </p>
      </header>

      {/* Story sections */}
      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          How it started
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            SagaCSS didn&apos;t start out trying to be a suite. It started as a tiny calculator
            project — a weekend build to sharpen a few ideas. But somewhere between shipping that
            calculator and reaching for the fifth different single-purpose website in the same
            afternoon just to tweak a gradient, a box shadow and a clip-path, a very obvious
            question showed up: <em>why is all of this scattered across the internet?</em>
          </p>
          <p>
            Every developer knows the drill. You need a border-radius preview, so you open one site.
            You need a WCAG contrast check, so you open another. You want a decent color palette,
            and now you&apos;re on a third. Each one has its own theme, its own ads, its own account
            wall, its own idea of what &ldquo;copy code&rdquo; should mean. Half of them work. Half
            of them haven&apos;t been updated in years. All of them break your flow.
          </p>
          <p>
            SagaCSS is the answer to that frustration: one comprehensive, free, no-login CSS toolkit
            developers can rely on daily. Everything runs in your browser, everything is copy-ready,
            and nothing hides behind a sign-up form.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Why &ldquo;SagaCSS&rdquo;
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            A saga is a long story told in chapters — and that&apos;s exactly what this project is.
            Not a fixed, finished product with a launch date and a press release, but an evolving
            journey. One tool ships, then the next. A generator gets refined because real feedback
            said the defaults were off. A new category shows up because enough people asked for it.
          </p>
          <p>
            The name reflects that mindset: SagaCSS is the ongoing story of building useful CSS
            tooling, one chapter at a time.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          What SagaCSS offers today
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            SagaCSS is a growing collection of visual generators and references, organised into four
            groups:
          </p>
          <ul className="list-disc space-y-2 pl-6 marker:text-primary">
            <li>
              <strong className="text-foreground">Core CSS generators</strong> — gradients,
              border-radius, box shadow, text shadow, animations, cubic-bezier curves, clip-path,
              filters, flexbox and grid playgrounds, button styles, spinners, scrollbars and more.
            </li>
            <li>
              <strong className="text-foreground">Design style generators</strong> — neumorphism,
              glassmorphism, claymorphism, neubrutalism, Y2K, cyberpunk and art-deco presets you can
              dial in and export.
            </li>
            <li>
              <strong className="text-foreground">Reference &amp; learning tools</strong> — a
              searchable CSS Cheat Sheet, color converters, contrast checkers, theme variable
              builders and other utilities that live next to your editor.
            </li>
            <li>
              <strong className="text-foreground">My Kit</strong> — a personal, browser-local space
              to save, preview and combine your favourite snippets across the whole app.
            </li>
          </ul>
          <p>
            Every tool sticks to the same core values: completely free, no sign-up, all data stays
            on your device (privacy-first), and code output is available in <strong>CSS</strong>,{" "}
            <strong>Tailwind</strong> and
            <strong> Bootstrap</strong> so it drops into whatever stack you&apos;re already using.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Built by
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            SagaCSS is designed, built and maintained by{" "}
            <a
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://www.linkedin.com/in/pawantripathi/"
              target="_blank"
              rel="noreferrer noopener"
            >
              Pawan Tripathi
            </a>{" "}
            — a developer who wanted to build practical, genuinely useful tools rather than another
            portfolio piece that nobody comes back to.
          </p>
          <p>
            This is an independently built project. No company backs it, no investors are steering
            the roadmap, no growth team is picking the features. It ships when it&apos;s ready and
            improves when there&apos;s something worth improving.
          </p>
          <p>
            You can follow the journey (or just say hello) on{" "}
            <a
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://www.linkedin.com/in/pawantripathi/"
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
            ,{" "}
            <a
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://github.com/tripathipawan"
              target="_blank"
              rel="noreferrer noopener"
            >
              GitHub
            </a>
            , the{" "}
            <a
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://www.youtube.com/@tripathidevlab"
              target="_blank"
              rel="noreferrer noopener"
            >
              TripathiDevLab
            </a>{" "}
            YouTube channel, or{" "}
            <a
              className="text-primary underline underline-offset-4 hover:text-primary/80"
              href="https://www.instagram.com/tripathidevlab"
              target="_blank"
              rel="noreferrer noopener"
            >
              Instagram
            </a>
            .
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          The philosophy
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            Developer tools should get out of your way. That means no login walls to preview a
            shadow, no paywalls for the basics, no dark patterns trying to squeeze an email out of
            you before you can copy a snippet.
          </p>
          <p>
            SagaCSS is a commitment to keeping that friction at zero. New tools get added based on
            real feedback and real developer needs — the visible &ldquo;Coming Soon&rdquo; roadmap
            you&apos;ll see across the app isn&apos;t marketing polish, it&apos;s a public promise
            about what&apos;s next.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
          Get involved
        </h2>
        <div className="space-y-4 text-[15px] leading-7 text-foreground/90">
          <p>
            If a tool is missing, a preset feels off, or you just want to share what you shipped
            with it — reach out. Suggestions turn into tools; bug reports turn into fixes;
            conversations shape the roadmap.
          </p>
          <p>
            Head to the{" "}
            <Link
              to="/contact"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              contact page
            </Link>{" "}
            for every way to get in touch, or start exploring the toolkit from the{" "}
            <Link
              to="/"
              className="text-primary underline underline-offset-4 hover:text-primary/80"
            >
              home page
            </Link>
            .
          </p>
        </div>

        <blockquote className="mt-4 rounded-xl border-l-4 border-primary bg-gradient-to-br from-primary/10 via-card/60 to-card/60 p-6 text-lg font-medium leading-8 text-foreground shadow-sm md:text-xl">
          &ldquo;Every tool here started as someone&apos;s frustration with doing it the hard way.
          This saga continues with every new tool we ship.&rdquo;
        </blockquote>
      </section>

      <div className="pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          ← Back to all tools
        </Link>
      </div>
    </article>
  );
}
