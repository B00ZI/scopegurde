import {
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDashed,
  Clock,
  FileText,
  Link2,
  Plus,
  Users,
} from 'lucide-react';
import { Reveal, ScopePill, SoftPill } from './ui';

const MILESTONES = [
  {
    icon: CheckCircle2,
    iconTone: 'text-primary',
    title: 'Brand guidelines',
    sub: 'No deadline · 3/3 deliverables',
    pill: 'Done',
    pillClass: 'bg-primary/15 text-primary',
  },
  {
    icon: CircleDashed,
    iconTone: 'text-amber-500 dark:text-amber-400',
    title: 'Homepage design',
    sub: 'Due Aug 12 · 1/2 deliverables',
    pill: 'In progress',
    pillClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  },
  {
    icon: Circle,
    iconTone: 'text-secondary',
    title: 'QA & Launch',
    sub: 'No deadline · 0/3 deliverables',
    pill: 'Not started',
    pillClass: 'bg-surface-container text-secondary',
  },
];

const CONTRACT_SECTIONS = [
  {
    title: 'Agreed Work',
    items: ['Homepage plus 4 inner pages', 'Brand guidelines applied to every page', 'Responsive and WCAG AA accessible'],
  },
  {
    title: 'Rules',
    items: [
      'Changes outside the agreed work are quoted before work starts',
      'Up to 2 revision rounds per deliverable',
    ],
  },
];

function RequestCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {/* CR-1 */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ScopePill decision="Out of Scope" />
          <SoftPill className="bg-primary/10 text-primary border border-primary/20">Reviewed</SoftPill>
        </div>
        <div>
          <p className="font-medium text-on-surface">Dark mode</p>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            Add a dark theme across the public hub and the new dashboard templates.
          </p>
        </div>
        <p className="text-[11px] text-secondary">Client request · Aug 10, 2026</p>
        <div className="mt-auto bg-surface-container-low rounded-lg px-3 py-2 flex items-center gap-2 text-[11px] text-secondary">
          <FileText className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            Change proposal: <span className="font-semibold text-on-surface">Dark mode implementation</span>
          </span>
          <SoftPill className="ml-auto bg-surface-container text-secondary border border-surface-container-highest">
            Draft
          </SoftPill>
        </div>
      </div>

      {/* CR-4 */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ScopePill decision="In Scope" />
          <SoftPill className="bg-surface-container text-secondary border border-surface-container-highest">
            Resolved
          </SoftPill>
        </div>
        <div>
          <p className="font-medium text-on-surface">Onboarding email sequence</p>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            Three automated emails when a client creates an account.
          </p>
        </div>
        <p className="text-[11px] text-secondary mt-auto">Client request · Aug 9, 2026</p>
      </div>

      {/* CR-3 */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <ScopePill decision="Needs Review" />
          <SoftPill className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
            Needs Review
          </SoftPill>
        </div>
        <div>
          <p className="font-medium text-on-surface">Spanish translations</p>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            The new pages mention translations into Spanish (ES-MX) that are not listed in the contract.
          </p>
        </div>
        <p className="text-[11px] text-secondary mt-auto">AI-detected request · Aug 12, 2026</p>
      </div>
    </div>
  );
}

export function WorkspaceShowcase() {
  return (
    <section id="features" className="lp-anchor relative overflow-hidden bg-surface-container border-y border-surface-container-highest">
      <div className="lp-grid absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28">
        <Reveal className="max-w-3xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
            One workspace for the whole project.
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed">
            Budget, milestones, requests and the contract itself, all on one screen. Every request sits right next
            to the part of the agreement it is measured against.
          </p>
        </Reveal>

        <Reveal delay={0.06} className="mt-10 md:mt-14">
          <div
            className="lp-mock lp-mock-scroll overflow-x-auto"
            role="img"
            aria-label="ScopeGuard project workspace for Q3 Hub Rebuild with client Acme Corp, current value twenty thousand nine hundred dollars, three of five milestones done, three change requests with scope labels, and contract sections."
          >
            <div className="space-y-5" data-static>
              {/* Project summary */}
              <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-7 shadow-sm">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-2xl font-bold text-on-surface tracking-tight">Q3 Hub Rebuild</p>
                      <SoftPill className="bg-primary/10 text-primary border border-primary/20">In Progress</SoftPill>
                    </div>
                    <p className="text-sm text-secondary mt-1.5">PRJ-1001 · Acme Corp</p>
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 text-xs text-secondary">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="w-3.5 h-3.5" /> Created May 18, 2026
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Deadline Aug 20, 2026
                      </span>
                    </div>
                  </div>
                  <div className="lg:text-right shrink-0">
                    <p className="font-label-caps text-secondary uppercase mb-1">Current value</p>
                    <p className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">$20,900</p>
                    <p className="text-xs text-secondary mt-1">$18,500 original + $2,400 approved</p>
                  </div>
                </div>

                <div className="mt-5 pt-5 border-t border-surface-container-highest flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-2 whitespace-nowrap bg-surface-container-lowest border border-surface-container-highest text-on-surface font-button px-4 py-2.5 rounded-lg shadow-sm text-sm">
                    <Plus className="w-4 h-4" /> Add Request
                  </span>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg shadow-sm text-sm">
                    <Users className="w-4 h-4" /> Open Client Room
                  </span>
                  <span className="p-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-secondary">
                    <Link2 className="w-4 h-4" />
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-sm font-medium text-on-surface">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Status
                  </span>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-7 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-semibold text-on-surface tracking-tight">Milestones</p>
                    <span className="text-xs text-secondary font-medium">3 of 5 done</span>
                  </div>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap bg-surface-container-lowest border border-surface-container-highest text-on-surface font-button px-3.5 py-2 rounded-lg shadow-sm text-xs">
                    <Plus className="w-4 h-4" /> Add Milestone
                  </span>
                </div>

                <div className="mt-4 bg-surface-container-low rounded-lg p-3.5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium text-secondary">Overall progress</p>
                    <p className="text-xs font-bold text-primary">60%</p>
                  </div>
                  <div className="mt-2 h-2 bg-surface-container-highest rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  {MILESTONES.map((m) => (
                    <div
                      key={m.title}
                      className="bg-surface-container-low border border-surface-container-highest rounded-xl p-4 flex items-center gap-4 shadow-sm"
                    >
                      <m.icon className={`w-5 h-5 shrink-0 ${m.iconTone}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-on-surface truncate">{m.title}</span>
                        <span className="block text-xs text-secondary mt-0.5">{m.sub}</span>
                      </span>
                      <SoftPill className={m.pillClass}>{m.pill}</SoftPill>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requests & Changes */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="text-lg font-semibold text-on-surface tracking-tight">Requests &amp; Changes</p>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap bg-surface-container-lowest border border-surface-container-highest text-on-surface font-button px-3.5 py-2 rounded-lg shadow-sm text-xs">
                    <Plus className="w-4 h-4" /> Add Request
                  </span>
                </div>
                <div className="flex gap-1 p-1 bg-surface-container-low rounded-xl mb-5 w-fit">
                  <span className="px-4 py-2 rounded-lg text-sm font-bold bg-surface-container-lowest text-on-surface shadow-sm">
                    Requests <span className="opacity-60 ml-0.5">5</span>
                  </span>
                  <span className="px-4 py-2 rounded-lg text-sm font-bold text-secondary">
                    Changes <span className="opacity-60 ml-0.5">3</span>
                  </span>
                </div>
                <RequestCards />
              </div>

              {/* Contract details */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                  <p className="text-lg font-semibold text-on-surface tracking-tight">Contract Details</p>
                  <span className="inline-flex items-center gap-2 whitespace-nowrap bg-surface-container-lowest border border-surface-container-highest text-secondary font-button px-3.5 py-2 rounded-lg shadow-sm text-xs">
                    <FileText className="w-4 h-4" /> View Original Contract
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONTRACT_SECTIONS.map((sec) => (
                    <div
                      key={sec.title}
                      className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm"
                    >
                      <p className="font-button text-on-surface mb-3">{sec.title}</p>
                      <ul className="space-y-2">
                        {sec.items.map((item) => (
                          <li key={item} className="flex items-start gap-2.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                            <span className="text-sm text-on-surface-variant leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
