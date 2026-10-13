import { ArrowRight, Check, CheckCircle2, Pencil, Sparkles } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

const STEPS = [
  {
    title: 'Add the agreement',
    body: 'Start a project and provide its contract or agreed scope. Paste the text you already have.',
  },
  {
    title: 'Review the scope',
    body: 'Check the extracted milestones and rules, correct anything that needs editing, and confirm the source of truth.',
  },
  {
    title: 'Evaluate new requests',
    body: 'Compare a client request with the confirmed scope, then decide whether it is included or needs a change discussion.',
  },
];

function StepOneSnippet() {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-3.5 shadow-sm" aria-hidden="true">
      <div data-static>
        <p className="text-[11px] text-secondary leading-relaxed">
          Deliverables
          <br />
          1. Homepage.
          <br />
          2. Four inner pages (services, pricing, support, contact).
          <br />
          <span className="opacity-60">3. Responsive layout and WCAG AA accessibility.…</span>
        </p>
        <div className="mt-3 pt-3 border-t border-surface-container-highest flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Analyze Contract
          </span>
        </div>
      </div>
    </div>
  );
}

function StepTwoSnippet() {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-3.5 shadow-sm" aria-hidden="true">
      <div data-static className="space-y-2">
        {[
          { icon: CheckCircle2, text: 'Discovery & Research', tone: 'text-primary' },
          { icon: CheckCircle2, text: 'Wireframes', tone: 'text-primary' },
          { icon: Pencil, text: 'Homepage design', tone: 'text-secondary' },
        ].map((row) => (
          <div key={row.text} className="flex items-center gap-2.5 bg-surface-container-low rounded-lg px-3 py-2">
            <row.icon className={`w-4 h-4 shrink-0 ${row.tone}`} />
            <span className="text-xs font-medium text-on-surface truncate">{row.text}</span>
          </div>
        ))}
        <p className="text-[11px] text-secondary pt-0.5">Editable until you confirm.</p>
      </div>
    </div>
  );
}

function StepThreeSnippet() {
  return (
    <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-3.5 shadow-sm" aria-hidden="true">
      <div data-static>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs font-semibold text-on-surface truncate">Spanish translations</p>
          <ScopePill decision="Needs Review" />
        </div>
        <p className="text-[11px] text-secondary mt-1.5">Client request · Aug 12, 2026</p>
        <div className="mt-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-primary text-on-primary text-[11px] font-bold shadow-sm">
            <Check className="w-3.5 h-3.5" /> Review
          </span>
          <span className="inline-flex items-center px-2.5 py-1.5 rounded-lg border border-surface-container-highest bg-surface-container-low text-[11px] font-bold text-on-surface">
            Run AI check
          </span>
        </div>
      </div>
    </div>
  );
}

const SNIPPETS = [StepOneSnippet, StepTwoSnippet, StepThreeSnippet];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="lp-anchor relative overflow-hidden">
      <div className="lp-grid absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
            Three steps from agreement to decision.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed">
            The contract you already have becomes the reference point every request is measured against.
          </p>
        </Reveal>

        <div className="mt-14 md:mt-20 relative">
          {/* Connecting line through the step numbers (desktop only) */}
          <div
            className="hidden md:block absolute left-0 right-0 top-7 h-px bg-surface-container-highest"
            aria-hidden="true"
          />

          <ol className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 relative">
            {STEPS.map((step, i) => {
              const Snippet = SNIPPETS[i];
              return (
                <li key={step.title} className="relative">
                  <Reveal delay={i * 0.07}>
                    <div className="flex md:block items-center gap-4">
                      <span className="relative z-10 w-14 h-14 rounded-full bg-surface-container-lowest border-2 border-primary/30 flex items-center justify-center text-base font-black text-primary shrink-0 shadow-sm">
                        {i + 1}
                      </span>
                      <div className="md:mt-6">
                        <h3 className="text-xl sm:text-2xl font-semibold text-on-surface tracking-tight">
                          {step.title}
                        </h3>
                        <p className="mt-2.5 text-base sm:text-lg text-secondary leading-relaxed max-w-sm">
                          {step.body}
                        </p>
                      </div>
                    </div>
                    <div className="mt-6">
                      <Snippet />
                    </div>
                  </Reveal>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      className="hidden md:block absolute -right-6 top-5 w-4 h-4 text-outline"
                      aria-hidden="true"
                    />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
