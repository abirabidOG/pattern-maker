import type { Metadata } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pattern Maker — Free Seamless Pattern Maker',
  description:
    'Make a seamless repeating pattern from a sentence or by hand. Free, no sign-up, download a 2000px PNG tile or an SVG.',
  metadataBase: new URL('https://tools.abidmahmud.cv'),
  alternates: {
    canonical: '/pattern-maker',
  },
  openGraph: {
    title: 'Pattern Maker — Free Seamless Pattern Maker',
    description:
      'Make a seamless repeating pattern from a sentence or by hand. Free, no sign-up, download a 2000px PNG tile or an SVG.',
    url: 'https://tools.abidmahmud.cv/pattern-maker',
    siteName: 'Abid Mahmud Tools',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${interTight.variable}`}>
      <head>
        {/* Google Analytics 4 */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-ZF1FSM8N07"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-ZF1FSM8N07', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F4F2EC] text-[#0B0B0D] selection:bg-[#D4FF3A] selection:text-[#0B0B0D]">
        {/* Floating Translucent Header */}
        <header className="fixed top-3 md:top-4 left-3 right-3 md:left-0 md:right-0 md:mx-auto z-50 flex h-16 md:w-[min(1400px,calc(100%-2rem))] max-w-[1400px] items-center justify-between rounded-full border border-[#0B0B0D]/10 bg-white/85 backdrop-blur-md px-4 sm:px-6 md:px-8 shadow-sm">
          <a
            href="https://tools.abidmahmud.cv"
            className="flex items-center gap-2.5 text-[#0B0B0D] font-bold text-lg hover:opacity-85 transition-opacity"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#5846F6] text-white text-xs font-mono font-bold shadow-xs">
              PM
            </span>
            <span className="tracking-tight font-headline">Pattern Maker</span>
          </a>

          <nav className="flex items-center gap-1.5 sm:gap-2">
            <a
              href="https://tools.abidmahmud.cv"
              className="rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#0B0B0D]/5 transition-colors"
            >
              ← All Tools
            </a>
            <a
              href="https://tools.abidmahmud.cv/linetrace"
              className="hidden sm:inline-flex rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#0B0B0D]/5 transition-colors"
            >
              LineTrace
            </a>
            <a
              href="https://tools.abidmahmud.cv/svg-optimizer"
              className="hidden md:inline-flex rounded-full px-3 py-1.5 text-xs sm:text-sm font-medium text-[#4F4E55] hover:text-[#0B0B0D] hover:bg-[#0B0B0D]/5 transition-colors"
            >
              SVG Optimizer
            </a>
            <a
              href="https://www.abidmahmud.cv"
              className="inline-flex items-center rounded-full bg-[#0B0B0D] text-white px-3.5 py-1.5 text-xs sm:text-sm font-medium hover:bg-[#5846F6] transition-colors shadow-xs"
            >
              Portfolio &rarr;
            </a>
          </nav>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 pt-24 pb-16">{children}</main>

        {/* Global Footer */}
        <footer className="border-t border-[#0B0B0D]/10 bg-white py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#0B0B0D]">
                  Pattern Maker &mdash; Free Seamless Pattern Maker
                </p>
                <p className="text-xs text-[#4F4E55]">
                  Free, unlimited, no sign-up. Patterns you make are yours.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-[#4F4E55]">
                <a
                  href="https://tools.abidmahmud.cv"
                  className="hover:text-[#5846F6] transition-colors"
                >
                  All Tools
                </a>
                <span>&bull;</span>
                <a
                  href="https://tools.abidmahmud.cv/linetrace"
                  className="hover:text-[#5846F6] transition-colors"
                >
                  LineTrace
                </a>
                <span>&bull;</span>
                <a
                  href="https://tools.abidmahmud.cv/svg-optimizer"
                  className="hover:text-[#5846F6] transition-colors"
                >
                  SVG Optimizer
                </a>
                <span>&bull;</span>
                <a
                  href="https://tools.abidmahmud.cv/webptools"
                  className="hover:text-[#5846F6] transition-colors"
                >
                  WEBPTools
                </a>
                <span>&bull;</span>
                <a
                  href="https://www.abidmahmud.cv"
                  className="hover:text-[#5846F6] transition-colors font-semibold text-[#0B0B0D]"
                >
                  Abid Mahmud Portfolio
                </a>
              </div>
            </div>
            <div className="border-t border-[#0B0B0D]/5 pt-4 text-center text-[11px] text-[#4F4E55]">
              Designed & developed with grid restraint by Abid Mahmud. 100% in-browser Canvas & SVG generation.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
