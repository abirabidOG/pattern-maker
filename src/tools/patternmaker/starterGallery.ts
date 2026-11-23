import type { PatternState } from './types';
import { PALETTES } from './palettes';
import { generatePatternLayout } from './engine/layouts';

export interface StarterPatternPreset {
  id: string;
  name: string;
  category: 'florals' | 'geometrics' | 'kids' | 'festive';
  description: string;
  prompt: string;
  state: PatternState;
}

export const STARTER_GALLERY: StarterPatternPreset[] = [
  // 1. FLORALS
  {
    id: 'floral-rose-garden',
    name: 'English Rose Garden',
    category: 'florals',
    description: 'Half-drop repeating roses and green leaves on soft cream paper.',
    prompt: 'Pink roses and green leaves on cream',
    state: {
      version: 1,
      name: 'English Rose Garden',
      motifs: generatePatternLayout({
        layout: 'half-drop',
        motifIds: ['rose', 'leaf'],
        motifSize: 55,
        spacing: 6,
        rotation: 20,
        colorCount: 3,
      }),
      style: 'flat',
      layout: 'half-drop',
      motifSize: 55,
      spacing: 6,
      rotation: 20,
      colorCount: 3,
      backgroundColor: '#F7F3E8',
      palette: PALETTES[0], // Floral Cream
      activeMotifId: 'rose',
    },
  },
  {
    id: 'floral-sunflowers',
    name: 'Sunflower & Daisies',
    category: 'florals',
    description: 'Golden radiant sunflowers with white meadow daisies.',
    prompt: 'Yellow sunflowers and white daisies on cream',
    state: {
      version: 1,
      name: 'Sunflower & Daisies',
      motifs: generatePatternLayout({
        layout: 'grid',
        motifIds: ['sunflower', 'daisy', 'leaf'],
        motifSize: 50,
        spacing: 5,
        rotation: 15,
        colorCount: 3,
      }),
      style: 'flat',
      layout: 'grid',
      motifSize: 50,
      spacing: 5,
      rotation: 15,
      colorCount: 3,
      backgroundColor: '#FFFDF7',
      palette: PALETTES[1], // Sun & Sand
      activeMotifId: 'sunflower',
    },
  },

  // 2. GEOMETRICS
  {
    id: 'geo-diamond-grid',
    name: 'Bauhaus Diamonds',
    category: 'geometrics',
    description: 'Precise isometric diamonds and triangles with crisp framing.',
    prompt: 'Blue geometric diamonds and triangles on sand',
    state: {
      version: 1,
      name: 'Bauhaus Diamonds',
      motifs: generatePatternLayout({
        layout: 'diamond',
        motifIds: ['diamond', 'triangle', 'hexagon'],
        motifSize: 60,
        spacing: 8,
        rotation: 0,
        colorCount: 4,
      }),
      style: 'geometric',
      layout: 'diamond',
      motifSize: 60,
      spacing: 8,
      rotation: 0,
      colorCount: 4,
      backgroundColor: '#EAE6DF',
      palette: PALETTES[3], // Forest & Sage
      activeMotifId: 'diamond',
    },
  },
  {
    id: 'geo-minimal-rings',
    name: 'Minimalist Rings & Dots',
    category: 'geometrics',
    description: 'Clean architectural line art with fine concentric forms.',
    prompt: 'White rings and dots on dark ink',
    state: {
      version: 1,
      name: 'Minimalist Rings & Dots',
      motifs: generatePatternLayout({
        layout: 'brick',
        motifIds: ['ring', 'circle', 'dot'],
        motifSize: 50,
        spacing: 6,
        rotation: 0,
        colorCount: 2,
      }),
      style: 'minimal',
      layout: 'brick',
      motifSize: 50,
      spacing: 6,
      rotation: 0,
      colorCount: 2,
      backgroundColor: '#0B0B0D',
      palette: PALETTES[5], // Neon Accent
      activeMotifId: 'ring',
    },
  },

  // 3. KIDS
  {
    id: 'kids-animals-stars',
    name: 'Playful Pets & Stars',
    category: 'kids',
    description: 'Cute kittens and dogs surrounded by sparkling stars for nursery textiles.',
    prompt: 'Cute cats and stars for kids on light blue',
    state: {
      version: 1,
      name: 'Playful Pets & Stars',
      motifs: generatePatternLayout({
        layout: 'scatter',
        motifIds: ['cat', 'dog', 'star'],
        motifSize: 52,
        spacing: 5,
        rotation: 30,
        colorCount: 3,
      }),
      style: 'kids',
      layout: 'scatter',
      motifSize: 52,
      spacing: 5,
      rotation: 30,
      colorCount: 3,
      backgroundColor: '#EBF4F6',
      palette: PALETTES[4], // Soft Pastel
      activeMotifId: 'cat',
    },
  },
  {
    id: 'kids-bear-adventure',
    name: 'Bear Cub Starlight',
    category: 'kids',
    description: 'Forest bear cubs under starry night clouds and rainbows.',
    prompt: 'Cute bears and rainbow on cream',
    state: {
      version: 1,
      name: 'Bear Cub Starlight',
      motifs: generatePatternLayout({
        layout: 'half-drop',
        motifIds: ['bear', 'rainbow', 'cloud'],
        motifSize: 56,
        spacing: 6,
        rotation: 15,
        colorCount: 4,
      }),
      style: 'kids',
      layout: 'half-drop',
      motifSize: 56,
      spacing: 6,
      rotation: 15,
      colorCount: 4,
      backgroundColor: '#FFF7EC',
      palette: PALETTES[0], // Floral Cream
      activeMotifId: 'bear',
    },
  },

  // 4. FESTIVE
  {
    id: 'festive-gold-crescents',
    name: 'Midnight Gold Crescents',
    category: 'festive',
    description: 'Luminous gold crescents and celestial diamonds on midnight navy.',
    prompt: 'Gold crescents and stars on dark blue',
    state: {
      version: 1,
      name: 'Midnight Gold Crescents',
      motifs: generatePatternLayout({
        layout: 'diamond',
        motifIds: ['crescent', 'star', 'diamond'],
        motifSize: 54,
        spacing: 7,
        rotation: 20,
        colorCount: 3,
      }),
      style: 'vintage',
      layout: 'diamond',
      motifSize: 54,
      spacing: 7,
      rotation: 20,
      colorCount: 3,
      backgroundColor: '#0F172A',
      palette: PALETTES[2], // Berry & Wine
      activeMotifId: 'crescent',
    },
  },
  {
    id: 'festive-sweet-berries',
    name: 'Sweet Berry Celebration',
    category: 'festive',
    description: 'Vibrant strawberries and sweet red hearts for holiday wrapping paper.',
    prompt: 'Red strawberries and green leaves on white',
    state: {
      version: 1,
      name: 'Sweet Berry Celebration',
      motifs: generatePatternLayout({
        layout: 'scatter',
        motifIds: ['strawberry', 'heart', 'cherry'],
        motifSize: 50,
        spacing: 5,
        rotation: 35,
        colorCount: 3,
      }),
      style: 'flat',
      layout: 'scatter',
      motifSize: 50,
      spacing: 5,
      rotation: 35,
      colorCount: 3,
      backgroundColor: '#FFF5F5',
      palette: PALETTES[2], // Berry & Wine
      activeMotifId: 'strawberry',
    },
  },
];
