import type { PatternState } from '../types';
import { PALETTES, DEFAULT_PALETTE } from '../palettes';

/**
 * Encodes the current pattern configuration into a compact URL hash
 */
export function encodePatternToHash(state: PatternState): string {
  const compact = {
    v: 1,
    l: state.layout,
    s: state.style,
    ms: state.motifSize,
    sp: state.spacing,
    ro: state.rotation,
    cc: state.colorCount,
    bg: state.backgroundColor,
    p: state.palette.id,
    m: state.motifs.map((m) => [
      m.motifId,
      Math.round(m.x),
      Math.round(m.y),
      Math.round(m.scale),
      Math.round(m.rotation),
      m.flipH ? 1 : 0,
      m.flipV ? 1 : 0,
      m.colorIndex,
      m.customColor || '',
    ]),
  };

  try {
    const jsonStr = JSON.stringify(compact);
    // Base64 encode safe for URL
    return encodeURIComponent(btoa(jsonStr));
  } catch (err) {
    console.error('Error encoding pattern to hash:', err);
    return '';
  }
}

/**
 * Decodes URL hash back into pattern state
 */
export function decodePatternFromHash(hashString: string): Partial<PatternState> | null {
  try {
    const cleanHash = hashString.replace(/^#/, '');
    if (!cleanHash) return null;

    const jsonStr = atob(decodeURIComponent(cleanHash));
    const data = JSON.parse(jsonStr);

    if (data.v !== 1) return null;

    const palette =
      PALETTES.find((p) => p.id === data.p) || DEFAULT_PALETTE;

    const motifs = (data.m || []).map((arr: any, idx: number) => ({
      id: `hash-motif-${idx}`,
      motifId: arr[0],
      x: arr[1],
      y: arr[2],
      scale: arr[3],
      rotation: arr[4],
      flipH: arr[5] === 1,
      flipV: arr[6] === 1,
      colorIndex: arr[7],
      customColor: arr[8] || undefined,
    }));

    return {
      layout: data.l,
      style: data.s,
      motifSize: data.ms,
      spacing: data.sp,
      rotation: data.ro,
      colorCount: data.cc,
      backgroundColor: data.bg,
      palette,
      motifs,
    };
  } catch (err) {
    console.error('Error decoding pattern from hash:', err);
    return null;
  }
}
