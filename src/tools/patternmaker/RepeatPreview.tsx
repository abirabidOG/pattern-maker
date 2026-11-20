'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Grid3X3, Grid2X2, Search, Layers } from 'lucide-react';
import type { PatternState, RepeatGridSize } from './types';
import { MOTIF_MAP } from './motifs/data';
import { renderMotifOnCanvas } from './motifs/renderMotif';
import { getWrappedMotifs, TILE_SIZE } from './engine/seamlessWrap';

interface RepeatPreviewProps {
  state: PatternState;
}

export const RepeatPreview: React.FC<RepeatPreviewProps> = ({ state }) => {
  const [repeatMode, setRepeatMode] = useState<RepeatGridSize>('3x3');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawRepeat = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Fill background
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = state.backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const wrapped = getWrappedMotifs(state.motifs);

    if (repeatMode === 'seam') {
      // Zoomed 400% corner seam inspector
      // Centers right at the corner intersection where 4 tile corners meet
      const zoom = 2.5;
      ctx.save();
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);

      // Render 2x2 tiles around the corner intersection (0, 0)
      for (const ox of [-TILE_SIZE, 0]) {
        for (const oy of [-TILE_SIZE, 0]) {
          ctx.save();
          ctx.translate(ox, oy);

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
          ctx.restore();
        }
      }

      ctx.restore();

      // Draw seam verification crosshair lines
      ctx.strokeStyle = 'rgba(88, 70, 246, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(width / 2, 0);
      ctx.lineTo(width / 2, height);
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();
      ctx.setLineDash([]);

      return;
    }

    // Grid repeats: 2x2 (sheet), 3x3, 4x4, 6x6
    const tilesPerAxis =
      repeatMode === 'sheet'
        ? 2
        : repeatMode === '3x3'
        ? 3
        : repeatMode === '4x4'
        ? 4
        : 6;

    const tileSizeOnPreview = width / tilesPerAxis;
    const scaleFactor = tileSizeOnPreview / TILE_SIZE;

    for (let ty = 0; ty < tilesPerAxis; ty++) {
      for (let tx = 0; tx < tilesPerAxis; tx++) {
        ctx.save();
        ctx.translate(tx * tileSizeOnPreview, ty * tileSizeOnPreview);
        ctx.scale(scaleFactor, scaleFactor);

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

        ctx.restore();
      }
    }
  }, [state, repeatMode]);

  useEffect(() => {
    drawRepeat();
  }, [drawRepeat]);

  return (
    <div className="space-y-4">
      {/* Repeat Grid Header Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 rounded-2xl bg-white p-2.5 border border-[#0B0B0D]/10 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setRepeatMode('3x3')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              repeatMode === '3x3'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            3×3
          </button>

          <button
            type="button"
            onClick={() => setRepeatMode('4x4')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              repeatMode === '4x4'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            4×4
          </button>

          <button
            type="button"
            onClick={() => setRepeatMode('6x6')}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              repeatMode === '6x6'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            6×6
          </button>

          <button
            type="button"
            onClick={() => setRepeatMode('sheet')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              repeatMode === 'sheet'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            <Grid2X2 className="h-3.5 w-3.5" />
            <span>2×2 Sheet</span>
          </button>

          <button
            type="button"
            onClick={() => setRepeatMode('seam')}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
              repeatMode === 'seam'
                ? 'bg-[#5846F6] text-white shadow-xs'
                : 'text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#F4F2EC]'
            }`}
          >
            <Search className="h-3.5 w-3.5" />
            <span>Check Seam</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-[#4F4E55] pr-2">
          {repeatMode === 'seam' ? 'Corner Seam (Zero Cut Lines)' : 'Seamless Repeat Preview'}
        </span>
      </div>

      {/* Repeat Canvas Container */}
      <div className="relative w-full max-w-[600px] mx-auto aspect-square rounded-3xl overflow-hidden border border-[#0B0B0D]/12 shadow-sm bg-white">
        <canvas
          ref={canvasRef}
          width={900}
          height={900}
          className="w-full h-full block"
        />

        {repeatMode === 'seam' && (
          <div className="absolute top-3 left-3 pointer-events-none px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-[#0B0B0D]/10 text-[10px] font-mono font-bold text-[#5846F6] shadow-xs">
            Crosshair = 4-Tile Junction
          </div>
        )}
      </div>
    </div>
  );
};
