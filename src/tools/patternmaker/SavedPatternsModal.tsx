'use client';

import React from 'react';
import { X, Trash2, FolderOpen, Calendar } from 'lucide-react';
import type { SavedPatternItem, PatternState } from './types';

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 border border-[#0B0B0D]/10 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#0B0B0D]/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-[#0B0B0D] font-headline">
              Saved Patterns (In-Browser Storage)
            </h3>
            <p className="text-[11px] text-[#4F4E55]">
              Patterns are saved locally on your device in your browser.
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

        {/* List of Patterns */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {savedList.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#4F4E55] space-y-2">
              <FolderOpen className="h-8 w-8 mx-auto text-[#0B0B0D]/30" />
              <p>No saved patterns yet.</p>
              <p className="text-[11px] text-[#4F4E55]/80">
                Click &quot;Save to Browser&quot; on any pattern to keep it handy!
              </p>
            </div>
          ) : (
            savedList.map((item) => (
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
                  <p className="text-xs font-bold text-[#0B0B0D] truncate">
                    {item.name}
                  </p>
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
