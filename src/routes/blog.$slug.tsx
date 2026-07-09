import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Link2 } from "lucide-react";
import { toast } from "sonner";
import { extractToc, getPost, getRelatedPosts, parseBlogContent } from "@/lib/blog";
import { ShareButtons } from "@/components/blog/share-buttons";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Post not found — SagaCSS" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} — SagaCSS Blog` },
        { name: "description", content: post.description },
        { property: "og:title", content: `${post.title} — SagaCSS` },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${post.slug}` },
        { property: "article:section", content: post.category },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.description },
      ],
      links: [{ rel: "canonical", href: `/blog/${post.slug}` }],
    };
  },
  notFoundComponent: PostNotFound,
  component: BlogPostPage,
});

function PostNotFound() {
  return (
    <div className="mx-auto max-w-3xl text-center py-16">
      <h1 className="text-2xl font-bold text-foreground">Post not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">This article doesn't exist or was moved.</p>
      <Link
        to="/blog"
        className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>
    </div>
  );
}

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const blocks = parseBlogContent(post.content);
  const toc = extractToc(post.content);
  const related = getRelatedPosts(post, 3);

  const copyHeadingLink = async (id: string) => {
    const base =
      typeof window !== "undefined"
        ? `${window.location.origin}/blog/${post.slug}`
        : `/blog/${post.slug}`;
    const url = `${base}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Section link copied");
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", `#${id}`);
      }
    } catch {
      toast.error("Couldn't copy link");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> All articles
      </Link>

      <div className="mt-4 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_220px]">
        <article className="min-w-0">
          <header className="border-b border-border pb-6">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link
                to="/blog"
                search={{ category: post.category }}
                className="rounded-full border border-primary/30 bg-primary/5 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary hover:bg-primary/10"
              >
                {post.category}
              </Link>
              <span className="text-muted-foreground">{post.readMinutes} min read</span>
            </div>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              {post.title}
            </h1>
            <p className="mt-3 text-base text-muted-foreground md:text-lg">{post.description}</p>
          </header>

          {toc.length >= 3 && (
            <nav
              aria-label="Table of contents"
              className="mt-6 rounded-xl border border-border bg-card/60 p-4 lg:hidden"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </div>
              <ol className="mt-2 flex flex-col gap-1.5 text-sm">
                {toc.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                    <a href={`#${h.id}`} className="text-muted-foreground hover:text-primary">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          <div className="mt-8 flex flex-col gap-5 text-[15px] leading-7 text-foreground/90">
            {blocks.map((b, i) => {
              if (b.type === "h2") {
                return (
                  <h2
                    key={i}
                    id={b.id}
                    style={{ scrollMarginTop: "5rem" }}
                    className="group mt-6 flex items-center gap-2 text-xl font-semibold text-foreground"
                  >
                    <span>{b.text}</span>
                    <button
                      type="button"
                      onClick={() => copyHeadingLink(b.id)}
                      aria-label={`Copy link to section: ${b.text}`}
                      title="Copy link to this section"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:text-foreground focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                    >
                      <Link2 className="h-4 w-4" />
                    </button>
                  </h2>
                );
              }
              if (b.type === "h3") {
                return (
                  <h3
                    key={i}
                    id={b.id}
                    style={{ scrollMarginTop: "5rem" }}
                    className="group mt-4 flex items-center gap-2 text-base font-semibold text-foreground"
                  >
                    <span>{b.text}</span>
                    <button
                      type="button"
                      onClick={() => copyHeadingLink(b.id)}
                      aria-label={`Copy link to section: ${b.text}`}
                      title="Copy link to this section"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition hover:text-foreground focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring group-hover:opacity-100"
                    >
                      <Link2 className="h-3.5 w-3.5" />
                    </button>
                  </h3>
                );
              }
              if (b.type === "ul") {
                return (
                  <ul key={i} className="ml-5 list-disc space-y-1.5 text-muted-foreground">
                    {b.items.map((item, j) => (
                      <li key={j}>{item}</li>
                    ))}
                  </ul>
                );
              }
              if (b.type === "code") {
                return (
                  <pre
                    key={i}
                    className="overflow-x-auto rounded-lg border border-border bg-muted/50 p-4 text-[13px] leading-6"
                  >
                    <code className="font-mono">{b.text}</code>
                  </pre>
                );
              }
              return (
                <p key={i} className="text-muted-foreground">
                  {b.text}
                </p>
              );
            })}
          </div>

          <div className="mt-10 border-t border-border pt-6">
            <ShareButtons slug={post.slug} title={post.title} description={post.description} />
          </div>

          {related.length > 0 && (
            <aside className="mt-14 border-t border-border pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Related articles
              </h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <li key={p.slug}>
                    <Link
                      to="/blog/$slug"
                      params={{ slug: p.slug }}
                      className="block h-full rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40"
                    >
                      <div className="text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {p.category}
                      </div>
                      <div className="mt-1 text-sm font-semibold text-foreground">{p.title}</div>
                      <div className="mt-1 text-xs text-muted-foreground">{p.description}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </article>

        {toc.length >= 3 && (
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-20">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                On this page
              </div>
              <ol className="mt-3 flex flex-col gap-2 border-l border-border pl-3 text-sm">
                {toc.map((h) => (
                  <li key={h.id} className={h.level === 3 ? "ml-3" : ""}>
                    <a
                      href={`#${h.id}`}
                      className="block text-muted-foreground transition-colors hover:text-primary"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </aside>
        )}
      </div>
    </div>
  );
}
