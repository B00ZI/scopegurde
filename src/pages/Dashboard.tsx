import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Briefcase, BadgeCheck, CalendarClock, Inbox, Hourglass, Search, Filter, Plus, ArrowDown, ArrowUp, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { StatCard } from '../components/StatCard';
import { MOCK_CLIENTS, MOCK_ATTENTION_ITEMS } from '../lib/mockData';
import { useAllChangeRequests, useProjects } from '../lib/appStore';
import { AttentionType, Milestone, Project } from '../types';

const DAY_MS = 1000 * 60 * 60 * 24;

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function getDaysUntil(deadline: string) {
  const now = new Date();
  const target = new Date(`${deadline}T00:00:00`);
  return Math.round((target.getTime() - now.getTime()) / DAY_MS);
}

function formatDeadline(deadline: string) {
  return new Date(`${deadline}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Milestone progress: count of done/total. Percentage is NOT the primary truth. */
function milestoneProgress(milestones: Milestone[]) {
  const total = milestones.length;
  const done = milestones.filter((m) => m.status === 'Done').length;
  return { done, total, pct: total ? Math.round((done / total) * 100) : 0 };
}

const ATTENTION_META: Record<AttentionType, { label: string; badgeClass: string }> = {
  'scope-decision': {
    label: 'Scope decision',
    badgeClass: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  },
  'change-proposal': {
    label: 'Change proposal',
    badgeClass: 'bg-primary/10 text-primary border border-primary/20',
  },
  'overdue-milestone': {
    label: 'Overdue milestone',
    badgeClass: 'bg-error-container text-on-error-container border border-error/20',
  },
};

export function DashboardPage({
  onNewProject,
  onSelectProject,
  onViewHistory,
}: {
  onNewProject: () => void;
  onSelectProject?: (projectId: string) => void;
  onViewHistory: () => void;
}) {
  const projects = useProjects();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ status: '', deadline: '', client: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'deadline', direction: 'asc' });

  const allChangeRequests = useAllChangeRequests();

  const clientName = (clientId: string) => MOCK_CLIENTS.find((c) => c.id === clientId)?.name ?? 'Unknown';
  const projectName = (projectId: string) => projects.find((p) => p.id === projectId)?.name ?? 'Unknown';

  const attentionItems = MOCK_ATTENTION_ITEMS;

  const isActiveProject = (p: Project) => p.status === 'In Progress' || p.status === 'On Hold';

  const isCurrentMonth = (dateStr?: string) => {
    if (!dateStr) return false;
    const now = new Date();
    const d = new Date(`${dateStr}T00:00:00`);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  };

  const activeProjects = useMemo(() => projects.filter(isActiveProject), [projects]);

  const completedThisMonth = useMemo(
    () => projects.filter((p) => p.status === 'Completed' && isCurrentMonth(p.completedAt)),
    [projects]
  );
  const completedValueThisMonth = completedThisMonth.reduce((sum, p) => sum + p.basePrice + p.outOfScopeAdded, 0);

  const upcomingDeadlines = useMemo(
    () => activeProjects.filter((p) => {
      if (!p.deadline) return false;
      const d = getDaysUntil(p.deadline);
      return d >= 0 && d <= 7;
    }).length,
    [activeProjects]
  );
  const waitingForYou = useMemo(
    () => activeProjects.reduce((sum, p) => sum + p.pendingOutOfScopeRequests, 0),
    [activeProjects]
  );
  const waitingForClient = useMemo(
    () => allChangeRequests.filter((cr) => cr.status === 'Sent').length,
    [allChangeRequests]
  );

  const stats = [
    {
      label: 'Upcoming Deadlines',
      value: String(upcomingDeadlines),
      trend: 'Next 7 days',
      icon: CalendarClock,
      onClick: () => {
        setFilters((prev) => ({ ...prev, deadline: '7' }));
        setIsFilterOpen(true);
      },
    },
    {
      label: 'Needs Your Action',
      value: String(waitingForYou),
      trend: 'Changes to review',
      icon: Inbox,
      onClick: () => {
        document.getElementById('needs-attention')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
    },
    {
      label: 'Awaiting Client',
      value: String(waitingForClient),
      trend: 'Sent for approval',
      icon: Hourglass,
    },
  ];

  const filteredProjects = activeProjects.filter((p) => {
    const client = clientName(p.clientId);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filters.status && p.status !== filters.status) return false;
    if (filters.client && client !== filters.client) return false;

    if (filters.deadline) {
      if (!p.deadline) return false;
      const days = getDaysUntil(p.deadline);
      if (filters.deadline === 'overdue') {
        if (days >= 0) return false;
      } else {
        if (days < 0 || days > parseInt(filters.deadline, 10)) return false;
      }
    }

    return true;
  });

  const sortedProjects = useMemo(() => {
    const items = [...filteredProjects];
    if (sortConfig) {
      items.sort((a, b) => {
        let aVal: any;
        let bVal: any;

        switch (sortConfig.key) {
          case 'client':
            aVal = clientName(a.clientId).toLowerCase();
            bVal = clientName(b.clientId).toLowerCase();
            break;
          case 'name':
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case 'progress':
            aVal = milestoneProgress(a.milestones).pct;
            bVal = milestoneProgress(b.milestones).pct;
            break;
          case 'value':
            aVal = a.basePrice + a.outOfScopeAdded;
            bVal = b.basePrice + b.outOfScopeAdded;
            break;
          case 'deadline':
            aVal = a.deadline ? new Date(`${a.deadline}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
            bVal = b.deadline ? new Date(`${b.deadline}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
            break;
          default:
            aVal = a[sortConfig.key as keyof Project];
            bVal = b[sortConfig.key as keyof Project];
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return items;
  }, [filteredProjects, sortConfig]);

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.deadline ? 1 : 0) + (filters.client ? 1 : 0);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else direction = null;
    }

    if (direction) {
      setSortConfig({ key, direction });
    } else {
      setSortConfig(null);
    }
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-30 ml-1 transition-opacity" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-3 h-3 opacity-100 ml-1 text-primary" />
      : <ArrowDown className="w-3 h-3 opacity-100 ml-1 text-primary" />;
  };

  const renderDeadlineCell = (deadline?: string) => {
    if (!deadline) return <span className="text-secondary">No deadline</span>;
    const days = getDaysUntil(deadline);
    const overdue = days < 0;
    return (
      <div>
        <p className="font-medium text-on-surface">{formatDeadline(deadline)}</p>
        <p className={`text-xs ${overdue ? 'text-error' : 'text-secondary'}`}>
          {overdue ? 'Overdue' : days === 0 ? 'Today' : `in ${days}d`}
        </p>
      </div>
    );
  };

  const renderMilestoneProgress = (milestones: Milestone[]) => {
    const { done, total, pct } = milestoneProgress(milestones);
    return (
      <div className="flex items-center gap-3" title={`${done} / ${total} milestones`}>
        <div className="w-20 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs text-secondary whitespace-nowrap">{done}/{total}</span>
      </div>
    );
  };

  const renderValue = (p: Project) => {
    const total = p.basePrice + p.outOfScopeAdded;
    return (
      <div>
        <p className="font-medium text-on-surface">{formatCurrency(total)}</p>
        <p className="text-xs text-secondary">
          {formatCurrency(p.basePrice)} original
          {p.outOfScopeAdded > 0 ? ` + ${formatCurrency(p.outOfScopeAdded)} approved` : ''}
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-8">
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your active projects and contract performance."
        actions={
          <button
            onClick={onNewProject}
            className="flex items-center gap-2 bg-primary text-on-primary font-button px-4 sm:px-5 py-2.5 sm:py-3 rounded-lg hover:opacity-90 transition-all shadow-sm active:scale-95 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Project</span>
            <span className="sm:hidden">New</span>
          </button>
        }
      />

      <div className="space-y-4 sm:space-y-6 mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Hero Metric: Completed Value This Month (80%) */}
          <div className="lg:col-span-4 relative overflow-hidden bg-primary text-on-primary rounded-xl p-5 sm:p-7 shadow-sm">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-2">Completed This Month</h3>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl sm:text-4xl font-bold tracking-tight">{formatCurrency(completedValueThisMonth)}</p>
                  <span className="text-xs sm:text-sm font-medium opacity-90">
                    +{completedThisMonth.length} project{completedThisMonth.length === 1 ? '' : 's'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 opacity-90">
                <BadgeCheck className="w-5 h-5" />
                <span className="text-xs font-medium">Agreed value closed this month</span>
              </div>
            </div>
            <BadgeCheck className="absolute -right-3 -bottom-6 w-32 h-32 opacity-10" />
          </div>

          {/* Active Projects (20%) */}
          <div
            onClick={() => {
              setFilters({ status: '', deadline: '', client: '' });
              setSearchTerm('');
            }}
            className="lg:col-span-1 flex flex-col justify-center relative overflow-hidden bg-surface-container-lowest border border-surface-container-highest rounded-xl p-5 shadow-sm cursor-pointer hover:border-primary/30 hover:shadow-md hover:bg-surface-container-low group transition-all duration-200"
          >
            <div className="relative z-10">
              <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider mb-3">Active Projects</h3>
              <p className="text-3xl sm:text-4xl font-bold text-on-surface tracking-tight">{activeProjects.length}</p>
              <p className="text-xs text-secondary mt-2">In progress now</p>
            </div>
            <Briefcase className="absolute -right-2 -bottom-4 w-24 h-24 opacity-[0.06] dark:opacity-[0.08] text-primary transition-transform duration-300 group-hover:scale-105" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {stats.map((stat) => {
            const { label, value, trend, icon, onClick } = stat;
            return (
              <StatCard
                key={label}
                label={label}
                value={value}
                trend={trend}
                icon={icon}
                onClick={onClick}
              />
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Needs Attention — only freelancer-action items */}
        <section id="needs-attention">
          <h3 className="font-h3 text-on-surface mb-6">Needs Attention</h3>

          {attentionItems.length === 0 ? (
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg p-8 text-center shadow-sm">
              <p className="font-medium text-on-surface">You're all caught up.</p>
              <p className="font-body-sm text-secondary mt-1">Nothing needs your attention right now.</p>
            </div>
          ) : (
            <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-surface-container-highest">
                      <th className="py-4 px-6 font-label-caps text-secondary uppercase">Project</th>
                      <th className="py-4 px-6 font-label-caps text-secondary uppercase">Issue</th>
                      <th className="py-4 px-6 font-label-caps text-secondary uppercase">Details</th>
                    </tr>
                  </thead>
                  <tbody className="font-body-sm">
                    {attentionItems.map((item) => {
                      const meta = ATTENTION_META[item.type];
                      return (
                        <tr
                          key={item.id}
                          onClick={() => onSelectProject?.(item.projectId)}
                          className="border-b border-surface-container-highest last:border-b-0 hover:bg-surface transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6">
                            <p className="font-medium text-on-surface">{projectName(item.projectId)}</p>
                            <p className="text-xs text-secondary">#{item.projectId}</p>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${meta.badgeClass}`}>
                              {meta.label}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-on-surface-variant">{item.details}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>

        <div>
          <h3 className="font-h3 text-on-surface mb-6">Active Projects</h3>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl pl-10 sm:pl-11 pr-4 py-3 h-[44px] sm:h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-sm sm:text-base text-on-surface placeholder:text-secondary shadow-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className={`flex-1 sm:flex-none relative px-4 h-[44px] sm:h-[48px] rounded-xl border font-button flex items-center justify-center gap-2 transition-colors shadow-sm ${
                    isFilterOpen || activeFiltersCount > 0
                      ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10'
                      : 'bg-surface-container-lowest border-surface-container-highest text-secondary hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <Filter className="w-4 sm:w-5 h-4 sm:h-5" />
                  <span className="text-xs sm:text-sm">Filters</span>
                  {activeFiltersCount > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary text-on-primary text-[9px] sm:text-[10px] font-bold">
                      {activeFiltersCount}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-visible"
                >
                  <div className="p-5 bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-button text-on-surface">Filter Projects</h4>
                      <button
                        onClick={() => setFilters({ status: '', deadline: '', client: '' })}
                        className="text-sm font-button text-secondary hover:text-primary transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <SearchableDropdown
                        label="Status"
                        value={filters.status}
                        hideSearch
                        onChange={(v) => setFilters((prev) => ({ ...prev, status: v }))}
                        options={[
                          { label: 'All Statuses', value: '' },
                          { label: 'In Progress', value: 'In Progress' },
                          { label: 'On Hold', value: 'On Hold' },
                        ]}
                      />

                      <SearchableDropdown
                        label="Deadline"
                        value={filters.deadline}
                        hideSearch
                        onChange={(v) => setFilters((prev) => ({ ...prev, deadline: v }))}
                        options={[
                          { label: 'Any Deadline', value: '' },
                          { label: 'Next 7 days', value: '7' },
                          { label: 'Next 30 days', value: '30' },
                          { label: 'Overdue', value: 'overdue' },
                        ]}
                      />

                      <SearchableDropdown
                        label="Client"
                        value={filters.client}
                        onChange={(v) => setFilters((prev) => ({ ...prev, client: v }))}
                        options={[
                          { label: 'All Clients', value: '' },
                          ...MOCK_CLIENTS.map((c) => ({ label: c.name, value: c.name })),
                        ]}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden shadow-sm">
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-surface-container-highest">
                    <th
                      onClick={() => requestSort('name')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Project {getSortIcon('name')}</div>
                    </th>
                    <th
                      onClick={() => requestSort('client')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Client {getSortIcon('client')}</div>
                    </th>
                    <th
                      onClick={() => requestSort('progress')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Progress {getSortIcon('progress')}</div>
                    </th>
                    <th
                      onClick={() => requestSort('deadline')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Deadline {getSortIcon('deadline')}</div>
                    </th>
                    <th
                      onClick={() => requestSort('value')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Current Value {getSortIcon('value')}</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="font-body-sm relative">
                  <AnimatePresence>
                    {sortedProjects.map((row) => (
                      <motion.tr
                        key={row.id}
                        layout
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => onSelectProject?.(row.id)}
                        className="border-b border-surface-container-highest hover:bg-surface transition-colors cursor-pointer group"
                      >
                        <td className="py-4 px-6">
                          <p className="font-semibold text-on-surface">{row.name}</p>
                          <p className="text-xs text-secondary">#{row.id}</p>
                        </td>
                        <td className="py-4 px-6 text-on-surface">{clientName(row.clientId)}</td>
                        <td className="py-4 px-6">{renderMilestoneProgress(row.milestones)}</td>
                        <td className="py-4 px-6 whitespace-nowrap">{renderDeadlineCell(row.deadline)}</td>
                        <td className="py-4 px-6 whitespace-nowrap">{renderValue(row)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-surface-container-highest">
              <AnimatePresence>
                {sortedProjects.map((row) => {
                  const { done, total, pct } = milestoneProgress(row.milestones);
                  return (
                    <motion.div
                      key={row.id}
                      layout
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => onSelectProject?.(row.id)}
                      className="p-4 active:bg-surface-container transition-colors cursor-pointer"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="min-w-0 mr-3">
                          <p className="font-bold text-on-surface leading-tight">{row.name}</p>
                          <p className="text-[10px] text-secondary uppercase font-bold tracking-wider mt-1">{clientName(row.clientId)}</p>
                          <p className="text-[10px] text-secondary mt-1">#{row.id}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Deadline</span>
                          {row.deadline ? (
                            <>
                              <p className="font-medium text-on-surface">{formatDeadline(row.deadline)}</p>
                              <p className={`text-[10px] ${getDaysUntil(row.deadline) < 0 ? 'text-error' : 'text-secondary'}`}>
                                {getDaysUntil(row.deadline) < 0 ? 'Overdue' : getDaysUntil(row.deadline) === 0 ? 'Today' : `in ${getDaysUntil(row.deadline)}d`}
                              </p>
                            </>
                          ) : (
                            <p className="font-medium text-secondary">No deadline</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2" title={`${done} / ${total} milestones`}>
                        <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs font-medium text-secondary whitespace-nowrap">{done}/{total}</span>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div>
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Current Value</span>
                          <p className="text-lg font-bold text-on-surface">{formatCurrency(row.basePrice + row.outOfScopeAdded)}</p>
                          <p className="text-[10px] text-secondary">
                            {formatCurrency(row.basePrice)} original
                            {row.outOfScopeAdded > 0 ? ` + ${formatCurrency(row.outOfScopeAdded)} approved` : ''}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {sortedProjects.length === 0 && (
              <div className="p-8 text-center text-secondary">
                No active projects match your filters.
              </div>
            )}
          </div>
        </div>

        {/* Project History navigation */}
        <div className="flex justify-end">
          <button
            onClick={onViewHistory}
            className="flex items-center gap-2 text-primary font-button hover:opacity-80 transition-opacity"
          >
            View Project History
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
