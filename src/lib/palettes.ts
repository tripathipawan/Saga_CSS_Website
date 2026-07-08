export type PaletteCategory =
  | "Pastel"
  | "Vibrant"
  | "Monochrome"
  | "Gradient"
  | "Nature"
  | "Retro"
  | "Neon"
  | "Earth"
  | "Corporate"
  | "Dark"
  | "Autumn"
  | "Summer"
  | "Winter"
  | "Spring";

export type Palette = { name: string; category: PaletteCategory; colors: string[] };

const SEED: Palette[] = [
  // Pastel
  {
    name: "Cotton Candy",
    category: "Pastel",
    colors: ["#fbc2eb", "#a6c1ee", "#c2e9fb", "#fddb92", "#f8bbd0"],
  },
  {
    name: "Baby Bloom",
    category: "Pastel",
    colors: ["#ffd6e0", "#ffefcf", "#d1f0e0", "#c9e4ff", "#e8d5ff"],
  },
  {
    name: "Macaron",
    category: "Pastel",
    colors: ["#f7cac9", "#92a8d1", "#f7786b", "#c5b9cd", "#dec3c3"],
  },
  {
    name: "Soft Serve",
    category: "Pastel",
    colors: ["#fef6e4", "#f3d2c1", "#f582ae", "#8bd3dd", "#001858"],
  },
  {
    name: "Sherbet",
    category: "Pastel",
    colors: ["#fddde6", "#fcd5b5", "#fff2b3", "#c9f0d5", "#c4d9ff"],
  },
  {
    name: "Pearl Dust",
    category: "Pastel",
    colors: ["#f4e2d8", "#ba9494", "#dfcdc3", "#ede1d1", "#c8b6a6"],
  },
  {
    name: "Mint Cream",
    category: "Pastel",
    colors: ["#e0fbe2", "#bfd8bd", "#98c9a3", "#77bfa3", "#d1f0e0"],
  },
  {
    name: "Lavender Field",
    category: "Pastel",
    colors: ["#e0bbff", "#c9a7eb", "#a084ca", "#7159a6", "#4a3f8e"],
  },
  {
    name: "Peach Whisper",
    category: "Pastel",
    colors: ["#ffe5d9", "#ffcad4", "#f4acb7", "#9d8189", "#d8e2dc"],
  },
  {
    name: "Sky Nursery",
    category: "Pastel",
    colors: ["#caf0f8", "#ade8f4", "#90e0ef", "#48cae4", "#00b4d8"],
  },

  // Vibrant
  {
    name: "Electric Punch",
    category: "Vibrant",
    colors: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff"],
  },
  {
    name: "Tropical Rush",
    category: "Vibrant",
    colors: ["#ff5f6d", "#ffc371", "#00c9a7", "#4d8af0", "#c34a36"],
  },
  {
    name: "Carnival",
    category: "Vibrant",
    colors: ["#e63946", "#f1faee", "#a8dadc", "#457b9d", "#1d3557"],
  },
  {
    name: "Sunset Pop",
    category: "Vibrant",
    colors: ["#ff9a00", "#ff5714", "#c81d25", "#480ca8", "#f72585"],
  },
  {
    name: "Berry Blast",
    category: "Vibrant",
    colors: ["#d62828", "#f77f00", "#fcbf49", "#eae2b7", "#003049"],
  },
  {
    name: "Party Hard",
    category: "Vibrant",
    colors: ["#ef476f", "#ffd166", "#06d6a0", "#118ab2", "#073b4c"],
  },
  {
    name: "Fiesta",
    category: "Vibrant",
    colors: ["#f94144", "#f3722c", "#f8961e", "#f9c74f", "#90be6d"],
  },
  {
    name: "Rainbow Riot",
    category: "Vibrant",
    colors: ["#ff595e", "#ffca3a", "#8ac926", "#1982c4", "#6a4c93"],
  },

  // Monochrome
  {
    name: "Slate Story",
    category: "Monochrome",
    colors: ["#0f172a", "#1e293b", "#334155", "#64748b", "#94a3b8"],
  },
  {
    name: "Charcoal",
    category: "Monochrome",
    colors: ["#111111", "#333333", "#555555", "#888888", "#cccccc"],
  },
  {
    name: "Blueprint",
    category: "Monochrome",
    colors: ["#03045e", "#023e8a", "#0077b6", "#0096c7", "#48cae4"],
  },
  {
    name: "Rose Mono",
    category: "Monochrome",
    colors: ["#5c0002", "#8b0000", "#c1121f", "#e63946", "#ffb4a2"],
  },
  {
    name: "Emerald Depths",
    category: "Monochrome",
    colors: ["#0b3d2e", "#1b5e20", "#2e7d32", "#4caf50", "#a5d6a7"],
  },
  {
    name: "Violet Fade",
    category: "Monochrome",
    colors: ["#240046", "#3c096c", "#5a189a", "#7b2cbf", "#c77dff"],
  },
  {
    name: "Amber Fade",
    category: "Monochrome",
    colors: ["#663c00", "#996600", "#cc8800", "#ffb020", "#ffd166"],
  },

  // Gradient
  {
    name: "Aurora",
    category: "Gradient",
    colors: ["#00c6ff", "#0072ff", "#8e2de2", "#4a00e0", "#ff0080"],
  },
  {
    name: "Sunset Sky",
    category: "Gradient",
    colors: ["#ff9966", "#ff5e62", "#ff2d55", "#c471ed", "#f64f59"],
  },
  {
    name: "Ocean Wave",
    category: "Gradient",
    colors: ["#2e3192", "#1bffff", "#00c9ff", "#92fe9d", "#00b09b"],
  },
  {
    name: "Purple Rain",
    category: "Gradient",
    colors: ["#5f2c82", "#49a09d", "#7f00ff", "#e100ff", "#00d2ff"],
  },
  {
    name: "Cosmic",
    category: "Gradient",
    colors: ["#360033", "#0b8793", "#e94057", "#f27121", "#8a2387"],
  },
  {
    name: "Peach Blossom",
    category: "Gradient",
    colors: ["#ee9ca7", "#ffdde1", "#fbc2eb", "#a6c1ee", "#fddb92"],
  },

  // Nature
  {
    name: "Forest Floor",
    category: "Nature",
    colors: ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],
  },
  {
    name: "Woodland",
    category: "Nature",
    colors: ["#2d3a3a", "#556b2f", "#8b7355", "#c9b037", "#e8dcc4"],
  },
  {
    name: "Meadow",
    category: "Nature",
    colors: ["#606c38", "#283618", "#fefae0", "#dda15e", "#bc6c25"],
  },
  {
    name: "Sea Breeze",
    category: "Nature",
    colors: ["#003049", "#d62828", "#f77f00", "#fcbf49", "#eae2b7"],
  },
  {
    name: "Rainforest",
    category: "Nature",
    colors: ["#004b23", "#006400", "#38b000", "#70e000", "#ccff33"],
  },
  {
    name: "Coral Reef",
    category: "Nature",
    colors: ["#ff9a76", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"],
  },

  // Retro
  {
    name: "70s Groove",
    category: "Retro",
    colors: ["#f7b32b", "#f72585", "#7209b7", "#3a0ca3", "#4361ee"],
  },
  {
    name: "Vinyl",
    category: "Retro",
    colors: ["#22223b", "#4a4e69", "#9a8c98", "#c9ada7", "#f2e9e4"],
  },
  {
    name: "Diner",
    category: "Retro",
    colors: ["#ff595e", "#ffca3a", "#1982c4", "#6a4c93", "#8ac926"],
  },
  {
    name: "Sepia Postcard",
    category: "Retro",
    colors: ["#8b5a2b", "#b08968", "#ddb892", "#ede0d4", "#7f5539"],
  },
  {
    name: "Cassette",
    category: "Retro",
    colors: ["#f28482", "#f5cac3", "#84a59d", "#f6bd60", "#f7ede2"],
  },
  {
    name: "80s Sunset",
    category: "Retro",
    colors: ["#ff1e56", "#ff9a3c", "#ffbd39", "#8338ec", "#3a86ff"],
  },

  // Neon
  {
    name: "Tokyo Neon",
    category: "Neon",
    colors: ["#ff00ff", "#00ffff", "#ff0080", "#00ff41", "#fffb00"],
  },
  {
    name: "Cyberpunk",
    category: "Neon",
    colors: ["#0abdc6", "#ea00d9", "#711c91", "#133e7c", "#091833"],
  },
  {
    name: "Miami",
    category: "Neon",
    colors: ["#ff71ce", "#01cdfe", "#05ffa1", "#b967ff", "#fffb96"],
  },
  {
    name: "Laser",
    category: "Neon",
    colors: ["#39ff14", "#ff073a", "#0aefff", "#ff9933", "#fe019a"],
  },
  {
    name: "Vaporwave",
    category: "Neon",
    colors: ["#ff6ec7", "#ff2ec8", "#00f0ff", "#7f00ff", "#faff00"],
  },

  // Earth
  {
    name: "Desert",
    category: "Earth",
    colors: ["#c1440e", "#a8763e", "#e8c07d", "#f2d5a7", "#78502f"],
  },
  {
    name: "Clay",
    category: "Earth",
    colors: ["#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac"],
  },
  {
    name: "Terracotta",
    category: "Earth",
    colors: ["#9e4624", "#c9633b", "#e28f66", "#f2c299", "#f6dfd0"],
  },
  {
    name: "Stone",
    category: "Earth",
    colors: ["#3a3a3a", "#666362", "#a49f96", "#c8c1b1", "#eae4d3"],
  },
  {
    name: "Sand Dune",
    category: "Earth",
    colors: ["#e6c79c", "#d8a76e", "#a67c52", "#8b4513", "#5d3a1a"],
  },

  // Corporate
  {
    name: "Fintech",
    category: "Corporate",
    colors: ["#0b3d91", "#1e88e5", "#42a5f5", "#e3f2fd", "#0d47a1"],
  },
  {
    name: "Boardroom",
    category: "Corporate",
    colors: ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5f5f5"],
  },
  {
    name: "SaaS Clean",
    category: "Corporate",
    colors: ["#4f46e5", "#6366f1", "#818cf8", "#a5b4fc", "#e0e7ff"],
  },
  {
    name: "Consultant",
    category: "Corporate",
    colors: ["#2c3e50", "#34495e", "#7f8c8d", "#95a5a6", "#ecf0f1"],
  },
  {
    name: "Steel Blue",
    category: "Corporate",
    colors: ["#012a4a", "#013a63", "#01497c", "#014f86", "#a9d6e5"],
  },

  // Dark
  {
    name: "Midnight",
    category: "Dark",
    colors: ["#0d1117", "#161b22", "#21262d", "#30363d", "#c9d1d9"],
  },
  {
    name: "Obsidian",
    category: "Dark",
    colors: ["#0b0c10", "#1f2833", "#c5c6c7", "#66fcf1", "#45a29e"],
  },
  {
    name: "Blackout",
    category: "Dark",
    colors: ["#000000", "#111111", "#222222", "#8b5cf6", "#22d3ee"],
  },
  {
    name: "Deep Space",
    category: "Dark",
    colors: ["#03071e", "#370617", "#6a040f", "#9d0208", "#faa307"],
  },
  {
    name: "Terminal",
    category: "Dark",
    colors: ["#0a0e14", "#1f2430", "#b3b1ad", "#39bae6", "#95e6cb"],
  },

  // Autumn
  {
    name: "Harvest",
    category: "Autumn",
    colors: ["#7c2d12", "#b45309", "#d97706", "#f59e0b", "#fbbf24"],
  },
  {
    name: "Fallen Leaf",
    category: "Autumn",
    colors: ["#582f0e", "#7f4f24", "#936639", "#a68a64", "#c2a878"],
  },
  {
    name: "Pumpkin Spice",
    category: "Autumn",
    colors: ["#c1440e", "#f97316", "#fb923c", "#fdba74", "#fed7aa"],
  },
  {
    name: "Maple",
    category: "Autumn",
    colors: ["#450a0a", "#7f1d1d", "#b91c1c", "#dc2626", "#fca5a5"],
  },
  {
    name: "Cider",
    category: "Autumn",
    colors: ["#5c2c06", "#8a3b12", "#c26a1c", "#e69239", "#fddc9d"],
  },

  // Summer
  {
    name: "Beach Day",
    category: "Summer",
    colors: ["#00b4d8", "#90e0ef", "#caf0f8", "#ffd166", "#f77f00"],
  },
  {
    name: "Ice Pop",
    category: "Summer",
    colors: ["#ff477e", "#ff85a1", "#ffa5ab", "#ffe5d9", "#faf3dd"],
  },
  {
    name: "Poolside",
    category: "Summer",
    colors: ["#0077b6", "#00b4d8", "#48cae4", "#ade8f4", "#fef9c7"],
  },
  {
    name: "Watermelon",
    category: "Summer",
    colors: ["#ff3d3d", "#ff7676", "#00c896", "#00964f", "#ffffff"],
  },

  // Winter
  {
    name: "Frost",
    category: "Winter",
    colors: ["#e0f7fa", "#b2ebf2", "#4dd0e1", "#0097a7", "#006064"],
  },
  {
    name: "Snowfall",
    category: "Winter",
    colors: ["#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#1e293b"],
  },
  {
    name: "Aurora Borealis",
    category: "Winter",
    colors: ["#003566", "#0466c8", "#38b000", "#9ef01a", "#f2cc8f"],
  },
  {
    name: "Icicle",
    category: "Winter",
    colors: ["#c9e4ff", "#a3d5ff", "#5eb1ff", "#0077b6", "#023e8a"],
  },

  // Spring
  {
    name: "Cherry Blossom",
    category: "Spring",
    colors: ["#ffd6e0", "#ffb3c1", "#ff8fab", "#fb6f92", "#8e6f8b"],
  },
  {
    name: "Fresh Bloom",
    category: "Spring",
    colors: ["#f9dc5c", "#c9e4ca", "#87bba2", "#55828b", "#3b6064"],
  },
  {
    name: "Garden Party",
    category: "Spring",
    colors: ["#ffb5a7", "#fcd5ce", "#f8edeb", "#f9dcc4", "#fec89a"],
  },
  {
    name: "Tulip Field",
    category: "Spring",
    colors: ["#f72585", "#b5179e", "#7209b7", "#560bad", "#3f37c9"],
  },
];

function shiftHex(hex: string, amt: number) {
  const h = hex.replace("#", "");
  const r = Math.max(0, Math.min(255, parseInt(h.slice(0, 2), 16) + amt));
  const g = Math.max(0, Math.min(255, parseInt(h.slice(2, 4), 16) + amt));
  const b = Math.max(0, Math.min(255, parseInt(h.slice(4, 6), 16) + amt));
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("");
}

/** Generates a rich palette library (~400+ palettes) by seeding + variations. */
export const PALETTES: Palette[] = (() => {
  const out: Palette[] = [];
  for (const p of SEED) {
    out.push(p);
    for (const [suffix, amt] of [
      [" — Light", 25],
      [" — Deep", -25],
      [" — Muted", -12],
      [" — Bright", 15],
    ] as const) {
      out.push({
        name: p.name + suffix,
        category: p.category,
        colors: p.colors.map((c) => shiftHex(c, amt)),
      });
    }
  }
  return out;
})();

export const CATEGORIES: PaletteCategory[] = [
  "Pastel",
  "Vibrant",
  "Monochrome",
  "Gradient",
  "Nature",
  "Retro",
  "Neon",
  "Earth",
  "Corporate",
  "Dark",
  "Autumn",
  "Summer",
  "Winter",
  "Spring",
];
