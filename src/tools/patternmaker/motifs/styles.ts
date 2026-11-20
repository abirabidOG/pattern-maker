import type { StyleMode } from '../types';

export interface StyleOption {
  id: StyleMode;
  name: string;
  description: string;
}

export const STYLES: StyleOption[] = [
  {
    id: 'flat',
    name: 'Flat Vector',
    description: 'Flat Vector: solid color fills with clean, modern vector curves.',
  },
  {
    id: 'geometric',
    name: 'Geometric',
    description: 'Geometric: motifs become clean geometric shapes and crisp math lines.',
  },
  {
    id: 'kids',
    name: 'Kids',
    description: 'Kids: chunky playful outlines with soft rounded contours.',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    description: 'Vintage: engraved etching contours with fine-line editorial character.',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Minimal: delicate monoline vector strokes with generous negative space.',
  },
];
