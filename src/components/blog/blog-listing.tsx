import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { ToolHeader } from "@/components/tool-header";
import { BLOG_PAGE_SIZE, BLOG_POSTS, filterPosts, getAllCategories, paginate } from "@/lib/blog";

type Props = {
  page: number;
  category: string | null;
  query: string | null;
};

export function BlogListing({ page, category, query }: Props) {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState(query ?? "");
  useEffect(() => setSearchInput(query ?? ""), [query]);

  const filtered = useMemo(() => filterPosts(category, query), [category, query]);
  const { items, currentPage, totalPages, total, hasPrev, hasNext } = paginate(
    filtered,
    page,
    BLOG_PAGE_SIZE,
  );
  const categories = getAllCategories();

  const searchFor = (c: string | null, q: string | null) => {
    const s: { category?: string; q?: string } = {};
    if (c) s.category = c;
    if (q && q.trim()) s.q = q.trim();
    return s;
  };

  const title = category ? `Blog — ${category}` : "Blog";
  const description = category
    ? `${category} articles on the SagaCSS blog.`
    : "Practical writeups on CSS craft — layout, fundamentals, performance, accessibility and design trends.";

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/blog", search: searchFor(category, searchInput) });
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <ToolHeader title={title} description={description} />

      <div className="flex flex-col gap-4">
        <form
          onSubmit={onSearchSubmit}
          role="search"
          aria-label="Search articles"
          className="relative"
        >
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search articles by title, content or keyword..."
            className="w-full rounded-lg border border-border bg-background py-2.5 pl-10 pr-10 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/60"
            aria-label="Search articles"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                navigate({ to: "/blog", search: searchFor(category, null) });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>

        <nav aria-label="Filter posts by category" className="flex flex-wrap items-center gap-2">
          <Link
            to="/blog"
            search={searchFor(null, query)}
            className={
              !category
                ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                : "rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            }
          >
            All <span className="ml-1 text-muted-foreground/70">({BLOG_POSTS.length})</span>
          </Link>
          {categories.map(({ category: c, count }) => {
            const active = category === c;
            return (
              <Link
                key={c}
                to="/blog"
                search={searchFor(c, query)}
                className={
                  active
                    ? "rounded-full border border-primary bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    : "rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                }
                aria-current={active ? "page" : undefined}
              >
                {c} <span className="ml-1 text-muted-foreground/70">({count})</span>
              </Link>
            );
          })}
        </nav>

        {(category || (query && query.trim())) && (
          <p className="text-xs text-muted-foreground">
            Showing {total} {total === 1 ? "article" : "articles"}
            {category && (
              <>
                {" "}
                in <span className="font-medium text-foreground">{category}</span>
              </>
            )}
            {query && query.trim() && (
              <>
                {" "}
                matching <span className="font-medium text-foreground">"{query.trim()}"</span>
              </>
            )}
          </p>
        )}
      </div>

      {items.length === 0 ? (
        <div
          role="status"
          data-testid="blog-empty-state"
          className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center"
        >
          <p className="text-base font-semibold text-foreground">No articles match your filters</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try a different category or clear your search.
          </p>
          <Link
            to="/blog"
            search={{}}
            className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((post) => (
            <li key={post.slug} className="h-full">
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40 hover:bg-card/80"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full border border-primary/30 bg-primary/5 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                    {post.category}
                  </span>
                  <span>{post.readMinutes} min read</span>
                </div>
                <h2 className="mt-2 text-base font-semibold text-foreground group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">{post.description}</p>
                <span className="mt-3 text-xs font-medium text-primary">Read article →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav
          aria-label="Pagination"
          className="flex items-center justify-between border-t border-border pt-6"
        >
          {hasPrev ? (
            currentPage - 1 === 1 ? (
              <Link
                to="/blog"
                search={searchFor(category, query)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                rel="prev"
              >
                ← Previous
              </Link>
            ) : (
              <Link
                to="/blog/page/$page"
                params={{ page: String(currentPage - 1) }}
                search={searchFor(category, query)}
                className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
                rel="prev"
              >
                ← Previous
              </Link>
            )
          ) : (
            <span aria-hidden="true" />
          )}

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          {hasNext ? (
            <Link
              to="/blog/page/$page"
              params={{ page: String(currentPage + 1) }}
              search={searchFor(category, query)}
              className="inline-flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-accent"
              rel="next"
            >
              Next →
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
    </div>
  );
}
