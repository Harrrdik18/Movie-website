export type GradientStyle = "linear" | "radial" | "diagonal" | "angular";

interface GradientPalette {
  colors: string[];
  style: GradientStyle;
  noise: boolean;
}

const palettes: Record<string, GradientPalette> = {
  Action: {
    colors: ["#1a0808", "#2a0a0a", "#0d0505"],
    style: "diagonal",
    noise: true,
  },
  Adventure: {
    colors: ["#0a1a2a", "#0f2a1f", "#0a0f14"],
    style: "diagonal",
    noise: true,
  },
  Animation: {
    colors: ["#1a1a2a", "#2a1a3a", "#0f0f1a"],
    style: "radial",
    noise: false,
  },
  Comedy: {
    colors: ["#1a1a0a", "#2a2010", "#0f0f08"],
    style: "diagonal",
    noise: true,
  },
  Crime: {
    colors: ["#0a0a0f", "#1a151a", "#050508"],
    style: "angular",
    noise: true,
  },
  Documentary: {
    colors: ["#0f0f0f", "#1a1a1a", "#080808"],
    style: "linear",
    noise: true,
  },
  Drama: {
    colors: ["#0a0a14", "#14101a", "#08080f"],
    style: "diagonal",
    noise: true,
  },
  Family: {
    colors: ["#1a1a14", "#2a201a", "#0f0f0a"],
    style: "radial",
    noise: false,
  },
  Fantasy: {
    colors: ["#0f0a1a", "#1a0f2a", "#0a0510"],
    style: "radial",
    noise: false,
  },
  History: {
    colors: ["#14100a", "#1a1a14", "#0a0a08"],
    style: "linear",
    noise: true,
  },
  Horror: {
    colors: ["#0a0000", "#050000", "#000000"],
    style: "radial",
    noise: true,
  },
  Music: {
    colors: ["#1a0a14", "#2a1420", "#0f0510"],
    style: "diagonal",
    noise: false,
  },
  Mystery: {
    colors: ["#05080f", "#0f141a", "#050508"],
    style: "angular",
    noise: true,
  },
  Romance: {
    colors: ["#1a0a14", "#2a0a1a", "#0f0510"],
    style: "radial",
    noise: false,
  },
  "Science Fiction": {
    colors: ["#050a14", "#00101a", "#05050f"],
    style: "angular",
    noise: true,
  },
  Thriller: {
    colors: ["#080808", "#141010", "#050505"],
    style: "linear",
    noise: true,
  },
  War: {
    colors: ["#0a0505", "#14100a", "#050505"],
    style: "linear",
    noise: true,
  },
  Western: {
    colors: ["#14100a", "#1a1410", "#0a0805"],
    style: "diagonal",
    noise: true,
  },
  default: {
    colors: ["#0a0a0a", "#141414", "#080808"],
    style: "diagonal",
    noise: true,
  },
};

export function getGenreGradient(genre: string): GradientPalette {
  for (const [key, palette] of Object.entries(palettes)) {
    if (genre.toLowerCase().includes(key.toLowerCase())) {
      return palette;
    }
  }
  return palettes.default;
}

export function buildGradientCSS(genre: string): string {
  const { colors, style } = getGenreGradient(genre);
  const [c1, c2, c3] = colors;

  switch (style) {
    case "linear":
      return `linear-gradient(135deg, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    case "radial":
      return `radial-gradient(ellipse at 30% 40%, ${c1} 0%, ${c2} 50%, ${c3} 100%)`;
    case "angular":
      return `conic-gradient(from 45deg at 50% 50%, ${c1} 0deg, ${c2} 180deg, ${c3} 360deg)`;
    case "diagonal":
    default:
      return `linear-gradient(105deg, ${c1} 0%, ${c2} 40%, ${c3} 100%)`;
  }
}

export function buildHeroGradientCSS(genre: string): string {
  const { colors, style } = getGenreGradient(genre);
  const [c1, c2, c3] = colors;

  const mainGradient =
    style === "radial"
      ? `radial-gradient(ellipse at 30% 40%, ${c1} 0%, ${c2} 50%, ${c3} 100%)`
      : style === "angular"
        ? `conic-gradient(from 45deg at 50% 50%, ${c1} 0deg, ${c2} 180deg, ${c3} 360deg)`
        : `linear-gradient(105deg, ${c1} 0%, ${c2} 40%, ${c3} 100%)`;

  return `
    ${mainGradient},
    radial-gradient(ellipse at 80% 20%, rgba(255,255,255,0.03) 0%, transparent 60%),
    radial-gradient(ellipse at 20% 80%, rgba(255,255,255,0.02) 0%, transparent 50%),
    linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.6) 100%)
  `;
}
