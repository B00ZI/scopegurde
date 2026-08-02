import React, { useState, useMemo } from 'react';
import { CheckCircle, TrendingUp, Undo2, Award, Search, Filter, ArrowDown, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { MOCK_CLIENTS } from '../lib/mockData';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

/**
 * COMPLETED SCOPES HISTORY PAGE
 * 
 * Purpose: A searchable archive of all finalized and delivered scope changes.
 * 
 * Features:
 * - Aggregated performance metrics (Total completed, Revenue added)
 * - Detailed historical table with sorting
 * - "Undo Completion" capability to move items back to active status
 */
export function CompletedScopesPage({ onViewScope }: { onViewScope: (scope: any) => void }) {
  // --- STATE MANAGEMENT ---
  const [scopes, setScopes] = useState([
    { id: '88209', description: 'Logistics SLA Upgrade', client: 'Acme Corp', amount: '$4,500.00', completedAt: 'Oct 12, 2023', status: 'Completed' },
    { id: '88204', description: 'Priority Freight Bypass', client: 'Meridian Shipping', amount: '$12,000.00', completedAt: 'Sep 28, 2023', status: 'Completed' },
    { id: '88190', description: 'Custom Dashboard Implementation', client: 'Nexus Logistics', amount: '$2,850.00', completedAt: 'Sep 15, 2023', status: 'Completed' },
    { id: '88185', description: 'Q3 Analytics Expansion', client: 'Global Partners', amount: '$4,200.00', completedAt: 'Aug 30, 2023', status: 'Completed' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const [filters, setFilters] = useState({
    client: '',
    dateRange: '',
    minAmount: '',
    maxAmount: ''
  });

  // --- BUSINESS LOGIC: EVENT HANDLERS ---

  const handleUncomplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setScopes(prev => prev.filter(s => s.id !== id));
  };

  // --- BUSINESS LOGIC: FILTERING & SORTING ---

  const filteredScopes = scopes.filter(s => {
    const matchesSearch = (s.client?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.id?.toLowerCase().includes(searchTerm.toLowerCase())) || false;
    
    if (!matchesSearch) return false;
    if (filters.client && s.client !== filters.client) return false;

    if (filters.minAmount || filters.maxAmount) {
      const amount = parseFloat(s.amount.replace(/[^0-9.-]+/g,""));
      if (filters.minAmount && amount < parseFloat(filters.minAmount)) return false;
      const maxAmt = parseFloat(filters.maxAmount);
      if (filters.maxAmount && !isNaN(maxAmt) && amount > maxAmt) return false;
    }

    return true;
  });

  const sortedScopes = useMemo(() => {
    let sortableItems = [...filteredScopes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        if (sortConfig.key === 'amount') {
          aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, ""));
          bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, ""));
        } else if (sortConfig.key === 'completedAt') {
          aVal = new Date(aVal).getTime() || 0;
          bVal = new Date(bVal).getTime() || 0;
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredScopes, sortConfig]);

  const activeFiltersCount = (filters.client ? 1 : 0) + (filters.dateRange ? 1 : 0) + (filters.minAmount || filters.maxAmount ? 1 : 0);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' | null = 'asc';
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : null;
    }
    setSortConfig(direction ? { key, direction } : null);
  };

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) return <ArrowDown className="w-3 h-3 opacity-0 group-hover:opacity-30 ml-1 transition-opacity" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-3 h-3 opacity-100 ml-1 text-primary" />
      : <ArrowDown className="w-3 h-3 opacity-100 ml-1 text-primary" />;
  };

  // --- STATS CONFIG ---
  const stats = [
    { 
      label: 'Completed Scopes', 
      value: '14', 
      trend: 'All Time', 
      icon: CheckCircle, 
      color: 'text-[#065F46] dark:text-[#10B981]',
      onClick: () => {
        setFilters({ client: '', dateRange: '', minAmount: '', maxAmount: '' });
        setSearchTerm('');
      }
    },
    { label: 'Added Revenue', value: '$23,550', trend: 'Finalized', icon: TrendingUp, color: 'text-[#065F46] dark:text-[#10B981]' },
    { label: 'Top Client', value: 'Meridian', trend: '3 Finished', icon: Award, color: 'text-amber-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      <PageHeader 
        title="Completed Scopes History" 
        subtitle="A record of your operational performance and finalized scope changes."
      />

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const { label, value, trend, icon, color, onClick } = stat;
          return (
            <StatCard 
              key={label}
              label={label}
              value={value}
              trend={trend}
              icon={icon}
              color={color as any}
              onClick={onClick as any}
            />
          );
        })}
      </div>

      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary" />
            <input 
              type="text" 
              placeholder="Search history..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-xl pl-11 pr-4 py-3 h-[48px] focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow text-on-surface placeholder:text-secondary shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`relative px-4 h-[48px] rounded-xl border font-button flex items-center justify-center gap-2 transition-colors shadow-sm ${
                isFilterOpen || activeFiltersCount > 0 
                ? 'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10' 
                : 'bg-surface-container-lowest border-surface-container-highest text-secondary hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Filter UI */}
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
                    onClick={() => setFilters({ client: '', dateRange: '', minAmount: '', maxAmount: '' })}
                    className="text-sm font-button text-secondary hover:text-primary transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Client Filter */}
                  <SearchableDropdown
                    label="Client"
                    value={filters.client}
                    onChange={(v) => setFilters(prev => ({ ...prev, client: v }))}
                    options={[
                      { label: 'All Clients', value: '' },
                      ...MOCK_CLIENTS.map(c => ({ label: c.name, value: c.name }))
                    ]}
                  />

                  {/* Date Range dummy */}
                  <SearchableDropdown
                    label="Completed Date"
                    value={filters.dateRange}
                    hideSearch
                    onChange={(v) => setFilters(prev => ({ ...prev, dateRange: v }))}
                    options={[
                      { label: 'Any Time', value: '' },
                      { label: 'This Month', value: 'this-month' },
                      { label: 'Last Month', value: 'last-month' },
                      { label: 'Year To Date', value: 'ytd' }
                    ]}
                  />

                  {/* Amount Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Amount ($)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number"
                        placeholder="Min"
                        value={filters.minAmount}
                        onChange={(e) => setFilters(prev => ({ ...prev, minAmount: e.target.value }))}
                        className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-secondary">-</span>
                      <input 
                        type="number"
                        placeholder="Max"
                        value={filters.maxAmount}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxAmount: e.target.value }))}
                        className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Data Display */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden flex flex-col mx-4 sm:mx-0">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-full">
            <thead>
              <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th 
                  onClick={() => requestSort('description')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Scope {getSortIcon('description')}</div>
                </th>
                <th 
                  onClick={() => requestSort('client')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Client {getSortIcon('client')}</div>
                </th>
                <th 
                  onClick={() => requestSort('amount')}
                   className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Amount {getSortIcon('amount')}</div>
                </th>
                <th className="py-4 px-6 font-label-caps text-secondary uppercase select-none">Status</th>
                <th 
                  onClick={() => requestSort('completedAt')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Completed Date {getSortIcon('completedAt')}</div>
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              {sortedScopes.map((row) => (
                <tr 
                  key={row.id}
                  onClick={() => onViewScope(row)}
                  className="border-b border-surface-container-highest hover:bg-surface-container/50 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <p className="font-medium text-on-surface">{row.description}</p>
                    <p className="text-xs text-secondary">#{row.id}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                       <span className="font-medium text-on-surface">{row.client}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface font-medium">{row.amount}</td>
                  <td className="py-4 px-6">
                    <StatusBadge status={row.status as any} />
                  </td>
                  <td className="py-4 px-6 text-secondary">{row.completedAt}</td>
                  <td className="py-4 px-6 text-right w-16">
                    <button
                      onClick={(e) => handleUncomplete(e, row.id)}
                      className="p-2 text-secondary bg-surface rounded-lg border border-surface-container-highest hover:bg-surface-container hover:text-on-surface transition-all shadow-sm flex items-center justify-center ml-auto group-hover:opacity-100 opacity-50"
                      title="Undo Completion"
                    >
                      <Undo2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-surface-container-highest">
          {sortedScopes.map((row) => (
            <div 
              key={row.id} 
              onClick={() => onViewScope(row)}
              className="p-5 active:bg-surface-container transition-colors"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1 pr-4">
                  <p className="text-[10px] font-black text-outline uppercase tracking-widest mb-1">{row.client}</p>
                  <h4 className="font-bold text-on-surface text-base leading-tight">{row.description}</h4>
                  <p className="text-[10px] text-secondary mt-1 font-bold">#{row.id}</p>
                </div>
                <StatusBadge status={row.status as any} size="sm" />
              </div>
              <div className="flex items-center justify-between mt-6">
                <div>
                  <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-0.5">Amount</p>
                  <p className="text-lg font-bold text-primary">{row.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-black text-outline uppercase tracking-widest mb-0.5">Finished</p>
                  <p className="text-xs font-bold text-on-surface">{row.completedAt}</p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-highest flex justify-end">
                <button
                  onClick={(e) => handleUncomplete(e, row.id)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-surface-container-highest text-secondary text-[11px] font-bold active:scale-95 transition-transform"
                >
                  <Undo2 className="w-3 h-3" />
                  Undo Completion
                </button>
              </div>
            </div>
          ))}
        </div>

        {(sortedScopes.length === 0) && (
          <div className="p-12 text-center text-secondary bg-surface-container-low/30">
            No completed scopes found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
