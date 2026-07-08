export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace("#", "").trim();
  if (m.length === 3) {
    const r = parseInt(m[0] + m[0], 16);
    const g = parseInt(m[1] + m[1], 16);
    const b = parseInt(m[2] + m[2], 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }
  if (m.length === 6) {
    const r = parseInt(m.slice(0, 2), 16);
    const g = parseInt(m.slice(2, 4), 16);
    const b = parseInt(m.slice(4, 6), 16);
    if ([r, g, b].some(Number.isNaN)) return null;
    return { r, g, b };
  }
  return null;
}

export function rgbToHex(r: number, g: number, b: number) {
  const to = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

export function randomHex() {
  const h = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");
  return `#${h}`;
}

export function randomPleasantHex() {
  const hue = Math.floor(Math.random() * 360);
  const sat = 65 + Math.floor(Math.random() * 25);
  const light = 50 + Math.floor(Math.random() * 15);
  return hslToHex(hue, sat, light);
}

export function hslToHex(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const color = l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return Math.round(255 * color);
  };
  return rgbToHex(f(0), f(8), f(4));
}
