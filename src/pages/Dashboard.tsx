import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TrendingUp, Briefcase, AlertCircle, Clock, Search, Filter, Download, Plus, ArrowDown, ArrowUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { StatCard } from '../components/StatCard';
import { MOCK_CLIENTS, MOCK_PROJECTS } from '../lib/mockData';
import { Project } from '../types';

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

export function DashboardPage({ onNewProject }: { onNewProject: () => void }) {
  const [projects] = useState<Project[]>(MOCK_PROJECTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ client: '', deadline: '', approvals: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'deadline', direction: 'asc' });

  const clientName = (clientId: string) => MOCK_CLIENTS.find((c) => c.id === clientId)?.name ?? 'Unknown';

  const activeRevenue = useMemo(
    () => projects.reduce((sum, p) => sum + p.basePrice + p.outOfScopeAdded, 0),
    [projects]
  );
  const oosTotal = useMemo(() => projects.reduce((sum, p) => sum + p.outOfScopeAdded, 0), [projects]);
  const expiringCount = useMemo(
    () => projects.filter((p) => {
      const d = getDaysUntil(p.deadline);
      return d >= 0 && d <= 7;
    }).length,
    [projects]
  );
  const pendingApprovals = useMemo(
    () => projects.reduce((sum, p) => sum + p.pendingOutOfScopeRequests, 0),
    [projects]
  );

  const stats = [
    {
      label: 'Active Projects',
      value: String(projects.length),
      icon: Briefcase,
      onClick: () => {
        setFilters({ client: '', deadline: '', approvals: '' });
        setSearchTerm('');
      },
    },
    {
      label: 'Active Revenue',
      value: formatCurrency(activeRevenue),
      trend: `+$${(oosTotal / 1000).toFixed(1)}K OOS`,
      icon: TrendingUp,
    },
    {
      label: 'Expiring Soon',
      value: String(expiringCount),
      trend: 'Next 7d',
      icon: Clock,
      color: 'text-error',
      onClick: () => {
        setFilters((prev) => ({ ...prev, deadline: '7' }));
        setIsFilterOpen(true);
      },
    },
    {
      label: 'Pending OOS Approvals',
      value: String(pendingApprovals),
      trend: 'Needs review',
      icon: AlertCircle,
      onClick: () => {
        setFilters((prev) => ({ ...prev, approvals: 'pending' }));
        setIsFilterOpen(true);
      },
    },
  ];

  const filteredProjects = projects.filter((p) => {
    const client = clientName(p.clientId);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filters.client && client !== filters.client) return false;

    if (filters.deadline) {
      const days = getDaysUntil(p.deadline);
      if (filters.deadline === 'overdue') {
        if (days >= 0) return false;
      } else {
        if (days < 0 || days > parseInt(filters.deadline, 10)) return false;
      }
    }

    if (filters.approvals === 'pending' && p.pendingOutOfScopeRequests === 0) return false;

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
          case 'deadline':
            aVal = new Date(`${a.deadline}T00:00:00`).getTime();
            bVal = new Date(`${b.deadline}T00:00:00`).getTime();
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

  const activeFiltersCount = (filters.client ? 1 : 0) + (filters.deadline ? 1 : 0) + (filters.approvals ? 1 : 0);

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

  const renderDeadline = (deadline: string) => {
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

  const renderProgress = (progress: number) => (
    <div className="flex items-center gap-2">
      <div className="w-20 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress}%` }} />
      </div>
      <span className="text-xs text-secondary">{progress}%</span>
    </div>
  );

  const renderAdded = (added: number) =>
    added > 0
      ? <span className="font-medium text-[#065F46] dark:text-[#10B981]">+{formatCurrency(added)}</span>
      : <span className="text-secondary">—</span>;

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
        {stats.map((stat) => {
          const { label, value, trend, icon, color, onClick } = stat;
          return (
            <StatCard
              key={label}
              label={label}
              value={value}
              trend={trend}
              icon={icon}
              color={color}
              onClick={onClick}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-8">
        <div>
          <h3 className="font-h3 text-on-surface mb-6">Active Projects</h3>

          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search projects or clients..."
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
                <button className="flex items-center justify-center w-[44px] sm:w-[48px] h-[44px] sm:h-[48px] bg-surface-container-lowest border border-surface-container-highest rounded-xl text-secondary hover:bg-surface-container hover:text-on-surface transition-colors shadow-sm">
                  <Download className="w-4 sm:w-5 h-4 sm:h-5" />
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
                        onClick={() => setFilters({ client: '', deadline: '', approvals: '' })}
                        className="text-sm font-button text-secondary hover:text-primary transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <SearchableDropdown
                        label="Client"
                        value={filters.client}
                        onChange={(v) => setFilters((prev) => ({ ...prev, client: v }))}
                        options={[
                          { label: 'All Clients', value: '' },
                          ...MOCK_CLIENTS.map((c) => ({ label: c.name, value: c.name })),
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
                        label="Out-of-Scope Approvals"
                        value={filters.approvals}
                        hideSearch
                        onChange={(v) => setFilters((prev) => ({ ...prev, approvals: v }))}
                        options={[
                          { label: 'Any', value: '' },
                          { label: 'Pending only', value: 'pending' },
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
                      onClick={() => requestSort('basePrice')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Base Price {getSortIcon('basePrice')}</div>
                    </th>
                    <th
                      onClick={() => requestSort('outOfScopeAdded')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Added (OOS) {getSortIcon('outOfScopeAdded')}</div>
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
                        className="border-b border-surface-container-highest hover:bg-surface transition-colors cursor-default group"
                      >
                        <td className="py-4 px-6">
                          <p className="font-medium text-on-surface">{row.name}</p>
                          <p className="text-xs text-secondary">#{row.id}</p>
                        </td>
                        <td className="py-4 px-6 text-on-surface">{clientName(row.clientId)}</td>
                        <td className="py-4 px-6 font-medium text-on-surface">{formatCurrency(row.basePrice)}</td>
                        <td className="py-4 px-6">{renderAdded(row.outOfScopeAdded)}</td>
                        <td className="py-4 px-6">{renderProgress(row.progress)}</td>
                        <td className="py-4 px-6 whitespace-nowrap">{renderDeadline(row.deadline)}</td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            <div className="md:hidden divide-y divide-surface-container-highest">
              <AnimatePresence>
                {sortedProjects.map((row) => (
                  <motion.div
                    key={row.id}
                    layout
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 active:bg-surface-container transition-colors"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="min-w-0 mr-3">
                        <p className="font-bold text-on-surface leading-tight">{row.name}</p>
                        <p className="text-[10px] text-secondary uppercase font-bold tracking-wider mt-1">{clientName(row.clientId)}</p>
                        <p className="text-[10px] text-secondary mt-1">#{row.id}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Deadline</span>
                        <p className="font-medium text-on-surface">{formatDeadline(row.deadline)}</p>
                        <p className={`text-[10px] ${getDaysUntil(row.deadline) < 0 ? 'text-error' : 'text-secondary'}`}>
                          {getDaysUntil(row.deadline) < 0 ? 'Overdue' : getDaysUntil(row.deadline) === 0 ? 'Today' : `in ${getDaysUntil(row.deadline)}d`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${row.progress}%` }} />
                      </div>
                      <span className="text-xs font-medium text-secondary">{row.progress}%</span>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Base</span>
                        <span className="text-lg font-bold text-on-surface">{formatCurrency(row.basePrice)}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Added (OOS)</span>
                        {row.outOfScopeAdded > 0
                          ? <span className="text-lg font-bold text-[#065F46] dark:text-[#10B981]">+{formatCurrency(row.outOfScopeAdded)}</span>
                          : <span className="text-lg font-bold text-secondary">—</span>}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {sortedProjects.length === 0 && (
              <div className="p-8 text-center text-secondary">
                No active projects match your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
