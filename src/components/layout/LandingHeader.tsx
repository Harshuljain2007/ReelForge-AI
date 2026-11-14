import {Menu, X} from 'lucide-react';
import React, {useState} from 'react';

interface LandingHeaderProps {
  onOpenStudio: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({onOpenStudio}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0B0C0E]/90 backdrop-blur-md border-b border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element, one line) */}
        <a
          href="#top"
          className="font-display text-lg font-bold tracking-tight text-[#F4F5F7] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B8FF2E] rounded"
        >
          ReelForge AI
        </a>

        {/* Zone 2: 4 concise single-line text links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#A1A7B3]"
        >
          <a
            href="#workflow"
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            Workflow
          </a>
          <a
            href="#studio"
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            Studio
          </a>
          <a
            href="#showcase"
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            Showcase
          </a>
          <a
            href="#pricing"
            className="hover:text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0"
          >
            Pricing
          </a>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenStudio}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            Open Studio
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="md:hidden p-2 rounded-lg text-[#A1A7B3] hover:text-[#F4F5F7] hover:bg-white/[0.06] cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/[0.08] bg-[#0B0C0E] px-6 py-4 space-y-3">
          <a
            href="#workflow"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#A1A7B3] hover:text-[#F4F5F7]"
          >
            Workflow
          </a>
          <a
            href="#studio"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#A1A7B3] hover:text-[#F4F5F7]"
          >
            Studio
          </a>
          <a
            href="#showcase"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#A1A7B3] hover:text-[#F4F5F7]"
          >
            Showcase
          </a>
          <a
            href="#pricing"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm text-[#A1A7B3] hover:text-[#F4F5F7]"
          >
            Pricing
          </a>
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenStudio();
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-sm font-semibold cursor-pointer"
          >
            Open Studio
          </button>
        </div>
      )}
    </header>
  );
};
