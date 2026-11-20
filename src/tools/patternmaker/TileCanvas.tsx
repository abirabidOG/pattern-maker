'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  MousePointer,
  Move,
  Trash2,
  Undo2,
  Redo2,
  RotateCcw,
  PlusCircle,
} from 'lucide-react';
import type { PatternState, EditorTool, PlacedMotif } from './types';
import { MOTIF_MAP } from './motifs/data';
import { renderMotifOnCanvas } from './motifs/renderMotif';
import { getWrappedMotifs, TILE_SIZE } from './engine/seamlessWrap';

interface TileCanvasProps {
  state: PatternState;
  activeTool: EditorTool;
  setActiveTool: (tool: EditorTool) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onUpdateMotifs: (motifs: PlacedMotif[]) => void;
  onMotifPlaced?: (motifId: string) => void;
}

export const TileCanvas: React.FC<TileCanvasProps> = ({
  state,
  activeTool,
  setActiveTool,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClear,
  onUpdateMotifs,
  onMotifPlaced,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedMotifIndex, setSelectedMotifIndex] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Redraw canvas whenever state changes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear and fill background
    ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Subtle edge guideline grid
    ctx.strokeStyle = 'rgba(11, 11, 13, 0.06)';
    ctx.lineWidth = 1;
    ctx.strokeRect(0, 0, TILE_SIZE, TILE_SIZE);

    // Render all edge-wrapped motifs
    const wrapped = getWrappedMotifs(state.motifs);

    for (const item of wrapped) {
      const motifDef = MOTIF_MAP.get(item.motif.motifId);
      if (!motifDef) continue;

      const color =
        item.motif.customColor ||
        state.palette.motifColors[
          item.motif.colorIndex % state.palette.motifColors.length
        ];

      renderMotifOnCanvas(
        ctx,
        motifDef,
        state.style,
        color,
        item.renderX,
        item.renderY,
        item.motif.scale,
        item.motif.rotation,
        item.motif.flipH,
        item.motif.flipV
      );
    }
  }, [state]);

  useEffect(() => {
    redraw();
  }, [redraw]);

  // Coordinate helper: translates pointer event to 600x600 tile coordinates
  const getCanvasCoords = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scale = TILE_SIZE / rect.width;
    const x = Math.max(0, Math.min(TILE_SIZE, (clientX - rect.left) * scale));
    const y = Math.max(0, Math.min(TILE_SIZE, (clientY - rect.top) * scale));
    return { x, y };
  };

  // Find topmost motif under coordinate
  const findMotifAt = (x: number, y: number): number => {
    for (let i = state.motifs.length - 1; i >= 0; i--) {
      const m = state.motifs[i];
      const radius = Math.max(20, (m.scale / 100) * 45);
      const dist = Math.hypot(m.x - x, m.y - y);
      if (dist <= radius) {
        return i;
      }
    }
    return -1;
  };

  // Canvas interaction handlers
  const handlePointerDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasCoords(e);

    if (activeTool === 'place') {
      const newMotif: PlacedMotif = {
        id: `placed-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        motifId: state.activeMotifId || 'flower',
        x: Math.round(x),
        y: Math.round(y),
        scale: state.motifSize,
        rotation: state.rotation,
        flipH: false,
        flipV: false,
        colorIndex: state.motifs.length % state.colorCount,
        isHandPlaced: true,
      };
      onUpdateMotifs([...state.motifs, newMotif]);
      onMotifPlaced?.(newMotif.motifId);
    } else if (activeTool === 'erase') {
      const hitIndex = findMotifAt(x, y);
      if (hitIndex !== -1) {
        const updated = [...state.motifs];
        updated.splice(hitIndex, 1);
        onUpdateMotifs(updated);
      }
    } else if (activeTool === 'move') {
      const hitIndex = findMotifAt(x, y);
      if (hitIndex !== -1) {
        setSelectedMotifIndex(hitIndex);
        setIsDragging(true);
        setDragOffset({
          x: x - state.motifs[hitIndex].x,
          y: y - state.motifs[hitIndex].y,
        });
      } else {
        setSelectedMotifIndex(null);
      }
    }
  };

  const handlePointerMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || selectedMotifIndex === null || activeTool !== 'move') return;
    const { x, y } = getCanvasCoords(e);
    const updated = [...state.motifs];
    const target = { ...updated[selectedMotifIndex] };
    target.x = Math.round(Math.max(0, Math.min(TILE_SIZE, x - dragOffset.x)));
    target.y = Math.round(Math.max(0, Math.min(TILE_SIZE, y - dragOffset.y)));
    target.isHandPlaced = true;
    updated[selectedMotifIndex] = target;
    onUpdateMotifs(updated);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  return (
    <div className="space-y-4">
      {/* Tile Canvas Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-white p-2.5 border border-[#0B0B0D]/10 shadow-xs">
        {/* Mode Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTool('place')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTool === 'place'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Place</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('move')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTool === 'move'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            <Move className="h-3.5 w-3.5" />
            <span>Move</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTool('erase')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              activeTool === 'erase'
                ? 'bg-[#E4572E] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Erase</span>
          </button>
        </div>

        {/* History & Clear Actions */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (U)"
            className="p-1.5 rounded-full border border-[#0B0B0D]/10 text-[#0B0B0D] hover:bg-[#F4F2EC] disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (R)"
            className="p-1.5 rounded-full border border-[#0B0B0D]/10 text-[#0B0B0D] hover:bg-[#F4F2EC] disabled:opacity-30 disabled:pointer-events-none transition-all"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors ml-1"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear Tile</span>
          </button>
        </div>
      </div>

      {/* 600px Tile Canvas Stage */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[600px] mx-auto aspect-square rounded-3xl overflow-hidden border border-[#0B0B0D]/12 shadow-sm bg-white"
      >
        <canvas
          ref={canvasRef}
          width={TILE_SIZE}
          height={TILE_SIZE}
          onMouseDown={handlePointerDown}
          onMouseMove={handlePointerMove}
          onMouseUp={handlePointerUp}
          onMouseLeave={handlePointerUp}
          className={`w-full h-full block ${
            activeTool === 'place'
              ? 'cursor-crosshair'
              : activeTool === 'move'
              ? isDragging
                ? 'cursor-grabbing'
                : 'cursor-grab'
              : 'cursor-pointer'
          }`}
        />

        {/* Floating Tool Indicator Badge */}
        <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#0B0B0D]/10 text-[10px] font-mono uppercase font-bold text-[#4F4E55] shadow-xs">
          Mode: <span className="text-[#5846F6]">{activeTool}</span>
        </div>

        {/* Motif Count Badge */}
        <div className="absolute bottom-3 right-3 pointer-events-none px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#0B0B0D]/10 text-[10px] font-mono font-bold text-[#4F4E55] shadow-xs">
          {state.motifs.length} motifs
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 border border-[#0B0B0D]/10 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-[#0B0B0D] font-headline">
              Clear entire tile?
            </h4>
            <p className="text-xs text-[#4F4E55] leading-relaxed">
              This will remove all motifs currently placed on the tile. You can still undo this action.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-full text-xs font-semibold text-[#4F4E55] hover:bg-[#F4F2EC] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-full text-xs font-bold bg-[#E4572E] text-white hover:bg-[#c9401e] transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
