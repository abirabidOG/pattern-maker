'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles,
  Check,
  AlertCircle,
  Command,
  Keyboard,
  Image as ImageIcon,
  Upload,
  ChevronUp,
  ChevronDown,
  Layers,
  Grid,
} from 'lucide-react';
import type { PatternState, EditorTool, Palette, PlacedMotif } from './types';
import { DEFAULT_PALETTE, DEFAULT_BACKGROUND, PALETTES } from './palettes';
import { MOTIFS } from './motifs/data';
import { parsePrompt } from './engine/parser';
import { generatePatternLayout } from './engine/layouts';
import { PatternHistory } from './engine/history';
import {
  getSavedPatterns,
  savePatternToStorage,
  deleteSavedPatternFromStorage,
} from './storage/localStorage';
import { encodePatternToHash, decodePatternFromHash } from './storage/urlHash';
import { exportTilePng } from './export/exportPng';
import { STARTER_GALLERY, type StarterPatternPreset } from './starterGallery';
import {
  trackPatternGenerated,
  trackPatternVariation,
  trackMotifPlaced,
  trackPatternShared,
  trackPaletteApplied,
  trackImageToPatternUploaded,
  trackStarterGalleryLoaded,
  trackPatternSavedToCollection,
} from './analytics';


import { TileCanvas } from './TileCanvas';
import { RepeatPreview } from './RepeatPreview';
import { ControlPanel } from './ControlPanel';
import { DownloadBar } from './DownloadBar';
import { SavedPatternsModal } from './SavedPatternsModal';

export const PatternMakerTool: React.FC = () => {
  // Initial default state
  const initialMotifs = generatePatternLayout({
    layout: 'half-drop',
    motifIds: ['flower', 'leaf'],
    motifSize: 55,
    spacing: 5,
    rotation: 25,
    colorCount: 3,
  });

  const [patternState, setPatternState] = useState<PatternState>({
    version: 1,
    name: 'Floral Bloom Half-Drop',
    motifs: initialMotifs,
    style: 'flat',
    layout: 'half-drop',
    motifSize: 55,
    spacing: 5,
    rotation: 25,
    colorCount: 3,
    backgroundColor: DEFAULT_BACKGROUND,
    palette: DEFAULT_PALETTE,
    activeMotifId: 'flower',
  });

  // History stack manager
  const historyRef = useRef<PatternHistory | null>(null);
  if (!historyRef.current) {
    historyRef.current = new PatternHistory(patternState);
  }

  // UI state
  const [activeTool, setActiveTool] = useState<EditorTool>('place');
  const [promptText, setPromptText] = useState<string>('Pink flowers and green leaves on cream');
  const [parseReadout, setParseReadout] = useState<string | null>(
    'Made a pattern with: flower and leaf on cream.'
  );
  const [unmatchedNote, setUnmatchedNote] = useState<string | null>(null);
  const [paletteNotice, setPaletteNotice] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavedModalOpen, setIsSavedModalOpen] = useState<boolean>(false);
  const [savedCount, setSavedCount] = useState<number>(0);
  const [showOverwriteConfirm, setShowOverwriteConfirm] = useState<boolean>(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const variationCounterRef = useRef<number>(1);

  // Phase 2: Starter Gallery & Image to Pattern state
  const [isGalleryOpen, setIsGalleryOpen] = useState<boolean>(true);
  const [galleryCategory, setGalleryCategory] = useState<'all' | 'florals' | 'geometrics' | 'kids' | 'festive'>('all');
  const imageInputRef = useRef<HTMLInputElement>(null);


  // Update saved count on mount
  useEffect(() => {
    setSavedCount(getSavedPatterns().length);

    // Check URL hash for shared pattern
    if (typeof window !== 'undefined' && window.location.hash) {
      const decoded = decodePatternFromHash(window.location.hash);
      if (decoded) {
        setPatternState((prev) => {
          const next = { ...prev, ...decoded };
          historyRef.current?.push(next);
          return next;
        });
        showToast('Shared pattern restored from link!');
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State update wrapper recording history
  const updateState = useCallback(
    (partial: Partial<PatternState>, recordHistory = true) => {
      setPatternState((prev) => {
        let updatedMotifs = prev.motifs;

        // If layout, size, spacing, rotation or colorCount changed and not in free mode,
        // automatically re-project non-hand-placed motifs
        const layoutPropsChanged =
          (partial.layout && partial.layout !== prev.layout) ||
          (partial.motifSize && partial.motifSize !== prev.motifSize) ||
          (partial.spacing !== undefined && partial.spacing !== prev.spacing) ||
          (partial.rotation !== undefined && partial.rotation !== prev.rotation) ||
          (partial.colorCount !== undefined && partial.colorCount !== prev.colorCount);

        const currentLayout = partial.layout || prev.layout;
        const currentSize = partial.motifSize || prev.motifSize;
        const currentSpacing = partial.spacing !== undefined ? partial.spacing : prev.spacing;
        const currentRot = partial.rotation !== undefined ? partial.rotation : prev.rotation;
        const currentColorCount = partial.colorCount || prev.colorCount;

        if (layoutPropsChanged && currentLayout !== 'free') {
          const existingIds = Array.from(new Set(prev.motifs.map((m) => m.motifId)));
          const activeIds = existingIds.length > 0 ? existingIds : [prev.activeMotifId];

          updatedMotifs = generatePatternLayout({
            layout: currentLayout,
            motifIds: activeIds,
            motifSize: currentSize,
            spacing: currentSpacing,
            rotation: currentRot,
            colorCount: currentColorCount,
            variationSeed: variationCounterRef.current,
          });
        }

        const next: PatternState = {
          ...prev,
          ...partial,
          motifs: partial.motifs || updatedMotifs,
        };

        if (recordHistory) {
          historyRef.current?.push(next);
        }
        return next;
      });
    },
    []
  );

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    const prev = historyRef.current?.undo();
    if (prev) {
      setPatternState(prev);
    }
  }, []);

  const handleRedo = useCallback(() => {
    const next = historyRef.current?.redo();
    if (next) {
      setPatternState(next);
    }
  }, []);

  // Check if hand-placed motifs exist before replacing
  const hasHandPlacedMotifs = useCallback(() => {
    return patternState.motifs.some((m) => m.isHandPlaced);
  }, [patternState.motifs]);

  const confirmBeforeReplace = useCallback(
    (action: () => void) => {
      if (hasHandPlacedMotifs()) {
        pendingActionRef.current = action;
        setShowOverwriteConfirm(true);
      } else {
        action();
      }
    },
    [hasHandPlacedMotifs]
  );

  // Generate Pattern from Prompt
  const executeGeneratePrompt = useCallback(
    (textToUse?: string) => {
      const query = textToUse || promptText;
      const parsed = parsePrompt(query);

      const nextLayout = patternState.layout === 'free' ? 'half-drop' : patternState.layout;
      const nextStyle = parsed.detectedStyle || patternState.style;
      const nextBg = parsed.matchedBgColor?.hex || patternState.backgroundColor;

      const newMotifs = generatePatternLayout({
        layout: nextLayout,
        motifIds: parsed.matchedMotifs,
        motifSize: patternState.motifSize,
        spacing: patternState.spacing,
        rotation: patternState.rotation,
        colorCount: patternState.colorCount,
        variationSeed: ++variationCounterRef.current,
      });

      const nextState: PatternState = {
        ...patternState,
        motifs: newMotifs,
        layout: nextLayout,
        style: nextStyle,
        backgroundColor: nextBg,
        activeMotifId: parsed.matchedMotifs[0] || patternState.activeMotifId,
      };

      setPatternState(nextState);
      historyRef.current?.push(nextState);
      setParseReadout(parsed.readout);
      setUnmatchedNote(parsed.unmatchedNote || null);

      trackPatternGenerated(query, nextLayout, nextStyle);
    },
    [promptText, patternState]
  );

  const handleGeneratePrompt = (textToUse?: string) => {
    confirmBeforeReplace(() => executeGeneratePrompt(textToUse));
  };

  // New Variation handler (re-seeds layout rotation/offsets)
  const executeNewVariation = useCallback(() => {
    const motifIds = Array.from(new Set(patternState.motifs.map((m) => m.motifId)));
    const activeIds = motifIds.length > 0 ? motifIds : [patternState.activeMotifId];

    const newMotifs = generatePatternLayout({
      layout: patternState.layout === 'free' ? 'scatter' : patternState.layout,
      motifIds: activeIds,
      motifSize: patternState.motifSize,
      spacing: patternState.spacing,
      rotation: patternState.rotation,
      colorCount: patternState.colorCount,
      variationSeed: ++variationCounterRef.current,
    });

    const nextState: PatternState = {
      ...patternState,
      motifs: newMotifs,
      layout: patternState.layout === 'free' ? 'scatter' : patternState.layout,
    };

    setPatternState(nextState);
    historyRef.current?.push(nextState);
    showToast('New pattern variation generated.');
    trackPatternVariation(nextState.layout, nextState.style);
  }, [patternState]);

  const handleNewVariation = () => {
    confirmBeforeReplace(executeNewVariation);
  };

  // Randomize button (picks random motif, palette, layout)
  const executeRandomize = useCallback(() => {
    const randomMotif = MOTIFS[Math.floor(Math.random() * MOTIFS.length)];
    const randomPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
    const layouts: ('half-drop' | 'brick' | 'diamond' | 'scatter' | 'grid')[] = [
      'half-drop',
      'brick',
      'diamond',
      'scatter',
      'grid',
    ];
    const randomLayout = layouts[Math.floor(Math.random() * layouts.length)];
    const randomRot = Math.floor(Math.random() * 8) * 45;

    const newMotifs = generatePatternLayout({
      layout: randomLayout,
      motifIds: [randomMotif.id],
      motifSize: 55,
      spacing: 5,
      rotation: randomRot,
      colorCount: 3,
      variationSeed: ++variationCounterRef.current,
    });

    const nextState: PatternState = {
      ...patternState,
      motifs: newMotifs,
      layout: randomLayout,
      activeMotifId: randomMotif.id,
      palette: randomPalette,
      backgroundColor: randomPalette.background,
      rotation: randomRot,
    };

    setPatternState(nextState);
    historyRef.current?.push(nextState);
    setParseReadout(`Randomized pattern with: ${randomMotif.name} in ${randomPalette.name}.`);
    setUnmatchedNote(null);
    showToast(`Randomized: ${randomMotif.name} • ${randomPalette.name}`);
  }, [patternState]);

  const handleRandomize = () => {
    confirmBeforeReplace(executeRandomize);
  };

  // Clear tile
  const handleClearTile = () => {
    const nextState: PatternState = {
      ...patternState,
      motifs: [],
      layout: 'free',
    };
    setPatternState(nextState);
    historyRef.current?.push(nextState);
    showToast('Tile cleared.');
  };

  // Palette selection handler
  const handleSelectPalette = (palette: Palette) => {
    const nextState: PatternState = {
      ...patternState,
      palette,
      backgroundColor: palette.background,
    };
    setPatternState(nextState);
    historyRef.current?.push(nextState);
    setPaletteNotice(`Applied ${palette.name} palette`);
    setTimeout(() => setPaletteNotice(null), 3000);
    trackPaletteApplied(palette.id);
  };

  // Recolour Motifs (shuffles colorIndex across placed motifs)
  const handleRecolourMotifs = () => {
    const updated = patternState.motifs.map((m) => ({
      ...m,
      colorIndex: (m.colorIndex + 1) % patternState.colorCount,
      customColor: undefined,
    }));
    updateState({ motifs: updated });
    showToast('Motifs recoloured.');
  };

  // Save Pattern to Browser localStorage (Collections support)
  const handleSavePattern = async () => {
    try {
      const { blob } = await exportTilePng(patternState, {
        size: 500,
        transparentBackground: false,
      });
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      const col = patternState.collection || 'Favorites';
      const updatedList = savePatternToStorage(patternState, dataUrl, col);
      setSavedCount(updatedList.length);
      trackPatternSavedToCollection(col);
      showToast(`Pattern saved to collection "${col}"!`);
    } catch (err) {
      console.error(err);
      showToast('Could not save pattern.');
    }
  };

  // Phase 2: Starter Gallery preset loader
  const handleLoadStarterPreset = (preset: StarterPatternPreset) => {
    setPatternState(preset.state);
    historyRef.current?.push(preset.state);
    setPromptText(preset.prompt);
    setParseReadout(`Loaded "${preset.name}" starter preset.`);
    setUnmatchedNote(null);
    trackStarterGalleryLoaded(preset.name, preset.category);
    showToast(`Loaded ${preset.name}!`);
  };

  // Phase 2: Client-side Image to Pattern
  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl) {
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        const newMotifs = generatePatternLayout({
          layout: patternState.layout === 'free' ? 'half-drop' : patternState.layout,
          motifIds: ['custom-image'],
          motifSize: patternState.motifSize || 55,
          spacing: patternState.spacing || 5,
          rotation: 0,
          colorCount: 1,
        }).map((m) => ({ ...m, imageDataUrl: dataUrl }));

        const nextState: PatternState = {
          ...patternState,
          name: `${cleanName} Seamless Pattern`,
          uploadedImageUrl: dataUrl,
          motifs: newMotifs,
        };

        setPatternState(nextState);
        historyRef.current?.push(nextState);
        trackImageToPatternUploaded(file.name, file.size);
        showToast('Image loaded! Repeating pattern generated client-side.');
      }
    };
    reader.readAsDataURL(file);
  };


  // Share Pattern link via URL hash
  const handleSharePattern = async () => {
    const hash = encodePatternToHash(patternState);
    const url = `${window.location.origin}${window.location.pathname}#${hash}`;

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      showToast('Shareable link copied to clipboard!');
      trackPatternShared();
    }
  };

  // Keyboard Shortcuts: U undo, R redo, G generate, N new variation, D download PNG
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing in an input
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable)
      ) {
        return;
      }

      const key = e.key.toLowerCase();
      if (key === 'u') {
        e.preventDefault();
        handleUndo();
      } else if (key === 'r') {
        e.preventDefault();
        handleRedo();
      } else if (key === 'g') {
        e.preventDefault();
        handleGeneratePrompt();
      } else if (key === 'n') {
        e.preventDefault();
        handleNewVariation();
      } else if (key === 'd') {
        e.preventDefault();
        // Trigger default 2000px PNG download
        exportTilePng(patternState, { size: 2000, transparentBackground: false }).then(
          ({ blob, filename }) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
            showToast('Tile PNG saved (2000x2000).');
          }
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleGeneratePrompt, handleNewVariation, patternState]);

  return (
    <div className="w-full space-y-10 selection:bg-[#D4FF3A] selection:text-[#0B0B0D]">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#0B0B0D] px-5 py-2.5 text-xs font-semibold text-white shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <Check className="h-4 w-4 text-[#D4FF3A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Phase 2: Starter Gallery of Built-in Pattern Sets */}
      <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#5846F6]" />
            <h3 className="text-sm sm:text-base font-bold text-[#0B0B0D] font-headline">
              Starter Gallery (Built-in 1-Click Sets)
            </h3>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'florals', 'geometrics', 'kids', 'festive'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setGalleryCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize transition-all shrink-0 ${
                  galleryCategory === cat
                    ? 'bg-[#5846F6] text-white shadow-xs'
                    : 'bg-[#F4F2EC] text-[#4F4E55] hover:text-[#0B0B0D]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STARTER_GALLERY.filter(
            (p) => galleryCategory === 'all' || p.category === galleryCategory
          ).map((preset) => (
            <div
              key={preset.id}
              className="rounded-2xl border border-[#0B0B0D]/10 bg-[#FAF9F5] p-3 flex flex-col justify-between hover:border-[#5846F6]/50 transition-all group"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-[#5846F6]">
                    {preset.category}
                  </span>
                  <div
                    className="h-3 w-3 rounded-full border border-black/10"
                    style={{ backgroundColor: preset.state.backgroundColor }}
                  />
                </div>
                <h4 className="text-xs font-bold text-[#0B0B0D] group-hover:text-[#5846F6] transition-colors">
                  {preset.name}
                </h4>
                <p className="text-[10px] text-[#4F4E55] line-clamp-2 leading-relaxed">
                  {preset.description}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLoadStarterPreset(preset)}
                className="mt-3 w-full py-1.5 rounded-xl bg-white border border-[#0B0B0D]/10 hover:bg-[#5846F6] hover:text-white hover:border-[#5846F6] text-[#0B0B0D] text-[11px] font-bold transition-all shadow-xs"
              >
                Load Preset
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Workspace Layout (Desktop Two-Column & Mobile Responsive Flow) */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Tile Canvas + Shortcuts on Desktop */}
        <div className="w-full lg:col-span-6 space-y-4 order-1 lg:order-1">
          {/* Phase 2: Image-to-Pattern Card */}
          <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-[#5846F6]" />
                <span className="text-xs font-bold text-[#0B0B0D] font-headline uppercase tracking-wider font-mono">
                  Image-to-Pattern (Client-Side)
                </span>
              </div>
            </div>

            <p className="text-[11px] text-[#4F4E55] leading-relaxed">
              Upload any photo or icon to seamlessly tile across layouts. 100% in-browser client-side repeat — no upload to any server, without claiming background removal.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5846F6] hover:bg-[#4735E5] text-white px-3.5 py-2 text-xs font-bold shadow-xs transition-all"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload Photo / Icon</span>
              </button>

              {patternState.uploadedImageUrl && (
                <button
                  type="button"
                  onClick={() => {
                    const fallbackMotifs = generatePatternLayout({
                      layout: 'half-drop',
                      motifIds: ['flower', 'leaf'],
                      motifSize: 55,
                      spacing: 5,
                      rotation: 25,
                      colorCount: 3,
                    });
                    updateState({ uploadedImageUrl: undefined, motifs: fallbackMotifs });
                    showToast('Cleared custom image.');
                  }}
                  className="rounded-xl border border-[#0B0B0D]/10 bg-[#F4F2EC] hover:bg-[#E5E1D6] px-3 py-2 text-xs font-medium text-[#4F4E55] hover:text-[#0B0B0D] transition-colors"
                >
                  Clear Image
                </button>
              )}
            </div>

            {/* Hidden Image Input */}
            <input
              ref={imageInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageUpload(file);
                e.target.value = '';
              }}
              className="hidden"
            />
          </div>

          <div className="flex items-center justify-between pb-1">
            <h2 className="text-base sm:text-lg font-bold text-[#0B0B0D] font-headline flex items-center gap-2">
              <span>Tile Canvas (600&times;600)</span>
            </h2>
            <span className="text-xs font-mono text-[#4F4E55]">
              Seamless boundary wrap active
            </span>
          </div>


          {/* Interactive Tile Canvas */}
          <TileCanvas
            state={patternState}
            activeTool={activeTool}
            setActiveTool={setActiveTool}
            canUndo={historyRef.current?.canUndo || false}
            canRedo={historyRef.current?.canRedo || false}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClearTile}
            onUpdateMotifs={(newMotifs) => updateState({ motifs: newMotifs })}
            onMotifPlaced={(id) => trackMotifPlaced(id, patternState.motifs.length + 1)}
          />

          {/* Keyboard Shortcuts Helper Bar */}
          <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] font-mono text-[#4F4E55] pt-1">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0B0B0D]/10 text-[#0B0B0D] font-bold">U</kbd> Undo
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0B0B0D]/10 text-[#0B0B0D] font-bold">R</kbd> Redo
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0B0B0D]/10 text-[#0B0B0D] font-bold">G</kbd> Generate
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0B0B0D]/10 text-[#0B0B0D] font-bold">N</kbd> New Variation
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-white border border-[#0B0B0D]/10 text-[#0B0B0D] font-bold">D</kbd> Download PNG
            </span>
          </div>
        </div>

        {/* Right Column: Controls in Cards on Desktop / 3rd on Mobile */}
        <div className="w-full lg:col-span-6 space-y-6 order-3 lg:order-2">
          <ControlPanel
            state={patternState}
            promptText={promptText}
            setPromptText={setPromptText}
            parseReadout={parseReadout}
            unmatchedNote={unmatchedNote}
            paletteChangeNotice={paletteNotice}
            onGeneratePrompt={handleGeneratePrompt}
            onNewVariation={handleNewVariation}
            onRandomize={handleRandomize}
            onUpdateState={updateState}
            onSelectPalette={handleSelectPalette}
            onRecolourMotifs={handleRecolourMotifs}
            onSavePattern={handleSavePattern}
            onSharePattern={handleSharePattern}
            onOpenSavedModal={() => setIsSavedModalOpen(true)}
            savedCount={savedCount}
          />
        </div>

        {/* Below Row / Mobile 2nd: Repeat Preview & Seam Verifier */}
        <div className="w-full lg:col-span-12 space-y-4 order-2 lg:order-3 pt-6 border-t border-[#0B0B0D]/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#0B0B0D] font-headline">
                Repeat Preview & Seam Check
              </h2>
              <p className="text-xs text-[#4F4E55]">
                Real-time seamless tiling. Verify edges with 3&times;3, 4&times;4, 6&times;6, or zoom right onto the corner seam.
              </p>
            </div>
          </div>

          <RepeatPreview state={patternState} />
        </div>

        {/* Below Row / Mobile 4th: Download Bar */}
        <div className="w-full lg:col-span-12 order-4 lg:order-4 pt-4">
          <DownloadBar state={patternState} showToast={showToast} />
        </div>
      </div>

      {/* Sticky Download Bar on Mobile Screens */}
      <DownloadBar state={patternState} showToast={showToast} isStickyMobile={true} />

      {/* Saved Patterns Modal */}
      <SavedPatternsModal
        isOpen={isSavedModalOpen}
        onClose={() => setIsSavedModalOpen(false)}
        savedList={getSavedPatterns()}
        onLoadPattern={(loaded) => {
          setPatternState(loaded);
          historyRef.current?.push(loaded);
          showToast(`Loaded "${loaded.name || 'Pattern'}"`);
        }}
        onDeletePattern={(id) => {
          const updated = deleteSavedPatternFromStorage(id);
          setSavedCount(updated.length);
          showToast('Pattern deleted.');
        }}
      />

      {/* Hand-Placed Motif Overwrite Confirm Modal */}
      {showOverwriteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 border border-[#0B0B0D]/10 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-[#0B0B0D] font-headline">
              Replace hand-placed motifs?
            </h4>
            <p className="text-xs text-[#4F4E55] leading-relaxed">
              Your tile currently contains hand-placed or customized motifs. Generating a new pattern will replace them.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowOverwriteConfirm(false);
                  pendingActionRef.current = null;
                }}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4F4E55] hover:bg-[#F4F2EC] transition-colors"
              >
                Keep Existing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowOverwriteConfirm(false);
                  pendingActionRef.current?.();
                  pendingActionRef.current = null;
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#5846F6] text-white hover:bg-[#4735E5] transition-colors"
              >
                Yes, Replace
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
