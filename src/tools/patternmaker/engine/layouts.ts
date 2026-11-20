import type { LayoutMode, PlacedMotif } from '../types';
import { TILE_SIZE } from './seamlessWrap';

export interface GenerateLayoutOptions {
  layout: LayoutMode;
  motifIds: string[];
  motifSize: number; // 10-150, default 55
  spacing: number; // 0-20, default 5
  rotation: number; // 0-360, default 25
  colorCount: number; // 1-5, default 3
  variationSeed?: number;
}

/**
 * Generates placed motifs according to layout mode, spacing, scale, and rotation.
 */
export function generatePatternLayout(options: GenerateLayoutOptions): PlacedMotif[] {
  const {
    layout,
    motifIds,
    motifSize,
    spacing,
    rotation: baseRotation,
    colorCount,
    variationSeed = 0,
  } = options;

  if (motifIds.length === 0) return [];

  // Spacing slider (0 to 20): maps to grid count (from 2 up to 8 rows/cols)
  // Default 5 -> ~4 grid cells across 600px
  const gridCount = Math.max(2, Math.min(8, Math.round(2.5 + (spacing / 20) * 5.5)));
  const cellW = TILE_SIZE / gridCount;
  const cellH = TILE_SIZE / gridCount;

  const placed: PlacedMotif[] = [];
  let itemIndex = 0;

  // Pseudo-random deterministic generator based on seed
  let seed = variationSeed + 1337;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  if (layout === 'half-drop') {
    // Half-drop: columns alternate by 50% vertical offset
    for (let c = 0; c < gridCount; c++) {
      const colOffset = (c % 2) * (cellH / 2);
      for (let r = 0; r < gridCount; r++) {
        const x = (c + 0.5) * cellW;
        const y = ((r + 0.5) * cellH + colOffset) % TILE_SIZE;

        const motifId = motifIds[itemIndex % motifIds.length];
        const rot = (itemIndex % 2 === 0 ? baseRotation : -baseRotation + 180) % 360;

        placed.push({
          id: `motif-${c}-${r}-${itemIndex}`,
          motifId,
          x: +x.toFixed(2),
          y: +y.toFixed(2),
          scale: motifSize,
          rotation: rot,
          flipH: (c + r) % 3 === 0,
          flipV: false,
          colorIndex: itemIndex % Math.max(1, Math.min(4, colorCount)),
        });
        itemIndex++;
      }
    }
  } else if (layout === 'brick') {
    // Brick: rows alternate by 50% horizontal offset
    for (let r = 0; r < gridCount; r++) {
      const rowOffset = (r % 2) * (cellW / 2);
      for (let c = 0; c < gridCount; c++) {
        const x = ((c + 0.5) * cellW + rowOffset) % TILE_SIZE;
        const y = (r + 0.5) * cellH;

        const motifId = motifIds[itemIndex % motifIds.length];
        const rot = (itemIndex % 2 === 0 ? baseRotation : -baseRotation) % 360;

        placed.push({
          id: `motif-${r}-${c}-${itemIndex}`,
          motifId,
          x: +x.toFixed(2),
          y: +y.toFixed(2),
          scale: motifSize,
          rotation: rot,
          flipH: r % 2 === 1,
          flipV: false,
          colorIndex: itemIndex % Math.max(1, Math.min(4, colorCount)),
        });
        itemIndex++;
      }
    }
  } else if (layout === 'diamond') {
    // Diamond: 45-degree isometric staggered lattice
    const diamondStep = TILE_SIZE / gridCount;
    for (let row = 0; row < gridCount * 2; row++) {
      for (let col = 0; col < gridCount; col++) {
        const isOffset = row % 2 === 1;
        const x = (col + (isOffset ? 0.5 : 0)) * diamondStep;
        const y = row * (diamondStep / 2);

        if (x < TILE_SIZE && y < TILE_SIZE) {
          const motifId = motifIds[itemIndex % motifIds.length];
          const rot = (baseRotation + (row % 2 === 0 ? 0 : 45)) % 360;

          placed.push({
            id: `motif-dia-${row}-${col}-${itemIndex}`,
            motifId,
            x: +x.toFixed(2),
            y: +y.toFixed(2),
            scale: motifSize * 0.85,
            rotation: rot,
            flipH: col % 2 === 1,
            flipV: false,
            colorIndex: itemIndex % Math.max(1, Math.min(4, colorCount)),
          });
          itemIndex++;
        }
      }
    }
  } else if (layout === 'scatter') {
    // Scatter: natural organic arrangement with jittered Poisson-disc-like distribution
    const count = Math.max(6, Math.min(24, Math.round(gridCount * gridCount * 0.75)));
    for (let i = 0; i < count; i++) {
      // Stratified jitter
      const gridX = (i % gridCount) * cellW;
      const gridY = Math.floor(i / gridCount) * cellH;
      const x = (gridX + (0.2 + random() * 0.6) * cellW) % TILE_SIZE;
      const y = (gridY + (0.2 + random() * 0.6) * cellH) % TILE_SIZE;

      const motifId = motifIds[i % motifIds.length];
      const scaleJitter = motifSize * (0.8 + random() * 0.4);
      const rotJitter = Math.round(baseRotation + (random() - 0.5) * 60 + i * 35) % 360;

      placed.push({
        id: `motif-scatter-${i}-${variationSeed}`,
        motifId,
        x: +x.toFixed(2),
        y: +y.toFixed(2),
        scale: +scaleJitter.toFixed(1),
        rotation: rotJitter < 0 ? rotJitter + 360 : rotJitter,
        flipH: random() > 0.5,
        flipV: random() > 0.7,
        colorIndex: i % Math.max(1, Math.min(4, colorCount)),
      });
    }
  } else if (layout === 'grid') {
    // Cartesian Grid: regular rows and columns
    for (let r = 0; r < gridCount; r++) {
      for (let c = 0; c < gridCount; c++) {
        const x = (c + 0.5) * cellW;
        const y = (r + 0.5) * cellH;

        const motifId = motifIds[itemIndex % motifIds.length];

        placed.push({
          id: `motif-grid-${r}-${c}`,
          motifId,
          x: +x.toFixed(2),
          y: +y.toFixed(2),
          scale: motifSize,
          rotation: baseRotation,
          flipH: false,
          flipV: false,
          colorIndex: itemIndex % Math.max(1, Math.min(4, colorCount)),
        });
        itemIndex++;
      }
    }
  } else {
    // Free mode: default center motif if empty
    placed.push({
      id: `motif-free-center`,
      motifId: motifIds[0],
      x: 300,
      y: 300,
      scale: motifSize,
      rotation: baseRotation,
      flipH: false,
      flipV: false,
      colorIndex: 0,
      isHandPlaced: true,
    });
  }

  return placed;
}
