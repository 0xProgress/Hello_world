export type VibeId = "editorial" | "terminal" | "blueprint";

export interface VibeDefinition {
  id: VibeId;
  label: string;
  shortLabel: string;
  description: string;
  swatchLight: string;
  swatchDark: string;
}

export const DEFAULT_VIBE: VibeId = "editorial";

export const VIBES: VibeDefinition[] = [
  {
    id: "editorial",
    label: "Editorial",
    shortLabel: "edit",
    description: "Warm alabaster & obsidian with Fraunces serif display.",
    swatchLight: "#6d28d9",
    swatchDark: "#c084fc",
  },
  {
    id: "terminal",
    label: "Terminal",
    shortLabel: "term",
    description: "Monospace display, sharp corners & phosphor emerald.",
    swatchLight: "#047857",
    swatchDark: "#34d399",
  },
  {
    id: "blueprint",
    label: "Blueprint",
    shortLabel: "blue",
    description: "Drafting slate & technical cobalt engineering studio.",
    swatchLight: "#1d4ed8",
    swatchDark: "#38bdf8",
  },
];

export function isValidVibe(value: unknown): value is VibeId {
  return value === "editorial" || value === "terminal" || value === "blueprint";
}
