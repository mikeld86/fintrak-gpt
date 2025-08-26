export type Theme = "blue" | "pink" | "yellow";

export const themeColors: Record<Theme, { primary: string; secondary: string }> = {
  blue: { primary: "#2979ff", secondary: "#16ffdb" },
  pink: { primary: "#ff0086", secondary: "#5c19e5" },
  yellow: { primary: "#ffff00", secondary: "#06ff00" },
};

function hexToRgb(hex: string): [number, number, number] {
  const cleaned = hex.replace(/^#/, "");
  const bigint = parseInt(cleaned, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b]
    .map((x) => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    })
    .join("")}`;
}

export function getRingColor(theme: Theme, amount = 0.5): string {
  const [r, g, b] = hexToRgb(themeColors[theme].primary);
  const ringR = r + (255 - r) * amount;
  const ringG = g + (255 - g) * amount;
  const ringB = b + (255 - b) * amount;
  return rgbToHex(ringR, ringG, ringB);
}
