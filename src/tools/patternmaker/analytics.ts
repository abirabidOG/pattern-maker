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

// Phase 2 GA4 events
export function trackImageToPatternUploaded(filename: string, sizeBytes: number) {
  sendEvent('image_to_pattern_uploaded', {
    filename,
    size_bytes: sizeBytes,
    tool: 'pattern-maker',
  });
}

export function trackCollectionCreated(collectionName: string) {
  sendEvent('collection_created', {
    collection_name: collectionName,
    tool: 'pattern-maker',
  });
}

export function trackPatternSavedToCollection(collectionName: string) {
  sendEvent('pattern_saved_to_collection', {
    collection_name: collectionName,
    tool: 'pattern-maker',
  });
}

export function trackPrintSheetDownloaded() {
  sendEvent('print_sheet_300dpi_downloaded', {
    dimensions: '2625x3375',
    dpi: 300,
    has_bleed: true,
    safe_margin: '1 inch',
    tool: 'pattern-maker',
  });
}

export function trackStarterGalleryLoaded(presetName: string, category: string) {
  sendEvent('starter_gallery_loaded', {
    preset_name: presetName,
    category,
    tool: 'pattern-maker',
  });
}

export function trackCssBackgroundCopied() {
  sendEvent('css_background_copied', {
    tool: 'pattern-maker',
  });
}

