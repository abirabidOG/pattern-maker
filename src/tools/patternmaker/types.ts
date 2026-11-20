export type StyleMode = 'flat' | 'geometric' | 'kids' | 'vintage' | 'minimal';

export type LayoutMode = 'grid' | 'half-drop' | 'brick' | 'diamond' | 'scatter' | 'free';

export type EditorTool = 'place' | 'move' | 'erase';

export type RepeatGridSize = '3x3' | '4x4' | '6x6' | 'sheet' | 'seam';

export interface MotifPath {
  d: string;
  fillRule?: 'nonzero' | 'evenodd';
  strokeOnly?: boolean;
  strokeWidth?: number;
}

export interface MotifDefinition {
  id: string;
  name: string;
  keywords: string[];
  category: 'nature' | 'shapes' | 'cute' | 'objects';
  paths: MotifPath[];
}

export interface PlacedMotif {
  id: string;
  motifId: string;
  x: number; // 0 to 600 canvas coordinate
  y: number; // 0 to 600 canvas coordinate
  scale: number; // 0.2 to 3.0 relative scale
  rotation: number; // 0 to 360 degrees
  flipH: boolean;
  flipV: boolean;
  colorIndex: number; // 0 to 3 from palette motif colors
  customColor?: string;
  isHandPlaced?: boolean;
}

export interface Palette {
  id: string;
  name: string;
  background: string;
  motifColors: [string, string, string, string];
}

export interface PatternState {
  version: 1;
  name?: string;
  motifs: PlacedMotif[];
  style: StyleMode;
  layout: LayoutMode;
  motifSize: number; // default 55, range 10-150
  spacing: number; // default 5, range 0-20
  rotation: number; // default 25 degrees, range 0-360
  colorCount: number; // default 3, range 1-5
  backgroundColor: string; // default #F3E5C3
  palette: Palette;
  activeMotifId: string;
}

export interface PromptParseResult {
  matchedMotifs: string[];
  matchedBgColor?: { name: string; hex: string };
  readout: string;
  unmatchedNote?: string;
}

export interface SavedPatternItem {
  id: string;
  name: string;
  timestamp: number;
  previewDataUrl: string;
  state: PatternState;
}
