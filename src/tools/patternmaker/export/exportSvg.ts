import type { PatternState } from '../types';
import { MOTIF_MAP } from '../motifs/data';
import { renderMotifToSvg } from '../motifs/renderMotif';
import { getWrappedMotifs } from '../engine/seamlessWrap';

export function exportTileSvg(
  state: PatternState,
  transparentBackground = false
): { svgContent: string; filename: string } {
  const wrapped = getWrappedMotifs(state.motifs);

  const motifSvgElements = wrapped
    .map((item) => {
      const motifDef = MOTIF_MAP.get(item.motif.motifId);
      if (!motifDef) return '';

      const color =
        item.motif.customColor ||
        state.palette.motifColors[item.motif.colorIndex % state.palette.motifColors.length];

      return renderMotifToSvg(
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
    })
    .filter(Boolean)
    .join('\n    ');

  const bgRect = transparentBackground
    ? ''
    : `<rect width="600" height="600" fill="${state.backgroundColor}"/>\n  `;

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="600" height="600">
  <!-- Generated with Pattern Maker — tools.abidmahmud.cv/pattern-maker -->
  <!-- 100% Free & Unlimited Seamless Pattern Tile -->
  <defs>
    <pattern id="seamless-tile" width="600" height="600" patternUnits="userSpaceOnUse">
      ${bgRect}<!-- Wrapped Seamless Motifs -->
      ${motifSvgElements}
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="url(#seamless-tile)"/>
</svg>`.trim();

  const filename = `pattern-seamless-tile.svg`;
  return { svgContent, filename };
}
