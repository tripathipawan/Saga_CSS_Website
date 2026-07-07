// Migrates old "csscraft.*" localStorage keys to "sagacss.*" so existing
// users don't lose their saved snippets or preferences after the rename.
const MIGRATION_FLAG = "sagacss.migrated.v1";

export function migrateLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    if (localStorage.getItem(MIGRATION_FLAG)) return;

    // Theme key had a different shape ("css-craft-theme" -> "sagacss-theme").
    const oldTheme = localStorage.getItem("css-craft-theme");
    if (oldTheme && !localStorage.getItem("sagacss-theme")) {
      localStorage.setItem("sagacss-theme", oldTheme);
    }

    // Copy every "csscraft.*" key to a "sagacss.*" counterpart.
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith("csscraft.")) continue;
      const newKey = "sagacss." + key.slice("csscraft.".length);
      if (localStorage.getItem(newKey) === null) {
        const value = localStorage.getItem(key);
        if (value !== null) localStorage.setItem(newKey, value);
      }
    }

    localStorage.setItem(MIGRATION_FLAG, "1");
  } catch {
    /* ignore */
  }
}
