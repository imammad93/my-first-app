const CONFIG = require('./world-map-interactive.json') as MapConfig;

export type Country = {
  id: string;
  iso2?: string | null;
  nameAz: string;
  nameEn: string;
  capital: string;
  region: string;
  center: [number, number];
  capitalPoint?: [number, number] | null;
  markerOnly: boolean;
  path: string;
};

export type MapConfig = {
  labels: {
    title: string;
    subtitle: string;
    tapHint: string;
    selectedMessage: string;
    capitalLabel: string;
    viewMapButton: string;
    zoomIn: string;
    zoomOut: string;
  };
  interaction: {
    zoom: { minScale: number; maxScale: number; buttonStep: number; autoFitPaddingPercent: number };
    reset: { resetDurationMs: number };
  };
  animation: {
    countryZoomDurationMs: number;
    infoCard: { durationMs: number; initialScale: number; overshootScale: number };
    selectedCountry: { fill: string; stroke: string };
  };
  theme: {
    ocean: string;
    countryPalette: string[];
    cardBackground: string;
    primaryText: string;
    capitalText: string;
  };
  map: { viewBox: [number, number, number, number] };
  countries: Country[];
};

export { CONFIG };

export const [VB_X, VB_Y, VB_WIDTH, VB_HEIGHT] = CONFIG.map.viewBox;
export const MIN_SCALE = CONFIG.interaction.zoom.minScale;
export const MAX_SCALE = CONFIG.interaction.zoom.maxScale;
export const ZOOM_STEP = CONFIG.interaction.zoom.buttonStep;
export const FIT_PADDING = 1 + CONFIG.interaction.zoom.autoFitPaddingPercent / 100;

export type Bbox = { minX: number; minY: number; maxX: number; maxY: number };

export function bboxFromPath(path: string): Bbox | null {
  const matches = path.match(/-?\d+\.?\d*/g);
  if (!matches || matches.length < 2) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (let i = 0; i + 1 < matches.length; i += 2) {
    const x = parseFloat(matches[i]);
    const y = parseFloat(matches[i + 1]);
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY };
}

export function bboxFromCenter(center: [number, number], radius = 24): Bbox {
  return {
    minX: center[0] - radius,
    minY: center[1] - radius,
    maxX: center[0] + radius,
    maxY: center[1] + radius,
  };
}

export function computeBboxes(countries: Country[]): Record<string, Bbox> {
  const map: Record<string, Bbox> = {};
  countries.forEach((c) => {
    const bb = c.markerOnly || !c.path ? bboxFromCenter(c.center) : bboxFromPath(c.path);
    if (bb) map[c.id] = bb;
  });
  return map;
}

export function regionColorMap(countries: Country[], palette: string[]): Record<string, string> {
  const map: Record<string, string> = {};
  let i = 0;
  countries.forEach((c) => {
    if (!(c.region in map)) {
      map[c.region] = palette[i % palette.length];
      i++;
    }
  });
  return map;
}

export function flagFromIso2(iso2?: string | null): string {
  if (!iso2 || iso2.length !== 2) return '🏳️';
  const codePoints = [...iso2.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}
