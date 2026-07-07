export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  readMinutes: number;
  category: string;
  tags: string[];
  content: string; // markdown-ish plain paragraphs separated by blank lines; supports ## headings and - list items
};

export const BLOG_PAGE_SIZE = 9;

// Ordered manually; no publish dates are shown anywhere in the UI so this
// content reads as evergreen. Order here === display order.
import { NEW_BLOG_POSTS } from "./blog-posts";

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "why-sagacss",
    title: "Why SagaCSS exists",
    description: "A short story about frustration with copy-paste CSS and how a weekend tool grew into a full visual toolkit.",
    readMinutes: 4,
    category: "Product",
    tags: ["story", "product"],
    content: `Every developer has that moment. You are staring at a hero section that is almost right, the gradient is close but not quite, the shadow is heavier than it should be, and you have five browser tabs open cross-referencing MDN, a Stack Overflow answer from 2014, and someone's CodePen.\n\nSagaCSS started as a personal escape hatch from that loop. The idea was small: a single page with sliders for a gradient and a copy button. That was it.\n\n## From one tool to many\n\nOnce the gradient tool existed, the border-radius tool was obvious. Then box-shadow. Then a color palette generator, because picking a five-color palette by typing hex codes into a text box is not a great user experience.\n\nEach tool solved one small problem. Together they became a toolkit.\n\n## The principles\n\n- Everything runs in your browser. No sign up, no tracking, no cloud.\n- Every value you tweak has a live preview.\n- Every output has a one-click copy button that gives you production-ready CSS.\n- Tailwind and Bootstrap tabs sit next to the raw CSS so you can paste into whatever your project actually uses.\n\nThat's the whole product. No roadmap deck, no growth chart, just tools that respect your time.`
  },
  {
    slug: "gradients-that-do-not-look-muddy",
    title: "Gradients that do not look muddy",
    description: "Why blending two random colors usually produces gray, and the three-stop trick that fixes it.",
    readMinutes: 5,
    category: "Color",
    tags: ["gradients", "color-theory"],
    content: `Take two colors from opposite sides of the color wheel — say a warm orange and a cool teal — and blend them in a linear gradient. Somewhere in the middle you'll get a grayish brown that looks like wet cardboard.\n\nThis is not your fault. It is math.\n\n## What is actually happening\n\nCSS gradients interpolate in sRGB by default. Interpolating two complementary colors in sRGB passes through the neutral axis, which is gray. The wider the hue jump, the more gray you get in the middle.\n\n## The three-stop trick\n\nInsert a middle stop that shares saturation and lightness with the endpoints but sits between them on the hue wheel.\n\n\`\`\`css\nbackground: linear-gradient(90deg, #ff7a45 0%, #d94f8c 50%, #6b5bff 100%);\n\`\`\`\n\nThe midpoint is doing the heavy lifting. It keeps chroma high across the whole transition instead of collapsing to gray.\n\n## Or use a modern color space\n\nOn browsers that support it, tell CSS to interpolate in a perceptually uniform space:\n\n\`\`\`css\nbackground: linear-gradient(in oklch 90deg, #ff7a45, #6b5bff);\n\`\`\`\n\nThat single \`in oklch\` keyword removes the muddy midpoint without needing a manual middle stop.`
  },
  {
    slug: "shadow-layering",
    title: "Layered shadows: the one habit that makes UI feel expensive",
    description: "A single box-shadow always looks flat. Stacking two or three cheap shadows gives you depth for free.",
    readMinutes: 3,
    category: "Design Trends",
    tags: ["shadows", "polish"],
    content: `Compare these two cards side by side and one of them will always look more expensive:\n\n\`\`\`css\n/* Flat */\nbox-shadow: 0 8px 24px rgba(0,0,0,.2);\n\n/* Layered */\nbox-shadow:\n  0 1px 2px rgba(0,0,0,.06),\n  0 4px 12px rgba(0,0,0,.08),\n  0 16px 40px rgba(0,0,0,.12);\n\`\`\`\n\n## Why layering works\n\nReal-world shadows are never a single blur. They are a sharp contact shadow directly under the object, a medium ambient shadow a few centimeters out, and a soft cast shadow further away. Stacking three shadows in CSS mimics that.\n\n## A rule of thumb\n\n- One tight, low-opacity shadow for the contact edge (1-2px offset, 2-4px blur)\n- One medium shadow for ambient depth (4-8px offset, 12-20px blur)\n- One large soft shadow for atmosphere (12-24px offset, 32-60px blur)\n\nKeep every layer under 15 percent opacity. The eye reads three subtle shadows as depth, but one heavy shadow as a sticker.`
  },
  ...NEW_BLOG_POSTS,
];

export function getPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getSortedPosts(): BlogPost[] {
  // Manual order — no dates in this collection.
  return [...BLOG_POSTS];
}

export function getAllCategories(): { category: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of BLOG_POSTS) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
  return [...counts.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count || a.category.localeCompare(b.category));
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of BLOG_POSTS) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function filterPosts(
  categoryOrTag: string | null,
  query: string | null = null,
): BlogPost[] {
  let posts = getSortedPosts();
  if (categoryOrTag) {
    const key = categoryOrTag.toLowerCase();
    posts = posts.filter(
      (p) => p.category.toLowerCase() === key || p.tags.some((t) => t.toLowerCase() === key),
    );
  }
  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.content.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return posts;
}

export function getRelatedPosts(post: BlogPost, limit = 3): BlogPost[] {
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);
  const sameCategory = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...sameCategory, ...rest].slice(0, limit);
}

export function paginate<T>(items: T[], page: number, pageSize = BLOG_PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    currentPage: current,
    totalPages,
    total: items.length,
    hasPrev: current > 1,
    hasNext: current < totalPages,
  };
}

// Minimal renderer for the tiny markdown subset used above.
export type BlogBlock =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "code"; lang: string; text: string };

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function parseBlogContent(content: string): BlogBlock[] {
  const blocks: BlogBlock[] = [];
  const lines = content.split("\n");
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: "code", lang, text: buf.join("\n") });
      continue;
    }
    if (line.startsWith("## ")) {
      const text = line.slice(3).trim();
      blocks.push({ type: "h2", text, id: slugifyHeading(text) });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = line.slice(4).trim();
      blocks.push({ type: "h3", text, id: slugifyHeading(text) });
      i++;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    // paragraph — collect until blank line or special marker
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !lines[i].startsWith("## ") &&
      !lines[i].startsWith("### ") &&
      !lines[i].startsWith("- ") &&
      !lines[i].startsWith("```")
    ) {
      buf.push(lines[i]);
      i++;
    }
    blocks.push({ type: "p", text: buf.join(" ") });
  }
  return blocks;
}

export function extractToc(content: string): { id: string; text: string; level: 2 | 3 }[] {
  return parseBlogContent(content)
    .filter((b): b is Extract<BlogBlock, { type: "h2" | "h3" }> => b.type === "h2" || b.type === "h3")
    .map((b) => ({ id: b.id, text: b.text, level: b.type === "h2" ? 2 : 3 }));
}