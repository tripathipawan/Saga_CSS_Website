import { createFileRoute, notFound } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { BlogListing } from "@/components/blog/blog-listing";
import { BLOG_PAGE_SIZE, filterPosts } from "@/lib/blog";

const searchSchema = z.object({
  category: fallback(z.string().optional(), undefined),
  q: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/blog/page/$page")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ category: search.category ?? null, q: search.q ?? null }),
  loader: ({ params, deps }) => {
    const page = Number(params.page);
    if (!Number.isInteger(page) || page < 1) throw notFound();
    const total = filterPosts(deps.category, deps.q).length;
    const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
    if (page > totalPages || page === 1) throw notFound();
    return { page, totalPages, category: deps.category, q: deps.q };
  },
  head: ({ params, loaderData }) => {
    const page = params.page;
    const totalPages = loaderData?.totalPages ?? 1;
    const current = loaderData?.page ?? Number(page);
    const category = loaderData?.category ?? null;
    const q = loaderData?.q ?? null;
    const qs = [
      category ? `category=${encodeURIComponent(category)}` : null,
      q ? `q=${encodeURIComponent(q)}` : null,
    ].filter(Boolean).join("&");
    const queryString = qs ? `?${qs}` : "";
    const prevHref =
      current - 1 === 1 ? `/blog${queryString}` : `/blog/page/${current - 1}${queryString}`;
    const nextHref = current < totalPages ? `/blog/page/${current + 1}${queryString}` : null;
    return {
      meta: [
        { title: `Blog — Page ${page} — SagaCSS` },
        {
          name: "description",
          content: `Page ${page} of the SagaCSS blog — practical CSS articles on layout, performance, accessibility and design.`,
        },
        { property: "og:title", content: `Blog — Page ${page} — SagaCSS` },
        { property: "og:description", content: `Page ${page} of the SagaCSS blog.` },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `https://csscraft.lovable.app/blog/page/${page}` },
      ],
      links: [
        { rel: "canonical", href: `https://csscraft.lovable.app/blog/page/${page}` },
        { rel: "prev", href: prevHref },
        ...(nextHref ? [{ rel: "next", href: nextHref }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl py-16 text-center">
      <h1 className="text-2xl font-bold text-foreground">Page not found</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This blog page doesn't exist. Head back to the{" "}
        <a href="/blog" className="text-primary hover:underline">
          first page
        </a>
        .
      </p>
    </div>
  ),
  component: BlogPagePage,
});

function BlogPagePage() {
  const { page } = Route.useLoaderData();
  const { category, q } = Route.useSearch();
  return <BlogListing page={page} category={category ?? null} query={q ?? null} />;
}
