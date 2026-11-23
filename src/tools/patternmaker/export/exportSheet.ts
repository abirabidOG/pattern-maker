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

/**
 * Phase 2: Generates a 300 DPI Print Sheet (Letter 8.5" x 11" with 0.125" Bleed & 1.0" Safe Margin Guide)
 * Total canvas: 2625 x 3375 px @ 300 DPI.
 */
export async function exportPrintSheet300Dpi(
  state: PatternState,
  options: { includeGuides?: boolean } = { includeGuides: true }
): Promise<{ blob: Blob; filename: string }> {
  const DPI = 300;
  const bleedInches = 0.125;
  const safeMarginInches = 1.0;

  const bleedPx = Math.round(bleedInches * DPI); // 38 px
  const safeMarginPx = Math.round(safeMarginInches * DPI); // 300 px

  const trimW = Math.round(8.5 * DPI); // 2550 px
  const trimH = Math.round(11 * DPI); // 3300 px

  const totalW = trimW + bleedPx * 2; // 2626 px
  const totalH = trimH + bleedPx * 2; // 3376 px

  const canvas = document.createElement('canvas');
  canvas.width = totalW;
  canvas.height = totalH;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context unavailable for 300 DPI print sheet');

  // Fill background
  ctx.fillStyle = state.backgroundColor;
  ctx.fillRect(0, 0, totalW, totalH);

  const wrapped = getWrappedMotifs(state.motifs);

  // Tile dimensions
  const numTilesX = Math.ceil(totalW / TILE_SIZE) + 1;
  const numTilesY = Math.ceil(totalH / TILE_SIZE) + 1;

  // Render seamless tiles across the entire bleed canvas
  for (let gy = 0; gy < numTilesY; gy++) {
    for (let gx = 0; gx < numTilesX; gx++) {
      ctx.save();
      ctx.translate(gx * TILE_SIZE, gy * TILE_SIZE);

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
          item.motif.scale,
          item.motif.rotation,
          item.motif.flipH,
          item.motif.flipV
        );
      }
      ctx.restore();
    }
  }

  // Draw 300 DPI Guides & Registration Marks if requested
  if (options.includeGuides) {
    ctx.save();

    // 1. Trim Line (Dashed blue)
    ctx.strokeStyle = '#2563EB';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 6]);
    ctx.strokeRect(bleedPx, bleedPx, trimW, trimH);

    // 2. Safe Margin Guide (1 inch inside trim line, dashed green)
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(
      bleedPx + safeMarginPx,
      bleedPx + safeMarginPx,
      trimW - safeMarginPx * 2,
      trimH - safeMarginPx * 2
    );

    // 3. Bleed Boundary (Outer perimeter, red outline)
    ctx.strokeStyle = '#DC2626';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(1, 1, totalW - 2, totalH - 2);

    // 4. Crop Marks at corners
    const markLen = 28;
    ctx.strokeStyle = '#0B0B0D';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);

    // Top-left
    ctx.beginPath();
    ctx.moveTo(bleedPx, 0);
    ctx.lineTo(bleedPx, markLen);
    ctx.moveTo(0, bleedPx);
    ctx.lineTo(markLen, bleedPx);
    // Top-right
    ctx.moveTo(bleedPx + trimW, 0);
    ctx.lineTo(bleedPx + trimW, markLen);
    ctx.moveTo(totalW, bleedPx);
    ctx.lineTo(totalW - markLen, bleedPx);
    // Bottom-left
    ctx.moveTo(bleedPx, totalH);
    ctx.lineTo(bleedPx, totalH - markLen);
    ctx.moveTo(0, bleedPx + trimH);
    ctx.lineTo(markLen, bleedPx + trimH);
    // Bottom-right
    ctx.moveTo(bleedPx + trimW, totalH);
    ctx.lineTo(bleedPx + trimW, totalH - markLen);
    ctx.moveTo(totalW, bleedPx + trimH);
    ctx.lineTo(totalW - markLen, bleedPx + trimH);
    ctx.stroke();

    // 5. Spec Banner in margin
    ctx.fillStyle = 'rgba(244, 242, 236, 0.92)';
    ctx.fillRect(bleedPx + 20, bleedPx + 20, 680, 52);
    ctx.strokeStyle = '#0B0B0D';
    ctx.lineWidth = 1;
    ctx.strokeRect(bleedPx + 20, bleedPx + 20, 680, 52);

    ctx.fillStyle = '#0B0B0D';
    ctx.font = 'bold 15px system-ui, -apple-system, sans-serif';
    ctx.fillText('300 DPI PRINT SHEET • 8.5" × 11" (LETTER)', bleedPx + 36, bleedPx + 44);
    ctx.font = '12px system-ui, -apple-system, sans-serif';
    ctx.fillStyle = '#4F4E55';
    ctx.fillText('RED: 0.125" Bleed • BLUE: Trim Line • GREEN: 1.0" Safe Margin Guide', bleedPx + 36, bleedPx + 62);

    ctx.restore();
  }

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('300 DPI Print Sheet PNG serialization failed'));
    }, 'image/png');
  });

  const filename = `pattern-print-sheet-300dpi-letter.png`;
  return { blob, filename };
}

