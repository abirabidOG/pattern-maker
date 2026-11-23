import type { MotifDefinition, StyleMode } from '../types';

// Cache Path2D objects for high performance 60fps rendering
const path2dCache = new Map<string, Path2D>();

function getPath2D(d: string): Path2D {
  let p = path2dCache.get(d);
  if (!p) {
    p = new Path2D(d);
    path2dCache.set(d, p);
  }
  return p;
}

/**
 * Renders a single motif instance onto an HTML5 2D Canvas context
 */
export function renderMotifOnCanvas(
  ctx: CanvasRenderingContext2D,
  motif: MotifDefinition,
  style: StyleMode,
  color: string,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): void {
  ctx.save();
  ctx.translate(x, y);

  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }

  const sx = (flipH ? -1 : 1) * (scale / 100);
  const sy = (flipV ? -1 : 1) * (scale / 100);
  ctx.scale(sx, sy);

  // Motifs are designed centered around (50, 50) in a 100x100 box
  ctx.translate(-50, -50);

  for (const pathObj of motif.paths) {
    const p2d = getPath2D(pathObj.d);

    if (style === 'minimal') {
      // Minimal: fine strokes, no heavy fills
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.5, (pathObj.strokeWidth || 3) * 0.9);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(p2d);
    } else if (style === 'kids') {
      // Kids: chunky bold outline with playful round joins and vibrant fill
      if (!pathObj.strokeOnly) {
        ctx.fillStyle = color;
        ctx.fill(p2d, pathObj.fillRule || 'nonzero');
      }
      ctx.strokeStyle = '#0B0B0D';
      ctx.lineWidth = 4;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(p2d);
    } else if (style === 'geometric') {
      // Geometric: crisp fills with fine mathematical framing line
      if (!pathObj.strokeOnly) {
        ctx.fillStyle = color;
        ctx.fill(p2d, pathObj.fillRule || 'nonzero');
      }
      ctx.strokeStyle = '#0B0B0D';
      ctx.lineWidth = 1.8;
      ctx.lineCap = 'butt';
      ctx.lineJoin = 'miter';
      ctx.stroke(p2d);
    } else if (style === 'vintage') {
      // Vintage: rich fill with engraved dual contour
      if (!pathObj.strokeOnly) {
        ctx.fillStyle = color;
        ctx.fill(p2d, pathObj.fillRule || 'nonzero');
      }
      ctx.strokeStyle = '#2b2b2b';
      ctx.lineWidth = 1.2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke(p2d);
    } else {
      // Flat Vector (default): clean pure solid fill or stroke
      if (pathObj.strokeOnly) {
        ctx.strokeStyle = color;
        ctx.lineWidth = pathObj.strokeWidth || 4;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke(p2d);
      } else {
        ctx.fillStyle = color;
        ctx.fill(p2d, pathObj.fillRule || 'nonzero');
      }
    }
  }

  ctx.restore();
}

/**
 * Serializes a single motif instance to an SVG <g> element matching canvas rendering
 */
export function renderMotifToSvg(
  motif: MotifDefinition,
  style: StyleMode,
  color: string,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): string {
  const sx = (flipH ? -1 : 1) * +(scale / 100).toFixed(4);
  const sy = (flipV ? -1 : 1) * +(scale / 100).toFixed(4);

  let transform = `translate(${x.toFixed(2)}, ${y.toFixed(2)})`;
  if (rotation !== 0) {
    transform += ` rotate(${rotation.toFixed(2)})`;
  }
  transform += ` scale(${sx}, ${sy}) translate(-50, -50)`;

  const pathElements = motif.paths.map((pathObj) => {
    let fill = 'none';
    let stroke = 'none';
    let strokeWidth = 0;
    let strokeLineCap = 'round';
    let strokeLineJoin = 'round';

    if (style === 'minimal') {
      fill = 'none';
      stroke = color;
      strokeWidth = Math.max(1.5, (pathObj.strokeWidth || 3) * 0.9);
    } else if (style === 'kids') {
      fill = pathObj.strokeOnly ? 'none' : color;
      stroke = '#0B0B0D';
      strokeWidth = 4;
    } else if (style === 'geometric') {
      fill = pathObj.strokeOnly ? 'none' : color;
      stroke = '#0B0B0D';
      strokeWidth = 1.8;
      strokeLineCap = 'butt';
      strokeLineJoin = 'miter';
    } else if (style === 'vintage') {
      fill = pathObj.strokeOnly ? 'none' : color;
      stroke = '#2b2b2b';
      strokeWidth = 1.2;
    } else {
      // Flat
      if (pathObj.strokeOnly) {
        fill = 'none';
        stroke = color;
        strokeWidth = pathObj.strokeWidth || 4;
      } else {
        fill = color;
        stroke = 'none';
      }
    }

    const fillRuleAttr = pathObj.fillRule ? ` fill-rule="${pathObj.fillRule}"` : '';
    const strokeAttrs =
      stroke !== 'none'
        ? ` stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="${strokeLineCap}" stroke-linejoin="${strokeLineJoin}"`
        : '';

    return `<path d="${pathObj.d}" fill="${fill}"${fillRuleAttr}${strokeAttrs}/>`;
  });

  return `<g transform="${transform}">${pathElements.join('')}</g>`;
}

// Phase 2: Client-side Image-to-Pattern helpers
const imageElementCache = new Map<string, HTMLImageElement>();

export function getCachedImage(url: string, onLoaded?: () => void): HTMLImageElement {
  let img = imageElementCache.get(url);
  if (!img) {
    img = new Image();
    img.crossOrigin = 'anonymous';
    if (onLoaded) {
      img.onload = onLoaded;
    }
    img.src = url;
    imageElementCache.set(url, img);
  }
  return img;
}

export function renderImageMotifOnCanvas(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): void {
  ctx.save();
  ctx.translate(x, y);
  if (rotation !== 0) {
    ctx.rotate((rotation * Math.PI) / 180);
  }
  const sx = (flipH ? -1 : 1) * (scale / 100);
  const sy = (flipV ? -1 : 1) * (scale / 100);
  ctx.scale(sx, sy);
  const aspect = img.naturalHeight / (img.naturalWidth || 1);
  const w = 100;
  const h = 100 * aspect;
  ctx.drawImage(img, -w / 2, -h / 2, w, h);
  ctx.restore();
}

export function renderImageMotifToSvg(
  imageUrl: string,
  x: number,
  y: number,
  scale: number,
  rotation: number,
  flipH: boolean,
  flipV: boolean
): string {
  const sx = (flipH ? -1 : 1) * +(scale / 100).toFixed(4);
  const sy = (flipV ? -1 : 1) * +(scale / 100).toFixed(4);
  let transform = `translate(${x.toFixed(2)}, ${y.toFixed(2)})`;
  if (rotation !== 0) {
    transform += ` rotate(${rotation.toFixed(2)})`;
  }
  transform += ` scale(${sx}, ${sy}) translate(-50, -50)`;
  return `<g transform="${transform}"><image href="${imageUrl}" width="100" height="100" preserveAspectRatio="xMidYMid meet"/></g>`;
}

