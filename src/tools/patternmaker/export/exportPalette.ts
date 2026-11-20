import type { Palette } from '../types';

export async function copyPaletteHex(palette: Palette, bg: string): Promise<string> {
  const hexList = [bg, ...palette.motifColors].map((c) => c.toUpperCase()).join(', ');
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(hexList);
  }
  return hexList;
}

export function downloadPaletteTxt(palette: Palette, bg: string): void {
  const content = [
    `Pattern Maker — Color Palette Details`,
    `Palette Name: ${palette.name}`,
    `----------------------------------------`,
    `Background: ${bg.toUpperCase()}`,
    `Motif Color 1: ${palette.motifColors[0].toUpperCase()}`,
    `Motif Color 2: ${palette.motifColors[1].toUpperCase()}`,
    `Motif Color 3: ${palette.motifColors[2].toUpperCase()}`,
    `Motif Color 4: ${palette.motifColors[3].toUpperCase()}`,
    `----------------------------------------`,
    `HEX Array: [${[bg, ...palette.motifColors].map((c) => `"${c.toUpperCase()}"`).join(', ')}]`,
    ``,
    `Free, unlimited seamless patterns: https://tools.abidmahmud.cv/pattern-maker`,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `palette-${palette.id}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
