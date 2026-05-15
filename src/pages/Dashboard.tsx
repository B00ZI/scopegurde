import React, { useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { TrendingUp, FileText, AlertCircle, ArrowUpRight, Search, Filter, Download, CheckCircle, Clock, ArrowDown, ArrowUp } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { MOCK_CLIENTS, MOCK_SCOPES } from '../lib/mockData';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';

/**
 * DASHBOARD PAGE
 * 
 * Purpose: Provides a high-level overview of business health and active work items.
 * 
 * Features:
 * - Metric cards with quick-filter shortcuts
 * - Searchable data table for active scopes
 * - Sortable columns (Description, Client, Amount, Status, Time)
 * - "Quick Complete" action to finalize scopes directly from the list
 */
export function DashboardPage({ onViewScope }: { onViewScope?: (scope: any) => void }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Advanced Filter State (Filters the activeScopes list)
  const [filters, setFilters] = useState({
    status: '',
    client: '',
    urgency: ''
  });
  
  // Primary Data State
  const [activeScopes, setActiveScopes] = useState(MOCK_SCOPES);
  const [completingIds, setCompletingIds] = useState<Set<string>>(new Set());
  const [completedScope, setCompletedScope] = useState<any | null>(null);
  const [snackbarTimeout, setSnackbarTimeout] = useState<NodeJS.Timeout | null>(null);

  // --- STATS CONFIGURATION ---
  const stats: any[] = [
    { 
      label: 'Monthly Revenue', 
      value: '$242,500', 
      trend: '+12.5%', 
      icon: TrendingUp 
    },
    { 
      label: 'Active Scopes', 
      value: '142', 
      trend: '+12', 
      icon: FileText,
      onClick: () => {
        setFilters({ status: '', client: '', urgency: '' });
        setSearchTerm('');
      }
    },
    { 
      label: 'Expiring Soon', 
      value: '3', 
      trend: 'Next 7d', 
      icon: Clock, 
      color: 'text-error',
      onClick: () => {
        setFilters(prev => ({ ...prev, urgency: '7' }));
        setIsFilterOpen(true);
      }
    },
    { 
      label: 'Pending Approvals', 
      value: '8', 
      trend: '-1', 
      icon: AlertCircle,
      onClick: () => {
        setFilters(prev => ({ ...prev, status: 'Draft' }));
        setIsFilterOpen(true);
      }
    },
  ];

  // --- TABLE LOGIC (Filtering & Sorting) ---

  const handleQuickComplete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const scopeToComplete = activeScopes.find(s => s.id === id);
    if (!scopeToComplete) return;

    setCompletingIds(prev => new Set(prev).add(id));

    setTimeout(() => {
      setActiveScopes(prev => prev.filter(row => row.id !== id));
      setCompletingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });

      setCompletedScope(scopeToComplete);
      if (snackbarTimeout) clearTimeout(snackbarTimeout);
      const timeoutId = setTimeout(() => setCompletedScope(null), 5000);
      setSnackbarTimeout(timeoutId);
    }, 300);
  };

  const handleUndo = () => {
    if (!completedScope) return;
    
    setActiveScopes(prev => {
      return [...prev, completedScope].sort((a, b) => b.id.localeCompare(a.id));
    });
    
    setCompletedScope(null);
    if (snackbarTimeout) clearTimeout(snackbarTimeout);
  };

  const filteredScopes = activeScopes.filter(scope => {
    const matchesSearch = (scope.client?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          scope.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          scope.id?.toLowerCase().includes(searchTerm.toLowerCase())) || false;
    if (!matchesSearch) return false;
    
    if (filters.status && scope.status !== filters.status) return false;
    if (filters.client && scope.client !== filters.client) return false;
    if (filters.urgency && scope.validUntil) {
      const validUntil = new Date(scope.validUntil).getTime();
      const now = new Date().getTime();
      const diffDays = (validUntil - now) / (1000 * 3600 * 24);
      if (diffDays > parseInt(filters.urgency, 10)) return false;
    } else if (filters.urgency && !scope.validUntil) {
      return false; // If searching for urgency and no validUntil present
    }
    
    return true;
  });

  const sortedScopes = useMemo(() => {
    let sortableItems = [...filteredScopes];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        // Custom comparisons
        if (sortConfig.key === 'amount') {
          aVal = parseFloat(aVal.replace(/[^0-9.-]+/g, ""));
          bVal = parseFloat(bVal.replace(/[^0-9.-]+/g, ""));
        } else if (sortConfig.key === 'time') {
          // Mock time sorting logic (very basic since we use string like '2h ago')
          // In a real app we'd use ISO timestamps
          const getMinutes = (t: any) => {
            if (!t || typeof t !== 'string') return 0;
            if (t.includes('h ago')) return parseInt(t) * 60;
            if (t.includes('Yesterday')) return 24 * 60;
            return 0;
          };
          aVal = getMinutes(aVal);
          bVal = getMinutes(bVal);
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredScopes, sortConfig]);

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.client ? 1 : 0) + (filters.urgency ? 1 : 0);

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

  return (
    <div className="max-w-7xl mx-auto pt-2 pb-8">
      <PageHeader 
        title="Dashboard" 
        subtitle="Overview of your logistics performance and scopes."
      />

      {/* Metric Cards Grid */}
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
          {/* Header & Global View CTA */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h3 className="font-h3 text-on-surface">Active Scopes</h3>
            <div className="flex items-center gap-4">
               <button className="text-primary font-button flex items-center gap-1 hover:underline text-sm sm:text-base">
                 View All <ArrowUpRight className="w-4 h-4" />
               </button>
            </div>
          </div>

          {/* Utility Bar: Search & Global Actions */}
          <div className="flex flex-col gap-4 mb-8">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 sm:w-5 h-4 sm:h-5 text-secondary" />
                <input
                  type="text"
                  placeholder="Search activity..."
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
                      <h4 className="font-button text-on-surface">Filter Active Scopes</h4>
                      <button 
                        onClick={() => setFilters({ status: '', client: '', urgency: '' })}
                        className="text-sm font-button text-secondary hover:text-primary transition-colors"
                      >
                        Clear All
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
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

                      {/* Status Filter */}
                      <SearchableDropdown
                        label="Status"
                        value={filters.status}
                        hideSearch
                        onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                        options={[
                          { label: 'All Statuses', value: '' },
                          { label: 'Draft', value: 'Draft' },
                          { label: 'Sent', value: 'Sent' },
                          { label: 'Approved', value: 'Approved' },
                          { label: 'Paid', value: 'Paid' },
                          { label: 'Expired', value: 'Expired' },
                        ]}
                      />

                      {/* Urgency Filter */}
                      <div className="flex flex-col gap-2">
                        <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Urgency (Days to Expire)</label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-secondary">Expiring in</span>
                          <input 
                            type="number"
                            placeholder="e.g. 3"
                            value={filters.urgency}
                            onChange={(e) => setFilters(prev => ({ ...prev, urgency: e.target.value }))}
                            className="bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-24"
                          />
                          <span className="text-sm text-secondary">days or less</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Data Display */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden shadow-sm">
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
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
                    <th 
                      onClick={() => requestSort('status')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Status {getSortIcon('status')}</div>
                    </th>
                    <th 
                      onClick={() => requestSort('time')}
                      className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                    >
                      <div className="flex items-center">Updated At {getSortIcon('time')}</div>
                    </th>
                    <th className="py-4 px-4"></th>
                  </tr>
                </thead>
                <tbody className="font-body-sm relative">
                  <AnimatePresence>
                    {sortedScopes.map((row) => {
                      const isCompleting = completingIds.has(row.id);
                      return (
                        <motion.tr 
                          key={row.id} 
                          layout
                          initial={{ opacity: 1, backgroundColor: 'transparent' }}
                          animate={isCompleting ? { 
                            backgroundColor: 'rgba(6, 95, 70, 0.1)', 
                            opacity: 0,
                            x: 30
                          } : { 
                            backgroundColor: 'transparent',
                            opacity: 1,
                            x: 0
                          }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: isCompleting ? 0.3 : 0.2 }}
                          onClick={() => !isCompleting && onViewScope && onViewScope(row)}
                          className={`border-b border-surface-container-highest hover:bg-surface transition-colors group cursor-pointer ${isCompleting ? 'pointer-events-none' : ''}`}
                        >
                          <td className="py-4 px-6">
                            <p className="font-medium text-on-surface">{row.description}</p>
                            <p className="text-xs text-secondary">#{row.id}</p>
                          </td>
                          <td className="py-4 px-6 text-on-surface">{row.client}</td>
                          <td className="py-4 px-6 font-medium text-on-surface">{row.amount}</td>
                          <td className="py-4 px-6">
                            <StatusBadge status={row.status as any} />
                          </td>
                          <td className="py-4 px-6 whitespace-nowrap text-secondary">{row.time}</td>
                          <td className="py-4 px-4 text-right w-16">
                            {(row.status === 'Paid' || row.status === 'Approved') && !isCompleting && (
                              <button
                                onClick={(e) => handleQuickComplete(e, row.id)}
                                className="p-2 text-white bg-[#065F46] rounded-full hover:bg-[#047857] hover:scale-110 transition-all shadow-md opacity-0 group-hover:opacity-100"
                                title="Mark as Completed"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden divide-y divide-surface-container-highest">
              <AnimatePresence>
                {sortedScopes.map((row) => {
                  const isCompleting = completingIds.has(row.id);
                  return (
                    <motion.div 
                      key={row.id} 
                      layout
                      initial={{ opacity: 1 }}
                      animate={isCompleting ? { 
                        backgroundColor: 'rgba(6, 95, 70, 0.1)', 
                        opacity: 0,
                        x: 30
                      } : { 
                        opacity: 1,
                        x: 0
                      }}
                      exit={{ opacity: 0 }}
                      onClick={() => !isCompleting && onViewScope && onViewScope(row)}
                      className={`p-4 active:bg-surface-container transition-colors ${isCompleting ? 'pointer-events-none' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-bold text-on-surface leading-tight">{row.description}</p>
                          <p className="text-[10px] text-secondary uppercase font-bold tracking-wider mt-1">{row.client}</p>
                        </div>
                        <StatusBadge status={row.status as any} size="sm" />
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Amount</span>
                          <span className="text-lg font-bold text-primary">{row.amount}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-bold text-secondary text-right">
                             {row.time}
                          </span>
                          {(row.status === 'Paid' || row.status === 'Approved') && !isCompleting && (
                            <button
                              onClick={(e) => handleQuickComplete(e, row.id)}
                              className="p-3 text-white bg-[#065F46] rounded-xl shadow-md active:scale-95"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {activeScopes.length === 0 && (
              <div className="p-8 text-center text-secondary">
                No active scopes. You're all caught up!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Snackbar Location (Bottom Right) */}
      <AnimatePresence>
        {completedScope && (
          <motion.div
             initial={{ opacity: 0, y: 50, scale: 0.95 }}
             animate={{ opacity: 1, y: 0, scale: 1 }}
             exit={{ opacity: 0, y: 20, scale: 0.95 }}
             transition={{ duration: 0.2 }}
             className="fixed bottom-6 right-6 z-50 flex items-center gap-4 bg-surface shadow-lg border border-surface-container-highest rounded-lg px-4 py-3"
          >
            <div className="flex items-center gap-2 text-on-surface">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span className="font-body-sm font-medium">Scope #{completedScope.id} moved to History.</span>
            </div>
            <div className="h-4 w-px bg-surface-container-highest"></div>
            <button 
              onClick={handleUndo}
              className="text-sm font-bold text-primary hover:text-primary/80 transition-colors"
            >
              Undo
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
