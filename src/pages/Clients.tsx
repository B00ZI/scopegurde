import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, Filter, Download, MoreVertical, ChevronLeft, ChevronRight, Plus, Edit2, Trash2, ExternalLink, TrendingUp, Users, Award, ArrowDown, ArrowUp } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Client } from '../types';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { MOCK_CLIENTS } from '../lib/mockData';
import { StatCard } from '../components/StatCard';

interface ClientsPageProps {
  onAddClient: () => void;
  onViewClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
  onDeleteClient?: (client: Client) => void;
}

/**
 * CLIENTS DIRECTORY PAGE
 * 
 * Purpose: Manage the central list of client profiles and their project status.
 * 
 * Features:
 * - High-level directory overview with metrics
 * - Searchable and filterable client table
 * - Sortable headers (Name, Ongoing Scopes, Completed Scopes, Revenue)
 * - Management actions (Edit, Delete, Open Profile)
 */
export function ClientsPage({ onAddClient, onViewClient, onEditClient, onDeleteClient }: ClientsPageProps) {
  // --- STATE MANAGEMENT ---
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  const [filters, setFilters] = useState({
    status: '',
    minRevenue: '',
    maxRevenue: ''
  });

  // --- BUSINESS LOGIC: FILTERING ---
  const filteredClients = MOCK_CLIENTS.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          client.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (filters.status) {
      if (filters.status === 'Active' && client.ongoingScopes === 0) return false;
      if (filters.status === 'Inactive' && client.ongoingScopes > 0) return false;
    }
    
    const revenue = parseInt(String(client.totalRevenue || client.lifetimeRevenue || '0').replace(/[^0-9.-]+/g, ""), 10);
    if (filters.minRevenue && revenue < parseInt(filters.minRevenue, 10)) return false;
    if (filters.maxRevenue && revenue > parseInt(filters.maxRevenue, 10)) return false;
    
    return true;
  });

  // --- BUSINESS LOGIC: SORTING ---
  const sortedClients = useMemo(() => {
    let sortableItems = [...filteredClients];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aVal: any = a[sortConfig.key as keyof typeof a];
        let bVal: any = b[sortConfig.key as keyof typeof b];

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableItems;
  }, [filteredClients, sortConfig]);

  const activeFiltersCount = (filters.status ? 1 : 0) + (filters.minRevenue || filters.maxRevenue ? 1 : 0);

  // --- REUSABLE DROPDOWN LOGIC ---
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdownId(null);
    if (openDropdownId) document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdownId]);

  // --- STATS CONFIG ---
  const stats = [
    { label: 'Total Clients', value: '42', trend: '+3', icon: Users },
    { label: 'Top Client', value: 'Swift Freight', trend: 'Revenue', icon: Award, color: 'text-amber-500' },
    { 
      label: 'Active Clients', 
      value: '30', 
      trend: 'Has Open Scope', 
      icon: TrendingUp, 
      color: 'text-primary',
      onClick: () => {
        setFilters(prev => ({ ...prev, status: 'Active' }));
        setIsFilterOpen(true);
      }
    },
  ];

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

  return (
    <div className="max-w-container-max mx-auto pt-2 pb-8">
      {/* Header Injection */}
      <PageHeader 
        title="Clients Directory" 
        subtitle="Manage client profiles and active logistics projects."
        actions={
          <button 
            onClick={onAddClient}
            className="font-button bg-primary text-on-primary px-5 py-2.5 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add New Client
          </button>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <StatCard 
            key={stat.label}
            {...stat}
          />
        ))}
      </div>

      {/* SECTION 1: Toolbar (Search & Filters) */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary" />
            <input
              type="text"
              placeholder="Search by client name, email, or ID..."
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
            <button className="flex items-center justify-center w-[48px] h-[48px] bg-surface-container-lowest border border-surface-container-highest rounded-xl text-secondary hover:bg-surface-container hover:text-on-surface transition-colors shadow-sm">
              <Download className="w-5 h-5" />
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
                  <h4 className="font-button text-on-surface">Filter Clients</h4>
                  <button 
                    onClick={() => setFilters({ status: '', minRevenue: '', maxRevenue: '' })}
                    className="text-sm font-button text-secondary hover:text-primary transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                  {/* Status Filter */}
                  <SearchableDropdown
                    label="Activity Status"
                    value={filters.status}
                    hideSearch
                    onChange={(v) => setFilters(prev => ({ ...prev, status: v }))}
                    options={[
                      { label: 'All Statuses', value: '' },
                      { label: 'Active (Has pending scopes)', value: 'Active' },
                      { label: 'Inactive (No pending scopes)', value: 'Inactive' }
                    ]}
                  />

                  {/* Revenue Volume Filter */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold text-secondary uppercase tracking-wider">Total Revenue ($)</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="number"
                        placeholder="Min"
                        value={filters.minRevenue}
                        onChange={(e) => setFilters(prev => ({ ...prev, minRevenue: e.target.value }))}
                        className="w-full bg-surface-container border border-surface-container-highest rounded-lg px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                      <span className="text-secondary">-</span>
                      <input 
                        type="number"
                        placeholder="Max"
                        value={filters.maxRevenue}
                        onChange={(e) => setFilters(prev => ({ ...prev, maxRevenue: e.target.value }))}
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

      {/* SECTION 2: Data Table */}
      <div className="bg-surface-container-lowest border border-surface-container-highest rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
               <tr className="bg-surface-container-low border-b border-surface-container-highest">
                <th  
                   onClick={() => requestSort('name')}
                   className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Client Details {getSortIcon('name')}</div>
                </th>
                <th 
                  onClick={() => requestSort('ongoingScopes')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Ongoing Scopes {getSortIcon('ongoingScopes')}</div>
                </th>
                <th 
                  onClick={() => requestSort('changeOrders')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Completed Scopes {getSortIcon('changeOrders')}</div>
                </th>
                <th 
                  onClick={() => requestSort('totalRevenue')}
                  className="py-4 px-6 font-label-caps text-secondary uppercase cursor-pointer hover:text-on-surface transition-colors select-none group"
                >
                  <div className="flex items-center">Total Revenue {getSortIcon('totalRevenue')}</div>
                </th>
                <th className="py-4 px-6"></th>
              </tr>
            </thead>
            <tbody className="font-body-sm">
              {sortedClients.map((client) => (
                <tr 
                  key={client.id} 
                  onClick={() => onViewClient(client)}
                  className="border-b border-surface-container-highest hover:bg-surface transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-on-surface group-hover:text-primary transition-colors">{client.name}</p>
                        <p className="text-secondary text-xs">ID: {client.id} • {client.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      {/* Status indicator dot */}
                      <span className={`w-2 h-2 rounded-full ${client.ongoingScopes > 0 ? 'bg-primary' : 'bg-outline-variant'}`}></span>
                      <span className="text-on-surface font-medium">{client.ongoingScopes}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-on-surface">{client.changeOrders}</td>
                  <td className="py-4 px-6 text-on-surface font-medium">{client.lifetimeRevenue || `$${(client.totalRevenue || 0).toLocaleString()}.00`}</td>
                  <td className="py-4 px-6 text-right relative">
                    <button 
                      className="text-secondary hover:text-primary transition-colors p-1 rounded-md hover:bg-surface-container"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdownId(openDropdownId === client.id ? null : client.id);
                      }}
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    
                    {openDropdownId === client.id && (
                      <div className="absolute right-8 top-12 z-10 w-48 bg-surface border border-surface-container-highest rounded-lg shadow-lg py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <button 
                          className="w-full text-left px-4 py-2 font-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); onViewClient(client); }}
                        >
                          <ExternalLink className="w-4 h-4" /> Open
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 font-body-sm text-on-surface hover:bg-surface-container flex items-center gap-2 transition-colors"
                          onClick={(e) => { e.stopPropagation(); setOpenDropdownId(null); onEditClient(client); }}
                        >
                          <Edit2 className="w-4 h-4" /> Edit
                        </button>
                        <button 
                          className="w-full text-left px-4 py-2 font-body-sm text-error hover:bg-error/10 flex items-center gap-2 transition-colors"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setOpenDropdownId(null); 
                            setClientToDelete(client);
                          }}
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Footer */}
        <div className="px-6 py-4 border-t border-surface-container-highest bg-surface-container-lowest flex items-center justify-between">
          <span className="font-body-sm text-secondary">Showing 1-4 of 42 clients</span>
          <div className="flex gap-1">
            <button className="p-1 rounded text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-1 rounded text-on-surface hover:bg-surface-container-low transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={!!clientToDelete}
        title="Delete Client"
        message={`Are you sure you want to delete ${clientToDelete?.name}? This action cannot be undone.`}
        confirmText="Delete Client"
        onConfirm={() => {
          if (clientToDelete && onDeleteClient) {
            onDeleteClient(clientToDelete);
          }
          setClientToDelete(null);
        }}
        onCancel={() => setClientToDelete(null)}
      />
    </div>
  );
}
