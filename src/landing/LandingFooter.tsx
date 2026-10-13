import { BrandMark } from './ui';

const FOOTER_LINKS = [
  { href: '#how-it-works', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#faq', label: 'FAQ' },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-surface-container-highest bg-surface-container-low">
      <div className="max-w-6xl mx-auto px-5 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex flex-col gap-1">
          <BrandMark size="sm" />
          <p className="text-xs text-secondary mt-1">Keep client work in scope.</p>
        </div>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {FOOTER_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-secondary hover:text-on-surface transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <p className="text-xs text-secondary">© 2026 ScopeGuard</p>
      </div>
    </footer>
  );
}
