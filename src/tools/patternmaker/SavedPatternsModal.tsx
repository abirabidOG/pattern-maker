'use client';

import React, { useState } from 'react';
import { X, Trash2, FolderOpen, Plus, Tag } from 'lucide-react';
import type { SavedPatternItem, PatternState } from './types';
import { getCollections, saveCollectionToStorage } from './storage/localStorage';
import { trackCollectionCreated } from './analytics';

interface SavedPatternsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedList: SavedPatternItem[];
  onLoadPattern: (state: PatternState) => void;
  onDeletePattern: (id: string) => void;
}

export const SavedPatternsModal: React.FC<SavedPatternsModalProps> = ({
  isOpen,
  onClose,
  savedList,
  onLoadPattern,
  onDeletePattern,
}) => {
  const [selectedCollection, setSelectedCollection] = useState<string>('All');
  const [newCollectionName, setNewCollectionName] = useState<string>('');
  const [isAddingCollection, setIsAddingCollection] = useState<boolean>(false);
  const [collectionsList, setCollectionsList] = useState<string[]>(() => getCollections());

  if (!isOpen) return null;

  const handleCreateCollection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    const updated = saveCollectionToStorage(newCollectionName.trim());
    setCollectionsList(updated);
    setSelectedCollection(newCollectionName.trim());
    trackCollectionCreated(newCollectionName.trim());
    setNewCollectionName('');
    setIsAddingCollection(false);
  };

  const filteredList =
    selectedCollection === 'All'
      ? savedList
      : savedList.filter((item) => (item.collection || 'Favorites') === selectedCollection);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 border border-[#0B0B0D]/10 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0B0B0D]/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B0B0D] font-headline">
              Pattern Collections
            </h3>
            <p className="text-[11px] text-[#4F4E55]">
              Organize and load your saved patterns directly from your browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F4F2EC] text-[#4F4E55] hover:text-[#0B0B0D]"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Collection Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCollection('All')}
            className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
              selectedCollection === 'All'
                ? 'bg-[#0B0B0D] text-white'
                : 'bg-[#F4F2EC] text-[#4F4E55] hover:text-[#0B0B0D]'
            }`}
          >
            All ({savedList.length})
          </button>

          {collectionsList.map((col) => {
            const count = savedList.filter((p) => (p.collection || 'Favorites') === col).length;
            return (
              <button
                key={col}
                type="button"
                onClick={() => setSelectedCollection(col)}
                className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  selectedCollection === col
                    ? 'bg-[#5846F6] text-white'
                    : 'bg-[#F4F2EC] text-[#4F4E55] hover:text-[#0B0B0D]'
                }`}
              >
                {col} {count > 0 ? `(${count})` : ''}
              </button>
            );
          })}

          {!isAddingCollection ? (
            <button
              type="button"
              onClick={() => setIsAddingCollection(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium text-[#5846F6] hover:bg-[#5846F6]/10 shrink-0"
            >
              <Plus className="h-3 w-3" />
              <span>New</span>
            </button>
          ) : (
            <form onSubmit={handleCreateCollection} className="flex items-center gap-1 shrink-0">
              <input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                autoFocus
                className="px-2 py-0.5 rounded-lg border border-[#0B0B0D]/20 text-xs w-28 focus:outline-none focus:ring-1 focus:ring-[#5846F6]"
              />
              <button
                type="submit"
                className="px-2 py-0.5 rounded-lg bg-[#5846F6] text-white text-[11px] font-bold"
              >
                Add
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCollection(false)}
                className="px-1 text-xs text-[#4F4E55]"
              >
                ×
              </button>
            </form>
          )}
        </div>

        {/* List of Patterns */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filteredList.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#4F4E55] space-y-2">
              <FolderOpen className="h-8 w-8 mx-auto text-[#0B0B0D]/30" />
              <p>No patterns saved in {selectedCollection === 'All' ? 'any collection' : selectedCollection}.</p>
              <p className="text-[11px] text-[#4F4E55]/80">
                Click &quot;Save to Browser&quot; on any pattern to keep it handy!
              </p>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 p-3 rounded-2xl border border-[#0B0B0D]/10 bg-[#F4F2EC]/30 hover:bg-[#F4F2EC]/80 transition-colors"
              >
                {/* Thumbnail Preview */}
                <div
                  className="h-14 w-14 rounded-xl border border-[#0B0B0D]/10 overflow-hidden shrink-0"
                  style={{ backgroundColor: item.state.backgroundColor }}
                >
                  {item.previewDataUrl ? (
                    <img
                      src={item.previewDataUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-[#0B0B0D] truncate">
                      {item.name}
                    </p>
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-black/5 text-[#4F4E55] font-mono text-[9px]">
                      <Tag className="h-2.5 w-2.5" />
                      {item.collection || 'Favorites'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#4F4E55] capitalize">
                    {item.state.layout} layout &bull; {item.state.motifs.length} motifs &bull;{' '}
                    {item.state.palette.name}
                  </p>
                  <p className="text-[9px] font-mono text-[#4F4E55]/80">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      onLoadPattern(item.state);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-bold bg-[#5846F6] text-white hover:bg-[#4735E5] transition-colors"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeletePattern(item.id)}
                    className="p-1.5 rounded-full text-[#4F4E55] hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete saved pattern"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

