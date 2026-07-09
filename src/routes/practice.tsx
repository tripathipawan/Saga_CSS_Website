import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Eye,
  EyeOff,
  RotateCcw,
  X,
  Link as LinkIcon,
  Download,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolHeader } from "@/components/tool-header";
import type { jsPDF } from "jspdf";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CHALLENGES,
  CHALLENGE_CATEGORIES,
  type Challenge,
  type ChallengeLevel,
} from "@/lib/practice-challenges";
import { resolveChecks, runChecks, type CheckResult } from "@/lib/practice-checks";
import { toast } from "sonner";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  c: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/practice")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "CSS Practice Challenges — 150 Live Coding Exercises — SagaCSS" },
      {
        name: "description",
        content:
          "150 hands-on CSS challenges with a live code editor, target preview, automated pass/fail checks, solutions and PDF export. Practice Flexbox, Grid, animations, selectors and more.",
      },
      { property: "og:title", content: "CSS Practice Challenges — SagaCSS" },
      {
        property: "og:description",
        content:
          "150 live-editor CSS challenges with automated checks — Flexbox, Grid, animations, selectors, responsive design.",
      },
      { property: "og:url", content: "/practice" },
    ],
    links: [{ rel: "canonical", href: "/practice" }],
  }),
  component: PracticePage,
});

const DONE_KEY = "sagacss.practice.done";
const BOOKMARK_KEY = "sagacss.practice.bookmarked";
const CODE_KEY = "sagacss.practice.code";
const PAGE_SIZE = 9;

function loadSet(key: string): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(window.localStorage.getItem(key) ?? "[]"));
  } catch {
    return new Set();
  }
}
function saveSet(key: string, s: Set<string>) {
  try {
    window.localStorage.setItem(key, JSON.stringify(Array.from(s)));
  } catch {
    /* ignore */
  }
}
function loadCode(id: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  try {
    const map = JSON.parse(window.localStorage.getItem(CODE_KEY) ?? "{}");
    return typeof map[id] === "string" ? map[id] : fallback;
  } catch {
    return fallback;
  }
}
function saveCode(id: string, code: string) {
  try {
    const map = JSON.parse(window.localStorage.getItem(CODE_KEY) ?? "{}");
    map[id] = code;
    window.localStorage.setItem(CODE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

const LEVEL_COLORS: Record<ChallengeLevel, string> = {
  Basic: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Advanced: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

function PracticePage() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [level, setLevel] = React.useState<ChallengeLevel | "all">("all");
  const [category, setCategory] = React.useState<string>("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [active, setActive] = React.useState<Challenge | null>(null);
  const [done, setDone] = React.useState<Set<string>>(() => loadSet(DONE_KEY));
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(() => loadSet(BOOKMARK_KEY));

  React.useEffect(() => saveSet(DONE_KEY, done), [done]);
  React.useEffect(() => saveSet(BOOKMARK_KEY, bookmarks), [bookmarks]);

  // Deep-link: open a specific challenge by ?c=<id>
  React.useEffect(() => {
    const id = search.c;
    if (id && (!active || active.id !== id)) {
      const found = CHALLENGES.find((c) => c.id === id);
      if (found) setActive(found);
    }
    if (!id && active) setActive(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.c]);

  const openChallenge = (c: Challenge) => {
    setActive(c);
    navigate({ search: { c: c.id }, replace: false });
  };
  const closeChallenge = () => {
    setActive(null);
    navigate({ search: {}, replace: false });
  };

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return CHALLENGES.filter((c) => {
      if (level !== "all" && c.level !== level) return false;
      if (category !== "all" && c.category !== category) return false;
      if (q && !`${c.title} ${c.description} ${c.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [level, category, query]);

  React.useEffect(() => setPage(1), [level, category, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = React.useMemo(() => {
    const byLevel: Record<ChallengeLevel, { total: number; done: number }> = {
      Basic: { total: 0, done: 0 },
      Medium: { total: 0, done: 0 },
      Advanced: { total: 0, done: 0 },
    };
    for (const c of CHALLENGES) {
      byLevel[c.level].total++;
      if (done.has(c.id)) byLevel[c.level].done++;
    }
    return { total: CHALLENGES.length, done: done.size, byLevel };
  }, [done]);

  const toggleDone = (id: string) =>
    setDone((p) => {
      const n = new Set(p);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });
  const toggleBookmark = (id: string) =>
    setBookmarks((p) => {
      const n = new Set(p);
      if (n.has(id)) {
        n.delete(id);
      } else {
        n.add(id);
      }
      return n;
    });

  const pct = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

  if (active) {
    return (
      <ChallengeView
        challenge={active}
        isDone={done.has(active.id)}
        isBookmarked={bookmarks.has(active.id)}
        onBack={closeChallenge}
        onToggleDone={() => toggleDone(active.id)}
        onToggleBookmark={() => toggleBookmark(active.id)}
      />
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <ToolHeader
        title="CSS Practice Challenges"
        description="150 live-editor CSS challenges with automated pass/fail checks. Compare against a target preview, write your CSS, reveal a solution when stuck, and export your bookmarks as PDF."
      />

      <section className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total</div>
          <div className="mt-1 text-2xl font-bold">{stats.total}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Completed</div>
          <div className="mt-1 text-2xl font-bold text-primary">
            {stats.done} <span className="text-sm text-muted-foreground">({pct}%)</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {(["Basic", "Medium", "Advanced"] as ChallengeLevel[]).map((lv) => (
          <div key={lv} className="hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{lv}</div>
            <div className="mt-1 text-sm">
              <span className="font-semibold">{stats.byLevel[lv].done}</span>
              <span className="text-muted-foreground"> / {stats.byLevel[lv].total}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="mb-4 flex flex-wrap items-center justify-end gap-2">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          disabled={bookmarks.size === 0}
          onClick={() =>
            exportPracticePdf(
              CHALLENGES.filter((c) => bookmarks.has(c.id)),
              "bookmarked",
            )
          }
        >
          <Download className="h-4 w-4" /> Export bookmarked ({bookmarks.size})
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() =>
            exportPracticePdf(
              CHALLENGES.filter((c) => done.has(c.id)),
              "completed",
            )
          }
          disabled={done.size === 0}
        >
          <Download className="h-4 w-4" /> Export completed ({done.size})
        </Button>
      </div>

      <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search challenges…"
            className="pl-9"
            aria-label="Search challenges"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-muted"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
        <Select value={level} onValueChange={(v) => setLevel(v as ChallengeLevel | "all")}>
          <SelectTrigger className="w-full sm:w-36" aria-label="Filter by level">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            <SelectItem value="Basic">Basic</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Advanced">Advanced</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Filter by category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CHALLENGE_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </section>

      <div className="mb-3 text-xs text-muted-foreground">
        Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {pageItems.length === 0 && (
          <li className="col-span-full rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No challenges match your filters.
          </li>
        )}
        {pageItems.map((c) => {
          const isDone = done.has(c.id);
          const isBookmarked = bookmarks.has(c.id);
          return (
            <li
              key={c.id}
              className={`group flex flex-col overflow-hidden rounded-xl border bg-card transition-colors ${isDone ? "border-primary/40" : "border-border hover:border-primary/30"}`}
            >
              <button
                onClick={() => openChallenge(c)}
                className="flex flex-1 flex-col text-left"
                aria-label={`Open challenge: ${c.title}`}
              >
                <div className="border-b border-border bg-muted/30 p-3">
                  <ChallengePreview challenge={c} css={c.solutionCss} height={140} />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[c.level]}`}>
                      {c.level}
                    </Badge>
                    <Badge variant="outline" className="text-[10px]">
                      {c.category}
                    </Badge>
                  </div>
                  <div className="font-semibold leading-snug">{c.title}</div>
                  <p className="text-xs text-muted-foreground line-clamp-2">{c.description}</p>
                </div>
              </button>
              <div className="flex items-center justify-between border-t border-border p-2">
                <button
                  onClick={() => toggleDone(c.id)}
                  aria-pressed={isDone}
                  aria-label={isDone ? "Mark not completed" : "Mark completed"}
                  className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
                >
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  {isDone ? "Completed" : "Mark done"}
                </button>
                <button
                  onClick={() => toggleBookmark(c.id)}
                  aria-pressed={isBookmarked}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark"}
                  className="rounded p-1 text-muted-foreground hover:bg-muted"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-4 w-4 text-primary" />
                  ) : (
                    <Bookmark className="h-4 w-4" />
                  )}
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav className="mt-6 flex items-center justify-between" aria-label="Pagination">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" /> Prev
          </Button>
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next <ChevronRight className="h-4 w-4" />
          </Button>
        </nav>
      )}
    </div>
  );
}

function ChallengePreview({
  challenge,
  css,
  height = 200,
}: {
  challenge: Challenge;
  css: string;
  height?: number;
}) {
  const srcDoc = React.useMemo(
    () =>
      `<!doctype html><html><head><style>html,body{margin:0;padding:8px;font-family:system-ui,sans-serif;font-size:13px;background:transparent;overflow:hidden;}${css}</style></head><body>${challenge.html}</body></html>`,
    [css, challenge.html],
  );
  return (
    <iframe
      title={`Preview of ${challenge.title}`}
      srcDoc={srcDoc}
      className="w-full rounded-md border border-border bg-white"
      style={{ height }}
      sandbox="allow-same-origin"
    />
  );
}

function ChallengeView({
  challenge,
  isDone,
  isBookmarked,
  onBack,
  onToggleDone,
  onToggleBookmark,
}: {
  challenge: Challenge;
  isDone: boolean;
  isBookmarked: boolean;
  onBack: () => void;
  onToggleDone: () => void;
  onToggleBookmark: () => void;
}) {
  const [code, setCode] = React.useState(() => loadCode(challenge.id, challenge.starterCss));
  const [showSolution, setShowSolution] = React.useState(false);
  const [results, setResults] = React.useState<{ results: CheckResult[]; note?: string } | null>(
    null,
  );

  React.useEffect(() => saveCode(challenge.id, code), [challenge.id, code]);
  React.useEffect(() => {
    setCode(loadCode(challenge.id, challenge.starterCss));
    setShowSolution(false);
    setResults(null);
  }, [challenge.id, challenge.starterCss]);

  const reset = () => {
    setCode(challenge.starterCss);
    setResults(null);
  };

  const checks = React.useMemo(() => resolveChecks(challenge), [challenge]);
  const runCheck = () => {
    const iframe = document.getElementById(
      `user-preview-${challenge.id}`,
    ) as HTMLIFrameElement | null;
    if (!iframe) {
      setResults(null);
      return;
    }
    if (checks.length === 0) {
      setResults({
        results: [],
        note: "No automated checks for this challenge — compare visually.",
      });
      return;
    }
    const res = runChecks(iframe, checks);
    setResults({ results: res });
  };

  const shareLink = async () => {
    const url = `${window.location.origin}/practice?c=${challenge.id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> All challenges
        </Button>
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[challenge.level]}`}>
            {challenge.level}
          </Badge>
          <Badge variant="outline" className="text-[10px]">
            {challenge.category}
          </Badge>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={shareLink}
            aria-label="Copy shareable link"
            className="gap-1.5"
          >
            <LinkIcon className="h-4 w-4" /> Copy link
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleBookmark}
            aria-pressed={isBookmarked}
            className="gap-1.5"
          >
            {isBookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            {isBookmarked ? "Bookmarked" : "Bookmark"}
          </Button>
          <Button
            variant={isDone ? "default" : "outline"}
            size="sm"
            onClick={onToggleDone}
            className="gap-1.5"
          >
            {isDone ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
            {isDone ? "Completed" : "Mark done"}
          </Button>
        </div>
      </div>

      <h1 className="text-2xl font-bold tracking-tight">{challenge.title}</h1>
      <p className="mt-2 text-muted-foreground">{challenge.description}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">🎯 Target</h2>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
              what to reproduce
            </span>
          </div>
          <ChallengePreview challenge={challenge} css={challenge.solutionCss} height={220} />
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-sm font-semibold">✏️ Your result</h2>
            <div className="flex gap-1">
              <Button size="sm" variant="ghost" onClick={runCheck} className="h-7 px-2 text-xs">
                Check
              </Button>
              <Button size="sm" variant="ghost" onClick={reset} className="h-7 gap-1 px-2 text-xs">
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            </div>
          </div>
          <iframe
            id={`user-preview-${challenge.id}`}
            title="Your live preview"
            srcDoc={`<!doctype html><html><head><style>html,body{margin:0;padding:8px;font-family:system-ui,sans-serif;font-size:13px;background:transparent;overflow:hidden;}${code}</style></head><body>${challenge.html}</body></html>`}
            className="w-full rounded-md border border-border bg-white"
            style={{ height: 220 }}
            sandbox="allow-same-origin"
          />
          {results && <CheckResultsPanel data={results} />}
        </section>
      </div>

      <section className="mt-4 rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <h2 className="text-sm font-semibold">Your CSS</h2>
          <span className="text-[10px] text-muted-foreground">saved locally as you type</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
          aria-label="Your CSS code"
          className="min-h-[220px] w-full resize-y rounded-b-xl bg-transparent p-4 font-mono text-sm outline-none"
        />
      </section>

      <section className="mt-4 rounded-xl border border-border bg-card p-4">
        <button
          className="flex items-center gap-2 text-sm font-semibold"
          onClick={() => setShowSolution((s) => !s)}
          aria-expanded={showSolution}
          aria-controls={`sol-${challenge.id}`}
        >
          {showSolution ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showSolution ? "Hide solution" : "Show solution"}
        </button>
        {showSolution && (
          <div id={`sol-${challenge.id}`} className="mt-3">
            <p className="mb-3 text-sm text-muted-foreground">{challenge.explanation}</p>
            <pre className="overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
              <code>{challenge.solutionCss}</code>
            </pre>
            <Button
              size="sm"
              variant="outline"
              className="mt-3"
              onClick={() => setCode(challenge.solutionCss)}
            >
              Load solution into editor
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

function CheckResultsPanel({ data }: { data: { results: CheckResult[]; note?: string } }) {
  if (data.note)
    return <div className="mt-2 rounded-md bg-muted px-3 py-2 text-xs">{data.note}</div>;
  const passed = data.results.filter((r) => r.pass).length;
  const total = data.results.length;
  const allPass = passed === total && total > 0;
  return (
    <div
      className={`mt-2 rounded-md border p-2 text-xs ${allPass ? "border-emerald-500/30 bg-emerald-500/5" : "border-rose-500/30 bg-rose-500/5"}`}
    >
      <div
        className={`mb-2 flex items-center gap-1.5 font-semibold ${allPass ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}`}
      >
        {allPass ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
        {allPass ? `Passed — all ${total} checks` : `Failed — ${passed}/${total} checks pass`}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[11px]">
          <thead className="text-muted-foreground">
            <tr className="text-left">
              <th className="p-1 font-medium">Selector</th>
              <th className="p-1 font-medium">Property</th>
              <th className="p-1 font-medium">Expected</th>
              <th className="p-1 font-medium">Actual</th>
              <th className="p-1 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((r, i) => (
              <tr key={i} className={`border-t border-border/50 ${r.pass ? "" : "bg-rose-500/5"}`}>
                <td className="p-1 font-mono">{r.check.selector}</td>
                <td className="p-1 font-mono">{r.check.prop}</td>
                <td className="p-1 font-mono text-muted-foreground">{r.check.matcher.value}</td>
                <td className="p-1 font-mono">
                  {r.actual ?? <span className="text-muted-foreground">{r.reason}</span>}
                </td>
                <td className="p-1">
                  {r.pass ? (
                    <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <XCircle className="h-3.5 w-3.5 text-rose-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

async function exportPracticePdf(items: Challenge[], scope: string) {
  if (items.length === 0) {
    toast.error("Nothing to export");
    return;
  }
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;
  let pageNum = 1;
  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`SagaCSS · Practice Challenges (${scope})`, margin, pageH - 20);
    doc.text(`Page ${pageNum}`, pageW - margin, pageH - 20, { align: "right" });
    pageNum++;
  };
  const ensure = (n: number) => {
    if (y + n > pageH - margin) {
      footer();
      doc.addPage();
      y = margin;
    }
  };

  // Cover
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageW, 180, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("SagaCSS", margin, 90);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.text(`Practice Challenges — ${scope}`, margin, 120);
  doc.setFontSize(11);
  doc.text(`${items.length} challenges · ${new Date().toLocaleDateString()}`, margin, 145);
  y = 220;

  for (const c of items) {
    ensure(60);
    doc.setTextColor(15, 23, 42);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const title = doc.splitTextToSize(`${c.title}  (${c.level} · ${c.category})`, contentW);
    doc.text(title, margin, y);
    y += title.length * 15 + 4;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(51, 65, 85);
    const desc = doc.splitTextToSize(c.description, contentW);
    for (const l of desc) {
      ensure(13);
      doc.text(l, margin, y);
      y += 13;
    }
    y += 4;
    // HTML block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100);
    ensure(14);
    doc.text("HTML", margin, y);
    y += 12;
    renderCode(
      doc,
      c.html,
      margin,
      contentW,
      () => ensure(14),
      () => {
        y += 12;
      },
      () => y,
      (v) => {
        y = v;
      },
    );
    // Solution CSS block
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100);
    ensure(14);
    doc.text("Solution CSS", margin, y);
    y += 12;
    renderCode(
      doc,
      c.solutionCss,
      margin,
      contentW,
      () => ensure(14),
      () => {
        y += 12;
      },
      () => y,
      (v) => {
        y = v;
      },
    );
    y += 12;
  }
  footer();
  doc.save(`sagacss-practice-${scope}-${new Date().toISOString().slice(0, 10)}.pdf`);
}

function renderCode(
  doc: jsPDF,
  code: string,
  margin: number,
  contentW: number,
  ensure: () => void,
  _bump: () => void,
  getY: () => number,
  setY: (n: number) => void,
) {
  const lines: string[] = [];
  for (const raw of code.split("\n")) {
    for (const w of doc.splitTextToSize(raw || " ", contentW - 16)) lines.push(w);
  }
  doc.setFillColor(241, 245, 249);
  const boxH = lines.length * 11 + 10;
  ensure();
  const y0 = getY();
  doc.roundedRect(margin, y0, contentW, boxH, 4, 4, "F");
  doc.setFont("courier", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  let cy = y0 + 12;
  for (const line of lines) {
    doc.text(line, margin + 8, cy);
    cy += 11;
  }
  setY(y0 + boxH + 4);
}
