import type { Palette } from './types';

export const PRESET_BACKGROUND_SWATCHES = [
  { label: 'White', hex: '#ffffff' },
  { label: 'Warm Cream', hex: '#faf3e3' },
  { label: 'Classic Cream', hex: '#f3e5c3' },
  { label: 'Soft Blue', hex: '#eef6f8' },
  { label: 'Pale Peach', hex: '#fdf1ec' },
  { label: 'Sage Tint', hex: '#f1f4ea' },
  { label: 'Dark Green', hex: '#14532d' },
  { label: 'Deep Ocean', hex: '#274156' },
  { label: 'Ink Charcoal', hex: '#2b2b2b' },
  { label: 'Blush Pink', hex: '#f27ea9' },
];

export const PALETTES: Palette[] = [
  {
    id: 'meadow',
    name: 'Meadow',
    background: '#faf3e3',
    motifColors: ['#f27ea9', '#4c9f70', '#f2c230', '#e4572e'],
  },
  {
    id: 'ocean',
    name: 'Ocean',
    background: '#eef6f8',
    motifColors: ['#3e7cb1', '#159a8c', '#8ecae6', '#274156'],
  },
  {
    id: 'berry',
    name: 'Berry',
    background: '#fdf1ec',
    motifColors: ['#c9409e', '#8e2f38', '#ff7a66', '#8b6cc1'],
  },
  {
    id: 'forest',
    name: 'Forest',
    background: '#f1f4ea',
    motifColors: ['#14532d', '#4c9f70', '#7d8c46', '#d9a441'],
  },
  {
    id: 'candy',
    name: 'Candy',
    background: '#fff6fa',
    motifColors: ['#ef476f', '#f2c230', '#35b5ac', '#f27ea9'],
  },
  {
    id: 'earth',
    name: 'Earth',
    background: '#f6efe4',
    motifColors: ['#8a5a3b', '#e4572e', '#d9a441', '#7d8c46'],
  },
  {
    id: 'mono-ink',
    name: 'Mono ink',
    background: '#ffffff',
    motifColors: ['#2b2b2b', '#5a635c', '#9aa0a6', '#2b2b2b'],
  },
  {
    id: 'night',
    name: 'Night',
    background: '#1d2733',
    motifColors: ['#8ecae6', '#f2c230', '#f27ea9', '#a8d8b9'],
  },
];

export const DEFAULT_PALETTE = PALETTES[0]; // Meadow
export const DEFAULT_BACKGROUND = '#F3E5C3';
