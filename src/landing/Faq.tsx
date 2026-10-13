import { ChevronDown } from 'lucide-react';
import { Reveal } from './ui';

const FAQS = [
  {
    q: 'What is ScopeGuard?',
    a: 'A project workspace for keeping client work aligned with the original agreement. You add a project and its contract, confirm the scope ScopeGuard extracts from it, and review every new request against that scope.',
  },
  {
    q: 'How does it compare a request with the agreed scope?',
    a: 'Open a request and run an AI check. ScopeGuard reads the contract details stored in the project and suggests one of three classifications (In Scope, Out of Scope, or Needs Review), along with the reasoning and a confidence level.',
  },
  {
    q: 'Can I review extracted contract details?',
    a: 'Yes. When you create a project, ScopeGuard shows what it found: milestones, deliverables, payment terms and scope rules. Every field is editable, and nothing is saved until you confirm it.',
  },
  {
    q: 'Does ScopeGuard make the final decision for me?',
    a: 'No. Classifications are suggestions to inform your judgment. You decide whether a request is handled within the agreed scope, turned into a change proposal, or discussed further with the client.',
  },
  {
    q: 'Who is it designed for?',
    a: 'Freelancers and small agencies who deliver client projects (developers, designers, consultants) and need a clear record of what was agreed.',
  },
];

export function Faq() {
  return (
    <section id="faq" className="lp-anchor">
      <div className="max-w-6xl mx-auto px-5 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[4fr_8fr] gap-8 lg:gap-16 items-start">
        <Reveal>
          <div className="lg:sticky lg:top-24">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
              Common questions
            </h2>
            <p className="mt-5 text-lg text-secondary leading-relaxed">
              Straight answers about what ScopeGuard does, and what it deliberately leaves to you.
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="border-t border-surface-container-highest">
            {FAQS.map((item) => (
              <details key={item.q} className="lp-faq group border-b border-surface-container-highest">
                <summary className="flex items-center justify-between gap-6 py-6 text-lg sm:text-xl font-semibold text-on-surface tracking-tight rounded-lg">
                  {item.q}
                  <ChevronDown
                    className="w-5 h-5 shrink-0 text-secondary transition-transform duration-200 group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <p className="pb-6 pr-10 text-base sm:text-lg text-secondary leading-relaxed max-w-2xl">{item.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
