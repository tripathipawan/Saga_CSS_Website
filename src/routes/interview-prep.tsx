import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import {
  Search,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  ChevronDown,
  Download,
  ChevronLeft,
  ChevronRight,
  X,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ToolHeader } from "@/components/tool-header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  INTERVIEW_QUESTIONS,
  type InterviewQuestion,
  type QLevel,
  type QLang,
} from "@/lib/interview-questions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { z } from "zod";
import { zodValidator, fallback } from "@tanstack/zod-adapter";

const searchSchema = z.object({
  q: fallback(z.string().optional(), undefined),
});

export const Route = createFileRoute("/interview-prep")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [
      { title: "HTML & CSS Interview Prep — 200 Questions & Answers — SagaCSS" },
      {
        name: "description",
        content:
          "Practice for frontend interviews with 200 HTML and CSS questions and answers — filter by level, search by keyword, mark reviewed, and download a study guide PDF in one click.",
      },
      { property: "og:title", content: "HTML & CSS Interview Prep — SagaCSS" },
      {
        property: "og:description",
        content: "200 HTML and CSS interview questions with in-depth answers and code examples.",
      },
      { property: "og:url", content: "https://csscraft.lovable.app/interview-prep" },
    ],
    links: [{ rel: "canonical", href: "https://csscraft.lovable.app/interview-prep" }],
  }),
  component: InterviewPrepPage,
});

const REVIEW_KEY = "sagacss.interview.reviewed";
const BOOKMARK_KEY = "sagacss.interview.bookmarked";
const PAGE_SIZE = 10;

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

const LEVEL_COLORS: Record<QLevel, string> = {
  Basic: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Advanced: "bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30",
};

function InterviewPrepPage() {
  const search = Route.useSearch();
  const [lang, setLang] = React.useState<QLang | "all">("all");
  const [level, setLevel] = React.useState<QLevel | "all">("all");
  const [query, setQuery] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [openIds, setOpenIds] = React.useState<Set<string>>(new Set());
  const [reviewed, setReviewed] = React.useState<Set<string>>(() => loadSet(REVIEW_KEY));
  const [bookmarks, setBookmarks] = React.useState<Set<string>>(() => loadSet(BOOKMARK_KEY));
  const [exportOpen, setExportOpen] = React.useState(false);

  React.useEffect(() => saveSet(REVIEW_KEY, reviewed), [reviewed]);
  React.useEffect(() => saveSet(BOOKMARK_KEY, bookmarks), [bookmarks]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return INTERVIEW_QUESTIONS.filter((it) => {
      if (lang !== "all" && it.lang !== lang) return false;
      if (level !== "all" && it.level !== level) return false;
      if (q && !`${it.question} ${it.answer} ${it.topic}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [lang, level, query]);

  React.useEffect(() => setPage(1), [lang, level, query]);

  // Deep-link: open & scroll to ?q=<id>
  React.useEffect(() => {
    const id = search.q;
    if (!id) return;
    const idx = INTERVIEW_QUESTIONS.findIndex((it) => it.id === id);
    if (idx < 0) return;
    setLang("all");
    setLevel("all");
    setQuery("");
    setPage(Math.floor(idx / PAGE_SIZE) + 1);
    setOpenIds((p) => new Set(p).add(id));
    setTimeout(() => {
      const el = document.getElementById(`q-${id}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-primary");
        setTimeout(() => el.classList.remove("ring-2", "ring-primary"), 2500);
      }
    }, 60);
  }, [search.q]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = React.useMemo(() => {
    const byLevel: Record<QLevel, { total: number; reviewed: number }> = {
      Basic: { total: 0, reviewed: 0 },
      Medium: { total: 0, reviewed: 0 },
      Advanced: { total: 0, reviewed: 0 },
    };
    for (const q of INTERVIEW_QUESTIONS) {
      byLevel[q.level].total++;
      if (reviewed.has(q.id)) byLevel[q.level].reviewed++;
    }
    return {
      total: INTERVIEW_QUESTIONS.length,
      reviewed: reviewed.size,
      byLevel,
    };
  }, [reviewed]);

  const toggleOpen = (id: string) =>
    setOpenIds((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleReviewed = (id: string) =>
    setReviewed((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleBookmark = (id: string) =>
    setBookmarks((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const copyLink = async (id: string) => {
    const url = `${window.location.origin}/interview-prep?q=${id}`;
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied");
    } catch {
      toast.error("Copy failed");
    }
  };

  const pct = stats.total ? Math.round((stats.reviewed / stats.total) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <ToolHeader
        title="Interview Prep Hub"
        description="200 HTML & CSS interview questions with in-depth answers, code examples, filters, review tracking and one-click PDF download."
      />

      {/* Stats dashboard */}
      <section className="mb-6 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Total</div>
          <div className="mt-1 text-2xl font-bold">{stats.total}</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Reviewed</div>
          <div className="mt-1 text-2xl font-bold text-primary">
            {stats.reviewed} <span className="text-sm text-muted-foreground">({pct}%)</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>
        {(["Basic", "Medium", "Advanced"] as QLevel[]).map((lv) => (
          <div key={lv} className="hidden sm:block">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{lv}</div>
            <div className="mt-1 text-sm">
              <span className="font-semibold">{stats.byLevel[lv].reviewed}</span>
              <span className="text-muted-foreground"> / {stats.byLevel[lv].total}</span>
            </div>
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions, answers, topics…"
            className="pl-9"
            aria-label="Search interview questions"
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
        <Select value={lang} onValueChange={(v) => setLang(v as any)}>
          <SelectTrigger className="w-full sm:w-32" aria-label="Filter by language">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All langs</SelectItem>
            <SelectItem value="CSS">CSS</SelectItem>
            <SelectItem value="HTML">HTML</SelectItem>
          </SelectContent>
        </Select>
        <Select value={level} onValueChange={(v) => setLevel(v as any)}>
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
        <ExportDialog
          open={exportOpen}
          onOpenChange={setExportOpen}
          filtered={filtered}
          reviewed={reviewed}
          bookmarks={bookmarks}
        />
      </section>

      <div className="mb-3 text-xs text-muted-foreground">
        Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–
        {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
      </div>

      {/* Questions */}
      <ul className="flex flex-col gap-3">
        {pageItems.length === 0 && (
          <li className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No questions match your filters.
          </li>
        )}
        {pageItems.map((it) => {
          const isOpen = openIds.has(it.id);
          const isReviewed = reviewed.has(it.id);
          const isBookmarked = bookmarks.has(it.id);
          return (
            <li
              key={it.id}
              id={`q-${it.id}`}
              className={`rounded-xl border bg-card transition-colors ${isReviewed ? "border-primary/40" : "border-border"}`}
            >
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => toggleReviewed(it.id)}
                  aria-label={isReviewed ? "Mark as not reviewed" : "Mark as reviewed"}
                  aria-pressed={isReviewed}
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
                >
                  {isReviewed ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => toggleOpen(it.id)}
                  aria-expanded={isOpen}
                  aria-controls={`ans-${it.id}`}
                  className="flex min-w-0 flex-1 items-start justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px]">
                        {it.lang}
                      </Badge>
                      <Badge variant="outline" className={`text-[10px] ${LEVEL_COLORS[it.level]}`}>
                        {it.level}
                      </Badge>
                      <span className="text-[10px] text-muted-foreground">{it.topic}</span>
                    </div>
                    <div className="font-medium leading-snug">{it.question}</div>
                  </div>
                  <ChevronDown
                    className={`mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <button
                  onClick={() => toggleBookmark(it.id)}
                  aria-label={isBookmarked ? "Remove bookmark" : "Bookmark question"}
                  aria-pressed={isBookmarked}
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
                >
                  {isBookmarked ? (
                    <BookmarkCheck className="h-5 w-5 text-primary" />
                  ) : (
                    <Bookmark className="h-5 w-5" />
                  )}
                </button>
                <button
                  onClick={() => copyLink(it.id)}
                  aria-label="Copy shareable link"
                  className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary"
                >
                  <LinkIcon className="h-4 w-4" />
                </button>
              </div>
              {isOpen && (
                <div id={`ans-${it.id}`} className="border-t border-border px-4 py-4 text-sm">
                  <p className="whitespace-pre-line leading-relaxed text-foreground/90">
                    {it.answer}
                  </p>
                  {it.code && (
                    <pre className="mt-3 overflow-auto rounded-lg bg-muted p-3 text-xs leading-relaxed">
                      <code>{it.code}</code>
                    </pre>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {/* Pagination */}
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

async function exportInterviewPdf(items: InterviewQuestion[]) {
  // Dynamic import keeps jsPDF out of the initial bundle.
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - margin) {
      addFooter();
      doc.addPage();
      y = margin;
    }
  };
  let pageNum = 1;
  const addFooter = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text(`SagaCSS · Interview Prep Study Guide`, margin, pageH - 20);
    doc.text(`Page ${pageNum}`, pageW - margin, pageH - 20, { align: "right" });
    pageNum++;
  };

  // ---------- Cover page ----------
  doc.setFillColor(99, 102, 241);
  doc.rect(0, 0, pageW, 220, "F");
  doc.setTextColor(255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(38);
  doc.text("SagaCSS", margin, 110);
  doc.setFontSize(20);
  doc.setFont("helvetica", "normal");
  doc.text("Interview Prep Study Guide", margin, 150);
  doc.setFontSize(12);
  doc.text(`${items.length} curated HTML & CSS questions`, margin, 180);
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11);
  doc.text(
    `Generated ${new Date().toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    260,
  );
  doc.setFontSize(10);
  doc.setTextColor(100);
  const intro =
    "This study guide is organised by language and difficulty. Each question includes an in-depth explanation and a code example where relevant. Best of luck with your interviews!";
  const introLines = doc.splitTextToSize(intro, contentW);
  doc.text(introLines, margin, 290);
  addFooter();
  doc.addPage();
  y = margin;

  // ---------- Group and render questions ----------
  const grouped = new Map<string, InterviewQuestion[]>();
  for (const it of items) {
    const key = `${it.lang} · ${it.level}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(it);
  }
  const orderedKeys = Array.from(grouped.keys()).sort();

  for (const key of orderedKeys) {
    const list = grouped.get(key)!;
    ensureRoom(40);
    doc.setDrawColor(99, 102, 241);
    doc.setLineWidth(2);
    doc.line(margin, y + 4, margin + 40, y + 4);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59);
    doc.text(key, margin, y + 22);
    y += 40;

    list.forEach((it, idx) => {
      // Question
      const qLines = doc.splitTextToSize(`${idx + 1}. ${it.question}`, contentW);
      ensureRoom(qLines.length * 14 + 6);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text(qLines, margin, y);
      y += qLines.length * 14 + 2;

      // Topic meta
      doc.setFont("helvetica", "italic");
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(it.topic.toUpperCase(), margin, y);
      y += 12;

      // Answer (strip backticks for cleaner print rendering)
      const answer = it.answer.replace(/`/g, "");
      const aLines = doc.splitTextToSize(answer, contentW);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10.5);
      doc.setTextColor(30, 41, 59);
      for (const line of aLines) {
        ensureRoom(14);
        doc.text(line, margin, y);
        y += 13;
      }

      // Code
      if (it.code) {
        const codeLines: string[] = [];
        for (const raw of it.code.split("\n")) {
          const wrapped = doc.splitTextToSize(raw || " ", contentW - 16);
          for (const w of wrapped) codeLines.push(w);
        }
        const boxH = codeLines.length * 12 + 12;
        ensureRoom(boxH + 6);
        doc.setFillColor(241, 245, 249);
        doc.roundedRect(margin, y, contentW, boxH, 4, 4, "F");
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        doc.setTextColor(51, 65, 85);
        let cy = y + 14;
        for (const line of codeLines) {
          doc.text(line, margin + 8, cy);
          cy += 12;
        }
        y += boxH + 4;
      }

      y += 12; // spacing between questions
    });
  }

  addFooter();
  doc.save(`sagacss-interview-prep-${new Date().toISOString().slice(0, 10)}.pdf`);
}

type Scope = "filtered" | "all" | "bookmarked" | "reviewed";

function ExportDialog({
  open,
  onOpenChange,
  filtered,
  reviewed,
  bookmarks,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  filtered: InterviewQuestion[];
  reviewed: Set<string>;
  bookmarks: Set<string>;
}) {
  const [scope, setScope] = React.useState<Scope>("filtered");
  const [langs, setLangs] = React.useState<Record<QLang, boolean>>({ HTML: true, CSS: true });
  const [levels, setLevels] = React.useState<Record<QLevel, boolean>>({
    Basic: true,
    Medium: true,
    Advanced: true,
  });

  const base: InterviewQuestion[] = React.useMemo(() => {
    switch (scope) {
      case "filtered":
        return filtered;
      case "all":
        return INTERVIEW_QUESTIONS;
      case "bookmarked":
        return INTERVIEW_QUESTIONS.filter((q) => bookmarks.has(q.id));
      case "reviewed":
        return INTERVIEW_QUESTIONS.filter((q) => reviewed.has(q.id));
    }
  }, [scope, filtered, reviewed, bookmarks]);

  const selected = React.useMemo(
    () => base.filter((q) => langs[q.lang] && levels[q.level]),
    [base, langs, levels],
  );

  const download = async () => {
    if (selected.length === 0) {
      toast.error("Nothing to export");
      return;
    }
    await exportInterviewPdf(selected);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export study guide</DialogTitle>
          <DialogDescription>
            Pick which questions to include, then download a formatted PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2 text-sm">
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Scope
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "filtered", label: `Current results (${filtered.length})` },
                  { id: "all", label: `All (${INTERVIEW_QUESTIONS.length})` },
                  { id: "bookmarked", label: `Bookmarked (${bookmarks.size})` },
                  { id: "reviewed", label: `Reviewed (${reviewed.size})` },
                ] as { id: Scope; label: string }[]
              ).map((s) => (
                <label
                  key={s.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-md border px-3 py-2 text-xs ${scope === s.id ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === s.id}
                    onChange={() => setScope(s.id)}
                    className="accent-primary"
                  />
                  {s.label}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Languages
            </div>
            <div className="flex gap-3">
              {(["HTML", "CSS"] as QLang[]).map((l) => (
                <label key={l} className="inline-flex cursor-pointer items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={langs[l]}
                    onChange={(e) => setLangs((p) => ({ ...p, [l]: e.target.checked }))}
                    className="accent-primary"
                  />
                  {l}
                </label>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Levels
            </div>
            <div className="flex flex-wrap gap-3">
              {(["Basic", "Medium", "Advanced"] as QLevel[]).map((lv) => (
                <label key={lv} className="inline-flex cursor-pointer items-center gap-1.5 text-xs">
                  <input
                    type="checkbox"
                    checked={levels[lv]}
                    onChange={(e) => setLevels((p) => ({ ...p, [lv]: e.target.checked }))}
                    className="accent-primary"
                  />
                  {lv}
                </label>
              ))}
            </div>
          </div>
          <div className="rounded-md bg-muted px-3 py-2 text-xs">
            Exporting <strong>{selected.length}</strong> question{selected.length === 1 ? "" : "s"}.
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={download} disabled={selected.length === 0} className="gap-1.5">
            <Download className="h-4 w-4" /> Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
