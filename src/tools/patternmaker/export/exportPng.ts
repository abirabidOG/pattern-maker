import type { PatternState } from '../types';
import { MOTIF_MAP } from '../motifs/data';
import { renderMotifOnCanvas, getCachedImage, renderImageMotifOnCanvas } from '../motifs/renderMotif';
import { getWrappedMotifs, TILE_SIZE } from '../engine/seamlessWrap';


export interface ExportPngOptions {
  size: 500 | 1000 | 2000 | 3000;
  transparentBackground: boolean;
}

/**
 * Renders the tile at the specified high-resolution dimension to PNG
 */
export async function exportTilePng(
  state: PatternState,
  options: ExportPngOptions
): Promise<{ blob: Blob; filename: string; sizeText: string }> {
  const { size, transparentBackground } = options;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Failed to create canvas context for export');

  // Background
  if (!transparentBackground) {
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  // Scale factor from 600px canvas to target export size
  const scaleMultiplier = size / TILE_SIZE;
  ctx.save();
  ctx.scale(scaleMultiplier, scaleMultiplier);

  // Render all edge-wrapped motifs
  const wrapped = getWrappedMotifs(state.motifs);
  for (const item of wrapped) {
    if (item.motif.imageDataUrl || state.uploadedImageUrl) {
      const url = item.motif.imageDataUrl || state.uploadedImageUrl!;
      const img = getCachedImage(url);
      if (img && img.complete) {
        renderImageMotifOnCanvas(
          ctx,
          img,
          item.renderX,
          item.renderY,
          item.motif.scale,
          item.motif.rotation,
          item.motif.flipH,
          item.motif.flipV
        );
      }
      continue;
    }

    const motifDef = MOTIF_MAP.get(item.motif.motifId);
    if (!motifDef) continue;


    const color =
      item.motif.customColor ||
      state.palette.motifColors[item.motif.colorIndex % state.palette.motifColors.length];

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

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => {
      if (b) resolve(b);
      else reject(new Error('PNG serialization failed'));
    }, 'image/png');
  });

  const filename = `pattern-tile-${size}x${size}.png`;
  const sizeText = `${size}x${size}`;

  return { blob, filename, sizeText };
}
