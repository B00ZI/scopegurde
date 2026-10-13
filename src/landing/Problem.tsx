import { ArrowDown, ArrowRight, MessageSquare } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

/**
 * Problem band: editorial contrast between the agreed scope and a new
 * request, using wording from the app's own sample contract and data.
 */
export function Problem() {
  return (
    <section className="relative overflow-hidden bg-surface-container-low border-y border-surface-container-highest">
      <div className="lp-dots absolute inset-0 opacity-70" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
            The original agreement shouldn&rsquo;t get lost in the project.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed max-w-2xl">
            Small requests arrive through calls and chat threads. After the third one, it is hard to remember what
            the contract actually included. ScopeGuard keeps the agreed scope beside every new request, so the
            comparison takes a minute, not a search through old emails.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 md:mt-14">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-stretch lp-mock">
            {/* What we agreed */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 sm:p-7 shadow-sm">
              <p className="font-label-caps text-secondary uppercase mb-4">What we agreed</p>
              <div data-static>
                <p className="font-button text-on-surface mb-3">Agreed work</p>
                <ul className="space-y-2.5">
                  {[
                    'Four inner pages (services, pricing, support, contact)',
                    'Up to two revision rounds per deliverable',
                    'Additional rounds are quoted separately',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                      <span className="text-sm text-on-surface-variant leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Connector */}
            <div className="flex md:flex-col items-center justify-center gap-2 py-1 text-secondary" aria-hidden="true">
              <ArrowRight className="hidden md:block w-5 h-5" />
              <ArrowDown className="md:hidden w-5 h-5" />
            </div>

            {/* The new request */}
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 sm:p-7 shadow-sm">
              <p className="font-label-caps text-secondary uppercase mb-4">The new request</p>
              <div data-static>
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="w-8 h-8 rounded-full bg-surface-container border border-surface-container-highest flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-secondary" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-on-surface">Acme Corp</p>
                    <p className="text-[11px] text-secondary">via email · this morning</p>
                  </div>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed bg-surface-container rounded-xl rounded-tl-sm px-4 py-3">
                  &ldquo;Could we also get the new pages in Spanish (ES-MX)? It shouldn&rsquo;t be much extra
                  work.&rdquo;
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 flex flex-wrap items-center justify-center gap-3 text-sm text-secondary">
          <ScopePill decision="Needs Review" />
          <span>The request, checked against what you agreed. The decision stays yours.</span>
        </Reveal>
      </div>
    </section>
  );
}
