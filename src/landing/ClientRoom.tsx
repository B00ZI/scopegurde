import { Check, CheckCircle2, Clock, Link2, MessageSquare, Plus, Sparkles } from 'lucide-react';
import { Reveal, ScopePill } from './ui';

const CLIENT_POINTS = [
  {
    icon: Link2,
    title: 'One link, no account',
    body: 'Your client opens the link and the project is right there. Nothing to sign up for.',
  },
  {
    icon: CheckCircle2,
    title: 'They see what is happening',
    body: 'Budget, progress and milestones, always current. No more status-update emails.',
  },
  {
    icon: MessageSquare,
    title: 'Requests arrive ready to check',
    body: 'Each new client request lands in your workspace marked Needs Review, next to the contract.',
  },
];

/** Static client-room preview: mirrors the real ClientRoom screen. */
function ClientRoomMock() {
  return (
    <div
      className="lp-mock space-y-4"
      role="img"
      aria-label="Client room view for Acme Corp showing the Q3 Hub Rebuild project at sixty percent complete and twenty thousand nine hundred dollars, a change proposal waiting for the client to approve two thousand two hundred dollars, and a card to send a new request."
    >
      <div data-static className="space-y-4">
        {/* What the client sees first */}
        <div className="lp-float bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 sm:p-6">
          <p className="font-label-caps text-secondary uppercase">Hi Acme Corp, here&rsquo;s your project</p>
          <div className="flex flex-wrap items-start justify-between gap-3 mt-2.5">
            <div>
              <p className="text-xl font-extrabold text-on-surface tracking-tight">Q3 Hub Rebuild</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-xs text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Due Aug 20, 2026
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 3 of 5 milestones complete
                </span>
              </div>
            </div>
            <div>
              <p className="font-label-caps text-secondary uppercase">Current value</p>
              <p className="text-xl font-bold text-on-surface tracking-tight mt-1">$20,900</p>
            </div>
          </div>
          <div className="mt-4 h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '60%' }} />
          </div>
        </div>

        {/* Client approves a change proposal */}
        <div className="lp-float bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between gap-2">
            <p className="font-button text-on-surface">Needs your decision</p>
            <span className="w-5 h-5 rounded-full bg-error/10 text-error text-[11px] font-bold flex items-center justify-center">
              1
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 flex-wrap mt-3">
            <ScopePill decision="Out of Scope" />
            <span className="text-xs text-secondary">Change proposal</span>
          </div>
          <p className="font-medium text-on-surface mt-3">Reporting dashboard add-on</p>
          <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> +5 days
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> +$2,200
            </span>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <span className="flex-1 h-10 bg-surface-container text-on-surface font-bold rounded-xl border border-surface-container-highest text-sm flex items-center justify-center">
              Decline
            </span>
            <span className="flex-[2] h-10 bg-primary text-on-primary font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-sm">
              <Check className="w-4 h-4" /> Approve &amp; add $2,200
            </span>
          </div>
        </div>

        {/* Client asks for something new */}
        <div className="lp-float bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-start gap-3.5 min-w-0 flex-1">
            <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <p className="font-button text-on-surface">Want to change something?</p>
              <p className="text-xs text-secondary mt-1">Ask for new work, extra revisions, or a scope tweak.</p>
            </div>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1.5 bg-primary text-on-primary font-button px-3.5 py-2.5 rounded-lg shadow-sm text-xs whitespace-nowrap">
            <Plus className="w-3.5 h-3.5" /> New request
          </span>
        </div>
      </div>
    </div>
  );
}

/** Client Room band: the public view your client gets from a shared link. */
export function ClientRoom() {
  return (
    <section id="client-room" className="lp-anchor relative overflow-hidden">
      <div className="lp-glow-left absolute inset-0" aria-hidden="true" />
      <div className="relative max-w-6xl mx-auto px-5 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <Reveal>
          <ClientRoomMock />
        </Reveal>

        <Reveal delay={0.08}>
          <div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-on-surface leading-[1.12]">
              Your client gets a view of their own.
            </h2>
            <p className="mt-6 text-lg sm:text-xl text-secondary leading-relaxed">
              Share one link. Your client sees progress and budget, approves or declines your change proposals, and
              sends new requests and messages from the same page. No account needed.
            </p>

            <ul className="mt-8 space-y-5">
              {CLIENT_POINTS.map((p) => (
                <li key={p.title} className="flex items-start gap-4">
                  <span className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                    <p.icon className="w-5 h-5 text-primary" />
                  </span>
                  <div>
                    <p className="text-base sm:text-lg font-semibold text-on-surface tracking-tight">{p.title}</p>
                    <p className="mt-1 text-base text-secondary leading-relaxed">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
