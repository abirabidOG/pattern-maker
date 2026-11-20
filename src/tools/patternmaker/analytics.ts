declare global {
  interface Window {
    gtag?: (
      command: 'event' | 'config' | 'js',
      action: string,
      params?: Record<string, any>
    ) => void;
  }
}

function sendEvent(eventName: string, params?: Record<string, any>) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
}

export function trackPatternGenerated(prompt: string, layout: string, style: string) {
  sendEvent('pattern_generated', {
    prompt_text: prompt,
    layout_mode: layout,
    style_mode: style,
  });
}

export function trackPatternVariation(layout: string, style: string) {
  sendEvent('pattern_variation', {
    layout_mode: layout,
    style_mode: style,
  });
}

export function trackMotifPlaced(motifId: string, totalMotifs: number) {
  sendEvent('motif_placed', {
    motif_id: motifId,
    motif_count: totalMotifs,
  });
}

// Key Event
export function trackPatternDownloadedPng(resolution: number, transparent: boolean) {
  sendEvent('pattern_downloaded_png', {
    resolution,
    is_transparent: transparent,
    event_category: 'key_event',
  });
}

// Key Event
export function trackPatternDownloadedSvg() {
  sendEvent('pattern_downloaded_svg', {
    event_category: 'key_event',
  });
}

export function trackPatternSheetDownloaded() {
  sendEvent('pattern_sheet_downloaded', {
    dimensions: '3000x3000',
  });
}

export function trackPatternShared() {
  sendEvent('pattern_shared');
}

export function trackPaletteApplied(paletteId: string) {
  sendEvent('palette_applied', {
    palette_id: paletteId,
  });
}
