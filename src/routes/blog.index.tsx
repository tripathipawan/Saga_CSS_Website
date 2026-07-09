import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { BlogListing } from "@/components/blog/blog-listing";
import { BLOG_PAGE_SIZE, filterPosts } from "@/lib/blog";

const searchSchema = z.object({
  category: fallback(z.string().optional(), undefined),
  q: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/blog/")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ category: search.category ?? null, q: search.q ?? null }),
  loader: ({ deps }) => {
    const total = filterPosts(deps.category, deps.q).length;
    const totalPages = Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
    return { totalPages, category: deps.category, q: deps.q };
  },
  head: ({ loaderData }) => {
    const totalPages = loaderData?.totalPages ?? 1;
    const category = loaderData?.category ?? null;
    const q = loaderData?.q ?? null;
    const queryString = [
      category ? `category=${encodeURIComponent(category)}` : null,
      q ? `q=${encodeURIComponent(q)}` : null,
    ]
      .filter(Boolean)
      .join("&");
    const nextHref = totalPages > 1 ? `/blog/page/2${queryString ? `?${queryString}` : ""}` : null;
    const title = category
      ? `${category} Articles — SagaCSS Blog`
      : "SagaCSS Blog — Practical CSS Articles & Tutorials";
    const description = category
      ? `${category} articles on the SagaCSS blog — practical CSS tutorials, tips and deep-dives.`
      : "Practical CSS articles: layout, fundamentals, performance, accessibility and modern design trends from the SagaCSS toolkit.";
    const ogUrl = queryString ? `/blog?${queryString}` : "/blog";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: ogUrl },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: "/blog" },
        ...(nextHref ? [{ rel: "next", href: nextHref }] : []),
      ],
    };
  },
  component: BlogIndexPage,
});

function BlogIndexPage() {
  const { category, q } = Route.useSearch();
  return <BlogListing page={1} category={category ?? null} query={q ?? null} />;
}
