import type { PatternState, SavedPatternItem } from '../types';

const STORAGE_KEY = 'pattern_maker_saved_patterns_v1';
const COLLECTIONS_KEY = 'pattern_maker_collections_v1';

const DEFAULT_COLLECTIONS = ['Favorites', 'Florals', 'Geometrics', 'Projects'];

export function getCollections(): string[] {
  if (typeof window === 'undefined') return DEFAULT_COLLECTIONS;
  try {
    const raw = localStorage.getItem(COLLECTIONS_KEY);
    if (!raw) return DEFAULT_COLLECTIONS;
    const parsed = JSON.parse(raw);
    return Array.from(new Set([...DEFAULT_COLLECTIONS, ...parsed]));
  } catch (err) {
    console.error('Failed to read collections:', err);
    return DEFAULT_COLLECTIONS;
  }
}

export function saveCollectionToStorage(name: string): string[] {
  if (typeof window === 'undefined') return DEFAULT_COLLECTIONS;
  const trimmed = name.trim();
  if (!trimmed) return getCollections();
  const current = getCollections();
  if (!current.includes(trimmed)) {
    const updated = [...current, trimmed];
    try {
      localStorage.setItem(COLLECTIONS_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to save collection:', err);
    }
    return updated;
  }
  return current;
}

export function getSavedPatterns(collection?: string): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const all = JSON.parse(raw) as SavedPatternItem[];
    if (!collection || collection === 'All') return all;
    return all.filter((p) => p.collection === collection);
  } catch (err) {
    console.error('Failed to read saved patterns:', err);
    return [];
  }
}

export function savePatternToStorage(
  state: PatternState,
  previewDataUrl: string,
  collection: string = 'Favorites'
): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  const list = getSavedPatterns();
  const newItem: SavedPatternItem = {
    id: `pattern-${Date.now()}`,
    name: state.name || `Pattern ${list.length + 1}`,
    collection,
    timestamp: Date.now(),
    previewDataUrl,
    state: JSON.parse(JSON.stringify(state)),
  };

  // Prepend newest
  const updated = [newItem, ...list.slice(0, 49)]; // Keep up to 50 saved patterns
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save pattern to localStorage:', err);
  }
  return updated;
}

export function updatePatternCollection(id: string, collection: string): SavedPatternItem[] {
  if (typeof window === 'undefined') return [];
  const list = getSavedPatterns();
  const updated = list.map((item) => (item.id === id ? { ...item, collection } : item));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update pattern collection:', err);
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

