import { MOTIFS } from '../motifs/data';
import type { PromptParseResult, StyleMode } from '../types';

interface ColorKeyword {
  name: string;
  hex: string;
  regex: RegExp;
}

const BG_COLOR_KEYWORDS: ColorKeyword[] = [
  { name: 'dark green', hex: '#14532d', regex: /\bdark\s+green\b/i },
  { name: 'light blue', hex: '#eef6f8', regex: /\blight\s+blue\b/i },
  { name: 'dark blue', hex: '#1d2733', regex: /\bdark\s+blue\b/i },
  { name: 'navy', hex: '#1d2733', regex: /\bnavy\b/i },
  { name: 'cream', hex: '#f3e5c3', regex: /\bcream\b/i },
  { name: 'white', hex: '#ffffff', regex: /\bwhite\b/i },
  { name: 'pink', hex: '#fdf1ec', regex: /\bpink\b/i },
  { name: 'black', hex: '#0b0b0d', regex: /\bblack\b/i },
  { name: 'sage', hex: '#f1f4ea', regex: /\bsage\b/i },
  { name: 'sand', hex: '#f6efe4', regex: /\bsand\b/i },
];

interface StyleKeyword {
  style: StyleMode;
  regex: RegExp;
}

const STYLE_KEYWORDS: StyleKeyword[] = [
  { style: 'geometric', regex: /\bgeometric\b/i },
  { style: 'kids', regex: /\bkids?\b|\bcute\b/i },
  { style: 'vintage', regex: /\bvintage\b|\bretro\b/i },
  { style: 'minimal', regex: /\bminimal\b|\bclean\b/i },
];

/**
 * Parses user natural language prompts deterministically:
 * - Matches up to 3 motif keywords
 * - Detects background color words
 * - Detects style keywords
 * - Detects unsupported noun requests to provide honest feedback
 */
export function parsePrompt(input: string): PromptParseResult & {
  detectedStyle?: StyleMode;
  motifColors?: string[];
} {
  const text = input.trim().toLowerCase();

  // 1. Detect background color
  let matchedBgColor: { name: string; hex: string } | undefined;
  for (const bg of BG_COLOR_KEYWORDS) {
    if (bg.regex.test(text)) {
      matchedBgColor = { name: bg.name, hex: bg.hex };
      break;
    }
  }

  // 2. Detect style keyword
  let detectedStyle: StyleMode | undefined;
  for (const st of STYLE_KEYWORDS) {
    if (st.regex.test(text)) {
      detectedStyle = st.style;
      break;
    }
  }

  // 3. Match up to 3 motif keywords in order of mention
  const matchedMotifs: string[] = [];
  const foundPositions: { motifId: string; pos: number; name: string }[] = [];

  for (const motif of MOTIFS) {
    for (const kw of motif.keywords) {
      const regex = new RegExp(`\\b${kw}\\b`, 'i');
      const match = regex.exec(text);
      if (match) {
        if (!foundPositions.some((p) => p.motifId === motif.id)) {
          foundPositions.push({
            motifId: motif.id,
            pos: match.index,
            name: motif.name.toLowerCase(),
          });
        }
        break;
      }
    }
  }

  // Sort by first appearance in prompt
  foundPositions.sort((a, b) => a.pos - b.pos);
  const selected = foundPositions.slice(0, 3);
  selected.forEach((s) => matchedMotifs.push(s.motifId));

  // Fallback if no motifs matched: default to flower
  if (matchedMotifs.length === 0) {
    matchedMotifs.push('flower');
  }

  // Check for common words that users might ask for that aren't yet in the 35 motifs
  const potentialMissingWords = [
    'elephant', 'tiger', 'lion', 'bird', 'fish', 'car', 'tree', 'mushroom',
    'boat', 'plane', 'guitar', 'music', 'book', 'dragon', 'rocket', 'dinosaur'
  ];
  let unmatchedNote: string | undefined;
  for (const word of potentialMissingWords) {
    if (new RegExp(`\\b${word}s?\\b`, 'i').test(text)) {
      const cap = word.charAt(0).toUpperCase() + word.slice(1);
      unmatchedNote = `${cap}s were not added yet.`;
      break;
    }
  }

  // Format honest readout
  const motifNames = selected.map((s) => s.name);
  const readoutMotifs =
    motifNames.length === 1
      ? motifNames[0]
      : motifNames.length === 2
      ? `${motifNames[0]} and ${motifNames[1]}`
      : `${motifNames[0]}, ${motifNames[1]} and ${motifNames[2]}`;

  const readoutBg = matchedBgColor ? ` on ${matchedBgColor.name}` : '';
  const readout = `Made a pattern with: ${readoutMotifs}${readoutBg}.`;

  return {
    matchedMotifs,
    matchedBgColor,
    detectedStyle,
    readout,
    unmatchedNote,
  };
}
