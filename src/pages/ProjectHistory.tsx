import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { MOCK_CLIENTS } from '../lib/mockData';
import { useProjects } from '../lib/appStore';
import { Project, ProjectStatus } from '../types';

const DAY_MS = 1000 * 60 * 60 * 24;

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const STATUS_META: Record<ProjectStatus, string> = {
  'In Progress': 'bg-primary/10 text-primary border border-primary/20',
  'On Hold': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  'Completed': 'bg-[#065F46] text-white shadow-sm',
  'Cancelled': 'bg-error/10 text-error border border-error/20',
  'Archived': 'bg-surface-container text-secondary border border-surface-container-highest',
};

const HISTORY_STATUSES: ProjectStatus[] = ['Completed', 'Cancelled', 'Archived'];

/**
 * PROJECT HISTORY PAGE
 *
 * Archive of non-active projects (completed, cancelled, archived) with
 * search and simple filters. The dashboard stays focused on active work;
 * everything finished or shelved lives here.
 */
export function ProjectHistoryPage({ onSelectProject }: { onSelectProject?: (projectId: string) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ status: '', client: '' });
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>({ key: 'completedAt', direction: 'desc' });

  const clientName = (clientId: string) => MOCK_CLIENTS.find((c) => c.id === clientId)?.name ?? 'Unknown';

  const historyProjects = useProjects().filter((p) => HISTORY_STATUSES.includes(p.status));

  const filteredProjects = historyProjects.filter((p) => {
    const client = clientName(p.clientId);
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;

    if (filters.status && p.status !== filters.status) return false;
    if (filters.client && client !== filters.client) return false;

    return true;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!sortConfig) return 0;
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
      case 'value':
        aVal = a.basePrice + a.outOfScopeAdded;
        bVal = b.basePrice + b.outOfScopeAdded;
        break;
      case 'completedAt':
        aVal = a.completedAt ? new Date(`${a.completedAt}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
        bVal = b.completedAt ? new Date(`${b.completedAt}T00:00:00`).getTime() : Number.POSITIVE_INFINITY;
        break;
      default:
        aVal = a[sortConfig.key as keyof Project];
        bVal = b[sortConfig.key as keyof Project];
    }

    if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.client ? 1 : 0);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig && sortConfig.key === key) {
      if (sortConfig.direction === 'asc') direction = 'desc';
      else direction = null;
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-30 ml-1 transition-opacity" />;
    return sortConfig.direction === 'asc'
      ? <ArrowUp className="w-3 h-3 opacity-100 ml-1 text-primary" />
      : <ArrowDown className="w-3 h-3 opacity-100 ml-1 text-primary" />;
  };

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-8">
      <PageHeader
        title="Project History"
        subtitle="Completed, cancelled, and archived projects."
      />

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl pl-10 sm:pl-11 pr-4 py-3 h-[44px] sm:h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-sm sm:text-base text-on-surface placeholder:text-secondary shadow-sm"
            />
          </div>
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
                  <h4 className="font-button text-on-surface">Filter History</h4>
                  <button
                    onClick={() => setFilters({ status: '', client: '' })}
                    className="text-sm font-button text-secondary hover:text-primary transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
                  <SearchableDropdown
                    label="Status"
                    value={filters.status}
                    hideSearch
                    onChange={(v) => setFilters((prev) => ({ ...prev, status: v }))}
                    options={[
                      { label: 'All Statuses', value: '' },
                      ...HISTORY_STATUSES.map((s) => ({ label: s, value: s })),
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
                  onClick={() => requestSort('value')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Value {getSortIcon('value')}</div>
                </th>
                <th className="py-4 px-6 font-label-caps text-secondary uppercase select-none">Status</th>
                <th
                  onClick={() => requestSort('completedAt')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Ended {getSortIcon('completedAt')}</div>
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              {sortedProjects.map((row) => (
                <tr
                  key={row.id}
                  onClick={() => onSelectProject?.(row.id)}
                  className="border-b border-surface-container-highest last:border-b-0 hover:bg-surface transition-colors cursor-pointer"
                >
                  <td className="py-4 px-6">
                    <p className="font-semibold text-on-surface">{row.name}</p>
                    <p className="text-xs text-secondary">#{row.id}</p>
                  </td>
                  <td className="py-4 px-6 text-on-surface">{clientName(row.clientId)}</td>
                  <td className="py-4 px-6 font-medium text-on-surface">{formatCurrency(row.basePrice + row.outOfScopeAdded)}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${STATUS_META[row.status]}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-secondary">{formatDate(row.completedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="md:hidden divide-y divide-surface-container-highest">
          {sortedProjects.map((row) => (
            <div
              key={row.id}
              onClick={() => onSelectProject?.(row.id)}
              className="p-4 active:bg-surface-container transition-colors cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="min-w-0 mr-3">
                  <p className="font-bold text-on-surface leading-tight">{row.name}</p>
                  <p className="text-[10px] text-secondary uppercase font-bold tracking-wider mt-1">{clientName(row.clientId)}</p>
                  <p className="text-[10px] text-secondary mt-1">#{row.id}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${STATUS_META[row.status]}`}>
                  {row.status}
                </span>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Value</span>
                  <p className="text-lg font-bold text-on-surface">{formatCurrency(row.basePrice + row.outOfScopeAdded)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Ended</span>
                  <p className="text-xs font-bold text-on-surface">{formatDate(row.completedAt)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {sortedProjects.length === 0 && (
          <div className="p-12 text-center text-secondary">
            No projects in history match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
