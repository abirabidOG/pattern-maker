import type { PatternState, SavedPatternItem } from '../types';

const STORAGE_KEY = 'pattern_maker_saved_patterns_v1';

export function getSavedPatterns(): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedPatternItem[];
  } catch (err) {
    console.error('Failed to read saved patterns:', err);
    return [];
  }
}

export function savePatternToStorage(
  state: PatternState,
  previewDataUrl: string
): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  const list = getSavedPatterns();
  const newItem: SavedPatternItem = {
    id: `pattern-${Date.now()}`,
    name: state.name || `Pattern ${list.length + 1}`,
    timestamp: Date.now(),
    previewDataUrl,
    state: JSON.parse(JSON.stringify(state)),
  };

  // Prepend newest
  const updated = [newItem, ...list.slice(0, 19)]; // Keep up to 20 saved patterns
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save pattern to localStorage:', err);
  }
  return updated;
}

export function deleteSavedPatternFromStorage(id: string): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  const list = getSavedPatterns();
  const updated = list.filter((item) => item.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to delete pattern from localStorage:', err);
  }
  return updated;
}
