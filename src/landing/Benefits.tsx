import { FileText, History, Tags, UserCheck } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

const ACTIVITY_LINES = [
  { title: 'Client accepted “Reporting dashboard add-on”', desc: '+$2,200 added' },
  { title: 'AI scope check on “Dark mode”', desc: 'Classified as Out of Scope · 91% confidence' },
  { title: 'Change proposal created: “Dark mode implementation”', desc: undefined },
];

export function Benefits() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 py-16 md:py-24">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-on-surface leading-[1.15]">
            What ScopeGuard keeps in order.
          </h2>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 gap-px bg-surface-container-highest border border-surface-container-highest rounded-2xl overflow-hidden">
            {/* Cell 1 — tinted */}
            <div className="bg-primary/5 p-6 sm:p-8">
              <span className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-on-surface tracking-tight">
                One reference for the agreement
              </h3>
              <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed">
                Milestones, payment terms and scope rules stay attached to the project, editable whenever you are.
              </p>
            </div>

            {/* Cell 2 — with pill visual */}
            <div className="bg-surface-container-lowest p-6 sm:p-8">
              <span className="w-10 h-10 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-center">
                <Tags className="w-5 h-5 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-on-surface tracking-tight">
                Clear request classification
              </h3>
              <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed">
                Included work, potential scope changes and uncertain cases, separated at a glance.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <ScopePill decision="In Scope" />
                <ScopePill decision="Out of Scope" />
                <ScopePill decision="Needs Review" />
              </div>
            </div>

            {/* Cell 3 */}
            <div className="bg-surface-container-lowest p-6 sm:p-8">
              <span className="w-10 h-10 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-on-surface tracking-tight">
                You stay the decision-maker
              </h3>
              <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed">
                Every suggestion lands in your review. Nothing is sent to a client or approved without you.
              </p>
            </div>

            {/* Cell 4 — with activity visual */}
            <div className="bg-surface-container-lowest p-6 sm:p-8">
              <span className="w-10 h-10 rounded-xl bg-surface-container border border-surface-container-highest flex items-center justify-center">
                <History className="w-5 h-5 text-primary" />
              </span>
              <h3 className="mt-5 text-lg font-semibold text-on-surface tracking-tight">A clearer change history</h3>
              <p className="mt-2 text-sm sm:text-base text-secondary leading-relaxed">
                Requests, proposals and client decisions are logged in the project activity.
              </p>
              <ul className="mt-4 space-y-2">
                {ACTIVITY_LINES.map((line) => (
                  <li key={line.title} className="bg-surface-container-low rounded-lg px-3 py-2">
                    <p className="text-xs font-medium text-on-surface leading-snug">{line.title}</p>
                    {line.desc && <p className="text-[11px] text-secondary mt-0.5">{line.desc}</p>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
