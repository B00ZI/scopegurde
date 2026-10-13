import { useEffect, useRef, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { BrandMark, lpBtnSmPrimary } from './ui';

interface LandingNavProps {
  onGetStarted: () => void;
  onSignIn: () => void;
}

const NAV_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingNav({ onGetStarted, onSignIn }: LandingNavProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-surface-container-highest">
      <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between gap-4">
        <a href="#top" aria-label="ScopeGuard — back to top" className="shrink-0 rounded-lg">
          <BrandMark size="sm" />
        </a>

        <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={onSignIn}
            className="hidden sm:inline-flex px-3 py-2 rounded-lg text-sm font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            Sign in
          </button>
          {/* Wrapper controls visibility: lpBtnSmPrimary sets display:inline-flex,
              which would override a `hidden` class on the button itself. */}
          <span className="hidden sm:block">
            <button onClick={onGetStarted} className={lpBtnSmPrimary}>
              Get started
            </button>
          </span>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="lp-mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="lg:hidden p-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors shadow-sm"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div
          id="lp-mobile-menu"
          ref={menuRef}
          className="lg:hidden border-t border-surface-container-highest bg-background"
        >
          <nav aria-label="Mobile" className="max-w-6xl mx-auto px-5 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-on-surface hover:bg-surface-container transition-colors"
              >
                {l.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-2 mt-1 border-t border-surface-container-highest">
              <button
                onClick={() => {
                  setOpen(false);
                  onSignIn();
                }}
                className="flex-1 inline-flex justify-center items-center px-4 py-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors shadow-sm"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setOpen(false);
                  onGetStarted();
                }}
                className={`flex-1 ${lpBtnSmPrimary} py-2.5`}
              >
                Get started
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
