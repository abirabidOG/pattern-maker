import type { PatternState } from '../types';
import { MOTIF_MAP } from '../motifs/data';
import { renderMotifOnCanvas } from '../motifs/renderMotif';
import { getWrappedMotifs, TILE_SIZE } from '../engine/seamlessWrap';

/**
 * Generates a full 3000x3000px seamless pattern sheet (5x5 tile repeat)
 */
export async function exportPatternSheetPng(
  state: PatternState
): Promise<{ blob: Blob; filename: string }> {
  const sheetDim = 3000;
  const repeatCount = 5; // 5 * 600 = 3000px
  const scale = 1; // 1:1 on 600px grid

  const canvas = document.createElement('canvas');
  canvas.width = sheetDim;
  canvas.height = sheetDim;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable for pattern sheet export');

  // Fill background
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, sheetDim, sheetDim);

  const wrapped = getWrappedMotifs(state.motifs);

  // Render 5x5 grid of seamless tiles
  for (let gridY = 0; gridY < repeatCount; gridY++) {
    for (let gridX = 0; gridX < repeatCount; gridX++) {
      const tileOriginX = gridX * TILE_SIZE;
      const tileOriginY = gridY * TILE_SIZE;

      ctx.save();
      ctx.translate(tileOriginX, tileOriginY);

      for (const item of wrapped) {
        const motifDef = MOTIF_MAP.get(item.motif.motifId);
        if (!motifDef) continue;

        const color =
          item.motif.customColor ||
          state.palette.motifColors[
            item.motif.colorIndex % state.palette.motifColors.length
          ];

        renderMotifOnCanvas(
          ctx,
          motifDef,
          state.style,
          color,
          item.renderX,
          item.renderY,
          item.motif.scale * scale,
          item.motif.rotation,
          item.motif.flipH,
          item.motif.flipV
        );
      }

      ctx.restore();
    }
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('Sheet PNG serialization failed'));
    }, 'image/png');
  });

  const filename = `pattern-sheet-3000x3000.png`;
  return { blob, filename };
}
