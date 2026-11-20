import type { FC } from 'react';

interface BrandIdentityCtaCardProps {
  className?: string;
}

export const BrandIdentityCtaCard: FC<BrandIdentityCtaCardProps> = ({
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl border border-[#0B0B0D]/10 bg-white p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-300 hover:border-[#0B0B0D]/20 hover:shadow-md ${className}`}
    >
      <div className="space-y-1 text-center sm:text-left">
        <h4 className="text-base sm:text-lg font-bold text-[#0B0B0D] font-headline">
          Need a full brand identity? See Abid Mahmud&apos;s work
        </h4>
        <p className="text-xs sm:text-sm text-[#4F4E55]">
          Logos, vector systems, packaging, and digital identities crafted with mathematical grid restraint.
        </p>
      </div>
      <a
        href="https://www.abidmahmud.cv"
        className="inline-flex items-center justify-center rounded-full bg-[#0B0B0D] hover:bg-[#5846F6] text-white px-6 py-3 text-xs sm:text-sm font-bold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 shadow-sm shrink-0"
      >
        Explore Portfolio &rarr;
      </a>
    </div>
  );
};
