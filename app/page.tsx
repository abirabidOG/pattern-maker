import type { Metadata } from 'next';
import { PatternMakerTool } from '@/tools/patternmaker/PatternMakerTool';
import { BrandIdentityCtaCard } from '@/components/BrandIdentityCtaCard';
import { ShieldCheck, Sparkles, Layers, Sliders, Download, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pattern Maker — Free Seamless Pattern Maker',
  description:
    'Make a seamless repeating pattern from a sentence or by hand. Free, no sign-up, download a 2000px PNG tile or an SVG.',
};

const FAQ_ITEMS = [
  {
    q: 'What is Pattern Maker?',
    a: 'Pattern Maker is a free web app that turns sentences into seamless repeating pattern tiles, or lets you compose them by hand using a library of 35 vector motifs. You can adjust repeat layouts (Half-drop, Brick, Grid, Diamond, Scatter), customize colors and sizes, inspect seams at 400% zoom, and download high-resolution PNG or vector SVG files.',
  },
  {
    q: 'Is it completely free? Are there any hidden fees or watermarks?',
    a: 'Pattern Maker is 100% free forever. There are no subscriptions, credits, paywalls, watermarks, or locked motifs. Every feature, preset palette, and export option is available to everyone without limitation.',
  },
  {
    q: 'Are my patterns and images private?',
    a: 'Yes, completely private. All pattern generation, canvas editing, and file rendering happen 100% client-side in your browser. No image data or prompt text is ever transmitted to a server or external database.',
  },
  {
    q: 'How does the seamless repeat guarantee work?',
    a: 'When motifs overlap the boundary of the square tile canvas, the pattern engine automatically calculates their exact coordinate offsets and draws wrapping copies on the opposite edges and corners. This ensures that when the tile is repeated horizontally and vertically, all shapes align seamlessly without visible seams or cut lines.',
  },
  {
    q: 'What formats and resolutions can I download?',
    a: 'You can export high-resolution PNG tiles at 500px, 1000px, 2000px (standard print-ready), and 3000px (ultra high-res), with optional transparent backgrounds. You can also download resolution-independent vector SVG tiles, full 3000x3000px pattern preview sheets, or copy the active 5-swatch color palette.',
  },
  {
    q: 'Can I use patterns created here for commercial products?',
    a: 'Yes. Any patterns you generate or build with Pattern Maker are completely yours to use for commercial packaging, textiles, apparel, digital backgrounds, branding, web design, or personal projects.',
  },
  {
    q: 'How does the "Describe a pattern" box work?',
    a: 'The describe box uses an honest, deterministic rule-based parser in JavaScript that extracts motif keywords (e.g., flowers, leaves, stars, hearts, suns) and background colors from your sentence. It does not send your prompt to an external AI server and never claims artificial intelligence; it transparently reports which motifs were recognized and placed on the tile.',
  },
];

export default function HomePage() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <div className="mx-auto max-w-[1400px] px-3 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">
      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Hero Headline Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto pt-2 sm:pt-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#0B0B0D]/10 bg-white/80 px-4 py-1.5 text-xs font-semibold text-[#0B0B0D] shadow-xs backdrop-blur-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#D4FF3A] ring-2 ring-[#0B0B0D]/20 animate-pulse" />
          <span>100% Free &bull; Zero Sign-Up &bull; Infinite Vector &amp; High-Res PNG</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-[#0B0B0D] font-headline">
          Pattern Maker
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-[#4F4E55] leading-relaxed">
          Describe a pattern, or build it by hand. Free, unlimited, yours to keep.
        </p>

        <div className="inline-flex items-center gap-2 text-xs font-mono text-[#4F4E55] bg-[#0B0B0D]/5 rounded-full px-3.5 py-1">
          <ShieldCheck className="h-3.5 w-3.5 text-[#5846F6]" />
          <span>100% client-side. Patterns are generated in your browser and never uploaded.</span>
        </div>
      </section>

      {/* Master Interactive Tool */}
      <section className="relative">
        <PatternMakerTool />
      </section>

      {/* How It Works Section */}
      <section className="space-y-8 pt-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B0B0D] font-headline">
            How Pattern Maker Works
          </h2>
          <p className="text-sm text-[#4F4E55]">
            From a single sentence to production-ready repeating tiles in seconds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5846F6]/10 text-[#5846F6]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0B0B0D] font-headline">
              1. Describe or Pick Motifs
            </h3>
            <p className="text-sm text-[#4F4E55] leading-relaxed">
              Type natural ideas like <em>&ldquo;Pink flowers and green leaves on cream&rdquo;</em>, click sample chips, or hand-place shapes from the 35 curated vector motif library.
            </p>
          </div>

          <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#D4FF3A]/40 text-[#0B0B0D]">
              <Sliders className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0B0B0D] font-headline">
              2. Tweak Layout &amp; Style
            </h3>
            <p className="text-sm text-[#4F4E55] leading-relaxed">
              Switch between Half-drop, Brick, Scatter, Diamond, or Grid layouts. Fine-tune scale, spacing density, rotation jitter, and 5 distinct design styles.
            </p>
          </div>

          <div className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#5846F6]/10 text-[#5846F6]">
              <Download className="h-5 w-5" />
            </div>
            <h3 className="font-bold text-lg text-[#0B0B0D] font-headline">
              3. Preview &amp; Export
            </h3>
            <p className="text-sm text-[#4F4E55] leading-relaxed">
              Inspect seam continuity at 400% corner zoom. Download seamless tiles up to 3000px PNG, vector SVG with repeating code, or a 3000px pattern sheet.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-10 space-y-6 shadow-xs">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-[#0B0B0D] font-headline">
            Engineered for Designers, Illustrators &amp; Makers
          </h2>
          <p className="text-sm text-[#4F4E55]">
            Pure client-side geometry algorithms ensure true mathematical repeatability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">Mathematical Edge Wrapping</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                Motifs that exceed tile boundaries wrap automatically to the opposite edge and corner coordinates, eliminating seam gaps.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">35 Original Vector Motifs</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                Botanicals, florals, celestial stars, animals, foods, and geometric primitives rendered with clean SVG path vectors.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">5 Aesthetic Styles</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                Transform any motif instantly into Flat Vector, Geometric, Kids, Vintage, or Minimal silhouettes.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">8 Curated Color Palettes</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                Harmonious 5-color palettes (Meadow, Ocean, Berry, Forest, Candy, Earth, Mono ink, Night) with custom recolor tools.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">High-Res Print Exports</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                Export 500px, 1000px, 2000px, or 3000px PNG tiles with optional transparency, plus clean vector SVG files.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-[#5846F6] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-[#0B0B0D]">Zero Sign-Up or Tracking</h4>
              <p className="text-xs text-[#4F4E55] leading-relaxed">
                No accounts, no cookies, no tracking pixels, and no cloud uploads. Save patterns to your browser or share via URL hash.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#0B0B0D] font-headline">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-[#4F4E55]">
            Everything you need to know about Pattern Maker and repeating tile exports.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 space-y-2.5 transition-all duration-300 hover:border-[#0B0B0D]/20 hover:shadow-xs"
            >
              <h3 className="font-bold text-sm sm:text-base text-[#0B0B0D] font-headline">
                {item.q}
              </h3>
              <p className="text-xs sm:text-sm text-[#4F4E55] leading-relaxed">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Identity Card */}
      <section className="pb-8">
        <BrandIdentityCtaCard />
      </section>
    </div>
  );
}
