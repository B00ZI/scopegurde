import { Bot, Check, Plus } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

export function Trust() {
  return (
    <section className="bg-surface-container-low border-y border-surface-container-highest">
      <div className="max-w-3xl mx-auto px-5 py-16 md:py-24 text-center">
        <Reveal>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface leading-[1.15]">
            AI can help review the scope.
            <br className="hidden sm:block" /> You stay in control.
          </h2>
          <p className="mt-5 text-base sm:text-lg text-secondary leading-relaxed">
            Extraction is a draft until you say otherwise: review the milestones and rules, correct anything, and
            confirm the source of truth before the project starts. Scope suggestions inform your judgment. The final
            say is always yours.
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="lp-mock mt-10 bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 sm:p-6 shadow-sm text-left max-w-md mx-auto"
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
