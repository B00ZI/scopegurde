import { Bot, Check, Plus } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

export function Trust() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low border-y border-surface-container-highest">
      <div className="lp-glow absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-3xl mx-auto px-5 py-20 md:py-28 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
            AI can help review the scope.
            <br className="hidden sm:block" /> You stay in control.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed">
            ScopeGuard reads your contract and suggests an answer for every request. Nothing is sent to your client, and
            nothing is saved or approved without you. You make the final call.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="lp-mock lp-float mt-12 bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 sm:p-7 shadow-sm text-left max-w-md mx-auto"
            role="img"
            aria-label="A request marked Needs Review with an AI suggestion of eighty-four percent confidence, and the Review and Run AI check actions the user chooses from."
          >
            <div data-static>
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-on-surface">Spanish translations</p>
                <ScopePill decision="Needs Review" />
              </div>
              <p className="text-xs text-secondary mt-1">Client request · Aug 12, 2026</p>

              <div className="mt-4 bg-surface-container-low rounded-xl p-3.5 flex items-start gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-on-surface">AI scope check</p>
                  <p className="text-xs text-secondary mt-1 leading-relaxed">
                    Needs Review · 84% confidence, overlaps partially with the agreed scope.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-button text-xs shadow-sm">
                  <Check className="w-4 h-4" /> Review
                </span>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-on-surface font-button text-xs shadow-sm">
                  <Plus className="w-4 h-4" /> Run AI check
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
