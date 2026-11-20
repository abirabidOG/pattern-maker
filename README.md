# Pattern Maker — Free Seamless Pattern Maker

A free, standalone web tool that turns natural language sentences into seamless repeating pattern tiles, or lets you compose them by hand using 35 vector motifs. 100% client-side in the browser with zero server uploads, no sign-up, no watermark, and no accounts.

Live URL: [https://tools.abidmahmud.cv/pattern-maker](https://tools.abidmahmud.cv/pattern-maker)

---

## Features

- **Describe Box (Rule-Based Parser)**: Match motif keywords and background colors deterministically without external AI APIs or image latency. Transparent, honest readouts.
- **11 Sample Prompts**: One-click prompt chips for rapid testing.
- **5 Drawing Styles**: Flat Vector, Geometric, Kids, Vintage, and Minimal.
- **35 Free Vector Motifs**: Original handcrafted SVG vector shapes covering florals, botanicals, celestial marks, animals, foods, and geometry.
- **Interactive 600×600 Tile Canvas**: Place, Move, and Erase modes with full Undo/Redo history (depth 30), Clear tile confirm modal, and hand-placed overwrite protection.
- **Layout & Arrangement Controls**: Half-drop (default), Brick, Grid, Diamond, Scatter, and Free. Fine-tune motif scale, spacing density, rotation jitter, and color rotation.
- **8 Curated 5-Swatch Palettes**: Meadow, Ocean, Berry, Forest, Candy, Earth, Mono ink, and Night, plus 10 background presets and custom hex pickers.
- **Real-Time Repeat Preview & Seam Verifier**: 3×3, 4×4, 6×6, 2×2 Sheet, and 400% corner seam inspector. Mathematical coordinate wrapping ensures 100% seamless tiling without edge seams.
- **High-Resolution Exports**:
  - Tile PNG: 500px, 1000px, 2000px (default), 3000px (ultra high-res) with optional transparent background.
  - Vector Tile SVG: Resolution-independent pure SVG with repeating `<pattern>` definition.
  - Pattern Sheet PNG: 3000×3000px full wallpaper presentation.
  - Palette Tools: One-click HEX code copy and TXT download.
- **Save & Share**: Browser localStorage drawer and Base64 URL hash sharing.
- **Keyboard Shortcuts**: `U` (Undo), `R` (Redo), `G` (Generate), `N` (New Variation), `D` (Download PNG).
- **GA4 Analytics**: Integrated tracking for generations, variations, motif placements, downloads, and shares (`G-ZF1FSM8N07`).
- **100% Free Forever**: Zero paywalls, no Pro tiers, no locked motifs, and full commercial usage rights.

---

## Design & Brand Tokens

- **Paper Background**: `#F4F2EC`
- **Ink Typography**: `#0B0B0D`
- **Iris Primary**: `#5846F6`
- **Volt Accent**: `#D4FF3A`
- **Smoke Subdued**: `#4F4E55`
- **Fog Borders**: `#C9C7C1`
- **Typography**: Inter Tight (headlines), Inter (body)

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Library**: React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Canvas / Math**: Native HTML5 Canvas 2D API + Path2D SVG caching

---

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start
```
