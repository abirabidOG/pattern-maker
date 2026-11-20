# Pattern Maker Implementation Plan

> **Goal**: Build a standalone, client-side, zero-cost seamless pattern maker application in Next.js 15 (App Router), React, TypeScript, and Tailwind CSS deployable to Vercel and hosted at `https://tools.abidmahmud.cv/pattern-maker`.

---

## 1. Architecture & Component Decomposition

```
pattern-maker/
├── app/
│   ├── layout.tsx         # Root layout with Inter/Inter Tight, GA4 (G-ZF1FSM8N07), floating header, global footer
│   ├── page.tsx           # Main Pattern Maker page with hero & PatternMakerTool
│   └── globals.css        # Tailwind v4 import, brand tokens, and checkerboard utilities
├── src/
│   ├── components/
│   │   ├── BrandIdentityCtaCard.tsx  # Matching attached portfolio banner
│   │   └── Header.tsx / Footer.tsx   # Global navigation with backlinks to tools.abidmahmud.cv
│   └── tools/
│       └── patternmaker/
│           ├── types.ts              # Core types: MotifDefinition, PlacedMotif, PatternState, StyleMode, LayoutMode, Palette
│           ├── motifs/
│           │   ├── data.ts           # 35 SVG vector motifs with raw path coordinates & viewboxes
│           │   ├── styles.ts         # 5 style transformers: Flat Vector, Geometric, Kids, Vintage, Minimal
│           │   └── renderMotif.ts    # Canvas & SVG renderer for transformed motif paths
│           ├── engine/
│           │   ├── parser.ts         # Rule-based prompt parser (35 keywords, 10 bg colors, max 3 motifs, honest feedback)
│           │   ├── layouts.ts        # 6 seamless repeat layout placement algorithms (Grid, Half-drop, Brick, Diamond, Scatter, Free)
│           │   ├── seamlessWrap.ts   # Edge wrapping geometry calculator (wraps motif instances across x/y boundaries)
│           │   └── history.ts        # Undo/Redo immutable state manager with action snapshots
│           ├── palettes.ts           # 8 curated 5-swatch palettes & 10 preset background swatches
│           ├── export/
│           │   ├── exportPng.ts      # Multi-resolution rasterizer (500, 1000, 2000, 3000px) with transparent toggle
│           │   ├── exportSvg.ts      # Pure SVG document serializer with <pattern> tags
│           │   ├── exportSheet.ts    # 3000x3000px high-res repeat sheet generator
│           │   └── exportPalette.ts  # Palette HEX copier and TXT file downloader
│           ├── storage/
│           │   ├── localStorage.ts   # Saved patterns store (save, load, list, delete)
│           │   └── urlHash.ts        # URL hash serializer/deserializer for 1-click shareable URLs
│           ├── analytics.ts          # GA4 event tracking with key conversion events
│           ├── TileCanvas.tsx        # 600px square interactive HTML5 Canvas tile editor (Place, Move, Erase)
│           ├── RepeatPreview.tsx     # Seamless repeat preview (3x3, 4x4, 6x6, 2x2 sheet, zoomed seam check)
│           ├── ControlPanel.tsx      # Describe box, Style selector, Motif picker, Layout, Density, Rotation, Color swatches
│           └── PatternMakerTool.tsx  # Master orchestrator combining desktop two-column & mobile layout
```

---

## 2. Core Data Models (`types.ts`)

```ts
export type StyleMode = 'flat' | 'geometric' | 'kids' | 'vintage' | 'minimal';
export type LayoutMode = 'grid' | 'half-drop' | 'brick' | 'diamond' | 'scatter' | 'free';

export interface MotifDefinition {
  id: string;
  name: string;
  category: 'nature' | 'shapes' | 'cute' | 'objects';
  keywords: string[];
  // Base SVG path data inside standard 100x100 viewBox
  paths: { d: string; fill?: string; stroke?: string; strokeWidth?: number }[];
}

export interface PlacedMotif {
  id: string;
  motifId: string;
  x: number; // 0 to 600
  y: number; // 0 to 600
  scale: number; // 0.2 to 3.0
  rotation: number; // 0 to 360
  flipH: boolean;
  flipV: boolean;
  colorIndex: number; // 0 to 3 (maps to palette motif colors)
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
  rotation: number; // default 25, range 0-360
  colorCount: number; // 1-5, default 3
  backgroundColor: string; // default #F3E5C3
  palette: Palette;
  activeMotifId: string; // for manual placement
}
```

---

## 3. Step-by-Step Execution Plan

### Task 1: Project Setup & Package Scaffolding
- **Files**: `package.json`, `next.config.js`, `tsconfig.json`, `app/globals.css`, `app/layout.tsx`.
- **Dependencies**: `next@^15.0.0`, `react@^19.0.0`, `react-dom@^19.0.0`, `lucide-react@^1.77.0`, `tailwindcss@^4.3.5`, `@tailwindcss/postcss`.
- **Actions**:
  1. Initialize `pattern-maker/package.json` copying dependencies from `linetrace-repo`.
  2. Install dependencies via `npm install`.
  3. Create `app/layout.tsx` with Inter / Inter Tight fonts, floating header, global footer, and GA4 tag `G-ZF1FSM8N07`.
  4. Verify build runs cleanly via `next build`.

### Task 2: 35 Vector Motifs Library & 5 Styles (`src/tools/patternmaker/motifs/`)
- **Motifs (35)**:
  1. Flower, 2. Tulip, 3. Daisy, 4. Leaf, 5. Palm leaf, 6. Star, 7. Heart, 8. Cat, 9. Dog, 10. Lemon,
  11. Coffee bean, 12. Sun, 13. Cloud, 14. Fruit, 15. Wave line, 16. Circle, 17. Dot cluster, 18. Diamond,
  19. Triangle, 20. Hexagon, 21. Crescent, 22. Ring, 23. Square, 24. Rose, 25. Sunflower, 26. Lavender,
  27. Teddy bear, 28. Whale, 29. Rainbow, 30. Strawberry, 31. Pineapple, 32. Cherry, 33. Coffee cup,
  34. Paisley, 35. Butterfly.
- **Styles (5)**:
  - `flat`: Clean vector fills and smooth curves.
  - `geometric`: Sharp polygons, angular simplification, crisp math lines.
  - `kids`: Chunky, playful outlines, rounded soft corners.
  - `vintage`: Fine-line stippling, etched engraving contours.
  - `minimal`: Thin line strokes, negative space, no heavy fills.
- **Verification**: Node script verifying all 35 motifs render without SVG syntax errors in all 5 styles.

### Task 3: Rule-Based Prompt Parser & Layout Generators (`engine/`)
- **Parser (`parser.ts`)**:
  - Parses input string for 35 motif keywords + 10 background colors (`cream`, `white`, `light blue`, `dark green`, `dark blue`, `pink`, `black`, `navy`, `sage`, `sand`).
  - Supports up to 3 motifs per prompt (e.g. "Pink flowers and green leaves on cream").
  - Returns honest readout: `"Made a pattern with: flower and leaf on cream."` or `"Leaves were not added yet."`.
  - Zero AI calls, zero external APIs.
- **Layouts (`layouts.ts`)**:
  - `Half-drop` (default): Alternating columns shifted by 50% tile height.
  - `Brick`: Alternating rows shifted by 50% tile width.
  - `Grid`: Regular Cartesian lattice.
  - `Diamond`: Rotated 45-degree isometric placement.
  - `Scatter`: Organic pseudo-random Poisson-disc distribution with collision avoidance.
  - `Free`: Manual placement without grid constraints.
- **Edge Wrapping (`seamlessWrap.ts`)**:
  - For every motif at `(x, y)` with radius `r`: if `x - r < 0`, duplicate at `x + 600`. If `x + r > 600`, duplicate at `x - 600`. Same for Y. If crossing a corner, duplicate 3 times (opposite corner, top/bottom, left/right).

### Task 4: Interactive Tile Canvas (`TileCanvas.tsx`)
- 600px square HTML5 Canvas.
- Toolbar: Place, Move, Erase buttons; Undo, Redo, Clear tile (with confirm modal).
- Overwrite safety: Before Generate or New variation replaces hand-placed motifs, ask with a modal confirm dialog.
- Drag & move: Touch and mouse support for moving motifs in Move mode.
- Seam preview guide lines: Subtle dotted grid toggle.

### Task 5: Design Controls & Palettes (`ControlPanel.tsx`, `palettes.ts`)
- 11 sample prompt chips:
  1. "Pink flowers and green leaves on cream"
  2. "Blue geometric triangles"
  3. "Cute cats and stars for kids"
  4. "Tropical leaves on dark green"
  5. "Red hearts and pink dots on white"
  6. "Yellow suns and white clouds on light blue"
  7. "Pink roses and green leaves on cream"
  8. "Yellow sunflowers and brown dots on white"
  9. "Blue whales and white clouds on light blue"
  10. "Red strawberries and green leaves on white"
  11. "Gold crescents and stars on dark blue"
- 8 Curated 5-Swatch Palettes: Meadow, Ocean, Berry, Forest, Candy, Earth, Mono ink, Night.
- 10 Background presets + Hex picker.
- Sliders: Size (10-150, def 55), Density (0-20, def 5), Rotation (0-360, def 25), Color rotation count (1-5, def 3).
- Motif controls: Flip H, Flip V, per-motif rotation, Recolour motifs.
- Randomize button: 1-click random motif, palette, and layout.

### Task 6: Repeat Preview & Seam Verifier (`RepeatPreview.tsx`)
- 3×3, 4×4, 6×6 live repeat grid buttons.
- 2×2 repeat sheet view.
- Zoomed 400% edge seam view to check seamless tile transitions.

### Task 7: Save, Share, Shortcuts & Multi-Format Export (`export/`, `storage/`)
- **Save/Share**:
  - Browser `localStorage` pattern list with save, load, and delete.
  - `Share` button copying URL with pattern state encoded in URL hash (`#pattern=...`).
- **Download**:
  - Tile PNG at 500px, 1000px, 2000px (default), 3000px + transparent background toggle.
  - Tile SVG download (pure vector `<svg>` with seamless `<pattern>` wrapper).
  - Pattern sheet PNG 3000×3000px.
  - Palette HEX copy + TXT download.
  - Toast confirmation: "Tile PNG saved (2000x2000)."
- **Shortcuts**: `U` undo, `R` redo, `G` generate, `N` new variation, `D` download PNG.
- **GA4 tracking**: All required events (`pattern_generated`, `pattern_variation`, `motif_placed`, `pattern_downloaded_png`, `pattern_downloaded_svg`, `pattern_sheet_downloaded`, `pattern_shared`, `palette_applied`).

### Task 8: Layout, Brand Identity CTA, Build Verification & Git Deploy
- Desktop: Left column tile canvas (600px square), Right column controls, Below repeat preview + download.
- Mobile: Tile -> Repeat preview -> Controls -> Sticky download bar.
- Footer: `"Free, unlimited, no sign-up. Patterns you make are yours."` + cross-links.
- Puppeteer visual testing across desktop and 390px mobile.
- Git initialize, commit, and push to GitHub `abirabidOG/pattern-maker`.
