import { ArrowDown, Bot } from 'lucide-react';
import { Reveal, ScopePill, SoftPill } from './ui';

const DECISIONS = [
  {
    decision: 'In Scope' as const,
    text: 'Inside the agreement, so just do the work.',
  },
  {
    decision: 'Out of Scope' as const,
    text: 'Not in the agreement. Quote it as a change with your own price and timeline.',
  },
  {
    decision: 'Needs Review' as const,
    text: 'Only partly covered. Look closer, then you decide.',
  },
];

export function RequestReview() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low border-y border-surface-container-highest">
      <div className="lp-glow absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        <Reveal>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
              Every request, checked against what you agreed.
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed max-w-xl">
              Requests come from your client, from your own team, or from the AI check. ScopeGuard compares each one
              with the contract saved in the project and suggests what it is.
            </p>

            <ul className="mt-9 divide-y divide-surface-container-highest border-t border-surface-container-highest">
              {DECISIONS.map((d) => (
                <li key={d.decision} className="py-5 flex items-start gap-4">
                  <span className="shrink-0 mt-0.5">
                    <ScopePill decision={d.decision} />
                  </span>
                  <span className="text-base lg:text-lg text-secondary leading-relaxed">{d.text}</span>
                </li>
              ))}
            </ul>

            <p className="mt-7 flex items-start gap-2.5 text-base text-secondary leading-relaxed">
              <Bot className="w-4.5 h-4.5 text-primary shrink-0 mt-0.5" />
              <span>
                Every AI check shows its reason and a confidence level. It is a suggestion. You make the call.
              </span>
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <div
            className="lp-mock lp-float space-y-4 border border-surface-container-highest rounded-2xl p-5 sm:p-6"
            role="img"
            aria-label="A client request for an extra reporting view marked Out of Scope, an AI scope check activity entry showing eighty-four percent confidence, and the linked change proposal for two thousand two hundred dollars and five extra days, approved."
          >
            <div data-static className="space-y-4">
              {/* The request */}
              <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <ScopePill decision="Out of Scope" />
                  <SoftPill className="bg-primary/10 text-primary border border-primary/20">Reviewed</SoftPill>
                </div>
                <p className="font-medium text-on-surface mt-3">Extra reporting view</p>
                <p className="text-sm text-secondary mt-1 leading-relaxed">
                  A dedicated analytics page with exportable CSV reports for fleet performance.
                </p>
                <p className="text-xs text-secondary mt-3">Client request · Aug 11, 2026</p>
              </div>

              <div className="flex justify-center" aria-hidden="true">
                <ArrowDown className="w-4 h-4 text-outline" />
              </div>

              {/* AI check result, as it appears in the activity feed */}
              <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-3 flex items-start gap-3 shadow-sm">
                <span className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4 h-4 text-primary" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">AI scope check</p>
                  <p className="text-xs text-secondary mt-0.5">
                    Classified as Out of Scope · 84% confidence
                  </p>
                </div>
              </div>

              <div className="flex justify-center" aria-hidden="true">
                <ArrowDown className="w-4 h-4 text-outline" />
              </div>

              {/* The change proposal */}
              <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <ScopePill decision="Out of Scope" />
                  <SoftPill className="bg-[#065F46] text-white shadow-sm">Approved</SoftPill>
                </div>
                <p className="font-medium text-on-surface mt-3">Reporting dashboard add-on</p>
                <p className="text-sm text-secondary mt-1 leading-relaxed">
                  Build a dedicated analytics page with date-range filtering and CSV export for fleet performance
                  data.
                </p>
                <div className="mt-4 pt-4 border-t border-surface-container-highest flex items-center justify-between gap-3">
                  <p className="text-sm font-bold text-on-surface">+$2,200 · +5 days</p>
                  <p className="text-xs text-secondary">Price and timeline set by you</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
