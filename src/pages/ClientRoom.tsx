import { useState } from 'react';
import {
  Building2, Check, CheckCircle2, Clock, Lock, MessageSquare, Plus,
  X, ShieldCheck, Sparkles,
} from 'lucide-react';
import {
  addChangeRequest,
  logActivity,
  nowDate,
  updateChangeRequest,
  updateProject,
  useChangeRequests,
  useContractSections,
  useMessages,
  useProject,
} from '../lib/appStore';
import { MessageThread } from '../components/MessageThread';
import { MOCK_CLIENTS } from '../lib/mockData';
import { ChangeScopeDecision } from '../types';

const DECISION_META: Record<ChangeScopeDecision, string> = {
  'In Scope': 'bg-primary/10 text-primary border border-primary/20',
  'Needs Review': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  'Out of Scope': 'bg-secondary/10 text-secondary border border-secondary/20',
};

interface ClientRoomProps {
  projectId: string;
  onExit?: () => void;
}

export function ClientRoomPage({ projectId, onExit }: ClientRoomProps) {
  const project = useProject(projectId);
  const changeRequests = useChangeRequests(projectId);
  const messages = useMessages(projectId);
  const sections = useContractSections(projectId);

  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [decided, setDecided] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="min-h-screen bg-surface-container-low py-8 sm:py-16 px-4 font-sans">
        <div className="max-w-2xl mx-auto bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-10 text-center">
          <p className="font-medium text-on-surface">This room link is not valid.</p>
          <p className="font-body-sm text-secondary mt-1">Ask your consultant for a fresh link.</p>
        </div>
      </div>
    );
  }

  const client = MOCK_CLIENTS.find((c) => c.id === project.clientId);
  const clientName = client?.name ?? 'Your consultant';
  const done = project.milestones.filter((m) => m.status === 'Done').length;
  const total = project.milestones.length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const pendingDecisions = changeRequests.filter((cr) => cr.kind === 'change' && cr.status === 'Awaiting Client');

  const totalValue = project.basePrice + project.outOfScopeAdded;

  const decide = (id: string, accept: boolean) => {
    const cr = changeRequests.find((c) => c.id === id);
    updateChangeRequest(id, {
      status: accept ? 'Approved' : 'Declined',
      clientDecision: {
        date: nowDate(),
        reason: accept ? undefined : 'Not needed',
      },
    });
    if (cr) {
      if (accept) {
        updateProject(projectId, { outOfScopeAdded: project.outOfScopeAdded + cr.priceAdjustment });
      }
      logActivity(projectId, {
        type: 'client-decision',
        title: `Client ${accept ? 'accepted' : 'rejected'} "${cr.title}"`,
        description: accept ? `+$${cr.priceAdjustment.toLocaleString('en-US')} added` : undefined,
      });
    }
    setDecided(accept ? `accepted-${id}` : `rejected-${id}`);
    window.setTimeout(() => setDecided(null), 2500);
  };

  const submitRequest = () => {
    const title = reqTitle.trim();
    if (!title) return;
    addChangeRequest({
      id: `CR-${Date.now()}`,
      projectId,
      title,
      description: reqDesc.trim() || '',
      source: 'Client',
      scopeDecision: 'Needs Review',
      kind: 'request',
      requestStatus: 'Needs Review',
      extraTimeDays: 0,
      priceAdjustment: 0,
      dateRequested: nowDate(),
    });
    updateProject(projectId, { pendingOutOfScopeRequests: project.pendingOutOfScopeRequests + 1 });
    logActivity(projectId, {
      type: 'request-submitted',
      title: `Client submitted request: "${title}"`,
    });
    setShowRequestForm(false);
    setReqTitle('');
    setReqDesc('');
  };

  const formatMoney = (v: number) => `$${v.toLocaleString('en-US')}`;

  return (
    <div className="min-h-screen bg-surface-container-low pb-16 px-4 selection:bg-primary/20 font-sans">
      <div className="max-w-3xl mx-auto pt-8 sm:pt-12 space-y-6 sm:space-y-8">
        {/* Brand header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-container-lowest border border-surface-container-highest shadow-sm flex items-center justify-center">
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-base font-bold text-on-surface tracking-tight">ScopeGuard</h1>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Client Room</p>
            </div>
          </div>
          {onExit && (
            <button
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-secondary hover:text-on-surface transition-colors"
            >
              <Lock className="w-3.5 h-3.5" /> Exit demo
            </button>
          )}
        </div>

        {/* Toast for decisions */}
        {decided && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-surface border border-surface-container-highest rounded-xl shadow-lg px-4 py-3 text-sm font-medium text-on-surface flex items-center gap-2">
            <Check className="w-4 h-4 text-primary" />
            {decided.startsWith('accepted') ? 'Change approved — thanks!' : 'Change declined — noted.'}
          </div>
        )}

        {/* Project hero */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Hi {clientName}, here's your project</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-on-surface tracking-tight mt-2">{project.name}</h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-secondary">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {project.deadline
                    ? `Due ${new Date(`${project.deadline}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                    : 'No fixed deadline'}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {done} of {total} milestones complete
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <p className="font-label-caps text-secondary uppercase">Current value</p>
              <p className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight mt-1">{formatMoney(totalValue)}</p>
            </div>
          </div>

          <div className="mt-5 h-2 bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
        </div>

        {/* Pending decisions */}
        {pendingDecisions.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-h3 text-on-surface flex items-center gap-2">
              Needs your decision
              <span className="w-5 h-5 rounded-full bg-error/10 text-error text-[11px] font-bold flex items-center justify-center">
                {pendingDecisions.length}
              </span>
            </h3>
            {pendingDecisions.map((cr) => (
              <div key={cr.id} className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm p-5 sm:p-6">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${DECISION_META[cr.scopeDecision]}`}>
                    {cr.scopeDecision}
                  </span>
                  <span className="text-xs text-secondary">{cr.source} request</span>
                </div>
                <h4 className="font-button text-on-surface mt-3">{cr.title}</h4>
                <p className="font-body-sm text-secondary mt-1">{cr.description}</p>

                <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-surface-container-highest text-xs text-secondary">
                  {cr.extraTimeDays > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />+{cr.extraTimeDays} day{cr.extraTimeDays === 1 ? '' : 's'}
                    </span>
                  )}
                  {cr.priceAdjustment > 0 && (
                    <span className="inline-flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" />+{formatMoney(cr.priceAdjustment)}
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    onClick={() => decide(cr.id, false)}
                    className="flex-1 h-11 bg-surface-container text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-all active:scale-[0.98] border border-surface-container-highest text-sm"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => decide(cr.id, true)}
                    className="flex-[2] h-11 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2 text-sm shadow-lg shadow-primary/20"
                  >
                    <Check className="w-4 h-4" /> Approve{cr.priceAdjustment > 0 ? ` & add ${formatMoney(cr.priceAdjustment)}` : ''}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Request something new */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm p-5 sm:p-6">
          {!showRequestForm ? (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-button text-on-surface">Want to change something?</p>
                  <p className="font-body-sm text-secondary mt-1">Ask for new work, extra revisions, or a scope tweak.</p>
                </div>
              </div>
              <button
                onClick={() => setShowRequestForm(true)}
                className="shrink-0 inline-flex items-center gap-2 bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm"
              >
                <Plus className="w-4 h-4" /> New request
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-3">
                  <input
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    placeholder="What do you need? e.g. Dark mode"
                    className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm"
                  />
                  <textarea
                    value={reqDesc}
                    onChange={(e) => setReqDesc(e.target.value)}
                    placeholder="Describe what's involved (optional)…"
                    className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm min-h-[80px] resize-y leading-relaxed"
                  />
                  <p className="text-xs text-secondary flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Your consultant reviews it against the agreement before quoting.
                  </p>
                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setShowRequestForm(false)}
                      className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors text-sm"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={submitRequest}
                      disabled={!reqTitle.trim()}
                      className="inline-flex items-center gap-2 bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm disabled:opacity-40 disabled:pointer-events-none"
                    >
                      Send request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Milestones */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm p-5 sm:p-6">
          <h3 className="font-h3 text-on-surface mb-4">Progress</h3>
          <div className="space-y-4">
            {project.milestones.map((m) => {
              const dl = m.deliverables?.length ?? 0;
              const dlDone = m.deliverables?.filter((d) => d.done).length ?? 0;
              return (
                <div key={m.id}>
                  <div className="flex items-center gap-3">
                    {m.status === 'Done' ? (
                      <div className="w-6 h-6 rounded-full bg-primary/15 text-primary flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-surface-container-high text-secondary flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                    )}
                    <span className={`flex-1 text-sm ${m.status === 'Done' ? 'text-secondary line-through decoration-surface-container-highest' : 'text-on-surface font-medium'}`}>
                      {m.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                      {dl > 0 ? `${dlDone}/${dl}` : m.status === 'Done' ? 'Done' : m.status === 'InProgress' ? 'In progress' : 'Up next'}
                    </span>
                  </div>
                  {dl > 0 && (
                    <ul className="ml-9 mt-1.5 space-y-1">
                      {m.deliverables!.map((d) => (
                        <li key={d.id} className="flex items-center gap-2 text-xs">
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${d.done ? 'bg-primary' : 'bg-surface-container-highest'}`} />
                          <span className={d.done ? 'text-secondary line-through' : 'text-on-surface-variant'}>{d.text}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-4">
          <h3 className="font-h3 text-on-surface flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" /> Messages
            {messages.length > 0 && (
              <span className="text-xs text-secondary font-medium normal-case">({messages.length})</span>
            )}
          </h3>
          <MessageThread projectId={projectId} mode="client" />
        </div>

        {/* Security footer */}
        <div className="flex items-center justify-center gap-2 pt-4">
          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
          <p className="text-center text-[11px] text-secondary font-medium">
            Secured room — shared only with your consultant. Messages are confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
