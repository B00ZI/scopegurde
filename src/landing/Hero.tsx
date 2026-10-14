import { ArrowRight, CalendarDays, FileText, Sparkles } from 'lucide-react';
import { Reveal, ScopePill, SoftPill, lpBtnGhost, lpBtnPrimary } from './ui';

/** Static product preview: mirrors the real project summary + request card in ProjectView. */
function HeroMockup() {
  return (
    <div
      className="lp-mock lp-mock-scroll lp-float relative overflow-x-auto rounded-2xl border border-surface-container-highest"
      role="img"
      aria-label="ScopeGuard workspace showing the Q3 Hub Rebuild project for Acme Corp, its current value of twenty thousand nine hundred dollars, milestone progress at sixty percent, and a client request for dark mode marked Out of Scope."
    >
      <div className="relative">
        <div className="lp-dots absolute inset-0 rounded-2xl" aria-hidden="true" />

        <div className="relative p-3 sm:p-4 space-y-3.5" data-static>
          {/* Project summary card */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-bold text-on-surface text-base tracking-tight truncate">Q3 Hub Rebuild</p>
                  <SoftPill className="bg-primary/10 text-primary border border-primary/20">In Progress</SoftPill>
                </div>
                <p className="text-xs text-secondary mt-1">PRJ-1001 · Acme Corp</p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-label-caps text-secondary uppercase mb-0.5">Current value</p>
                <p className="text-lg font-bold text-on-surface tracking-tight">$20,900</p>
              </div>
            </div>

            <div className="mt-4 bg-surface-container-low rounded-lg p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-medium text-secondary">Overall progress</p>
                <p className="text-xs font-bold text-primary">60%</p>
              </div>
              <div className="mt-2 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
              </div>
              <p className="text-[11px] text-secondary mt-2 flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" /> Deadline Aug 20 · 3 of 5 milestones done
              </p>
            </div>
          </div>

          {/* Request card */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <ScopePill decision="Out of Scope" />
              <SoftPill className="bg-primary/10 text-primary border border-primary/20">Reviewed</SoftPill>
            </div>
            <p className="font-medium text-on-surface mt-3">Dark mode</p>
            <p className="text-xs text-secondary mt-1 leading-relaxed">
              Add a dark theme across the public hub and the new dashboard templates.
            </p>
            <p className="text-[11px] text-secondary mt-2.5">Client request · Aug 10, 2026</p>
            <div className="mt-3 bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-2 text-[11px] text-secondary">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                Change proposal: <span className="font-semibold text-on-surface">Dark mode implementation</span>
              </span>
              <SoftPill className="ml-auto bg-surface-container text-secondary border border-surface-container-highest">
                Draft
              </SoftPill>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Hero({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* Decorative layers: faint blueprint grid + restrained brand glow */}
      <div className="lp-grid absolute inset-0" aria-hidden="true" />
      <div className="lp-glow absolute inset-0" aria-hidden="true" />
      <div className="lp-glow-bottom absolute inset-x-0 bottom-0 h-2/3" aria-hidden="true" />

      {/* Giant ScopeGuard wordmark, gradient-filled so it belongs to the background */}
      <div
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
        aria-hidden="true"
      >
        <span className="lp-hero-wordmark font-semibold uppercase tracking-tighter leading-none whitespace-nowrap text-[clamp(3.25rem,14vw,13rem)]">
          ScopeGuard
        </span>
      </div>

      <div className="relative max-w-6xl mx-auto px-5 pt-14 sm:pt-16 md:pt-24 pb-56 md:pb-80 grid grid-cols-1 lg:grid-cols-[52fr_48fr] gap-12 lg:gap-16 items-center">
        <Reveal>
          <div>
            <p className="font-label-caps text-primary uppercase">Client projects, with clear boundaries</p>
            <h1 className="mt-5 text-[2.75rem] sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.04] text-on-surface max-w-2xl">
              Keep client work in scope.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed max-w-xl">
              ScopeGuard keeps your contract next to your project, so you always know what a new request costs you.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <button onClick={onGetStarted} className={lpBtnPrimary}>
                Get started <ArrowRight className="w-4.5 h-4.5" />
              </button>
              <a href="#how-it-works" className={lpBtnGhost}>
                <Sparkles className="w-4.5 h-4.5 text-primary" /> See how it works
              </a>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <HeroMockup />
        </Reveal>
      </div>
    </section>
  );
}
