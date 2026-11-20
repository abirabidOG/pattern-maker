'use client';

import React, { useState } from 'react';
import {
  Download,
  FileCode,
  Layers,
  Copy,
  FileText,
  Check,
  Sparkles,
} from 'lucide-react';
import type { PatternState } from './types';
import { exportTilePng } from './export/exportPng';
import { exportTileSvg } from './export/exportSvg';
import { exportPatternSheetPng } from './export/exportSheet';
import { copyPaletteHex, downloadPaletteTxt } from './export/exportPalette';
import {
  trackPatternDownloadedPng,
  trackPatternDownloadedSvg,
  trackPatternSheetDownloaded,
} from './analytics';

interface DownloadBarProps {
  state: PatternState;
  showToast: (msg: string) => void;
  isStickyMobile?: boolean;
}

export const DownloadBar: React.FC<DownloadBarProps> = ({
  state,
  showToast,
  isStickyMobile = false,
}) => {
  const [pngResolution, setPngResolution] = useState<500 | 1000 | 2000 | 3000>(2000);
  const [transparentBg, setTransparentBg] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // Download helper: triggers browser download from Blob
  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadPng = async () => {
    setIsExporting(true);
    try {
      const { blob, filename, sizeText } = await exportTilePng(state, {
        size: pngResolution,
        transparentBackground: transparentBg,
      });
      triggerDownload(blob, filename);
      trackPatternDownloadedPng(pngResolution, transparentBg);
      showToast(`Tile PNG saved (${sizeText}).`);
    } catch (err: any) {
      console.error(err);
      showToast('Error exporting PNG.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadSvg = () => {
    try {
      const { svgContent, filename } = exportTileSvg(state, transparentBg);
      const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
      triggerDownload(blob, filename);
      trackPatternDownloadedSvg();
      showToast('Tile SVG saved (Scalable Vector).');
    } catch (err: any) {
      console.error(err);
      showToast('Error exporting SVG.');
    }
  };

  const handleDownloadSheet = async () => {
    setIsExporting(true);
    try {
      const { blob, filename } = await exportPatternSheetPng(state);
      triggerDownload(blob, filename);
      trackPatternSheetDownloaded();
      showToast('Pattern sheet saved (3000x3000px).');
    } catch (err: any) {
      console.error(err);
      showToast('Error generating pattern sheet.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyPaletteHex = async () => {
    await copyPaletteHex(state.palette, state.backgroundColor);
    showToast('Palette HEX codes copied to clipboard.');
  };

  const handleDownloadPaletteTxt = () => {
    downloadPaletteTxt(state.palette, state.backgroundColor);
    showToast('Palette TXT file saved.');
  };

  if (isStickyMobile) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#0B0B0D]/10 p-3 flex items-center justify-between gap-2 shadow-lg sm:hidden">
        <button
          type="button"
          onClick={handleDownloadPng}
          disabled={isExporting}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-[#5846F6] text-white py-2.5 text-xs font-bold shadow-xs active:scale-95 transition-all"
        >
          <Download className="h-4 w-4" />
          <span>Download Tile (PNG)</span>
        </button>

        <button
          type="button"
          onClick={handleDownloadSvg}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white py-2.5 px-3 text-xs font-bold text-[#0B0B0D] active:scale-95 transition-all"
        >
          <FileCode className="h-4 w-4 text-[#5846F6]" />
          <span>SVG</span>
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-8 shadow-xs space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-bold text-[#0B0B0D] font-headline">
            Export & Downloads
          </h3>
          <p className="text-xs text-[#4F4E55]">
            100% Free &bull; No watermark &bull; Full commercial & personal rights
          </p>
        </div>

        {/* Transparent Background Toggle */}
        <label className="inline-flex items-center gap-2 cursor-pointer text-xs font-semibold text-[#0B0B0D] select-none">
          <input
            type="checkbox"
            checked={transparentBg}
            onChange={(e) => setTransparentBg(e.target.checked)}
            className="rounded border-[#0B0B0D]/20 text-[#5846F6] focus:ring-[#5846F6] h-4 w-4"
          />
          <span>Transparent Background</span>
        </label>
      </div>

      {/* Main Download Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Tile PNG with resolution selector */}
        <div className="rounded-2xl border border-[#0B0B0D]/10 bg-[#F4F2EC]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0B0B0D] font-mono block">
              Tile PNG
            </span>
            <p className="text-[11px] text-[#4F4E55]">
              Seamless repeatable tile at high resolution
            </p>
          </div>

          <div className="space-y-3">
            {/* Resolution Selector: 500, 1000, 2000, 3000 */}
            <div className="grid grid-cols-4 gap-1">
              {([500, 1000, 2000, 3000] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setPngResolution(res)}
                  className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all ${
                    pngResolution === res
                      ? 'bg-[#5846F6] text-white'
                      : 'bg-white border border-[#0B0B0D]/10 text-[#4F4E55] hover:text-[#0B0B0D]'
                  }`}
                >
                  {res}px
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={isExporting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#5846F6] hover:bg-[#4735E5] text-white py-2.5 text-xs font-bold shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="h-4 w-4" />
              <span>Download {pngResolution}px PNG</span>
            </button>
          </div>
        </div>

        {/* 2. Scalable Vector SVG */}
        <div className="rounded-2xl border border-[#0B0B0D]/10 bg-[#F4F2EC]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0B0B0D] font-mono block">
              Vector Tile SVG
            </span>
            <p className="text-[11px] text-[#4F4E55]">
              Pure resolution-independent SVG with &lt;pattern&gt; definition
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-[#0B0B0D] hover:bg-[#5846F6] text-white py-2.5 text-xs font-bold shadow-xs transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <FileCode className="h-4 w-4 text-[#D4FF3A]" />
            <span>Download Tile SVG</span>
          </button>
        </div>

        {/* 3. High-Res 3000x3000px Repeat Sheet */}
        <div className="rounded-2xl border border-[#0B0B0D]/10 bg-[#F4F2EC]/40 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="font-bold text-xs uppercase tracking-wider text-[#0B0B0D] font-mono block">
              Pattern Sheet PNG
            </span>
            <p className="text-[11px] text-[#4F4E55]">
              Ready-to-print 3000x3000px composite wallpaper sheet
            </p>
          </div>

          <button
            type="button"
            onClick={handleDownloadSheet}
            disabled={isExporting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] text-[#0B0B0D] py-2.5 text-xs font-bold transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            <Layers className="h-4 w-4 text-[#5846F6]" />
            <span>Download Sheet (3000px)</span>
          </button>
        </div>
      </div>

      {/* Palette Export Row */}
      <div className="pt-2 border-t border-[#0B0B0D]/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="text-[#4F4E55]">
          Need the colors for design work?
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyPaletteHex}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] px-3.5 py-1.5 font-bold text-[#0B0B0D] transition-colors"
          >
            <Copy className="h-3.5 w-3.5 text-[#5846F6]" />
            <span>Copy HEX Codes</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadPaletteTxt}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#0B0B0D]/15 bg-white hover:bg-[#F4F2EC] px-3.5 py-1.5 font-bold text-[#0B0B0D] transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            <span>Download Palette TXT</span>
          </button>
        </div>
      </div>
    </div>
  );
};
