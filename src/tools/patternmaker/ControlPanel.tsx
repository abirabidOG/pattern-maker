'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Shuffle,
  Share2,
  Bookmark,
  BookmarkCheck,
  Check,
  Palette as PaletteIcon,
  Layers,
  Sliders,
  FlipHorizontal,
  FlipVertical,
  RotateCw,
  RefreshCw,
  Copy,
  ChevronDown,
} from 'lucide-react';
import type { PatternState, StyleMode, LayoutMode, Palette } from './types';
import { MOTIFS, MOTIF_MAP } from './motifs/data';
import { STYLES } from './motifs/styles';
import { PALETTES, PRESET_BACKGROUND_SWATCHES } from './palettes';

interface ControlPanelProps {
  state: PatternState;
  promptText: string;
  setPromptText: (text: string) => void;
  parseReadout: string | null;
  unmatchedNote: string | null;
  paletteChangeNotice: string | null;
  onGeneratePrompt: (text?: string) => void;
  onNewVariation: () => void;
  onRandomize: () => void;
  onUpdateState: (partial: Partial<PatternState>) => void;
  onSelectPalette: (palette: Palette) => void;
  onRecolourMotifs: () => void;
  onSavePattern: () => void;
  onSharePattern: () => void;
  onOpenSavedModal: () => void;
  savedCount: number;
}

export const SAMPLE_PROMPTS = [
  'Pink flowers and green leaves on cream',
  'Blue geometric triangles',
  'Cute cats and stars for kids',
  'Tropical leaves on dark green',
  'Red hearts and pink dots on white',
  'Yellow suns and white clouds on light blue',
  'Pink roses and green leaves on cream',
  'Yellow sunflowers and brown dots on white',
  'Blue whales and white clouds on light blue',
  'Red strawberries and green leaves on white',
  'Gold crescents and stars on dark blue',
];

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  promptText,
  setPromptText,
  parseReadout,
  unmatchedNote,
  paletteChangeNotice,
  onGeneratePrompt,
  onNewVariation,
  onRandomize,
  onUpdateState,
  onSelectPalette,
  onRecolourMotifs,
  onSavePattern,
  onSharePattern,
  onOpenSavedModal,
  savedCount,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedMotifColorIndex, setSelectedMotifColorIndex] = useState<number>(0);

  const currentStyleObj = STYLES.find((s) => s.id === state.style) || STYLES[0];

  const filteredMotifs =
    activeCategory === 'all'
      ? MOTIFS
      : MOTIFS.filter((m) => m.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* 1. Describe Box Card */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="prompt-input"
            className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D] font-mono flex items-center gap-1.5"
          >
            <Sparkles className="h-4 w-4 text-[#5846F6]" />
            <span>Describe a pattern (Rule-Based Parser)</span>
          </label>
          <span className="text-[11px] font-mono text-[#4F4E55]">No AI &bull; In-browser</span>
        </div>

        <div className="relative">
          <input
            id="prompt-input"
            type="text"
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') onGeneratePrompt();
            }}
            placeholder='e.g. "Pink flowers and green leaves on cream"'
            className="w-full rounded-2xl border border-[#0B0B0D]/15 bg-[#F4F2EC]/50 px-4 py-3 text-sm text-[#0B0B0D] placeholder-[#4F4E55]/60 focus:border-[#5846F6] focus:bg-white focus:outline-none transition-all shadow-xs"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onGeneratePrompt()}
            className="inline-flex items-center gap-2 rounded-full bg-[#5846F6] hover:bg-[#4735E5] text-white px-5 py-2.5 text-xs font-bold shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles className="h-3.5 w-3.5 text-[#D4FF3A]" />
            <span>Generate Pattern</span>
          </button>

          <button
            type="button"
            onClick={onNewVariation}
            className="inline-flex items-center gap-2 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] text-[#0B0B0D] px-4 py-2.5 text-xs font-bold transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>New Variation (N)</span>
          </button>

          <button
            type="button"
            onClick={onRandomize}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] text-[#0B0B0D] px-3.5 py-2.5 text-xs font-bold transition-colors ml-auto"
            title="Randomize motif, palette & layout"
          >
            <Shuffle className="h-3.5 w-3.5 text-[#5846F6]" />
            <span>Randomize</span>
          </button>
        </div>

        {/* Honest Readout Alert */}
        {parseReadout && (
          <div className="rounded-xl border border-[#5846F6]/20 bg-[#5846F6]/5 p-3 text-xs text-[#0B0B0D] space-y-1">
            <p className="font-semibold text-[#5846F6]">{parseReadout}</p>
            {unmatchedNote && (
              <p className="text-[#4F4E55] italic">{unmatchedNote}</p>
            )}
          </div>
        )}

        {/* 11 Sample Prompts Chips */}
        <div className="space-y-2 pt-1">
          <p className="text-[11px] font-mono uppercase font-semibold text-[#4F4E55]">
            Or try a sample prompt:
          </p>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
            {SAMPLE_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => {
                  setPromptText(prompt);
                  onGeneratePrompt(prompt);
                }}
                className="rounded-full border border-[#0B0B0D]/10 bg-[#F4F2EC]/80 hover:bg-[#5846F6]/10 hover:border-[#5846F6]/30 px-3 py-1 text-[11px] font-medium text-[#0B0B0D] transition-all text-left"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Style Buttons Card */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D] font-mono block">
          Drawing Style
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {STYLES.map((style) => (
            <button
              key={style.id}
              type="button"
              onClick={() => onUpdateState({ style: style.id })}
              className={`rounded-2xl border px-3 py-2 text-xs font-bold transition-all text-center ${
                state.style === style.id
                  ? 'border-[#5846F6] bg-[#5846F6] text-white shadow-xs'
                  : 'border-[#0B0B0D]/10 bg-[#F4F2EC]/60 hover:bg-white text-[#0B0B0D]'
              }`}
            >
              {style.name}
            </button>
          ))}
        </div>
        <p className="text-[11px] text-[#4F4E55] font-medium pt-1">
          {currentStyleObj.description}
        </p>
      </div>

      {/* 3. 35 Motif Library */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D] font-mono">
            35 Free Vector Motifs
          </label>
          <span className="text-[11px] font-mono text-[#5846F6] font-semibold">
            All 100% Free &bull; No Pro
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['all', 'nature', 'shapes', 'cute', 'objects'].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`capitalize px-3 py-1 rounded-full font-semibold transition-colors ${
                activeCategory === cat
                  ? 'bg-[#0B0B0D] text-white'
                  : 'bg-[#F4F2EC] text-[#4F4E55] hover:text-[#0B0B0D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 35 Motif Icons Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-7 gap-2 max-h-56 overflow-y-auto pr-1">
          {filteredMotifs.map((motif) => {
            const isSelected = state.activeMotifId === motif.id;
            return (
              <button
                key={motif.id}
                type="button"
                onClick={() => onUpdateState({ activeMotifId: motif.id })}
                title={`Select ${motif.name} to place`}
                className={`relative flex flex-col items-center justify-center p-2 rounded-2xl border transition-all ${
                  isSelected
                    ? 'border-[#5846F6] bg-[#5846F6]/10 ring-2 ring-[#5846F6]'
                    : 'border-[#0B0B0D]/10 hover:border-[#5846F6]/50 bg-[#F4F2EC]/40 hover:bg-white'
                }`}
              >
                <svg
                  viewBox="0 0 100 100"
                  className="h-7 w-7 text-[#0B0B0D]"
                  fill="currentColor"
                >
                  {motif.paths.map((p, i) => (
                    <path
                      key={i}
                      d={p.d}
                      fill={p.strokeOnly ? 'none' : 'currentColor'}
                      stroke={p.strokeOnly ? 'currentColor' : 'none'}
                      strokeWidth={p.strokeWidth || 4}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </svg>
                <span className="text-[9px] font-medium text-[#4F4E55] mt-1 truncate max-w-full">
                  {motif.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Design Controls (Layout, Size, Spacing, Rotation) */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-5">
        <label className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D] font-mono block">
          Design & Arrangement
        </label>

        {/* Layout Dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B0B0D]">
            <span>Repeat Layout:</span>
            <span className="font-mono text-[#5846F6] capitalize">{state.layout}</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {(['half-drop', 'brick', 'grid', 'diamond', 'scatter', 'free'] as LayoutMode[]).map(
              (mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => onUpdateState({ layout: mode })}
                  className={`rounded-xl border py-1.5 text-xs font-bold capitalize transition-all ${
                    state.layout === mode
                      ? 'border-[#5846F6] bg-[#5846F6] text-white shadow-xs'
                      : 'border-[#0B0B0D]/10 bg-[#F4F2EC]/50 hover:bg-white text-[#0B0B0D]'
                  }`}
                >
                  {mode}
                </button>
              )
            )}
          </div>
        </div>

        {/* Motif Size Slider (10-150, def 55) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B0B0D]">
            <span>Motif Size:</span>
            <span className="font-mono text-[#5846F6]">{state.motifSize}px</span>
          </div>
          <input
            type="range"
            min={10}
            max={150}
            value={state.motifSize}
            onChange={(e) => onUpdateState({ motifSize: Number(e.target.value) })}
            className="w-full accent-[#5846F6] cursor-pointer"
          />
        </div>

        {/* Spacing / Density Slider (0-20, def 5) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B0B0D]">
            <span>Spacing & Density:</span>
            <span className="font-mono text-[#5846F6]">{state.spacing}</span>
          </div>
          <input
            type="range"
            min={0}
            max={20}
            value={state.spacing}
            onChange={(e) => onUpdateState({ spacing: Number(e.target.value) })}
            className="w-full accent-[#5846F6] cursor-pointer"
          />
        </div>

        {/* Rotation Slider (0-360, def 25) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B0B0D]">
            <span>Rotation:</span>
            <span className="font-mono text-[#5846F6]">{state.rotation}&deg;</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={state.rotation}
            onChange={(e) => onUpdateState({ rotation: Number(e.target.value) })}
            className="w-full accent-[#5846F6] cursor-pointer"
          />
        </div>

        {/* Color Rotation Count Dropdown (1-5, def 3) & Flip Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0B0B0D] block">
              Color Count:
            </span>
            <select
              value={state.colorCount}
              onChange={(e) => onUpdateState({ colorCount: Number(e.target.value) })}
              className="w-full rounded-xl border border-[#0B0B0D]/15 bg-[#F4F2EC]/60 px-3 py-2 text-xs font-bold text-[#0B0B0D] focus:outline-none focus:border-[#5846F6]"
            >
              {[1, 2, 3, 4, 5].map((cnt) => (
                <option key={cnt} value={cnt}>
                  {cnt} {cnt === 1 ? 'color' : 'colors rotating'}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[#0B0B0D] block">
              Orientation:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  const updated = state.motifs.map((m) => ({ ...m, flipH: !m.flipH }));
                  onUpdateState({ motifs: updated });
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] px-2 py-2 text-xs font-bold text-[#0B0B0D] transition-colors"
              >
                <FlipHorizontal className="h-3.5 w-3.5" />
                <span>Flip H</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  const updated = state.motifs.map((m) => ({ ...m, flipV: !m.flipV }));
                  onUpdateState({ motifs: updated });
                }}
                className="flex-1 inline-flex items-center justify-center gap-1 rounded-xl border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] px-2 py-2 text-xs font-bold text-[#0B0B0D] transition-colors"
              >
                <FlipVertical className="h-3.5 w-3.5" />
                <span>Flip V</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Color Palettes & Background Swatches Card */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-[#0B0B0D] font-mono">
            8 Curated Palettes (Tap to Apply)
          </label>
          {paletteChangeNotice && (
            <span className="text-[11px] font-mono text-[#5846F6] font-semibold animate-in fade-in">
              {paletteChangeNotice}
            </span>
          )}
        </div>

        {/* 8 Palettes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PALETTES.map((pal) => {
            const isSelected = state.palette.id === pal.id;
            return (
              <button
                key={pal.id}
                type="button"
                onClick={() => onSelectPalette(pal)}
                className={`flex flex-col p-2.5 rounded-2xl border transition-all text-left ${
                  isSelected
                    ? 'border-[#5846F6] bg-[#5846F6]/5 ring-2 ring-[#5846F6]'
                    : 'border-[#0B0B0D]/10 hover:border-[#0B0B0D]/30 bg-white'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold text-[#0B0B0D] mb-1.5">
                  <span>{pal.name}</span>
                  {isSelected && <Check className="h-3 w-3 text-[#5846F6]" />}
                </div>
                {/* 5 Swatches Strip */}
                <div className="flex h-5 w-full rounded-lg overflow-hidden border border-[#0B0B0D]/10">
                  <div
                    className="w-1/5 h-full"
                    style={{ backgroundColor: pal.background }}
                    title={`BG: ${pal.background}`}
                  />
                  {pal.motifColors.map((c, i) => (
                    <div
                      key={i}
                      className="w-1/5 h-full"
                      style={{ backgroundColor: c }}
                      title={`Motif ${i + 1}: ${c}`}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Background Swatches & Hex Field */}
        <div className="pt-2 border-t border-[#0B0B0D]/10 space-y-2.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#0B0B0D]">
            <span>Background Color:</span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.backgroundColor}
                onChange={(e) => onUpdateState({ backgroundColor: e.target.value })}
                className="h-6 w-6 rounded-md border border-[#0B0B0D]/20 cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={state.backgroundColor}
                onChange={(e) => onUpdateState({ backgroundColor: e.target.value })}
                className="w-20 font-mono text-xs uppercase px-2 py-1 rounded-md border border-[#0B0B0D]/15 text-[#0B0B0D]"
              />
            </div>
          </div>

          {/* 10 Preset Swatches */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {PRESET_BACKGROUND_SWATCHES.map((sw) => (
              <button
                key={sw.hex}
                type="button"
                onClick={() => onUpdateState({ backgroundColor: sw.hex })}
                style={{ backgroundColor: sw.hex }}
                title={sw.label}
                className={`h-7 w-7 rounded-full border shrink-0 transition-transform ${
                  state.backgroundColor.toLowerCase() === sw.hex.toLowerCase()
                    ? 'border-[#5846F6] scale-110 ring-2 ring-[#5846F6]/50'
                    : 'border-[#0B0B0D]/20 hover:scale-105'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Recolour Motifs Button */}
        <div className="pt-2 border-t border-[#0B0B0D]/10 flex items-center justify-between">
          <span className="text-xs text-[#4F4E55]">
            Shuffle color index assignment across motifs:
          </span>
          <button
            type="button"
            onClick={onRecolourMotifs}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] px-3.5 py-1.5 text-xs font-bold text-[#0B0B0D] transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#5846F6]" />
            <span>Recolour Motifs</span>
          </button>
        </div>
      </div>

      {/* 6. Save & Share Bar */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onSavePattern}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#0B0B0D] hover:bg-[#5846F6] text-white px-4 py-2 text-xs font-bold transition-all shadow-xs"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save to Browser</span>
          </button>

          <button
            type="button"
            onClick={onOpenSavedModal}
            className="rounded-full border border-[#0B0B0D]/15 bg-[#F4F2EC] hover:bg-white text-[#0B0B0D] px-3 py-2 text-xs font-bold transition-colors"
          >
            Saved ({savedCount})
          </button>
        </div>

        <button
          type="button"
          onClick={onSharePattern}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] text-[#0B0B0D] px-4 py-2 text-xs font-bold transition-colors"
        >
          <Share2 className="h-3.5 w-3.5 text-[#5846F6]" />
          <span>Share Link</span>
        </button>
      </div>
    </div>
  );
};
