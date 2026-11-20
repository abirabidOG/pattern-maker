import type { PlacedMotif } from '../types';

export const TILE_SIZE = 600;

export interface WrappedMotifInstance {
  motif: PlacedMotif;
  renderX: number;
  renderY: number;
}

/**
 * Computes all wrapped instances of placed motifs so that motifs extending
 * past the 600x600 tile boundaries wrap around to opposite edges seamlessly.
 */
export function getWrappedMotifs(motifs: PlacedMotif[]): WrappedMotifInstance[] {
  const result: WrappedMotifInstance[] = [];

  for (const m of motifs) {
    // Effective bounding radius based on scale
    const radius = Math.max(20, (m.scale / 100) * 60);

    const xOffsets = [0];
    if (m.x - radius < 0) xOffsets.push(TILE_SIZE);
    if (m.x + radius > TILE_SIZE) xOffsets.push(-TILE_SIZE);

    const yOffsets = [0];
    if (m.y - radius < 0) yOffsets.push(TILE_SIZE);
    if (m.y + radius > TILE_SIZE) yOffsets.push(-TILE_SIZE);

    for (const ox of xOffsets) {
      for (const oy of yOffsets) {
        result.push({
          motif: m,
          renderX: m.x + ox,
          renderY: m.y + oy,
        });
      }
    }
  }

  return result;
}
