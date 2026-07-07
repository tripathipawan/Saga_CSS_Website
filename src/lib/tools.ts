export type ToolItem = {
  name: string;
  path: string;
  category: string;
  comingSoon?: boolean;
};

export const CORE_TOOLS: ToolItem[] = [
  { name: "Gradient Generator", path: "/tools/gradient", category: "Core Tools" },
  { name: "Border Radius", path: "/tools/border-radius", category: "Core Tools" },
  { name: "Box Shadow", path: "/tools/box-shadow", category: "Core Tools" },
  { name: "Text Shadow", path: "/tools/text-shadow", category: "Core Tools" },
  { name: "Animation", path: "/tools/animation", category: "Core Tools" },
  { name: "3D Shapes", path: "/tools/3d-shapes", category: "Core Tools" },
  { name: "Box Sizing", path: "/tools/box-sizing", category: "Core Tools" },
  { name: "Grid Layout", path: "/tools/grid", category: "Core Tools" },
  { name: "Color Palette", path: "/tools/color-palette", category: "Core Tools" },
  { name: "Color Converter", path: "/tools/color-converter", category: "Core Tools" },
  { name: "Color Mixer", path: "/tools/color-mixer", category: "Core Tools" },
  { name: "Contrast Checker", path: "/tools/contrast", category: "Core Tools" },
  { name: "Clip Path", path: "/tools/clip-path", category: "Core Tools" },
  { name: "Flexbox", path: "/tools/flexbox", category: "Core Tools" },
  { name: "SVG Generator", path: "/tools/svg", category: "Core Tools" },
  { name: "Button Style", path: "/tools/button", category: "Core Tools" },
  { name: "Cubic Bezier", path: "/tools/bezier", category: "Core Tools" },
  { name: "Font Pairing", path: "/tools/fonts", category: "Core Tools" },
  { name: "CSS Filter Generator", path: "/tools/filter", category: "Core Tools" },
  { name: "Clipped Text Effect", path: "/tools/image-text", category: "Core Tools" },
  { name: "SCSS / LESS Compiler", path: "/tools/preprocessor", category: "Core Tools" },
  { name: "Base64 Image Converter", path: "/tools/base64", category: "Core Tools" },
  { name: "Clamp() Calculator", path: "/tools/clamp", category: "Core Tools" },
  { name: "Dark Mode Variables", path: "/tools/theme-variables", category: "Core Tools" },
  { name: "CSS Reset Generator", path: "/tools/reset", category: "Core Tools" },
  { name: "Scrollbar Styler", path: "/tools/scrollbar", category: "Core Tools" },
  { name: "Loader / Spinner", path: "/tools/spinner", category: "Core Tools" },
  { name: "Theme Variables Builder", path: "/tools/theme", category: "Core Tools" },
  { name: "Browser Compatibility", path: "/tools/compatibility", category: "Core Tools" },
  { name: "Specificity Visualizer", path: "/tools/specificity", category: "Core Tools" },
  { name: "Responsive Preview", path: "/tools/responsive", category: "Core Tools" },
];

export const DESIGN_STYLES: ToolItem[] = [
  { name: "Neumorphism", path: "/styles/neumorphism", category: "Design Styles" },
  { name: "Glassmorphism", path: "/styles/glassmorphism", category: "Design Styles" },
  { name: "Claymorphism", path: "/styles/claymorphism", category: "Design Styles" },
  { name: "Neubrutalism", path: "/styles/neubrutalism", category: "Design Styles" },
  { name: "Y2K / Retro", path: "/styles/y2k", category: "Design Styles" },
  { name: "Cyberpunk Neon", path: "/styles/cyberpunk", category: "Design Styles" },
  { name: "Art Deco", path: "/styles/art-deco", category: "Design Styles" },
];

export const EXTRAS: ToolItem[] = [
  { name: "My Kit", path: "/my-kit", category: "Extras" },
  { name: "CSS Cheat Sheet", path: "/cheat-sheet", category: "Extras" },
];

export const LEARN: ToolItem[] = [
  { name: "Interview Prep", path: "/interview-prep", category: "Learn" },
  { name: "Practice Challenges", path: "/practice", category: "Learn" },
];

export const TOOL_INDEX: ToolItem[] = [
  ...CORE_TOOLS,
  ...DESIGN_STYLES,
  ...EXTRAS,
  { name: "Interview Prep", path: "/interview-prep", category: "Learn" },
  { name: "Practice Challenges", path: "/practice", category: "Learn" },
];