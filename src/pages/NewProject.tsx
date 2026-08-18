import { ReactNode, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft, ArrowRight, Check, FileText, Loader2, Plus, Sparkles,
  Trash2, Building2, RefreshCw, PartyPopper,
} from 'lucide-react';
import { MOCK_CLIENTS } from '../lib/mockData';
import { addProject, nowDate, setContractSections, setOriginalContract, logActivity } from '../lib/appStore';
import { runFakeAnalysis, ContractExtraction, SAMPLE_CONTRACTS } from '../lib/fakeAi';

interface NewProjectProps {
  onDone: (projectId: string) => void;
  onCancel: () => void;
}

const STEPS = ['Contract', 'Analysis', 'Review', 'Done'];

const inputClass =
  'w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm';

const btnPrimary =
  'inline-flex items-center gap-2 bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm disabled:opacity-40 disabled:pointer-events-none';

const btnGhost =
  'inline-flex items-center gap-2 bg-surface-container-lowest border border-surface-container-highest text-on-surface hover:bg-surface-container font-button px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm';

function SectionCard({ title, subtitle, children, className }: { key?: string | number; title: string; subtitle?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-6 shadow-sm ${className ?? ''}`}>
      <h3 className="font-button text-on-surface">{title}</h3>
      {subtitle && <p className="font-body-sm text-secondary mt-1">{subtitle}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function NewProjectPage({ onDone, onCancel }: NewProjectProps) {
  const [step, setStep] = useState(0);
  const [clientId, setClientId] = useState(MOCK_CLIENTS[0].id);
  const [basePrice, setBasePrice] = useState('15000');
  const [contractText, setContractText] = useState('');
  const [analysis, setAnalysis] = useState<ContractExtraction | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [createdId, setCreatedId] = useState<string | null>(null);

  const client = MOCK_CLIENTS.find((c) => c.id === clientId);

  const canAnalyze = contractText.trim().length > 40;
  const canReview = !!analysis;

  const startAnalysis = () => {
    setAnalyzing(true);
    runFakeAnalysis(contractText).then((res) => {
      setAnalysis(res);
      setAnalyzing(false);
      setStep(1);
    });
  };

  const patchAnalysis = (patch: Partial<ContractExtraction>) => {
    setAnalysis((a) => (a ? { ...a, ...patch } : a));
  };

  const addItem = (key: 'paymentTerms' | 'scopeRules') => {
    if (!analysis) return;
    patchAnalysis({ [key]: [...analysis[key], ''] });
  };

  const setItem = (key: 'paymentTerms' | 'scopeRules', index: number, value: string) => {
    if (!analysis) return;
    const next = [...analysis[key]];
    next[index] = value;
    patchAnalysis({ [key]: next });
  };

  const removeItem = (key: 'paymentTerms' | 'scopeRules', index: number) => {
    if (!analysis) return;
    patchAnalysis({ [key]: analysis[key].filter((_, i) => i !== index) });
  };

  const setMilestoneTitle = (index: number, value: string) => {
    if (!analysis) return;
    const next = [...analysis.milestones];
    next[index] = { ...next[index], title: value };
    patchAnalysis({ milestones: next });
  };

  const addDeliverable = (milestoneIndex: number) => {
    if (!analysis) return;
    const next = [...analysis.milestones];
    next[milestoneIndex] = { ...next[milestoneIndex], deliverables: [...next[milestoneIndex].deliverables, ''] };
    patchAnalysis({ milestones: next });
  };

  const setDeliverable = (milestoneIndex: number, deliverableIndex: number, value: string) => {
    if (!analysis) return;
    const next = [...analysis.milestones];
    const deliverables = [...next[milestoneIndex].deliverables];
    deliverables[deliverableIndex] = value;
    next[milestoneIndex] = { ...next[milestoneIndex], deliverables };
    patchAnalysis({ milestones: next });
  };

  const removeDeliverable = (milestoneIndex: number, deliverableIndex: number) => {
    if (!analysis) return;
    const next = [...analysis.milestones];
    next[milestoneIndex] = { ...next[milestoneIndex], deliverables: next[milestoneIndex].deliverables.filter((_, i) => i !== deliverableIndex) };
    patchAnalysis({ milestones: next });
  };

  const createProject = () => {
    if (!analysis || !client) return;
    const id = `PRJ-${Date.now()}`;
    const milestones = analysis.milestones
      .filter((m) => m.title.trim())
      .map((m, i) => ({
        id: `M-${i + 1}`,
        title: m.title,
        status: 'Todo' as const,
        deliverables: m.deliverables
          .filter((d) => d.trim())
          .map((text, j) => ({ id: `D-${i + 1}-${j + 1}`, text, done: false })),
      }));
    addProject({
      id,
      name: analysis.suggestedName.trim() || 'New Project',
      clientId: client.id,
      basePrice: Number(basePrice) || 0,
      outOfScopeAdded: 0,
      deadline: analysis.suggestedDeadline || undefined,
      pendingOutOfScopeRequests: 0,
      status: 'In Progress',
      createdAt: nowDate(),
      milestones,
    });
    setContractSections(id, [
      { id: 'sec-2', title: 'Payment Terms', items: analysis.paymentTerms.filter((t) => t.trim()) },
      { id: 'sec-3', title: 'Rules', items: analysis.scopeRules.filter((r) => r.trim()) },
    ]);
    setOriginalContract(id, contractText.trim());
    logActivity(id, {
      type: 'project-created',
      title: 'Project created from contract',
      description: 'AI extraction used to seed milestones and contract sections',
    });
    setCreatedId(id);
    setStep(3);
  };

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-8">
      {/* Stepper */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors shrink-0 ${
                  i < step
                    ? 'bg-primary text-on-primary'
                    : i === step
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'bg-surface-container text-secondary border border-surface-container-highest'
                }`}
              >
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`hidden sm:block text-xs font-bold whitespace-nowrap ${i === step ? 'text-on-surface' : 'text-secondary'}`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px ${i < step ? 'bg-primary' : 'bg-surface-container-highest'}`} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1 — Paste the contract */}
        {step === 0 && (
          <motion.div
            key="step-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <SectionCard title="Client" subtitle="Who is this project for?">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="block font-label-caps text-secondary uppercase mb-1.5">Client</span>
                  <div className="relative">
                    <select
                      value={clientId}
                      onChange={(e) => setClientId(e.target.value)}
                      className={`${inputClass} appearance-none pr-9`}
                    >
                      {MOCK_CLIENTS.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <Building2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                  </div>
                </label>
                <label className="block">
                  <span className="block font-label-caps text-secondary uppercase mb-1.5">Base budget ($)</span>
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="15000"
                  />
                </label>
              </div>
            </SectionCard>

            <SectionCard
              title="Contract text"
              subtitle="Paste the signed agreement. The AI reads it and drafts the project structure."
            >
              <textarea
                className={`${inputClass} min-h-[220px] resize-y leading-relaxed`}
                value={contractText}
                onChange={(e) => setContractText(e.target.value)}
                placeholder="Paste the full contract here…"
              />
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-secondary font-medium flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" /> Try a sample:
                </span>
                {SAMPLE_CONTRACTS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setContractText(s.text)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                      contractText.trim() === s.text.trim()
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-lowest border border-surface-container-highest text-secondary hover:text-on-surface'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </SectionCard>

            <div className="flex justify-between items-center">
              <button onClick={onCancel} className={btnGhost}>Cancel</button>
              <button onClick={startAnalysis} disabled={!canAnalyze || analyzing} className={btnPrimary}>
                {analyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Reading contract…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Analyze Contract <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2 — AI analysis */}
        {step === 1 && analysis && (
          <motion.div
            key="step-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <SectionCard title="What the AI found" subtitle="Extracted from the contract text. You can edit everything on the next step.">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <p className="font-label-caps text-primary uppercase mb-1">Suggested name</p>
                  <p className="font-medium text-on-surface">{analysis.suggestedName}</p>
                </div>
                <div className="bg-surface-container-low border border-surface-container-highest rounded-lg p-4">
                  <p className="font-label-caps text-secondary uppercase mb-1">Deadline</p>
                  <p className="font-medium text-on-surface">
                    {analysis.suggestedDeadline
                      ? new Date(`${analysis.suggestedDeadline}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : 'Not specified'}
                  </p>
                </div>
                <div className="bg-surface-container-low border border-surface-container-highest rounded-lg p-4">
                  <p className="font-label-caps text-secondary uppercase mb-1">Milestones</p>
                  <p className="font-medium text-on-surface">{analysis.milestones.filter((m) => m.title.trim()).length}</p>
                </div>
              </div>
            </SectionCard>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <SectionCard title="Milestones & deliverables" className="md:col-span-2">
                <div className="space-y-3">
                  {analysis.milestones.map((m, i) => (
                    <div key={i} className="bg-surface-container-low rounded-lg p-3">
                      <div className="flex items-center gap-2.5">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-bold shrink-0">{i + 1}</span>
                        <span className="font-medium text-sm text-on-surface">{m.title || '—'}</span>
                      </div>
                      {m.deliverables.length > 0 && (
                        <ul className="mt-2 ml-8 space-y-1">
                          {m.deliverables.map((d, j) => (
                            <li key={j} className="flex items-center gap-2 text-xs text-on-surface-variant">
                              <span className="w-1 h-1 rounded-full bg-primary/40 shrink-0" />
                              {d || '—'}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </SectionCard>
              {(
                [
                  { id: 'paymentTerms', title: 'Payment terms' },
                  { id: 'scopeRules', title: 'Scope rules' },
                ] as const
              ).map(({ id, title }) => (
                <SectionCard key={id} title={title}>
                  <ul className="space-y-2">
                    {analysis[id].map((item, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                        <span className="text-sm text-on-surface-variant leading-relaxed">{item || '—'}</span>
                      </li>
                    ))}
                  </ul>
                </SectionCard>
              ))}
            </div>

            <div className="flex justify-between">
              <button onClick={() => setStep(0)} className={btnGhost}><ArrowLeft className="w-4 h-4" /> Back</button>
              <button onClick={() => setStep(2)} className={btnPrimary}>Review & Edit <ArrowRight className="w-4 h-4" /></button>
            </div>
          </motion.div>
        )}

        {/* STEP 3 — Review */}
        {step === 2 && analysis && (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <SectionCard title="Project details">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="block sm:col-span-2">
                  <span className="block font-label-caps text-secondary uppercase mb-1.5">Project name</span>
                  <input className={inputClass} value={analysis.suggestedName} onChange={(e) => patchAnalysis({ suggestedName: e.target.value })} />
                </label>
                <label className="block">
                  <span className="block font-label-caps text-secondary uppercase mb-1.5">Deadline</span>
                  <input
                    type="date"
                    className={inputClass}
                    value={analysis.suggestedDeadline}
                    onChange={(e) => patchAnalysis({ suggestedDeadline: e.target.value })}
                  />
                </label>
              </div>
              <p className="text-xs text-secondary mt-3 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5" /> Client: {client?.name} · Base budget: ${Number(basePrice || 0).toLocaleString('en-US')}
              </p>
            </SectionCard>

            <SectionCard title="Milestones & deliverables">
              <div className="space-y-4">
                {analysis.milestones.map((m, mi) => (
                  <div key={mi} className="bg-surface-container-low rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-surface-container text-secondary flex items-center justify-center text-[11px] font-bold shrink-0">
                        {mi + 1}
                      </span>
                      <input className={inputClass} value={m.title} onChange={(e) => setMilestoneTitle(mi, e.target.value)} placeholder="Milestone name" />
                      <button
                        onClick={() => patchAnalysis({ milestones: analysis.milestones.filter((_, x) => x !== mi) })}
                        className="p-2 rounded-lg hover:bg-surface-container text-secondary hover:text-error transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="ml-8 space-y-1.5">
                      {m.deliverables.map((d, di) => (
                        <div key={di} className="flex items-center gap-2">
                          <input
                            className={`${inputClass} text-xs`}
                            value={d}
                            onChange={(e) => setDeliverable(mi, di, e.target.value)}
                            placeholder="Deliverable"
                          />
                          <button
                            onClick={() => removeDeliverable(mi, di)}
                            className="p-1.5 rounded-lg hover:bg-surface-container text-secondary hover:text-error transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addDeliverable(mi)}
                        className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:opacity-80 transition-opacity"
                      >
                        <Plus className="w-3 h-3" /> Add deliverable
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => patchAnalysis({ milestones: [...analysis.milestones, { title: '', deliverables: [] }] })}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
                >
                  <Plus className="w-4 h-4" /> Add milestone
                </button>
              </div>
            </SectionCard>

            {(
                [
                  { id: 'paymentTerms', title: 'Payment terms' },
                  { id: 'scopeRules', title: 'Scope rules' },
                ] as const
              ).map(({ id, title }) => (
                <SectionCard key={id} title={title}>
                  <div className="space-y-2">
                    {analysis[id].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          className={inputClass}
                          value={item}
                          onChange={(e) => setItem(id, i, e.target.value)}
                          placeholder="Empty item"
                        />
                        <button
                          onClick={() => removeItem(id, i)}
                          className="p-2 rounded-lg hover:bg-surface-container text-secondary hover:text-error transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addItem(id)}
                      className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:opacity-80 transition-opacity"
                    >
                      <Plus className="w-4 h-4" /> Add item
                    </button>
                  </div>
                </SectionCard>
              ))}

            <div className="flex justify-between">
              <button onClick={() => setStep(1)} className={btnGhost}><ArrowLeft className="w-4 h-4" /> Back</button>
              <button onClick={createProject} className={btnPrimary}>
                Create project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4 — Done */}
        {step === 3 && createdId && (
          <motion.div
            key="step-3"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
              <PartyPopper className="w-8 h-8" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">Project created</h2>
            <p className="text-secondary mt-2 max-w-md mx-auto">
              {analysis?.suggestedName} was created for {client?.name}. Milestones and contract sections were seeded from the extraction.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button onClick={onCancel} className={btnGhost}>
                <RefreshCw className="w-4 h-4" /> Create another
              </button>
              <button onClick={() => onDone(createdId)} className={btnPrimary}>
                Open project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
