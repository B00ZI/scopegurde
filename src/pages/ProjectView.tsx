import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Plus, Users, Copy, Link2, MoreHorizontal, CheckCircle2, Circle, CircleDashed,
  ChevronDown, ChevronUp, Pencil, Trash2, X, Clock, Banknote, FileText,
  CalendarDays, Check, RotateCcw, Archive, ShieldCheck, Inbox,
} from 'lucide-react';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  MOCK_CLIENTS, MOCK_PROJECTS, MOCK_CHANGE_REQUESTS, MOCK_CONTRACT_SECTIONS,
  CLIENT_ROOM_TOKENS, MOCK_ORIGINAL_CONTRACT,
} from '../lib/mockData';
import {
  ChangeRequest, ChangeRequestStatus, ChangeScopeDecision, ContractSection,
  Milestone, ProjectStatus,
} from '../types';

const DAY_MS = 1000 * 60 * 60 * 24;

const PROJECT_STATUS_META: Record<ProjectStatus, string> = {
  'In Progress': 'bg-primary/10 text-primary border border-primary/20',
  'On Hold': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  'Completed': 'bg-[#065F46] text-white shadow-sm',
  'Cancelled': 'bg-error/10 text-error border border-error/20',
  'Archived': 'bg-surface-container text-secondary border border-surface-container-highest',
};

const MILESTONE_META: Record<Milestone['status'], { label: string; icon: typeof Circle; className: string }> = {
  Todo: { label: 'Not started', icon: Circle, className: 'text-secondary' },
  InProgress: { label: 'In progress', icon: CircleDashed, className: 'text-amber-500 dark:text-amber-400' },
  Done: { label: 'Done', icon: CheckCircle2, className: 'text-primary' },
};

const MILESTONE_STATUS_STYLES: Record<Milestone['status'], string> = {
  Todo: 'bg-surface-container text-on-surface shadow-sm',
  InProgress: 'bg-amber-500/15 text-amber-700 dark:text-amber-400',
  Done: 'bg-primary/15 text-primary',
};

const CR_DECISION_META: Record<ChangeScopeDecision, string> = {
  'In Scope': 'bg-primary/10 text-primary border border-primary/20',
  'Needs Review': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  'Out of Scope': 'bg-secondary/10 text-secondary border border-secondary/20',
};

const CR_STATUS_META: Record<ChangeRequestStatus, string> = {
  Pending: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  Sent: 'bg-secondary/10 text-secondary border border-secondary/20',
  Accepted: 'bg-primary/10 text-primary border border-primary/20',
  Rejected: 'bg-error/10 text-error border border-error/20',
};

const PROJECT_STATUSES: ProjectStatus[] = ['In Progress', 'On Hold', 'Completed', 'Cancelled', 'Archived'];

const REJECT_REASONS = ['Too expensive', 'Takes too much time', "Don't need it anymore", 'Want something different', 'Other'];

type CrTab = 'all' | ChangeRequestStatus;

type ModalKind =
  | { kind: 'add-milestone' }
  | { kind: 'edit-milestone'; milestone: Milestone }
  | { kind: 'add-deliverable'; milestoneId: string }
  | { kind: 'add-change-request' }
  | { kind: 'add-contract-section' }
  | { kind: 'edit-contract-section'; section: ContractSection }
  | { kind: 'edit-project' }
  | { kind: 'original-contract' }
  | null;

interface ConfirmState {
  title: string;
  message: string;
  isDestructive: boolean;
  confirmText?: string;
  onConfirm: () => void;
}

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function formatDate(iso?: string, withYear = false) {
  if (!iso) return 'No deadline';
  return new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(withYear ? { year: 'numeric' } : {}),
  });
}

function getDaysUntil(deadline: string) {
  const now = new Date();
  const target = new Date(`${deadline}T00:00:00`);
  return Math.round((target.getTime() - now.getTime()) / DAY_MS);
}

const inputClass =
  'w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl px-4 py-2.5 text-sm text-on-surface placeholder:text-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow shadow-sm';

const btnPrimary =
  'inline-flex items-center gap-2 bg-primary text-on-primary font-button px-4 py-2.5 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm';

const btnGhost =
  'inline-flex items-center gap-2 bg-surface-container-lowest border border-surface-container-highest text-on-surface hover:bg-surface-container font-button px-4 py-2.5 rounded-lg transition-colors shadow-sm text-sm';

const btnGhostSm =
  'inline-flex items-center gap-2 bg-surface-container-lowest border border-surface-container-highest text-on-surface hover:bg-surface-container font-button px-3.5 py-2 rounded-lg transition-colors shadow-sm text-xs';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block font-label-caps text-secondary uppercase mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div className="relative">
      <select value={value} onChange={(e) => onChange(e.target.value)} className={`${inputClass} appearance-none pr-9`}>
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
      <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
    </div>
  );
}

function Modal({
  title, subtitle, wide, onClose, children,
}: {
  title: string;
  subtitle?: string;
  wide?: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-start sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className={`bg-surface border border-surface-container-highest rounded-2xl p-6 w-full ${wide ? 'max-w-2xl' : 'max-w-lg'} shadow-2xl my-8 animate-in zoom-in-95 duration-200`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2 className="font-h3 text-on-surface">{title}</h2>
            {subtitle && <p className="font-body-sm text-secondary mt-1">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="p-2 -m-2 rounded-lg hover:bg-surface-container text-secondary transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/**
 * PROJECT VIEW
 *
 * The freelancer's workspace for a single project: milestones, change requests,
 * contract details and the client room. Everything is UI-only against mock data —
 * local state handles expansion, status changes and mock CRUD.
 */
export function ProjectViewPage({ projectId, onBack }: { projectId: string; onBack: () => void }) {
  const source = MOCK_PROJECTS.find((p) => p.id === projectId);
  const [projectMeta, setProjectMeta] = useState(source!);
  const [milestones, setMilestones] = useState<Milestone[]>(source?.milestones ?? []);
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>(
    MOCK_CHANGE_REQUESTS.filter((c) => c.projectId === projectId)
  );
  const [contractSections, setContractSections] = useState<ContractSection[]>(MOCK_CONTRACT_SECTIONS);
  const [roomToken, setRoomToken] = useState(CLIENT_ROOM_TOKENS[projectId] ?? 'xxxxxxxxxxxx');

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [modal, setModal] = useState<ModalKind>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [projectMenuOpen, setProjectMenuOpen] = useState(false);
  const [crTab, setCrTab] = useState<CrTab>('all');
  const [copied, setCopied] = useState(false);

  if (!source) {
    return (
      <div className="max-w-7xl mx-auto pt-2 pb-8">
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-12 text-center shadow-sm">
          <Inbox className="w-10 h-10 mx-auto text-secondary" />
          <p className="font-medium text-on-surface mt-4">Project not found.</p>
          <p className="font-body-sm text-secondary mt-1">It may have been removed.</p>
          <button onClick={onBack} className={`${btnPrimary} mt-6`}>Back</button>
        </div>
      </div>
    );
  }

  const client = MOCK_CLIENTS.find((c) => c.id === projectMeta.clientId);
  const clientName = client?.name ?? 'Unknown';
  const totalValue = projectMeta.basePrice + projectMeta.outOfScopeAdded;

  const done = milestones.filter((m) => m.status === 'Done').length;
  const total = milestones.length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const roomUrl = `scopeguard.app/r/${projectMeta.id}-${roomToken}`;

  const patch = (key: string, value: string) => setDraft((d) => ({ ...d, [key]: value }));
  const closeModal = () => {
    setModal(null);
    setProjectMenuOpen(false);
  };

  const toggleExpanded = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // --- Milestones ----------------------------------------------------------
  const setMilestoneStatus = (id: string, status: Milestone['status']) => {
    setMilestones((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  };

  const openAddMilestone = () => {
    setDraft({ title: '', description: '', deadline: '' });
    setModal({ kind: 'add-milestone' });
  };

  const openEditMilestone = (m: Milestone) => {
    setDraft({ title: m.title, description: m.description ?? '', deadline: m.deadline ?? '' });
    setModal({ kind: 'edit-milestone', milestone: m });
  };

  const addMilestone = () => {
    const title = draft.title?.trim();
    if (!title) return;
    setMilestones((prev) => [
      ...prev,
      {
        id: `M-${Date.now()}`,
        title,
        description: draft.description?.trim() || undefined,
        deadline: draft.deadline || undefined,
        status: 'Todo',
        deliverables: [],
      },
    ]);
    closeModal();
  };

  const updateMilestone = () => {
    if (!modal || modal.kind !== 'edit-milestone') return;
    const id = modal.milestone.id;
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              title: draft.title?.trim() || m.title,
              description: draft.description?.trim() || undefined,
              deadline: draft.deadline || undefined,
            }
          : m
      )
    );
    closeModal();
  };

  const confirmDeleteMilestone = (m: Milestone) => {
    setConfirm({
      title: `Delete "${m.title}"?`,
      message: 'The milestone and its deliverables will be removed. Progress and value are not affected.',
      isDestructive: true,
      confirmText: 'Delete milestone',
      onConfirm: () => setMilestones((prev) => prev.filter((x) => x.id !== m.id)),
    });
  };

  const openAddDeliverable = (milestoneId: string) => {
    setDraft({ deliverable: '' });
    setModal({ kind: 'add-deliverable', milestoneId });
  };

  const addDeliverable = () => {
    if (!modal || modal.kind !== 'add-deliverable') return;
    const value = draft.deliverable?.trim();
    if (!value) return;
    setMilestones((prev) =>
      prev.map((m) => (m.id === modal.milestoneId ? { ...m, deliverables: [...(m.deliverables ?? []), value] } : m))
    );
    closeModal();
  };

  const removeDeliverable = (milestoneId: string, index: number) => {
    setMilestones((prev) =>
      prev.map((m) =>
        m.id === milestoneId
          ? { ...m, deliverables: (m.deliverables ?? []).filter((_, i) => i !== index) }
          : m
      )
    );
  };

  // --- Change requests -----------------------------------------------------
  const openAddChangeRequest = () => {
    setDraft({
      title: '',
      description: '',
      source: 'Client',
      scopeDecision: 'Needs Review',
      extraTimeDays: '',
      priceAdjustment: '',
    });
    setModal({ kind: 'add-change-request' });
  };

  const addChangeRequest = () => {
    const title = draft.title?.trim();
    if (!title) return;
    const request: ChangeRequest = {
      id: `CR-${Date.now()}`,
      projectId: projectMeta.id,
      title,
      description: draft.description?.trim() || '',
      source: (draft.source as ChangeRequest['source']) || 'Client',
      scopeDecision: (draft.scopeDecision as ChangeScopeDecision) || 'Needs Review',
      status: 'Pending',
      extraTimeDays: Number(draft.extraTimeDays) || 0,
      priceAdjustment: Number(draft.priceAdjustment) || 0,
      dateRequested: new Date().toISOString().slice(0, 10),
    };
    setChangeRequests((prev) => [request, ...prev]);
    closeModal();
  };

  // --- Contract sections ---------------------------------------------------
  const openAddSection = () => {
    setDraft({ title: '', items: '' });
    setModal({ kind: 'add-contract-section' });
  };

  const openEditSection = (s: ContractSection) => {
    setDraft({ title: s.title, items: s.items.join('\n') });
    setModal({ kind: 'edit-contract-section', section: s });
  };

  const saveContractSection = () => {
    const title = draft.title?.trim();
    if (!title) return;
    const items = (draft.items ?? '').split('\n').map((s) => s.trim()).filter(Boolean);
    if (modal?.kind === 'edit-contract-section') {
      const id = modal.section.id;
      setContractSections((prev) => prev.map((s) => (s.id === id ? { ...s, title, items } : s)));
    } else {
      setContractSections((prev) => [...prev, { id: `sec-${Date.now()}`, title, items }]);
    }
    closeModal();
  };

  const moveSection = (id: string, dir: -1 | 1) => {
    setContractSections((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const confirmDeleteSection = (s: ContractSection) => {
    setConfirm({
      title: `Delete "${s.title}"?`,
      message: 'The section and its items will be removed from the working contract.',
      isDestructive: true,
      confirmText: 'Delete section',
      onConfirm: () => setContractSections((prev) => prev.filter((x) => x.id !== s.id)),
    });
  };

  const removeSectionItem = (sectionId: string, index: number) => {
    setContractSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, items: s.items.filter((_, i) => i !== index) } : s))
    );
  };

  // --- Project / room ------------------------------------------------------
  const openEditProject = () => {
    setDraft({
      name: projectMeta.name,
      status: projectMeta.status,
      deadline: projectMeta.deadline ?? '',
      basePrice: String(projectMeta.basePrice),
    });
    setModal({ kind: 'edit-project' });
  };

  const saveProject = () => {
    setProjectMeta((p) => ({
      ...p,
      name: draft.name?.trim() || p.name,
      status: (draft.status as ProjectStatus) || p.status,
      deadline: draft.deadline || undefined,
      basePrice: Number(draft.basePrice) || p.basePrice,
    }));
    closeModal();
  };

  const confirmArchive = () => {
    setConfirm({
      title: `Archive ${projectMeta.name}?`,
      message: 'The project moves to Project History and disappears from the dashboard. The client room stays live.',
      isDestructive: false,
      confirmText: 'Archive project',
      onConfirm: () => {},
    });
  };

  const confirmDeleteProject = () => {
    setConfirm({
      title: `Delete ${projectMeta.name}?`,
      message: 'All milestones, change requests and room history will be permanently removed. This cannot be undone.',
      isDestructive: true,
      confirmText: 'Delete project',
      onConfirm: () => {},
    });
  };

  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${roomUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — mock prototype
    }
  };

  const confirmRegenerateRoom = () => {
    setConfirm({
      title: 'Regenerate room link?',
      message: 'The current link will stop working immediately. Share the new link with the client.',
      isDestructive: false,
      confirmText: 'Regenerate link',
      onConfirm: () => {
        setRoomToken(Math.random().toString(36).slice(2, 10));
        setCopied(false);
      },
    });
  };

  // --- Tabs for change requests --------------------------------------------
  const crCounts: Record<CrTab, number> = { all: changeRequests.length, Pending: 0, Sent: 0, Accepted: 0, Rejected: 0 };
  changeRequests.forEach((cr) => { crCounts[cr.status] += 1; });
  const crTabs: { key: CrTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'Pending', label: 'Pending' },
    { key: 'Sent', label: 'Sent' },
    { key: 'Accepted', label: 'Accepted' },
    { key: 'Rejected', label: 'Rejected' },
  ];
  const visibleRequests = crTab === 'all' ? changeRequests : changeRequests.filter((cr) => cr.status === crTab);

  const projectDeadlineMeta = projectMeta.deadline
    ? (() => {
        const d = getDaysUntil(projectMeta.deadline);
        return d < 0 ? { text: 'Overdue', className: 'text-error' } : d === 0 ? { text: 'Today', className: 'text-primary' } : { text: `in ${d}d`, className: 'text-secondary' };
      })()
    : null;

  const milestoneDeadlineMeta = (m: Milestone) => {
    if (!m.deadline) return { due: 'No deadline', overdue: false };
    const d = getDaysUntil(m.deadline);
    return { due: d < 0 ? `Overdue · due ${formatDate(m.deadline)}` : `Due ${formatDate(m.deadline)}`, overdue: d < 0 };
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-8">
      {/* Project header */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 sm:p-7 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">{projectMeta.name}</h1>
              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${PROJECT_STATUS_META[projectMeta.status]}`}>
                {projectMeta.status}
              </span>
            </div>
            <p className="text-sm text-secondary mt-1.5">#{projectMeta.id} · {clientName}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 mt-4 text-xs text-secondary">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />Created {formatDate(projectMeta.createdAt, true)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />Deadline {formatDate(projectMeta.deadline, true)}
                {projectDeadlineMeta && (
                  <span className={`font-bold ${projectDeadlineMeta.className}`}>{projectDeadlineMeta.text}</span>
                )}
              </span>
            </div>
          </div>

          <div className="lg:text-right shrink-0">
            <p className="font-label-caps text-secondary uppercase mb-1">Current Value</p>
            <p className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">{formatCurrency(totalValue)}</p>
            <p className="text-xs text-secondary mt-1">
              {formatCurrency(projectMeta.basePrice)} original
              {projectMeta.outOfScopeAdded > 0 ? ` + ${formatCurrency(projectMeta.outOfScopeAdded)} approved` : ''}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-surface-container-highest flex flex-wrap items-center gap-2.5">
          <button onClick={openAddMilestone} className={btnGhost}>
            <Plus className="w-4 h-4" />Add Milestone
          </button>
          <button onClick={openAddChangeRequest} className={btnGhost}>
            <Plus className="w-4 h-4" />Add Change Request
          </button>
          <button
            onClick={() => document.getElementById('client-room')?.scrollIntoView({ behavior: 'smooth' })}
            className={btnPrimary}
          >
            <Users className="w-4 h-4" />Client Room
          </button>
          <button
            onClick={copyRoomLink}
            className="p-2.5 rounded-lg border border-surface-container-highest bg-surface-container-lowest text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
            title="Copy room link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          <div className="relative">
            <button
              onClick={() => setProjectMenuOpen((o) => !o)}
              className="p-2.5 rounded-lg hover:bg-surface-container text-on-surface transition-colors"
              title="Project actions"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {projectMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setProjectMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 z-50 w-52 bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-lg py-1.5">
                  <button
                    onClick={() => { setProjectMenuOpen(false); openEditProject(); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <Pencil className="w-4 h-4 text-secondary" />Edit project
                  </button>
                  <button
                    onClick={() => { setProjectMenuOpen(false); confirmArchive(); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container flex items-center gap-2.5 transition-colors"
                  >
                    <Archive className="w-4 h-4 text-secondary" />Archive project
                  </button>
                  <div className="my-1 border-t border-surface-container-highest" />
                  <button
                    onClick={() => { setProjectMenuOpen(false); confirmDeleteProject(); }}
                    className="w-full text-left px-4 py-2 text-sm font-medium text-error hover:bg-error-container/40 flex items-center gap-2.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />Delete project
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Project progress */}
      <div className="mt-6 bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-button text-on-surface">Project Progress</p>
          <p className="text-xs text-secondary font-medium">
            {done} of {total} milestone{total === 1 ? '' : 's'} complete
          </p>
        </div>
        <div className="mt-3 h-2 bg-surface-container-highest rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-primary rounded-full"
          />
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {/* Milestones */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="font-h3 text-on-surface">Milestones</h3>
            <span className="text-xs text-secondary font-medium">{done} of {total} done</span>
          </div>

          {milestones.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-surface-container-highest rounded-xl p-10 text-center">
              <p className="font-medium text-on-surface">No milestones yet.</p>
              <p className="font-body-sm text-secondary mt-1 mb-5">Add the first one to start tracking progress.</p>
              <button onClick={openAddMilestone} className={btnPrimary}>
                <Plus className="w-4 h-4" />Add Milestone
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {milestones.map((m) => {
                const meta = MILESTONE_META[m.status];
                const StatusIcon = meta.icon;
                const dl = m.deliverables?.length ?? 0;
                const deadlineMeta = milestoneDeadlineMeta(m);
                const isOpen = expanded.has(m.id);
                return (
                  <div key={m.id} className="bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm overflow-hidden">
                    <button
                      onClick={() => toggleExpanded(m.id)}
                      className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:px-5 text-left hover:bg-surface transition-colors"
                    >
                      <StatusIcon className={`w-5 h-5 shrink-0 ${meta.className}`} />
                      <span className="flex-1 min-w-0">
                        <span className="block font-medium text-on-surface truncate">{m.title}</span>
                        <span className="block text-xs mt-0.5">
                          <span className={deadlineMeta.overdue ? 'text-error font-medium' : 'text-secondary'}>{deadlineMeta.due}</span>
                          <span className="text-secondary"> · {dl} deliverable{dl === 1 ? '' : 's'}</span>
                        </span>
                      </span>
                      <span className="hidden sm:inline text-xs font-bold px-2.5 py-1 rounded-full bg-surface-container-low text-secondary">
                        {meta.label}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-secondary shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-4 sm:px-5 pb-5 pt-4 border-t border-surface-container-highest">
                            {m.description && (
                              <p className="text-sm text-on-surface-variant leading-relaxed">{m.description}</p>
                            )}

                            <div className="mt-4">
                              <p className="font-label-caps text-secondary uppercase mb-2">Deliverables</p>
                              {m.deliverables && m.deliverables.length > 0 ? (
                                <ul className="space-y-1.5">
                                  {m.deliverables.map((d, i) => (
                                    <li key={i} className="flex items-center gap-2 group">
                                      <Check className="w-3.5 h-3.5 text-primary shrink-0" />
                                      <span className="flex-1 text-sm text-on-surface">{d}</span>
                                      <button
                                        onClick={() => removeDeliverable(m.id, i)}
                                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-surface-container text-secondary transition-opacity"
                                        title="Delete deliverable"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-sm text-secondary">No deliverables yet.</p>
                              )}
                            </div>

                            <div className="flex items-center gap-1.5 mt-4 text-xs text-secondary">
                              <CalendarDays className="w-3.5 h-3.5" />
                              {m.deadline ? (
                                <span className={deadlineMeta.overdue ? 'text-error font-medium' : ''}>
                                  {deadlineMeta.overdue ? `Overdue · ${formatDate(m.deadline)}` : `Deadline ${formatDate(m.deadline)}`}
                                </span>
                              ) : (
                                <span>No deadline set</span>
                              )}
                            </div>

                            <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-surface-container-highest">
                              <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-lg">
                                {(['Todo', 'InProgress', 'Done'] as Milestone['status'][]).map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => setMilestoneStatus(m.id, s)}
                                    className={`px-3 py-1.5 text-[11px] font-bold rounded-md transition-colors ${
                                      m.status === s ? MILESTONE_STATUS_STYLES[s] : 'text-secondary hover:text-on-surface'
                                    }`}
                                  >
                                    {MILESTONE_META[s].label}
                                  </button>
                                ))}
                              </div>
                              <div className="flex-1" />
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => openEditMilestone(m)}
                                  className="p-2 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                                  title="Edit milestone"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => openAddDeliverable(m.id)}
                                  className="p-2 rounded-lg hover:bg-surface-container text-secondary hover:text-on-surface transition-colors"
                                  title="Add deliverable"
                                >
                                  <Plus className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => confirmDeleteMilestone(m)}
                                  className="p-2 rounded-lg hover:bg-surface-container text-secondary hover:text-error transition-colors"
                                  title="Delete milestone"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Change Requests */}
        <section>
          <div className="flex items-center justify-between gap-3 mb-6">
            <h3 className="font-h3 text-on-surface">Change Requests</h3>
            <button onClick={openAddChangeRequest} className={btnGhostSm}>
              <Plus className="w-4 h-4" />Add Change Request
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {crTabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setCrTab(t.key)}
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors ${
                  crTab === t.key
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-surface-container-lowest border border-surface-container-highest text-secondary hover:text-on-surface'
                }`}
              >
                {t.label} <span className="opacity-70">{crCounts[t.key]}</span>
              </button>
            ))}
          </div>

          {visibleRequests.length === 0 ? (
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-10 text-center">
              <p className="font-medium text-on-surface">
                No {crTab === 'all' ? '' : crTab.toLowerCase() + ' '}change requests.
              </p>
              <p className="font-body-sm text-secondary mt-1">Add one to start tracking a scope change.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {visibleRequests.map((cr) => (
                <div key={cr.id} className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${CR_DECISION_META[cr.scopeDecision]}`}>
                      {cr.scopeDecision}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${CR_STATUS_META[cr.status]}`}>
                      {cr.status}
                    </span>
                  </div>

                  <div>
                    <p className="font-medium text-on-surface">{cr.title}</p>
                    <p className="font-body-sm text-secondary mt-1 line-clamp-2">{cr.description}</p>
                  </div>

                  <p className="text-xs text-secondary">{cr.source} request · {formatDate(cr.dateRequested, true)}</p>

                  {cr.status === 'Accepted' && (
                    <div className="bg-primary/10 text-primary rounded-lg p-3 flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <p className="text-xs font-bold">
                        Accepted{cr.clientDecision?.date ? ` · ${formatDate(cr.clientDecision.date, true)}` : ''}
                      </p>
                    </div>
                  )}
                  {cr.status === 'Rejected' && cr.clientDecision?.reason && (
                    <div className="bg-error-container/60 text-on-error-container rounded-lg p-3">
                      <p className="text-xs font-bold">Rejected — {cr.clientDecision.reason}</p>
                      {cr.clientDecision.note && <p className="text-xs mt-0.5 opacity-90">{cr.clientDecision.note}</p>}
                    </div>
                  )}

                  <div className="flex items-center gap-4 pt-3 mt-auto border-t border-surface-container-highest text-xs text-secondary">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />+{cr.extraTimeDays} day{cr.extraTimeDays === 1 ? '' : 's'}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Banknote className="w-3.5 h-3.5" />+{formatCurrency(cr.priceAdjustment)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Contract Details */}
        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <h3 className="font-h3 text-on-surface">Contract Details</h3>
            <div className="flex gap-2">
              <button onClick={openAddSection} className={btnGhostSm}>
                <Plus className="w-4 h-4" />Add section
              </button>
              <button onClick={() => setModal({ kind: 'original-contract' })} className={btnGhostSm}>
                <FileText className="w-4 h-4" />View Original Contract
              </button>
            </div>
          </div>

          {contractSections.length === 0 ? (
            <div className="bg-surface-container-lowest border border-dashed border-surface-container-highest rounded-xl p-10 text-center">
              <p className="font-medium text-on-surface">No contract sections yet.</p>
              <p className="font-body-sm text-secondary mt-1 mb-5">Capture the agreed terms as editable sections.</p>
              <button onClick={openAddSection} className={btnPrimary}>
                <Plus className="w-4 h-4" />Add section
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {contractSections.map((sec, i) => (
                <div key={sec.id} className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-0.5 min-w-0">
                      <button
                        onClick={() => moveSection(sec.id, -1)}
                        disabled={i === 0}
                        className="p-1.5 rounded-md hover:bg-surface-container text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveSection(sec.id, 1)}
                        disabled={i === contractSections.length - 1}
                        className="p-1.5 rounded-md hover:bg-surface-container text-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                        title="Move down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <h4 className="font-button text-on-surface ml-1 truncate">{sec.title}</h4>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => openEditSection(sec)}
                        className="p-2 rounded-md hover:bg-surface-container text-secondary transition-colors"
                        title="Edit section"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => confirmDeleteSection(sec)}
                        className="p-2 rounded-md hover:bg-surface-container text-secondary hover:text-error transition-colors"
                        title="Delete section"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {sec.items.length === 0 ? (
                    <p className="text-sm text-secondary">No items in this section.</p>
                  ) : (
                    <ul className="space-y-2">
                      {sec.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-start gap-2.5 group">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary/60 mt-2 shrink-0" />
                          <span className="flex-1 text-sm text-on-surface-variant leading-relaxed">{item}</span>
                          <button
                            onClick={() => removeSectionItem(sec.id, itemIdx)}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-surface-container text-secondary transition-opacity"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Client Room */}
        <section id="client-room" className="scroll-mt-24">
          <h3 className="font-h3 text-on-surface mb-6">Client Room</h3>
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="font-button text-on-surface">Share the room with {clientName}</p>
                <p className="font-body-sm text-secondary mt-1 max-w-2xl">
                  The client follows milestones, reviews change requests and talks to you — no account needed.
                </p>
              </div>
            </div>

            <div className="mt-5 flex flex-col sm:flex-row gap-2.5">
              <div className="flex-1 min-w-0 flex items-center gap-2.5 bg-surface-container-low border border-surface-container-highest rounded-lg px-4 py-3">
                <Link2 className="w-4 h-4 text-secondary shrink-0" />
                <span className="text-sm text-on-surface font-medium font-mono truncate">{roomUrl}</span>
              </div>
              <button onClick={copyRoomLink} className={`${btnPrimary} shrink-0`}>
                <Copy className="w-4 h-4" />{copied ? 'Copied' : 'Copy Link'}
              </button>
              <button onClick={confirmRegenerateRoom} className={`${btnGhost} shrink-0`}>
                <RotateCcw className="w-4 h-4" />Regenerate
              </button>
            </div>

            <p className="text-xs text-secondary mt-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              The link uses an unguessable token. Regenerating it immediately invalidates the old one.
            </p>
          </div>
        </section>
      </div>

      {/* --- Modals --- */}
      {modal?.kind === 'add-milestone' && (
        <Modal title="Add Milestone" subtitle="Break the project down into trackable steps." onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Title">
              <input className={inputClass} value={draft.title ?? ''} onChange={(e) => patch('title', e.target.value)} placeholder="e.g. Homepage design" />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[80px] resize-y leading-relaxed`}
                value={draft.description ?? ''}
                onChange={(e) => patch('description', e.target.value)}
                placeholder="What does this milestone cover?"
              />
            </Field>
            <Field label="Deadline (optional)">
              <input type="date" className={inputClass} value={draft.deadline ?? ''} onChange={(e) => patch('deadline', e.target.value)} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={addMilestone} className={btnPrimary}>Add milestone</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.kind === 'edit-milestone' && (
        <Modal title="Edit Milestone" subtitle="Update the title, description or deadline." onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Title">
              <input className={inputClass} value={draft.title ?? ''} onChange={(e) => patch('title', e.target.value)} />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[80px] resize-y leading-relaxed`}
                value={draft.description ?? ''}
                onChange={(e) => patch('description', e.target.value)}
              />
            </Field>
            <Field label="Deadline (optional)">
              <input type="date" className={inputClass} value={draft.deadline ?? ''} onChange={(e) => patch('deadline', e.target.value)} />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={updateMilestone} className={btnPrimary}>Save changes</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.kind === 'add-deliverable' && (
        <Modal
          title="Add Deliverable"
          subtitle={milestones.find((m) => m.id === modal.milestoneId)?.title}
          onClose={closeModal}
        >
          <div className="space-y-4">
            <Field label="Deliverable">
              <input
                className={inputClass}
                value={draft.deliverable ?? ''}
                onChange={(e) => patch('deliverable', e.target.value)}
                placeholder="e.g. Homepage design"
                onKeyDown={(e) => { if (e.key === 'Enter') addDeliverable(); }}
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={addDeliverable} className={btnPrimary}>Add deliverable</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.kind === 'add-change-request' && (
        <Modal
          title="Add Change Request"
          subtitle="Record a scope change. AI scope analysis and the client review come next."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <Field label="Title">
              <input className={inputClass} value={draft.title ?? ''} onChange={(e) => patch('title', e.target.value)} placeholder="e.g. Dark mode" />
            </Field>
            <Field label="Description">
              <textarea
                className={`${inputClass} min-h-[80px] resize-y leading-relaxed`}
                value={draft.description ?? ''}
                onChange={(e) => patch('description', e.target.value)}
                placeholder="What changed and what does it involve?"
              />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Source">
                <Select value={draft.source ?? 'Client'} onChange={(v) => patch('source', v)} options={['Client', 'Team', 'AI-detected']} />
              </Field>
              <Field label="Scope decision">
                <Select value={draft.scopeDecision ?? 'Needs Review'} onChange={(v) => patch('scopeDecision', v)} options={['In Scope', 'Needs Review', 'Out of Scope']} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Added time (days)">
                <input type="number" min="0" className={inputClass} value={draft.extraTimeDays ?? ''} onChange={(e) => patch('extraTimeDays', e.target.value)} placeholder="0" />
              </Field>
              <Field label="Price adjustment ($)">
                <input type="number" min="0" className={inputClass} value={draft.priceAdjustment ?? ''} onChange={(e) => patch('priceAdjustment', e.target.value)} placeholder="0" />
              </Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={addChangeRequest} className={btnPrimary}>Add request</button>
            </div>
          </div>
        </Modal>
      )}

      {(modal?.kind === 'add-contract-section' || modal?.kind === 'edit-contract-section') && (
        <Modal
          title={modal.kind === 'edit-contract-section' ? 'Edit Section' : 'Add Contract Section'}
          subtitle="Capture the agreed terms. Items are shown as a list."
          onClose={closeModal}
        >
          <div className="space-y-4">
            <Field label="Section title">
              <input className={inputClass} value={draft.title ?? ''} onChange={(e) => patch('title', e.target.value)} placeholder="e.g. Payment Terms" />
            </Field>
            <Field label="Items">
              <textarea
                className={`${inputClass} min-h-[140px] resize-y leading-relaxed`}
                value={draft.items ?? ''}
                onChange={(e) => patch('items', e.target.value)}
                placeholder={'50% upfront before kickoff\n25% on design approval'}
              />
            </Field>
            <p className="text-xs text-secondary -mt-2">One item per line.</p>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={saveContractSection} className={btnPrimary}>
                {modal.kind === 'edit-contract-section' ? 'Save changes' : 'Add section'}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.kind === 'edit-project' && (
        <Modal title="Edit Project" subtitle="Update the project details shown on this page." onClose={closeModal}>
          <div className="space-y-4">
            <Field label="Project name">
              <input className={inputClass} value={draft.name ?? ''} onChange={(e) => patch('name', e.target.value)} />
            </Field>
            <Field label="Status">
              <Select value={draft.status ?? 'In Progress'} onChange={(v) => patch('status', v)} options={PROJECT_STATUSES} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Deadline (optional)">
                <input type="date" className={inputClass} value={draft.deadline ?? ''} onChange={(e) => patch('deadline', e.target.value)} />
              </Field>
              <Field label="Base price ($)">
                <input type="number" min="0" className={inputClass} value={draft.basePrice ?? ''} onChange={(e) => patch('basePrice', e.target.value)} />
              </Field>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button onClick={closeModal} className="px-4 py-2.5 font-button text-secondary hover:text-on-surface transition-colors">Cancel</button>
              <button onClick={saveProject} className={btnPrimary}>Save changes</button>
            </div>
          </div>
        </Modal>
      )}

      {modal?.kind === 'original-contract' && (
        <Modal
          title="Original Contract"
          subtitle="The untouched text pasted when the project was created."
          wide
          onClose={closeModal}
        >
          <div className="bg-surface-container-low border border-surface-container-highest rounded-lg p-4 text-xs font-medium text-secondary mb-4 flex items-start gap-2">
            <Inbox className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Source text — the working Contract Details above are editable and independent from this.</span>
          </div>
          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {(MOCK_ORIGINAL_CONTRACT[projectId] ?? '').split('\n\n').filter(Boolean).map((paragraph, i) => (
              <p key={i} className="text-sm text-on-surface-variant leading-relaxed whitespace-pre-wrap">{paragraph}</p>
            ))}
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={!!confirm}
        title={confirm?.title ?? ''}
        message={confirm?.message ?? ''}
        confirmText={confirm?.confirmText}
        isDestructive={confirm?.isDestructive ?? false}
        onConfirm={() => {
          confirm?.onConfirm();
          setConfirm(null);
        }}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
