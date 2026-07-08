export type KitSnippet = {
  id: string;
  label: string;
  code: string;
  format: "css" | "tailwind" | "bootstrap" | "html";
  source: string;
  sourcePath: string;
  createdAt: number;
};

const KEY = "sagacss.myKit";

export function loadKit(): KitSnippet[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveKit(snippets: KitSnippet[]) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(snippets));
    window.dispatchEvent(new CustomEvent("sagacss:kit-change"));
  } catch {
    /* ignore */
  }
}

export function addSnippet(s: Omit<KitSnippet, "id" | "createdAt">) {
  const kit = loadKit();
  const item: KitSnippet = {
    ...s,
    id: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
  };
  kit.unshift(item);
  saveKit(kit);
  return item;
}

export function removeSnippet(id: string) {
  saveKit(loadKit().filter((s) => s.id !== id));
}

export function clearKit() {
  saveKit([]);
}

export function sourceFromPath(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean).pop() ?? "snippet";
  return seg
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
