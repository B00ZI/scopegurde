import { useState } from 'react';
import { Edit2, Trash2, ArrowLeft, Building2, Briefcase, FileText, TrendingUp, Search } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Client } from '../types';

interface ClientDetailsPageProps {
  client: Client;
  onBack: () => void;
  onEdit: () => void;
  onRemove: () => void;
  onViewScope?: (scope: any) => void;
}

/**
 * PAGE COMPONENT: Client Details
 * 
 * Purpose: Single-client view displaying overarching statistics, basic profile data,
 * and a history of their scope/change orders.
 */
export function ClientDetailsPage({ client, onBack, onEdit, onRemove, onViewScope }: ClientDetailsPageProps) {
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);

  const stats = [
    { label: 'Ongoing Scopes', value: client.ongoingScopes, icon: Briefcase, color: 'text-primary' },
    { label: 'Completed', value: client.changeOrders, icon: FileText, color: 'text-secondary' },
    { label: 'Total Revenue', value: `$${(client.totalRevenue || 0).toLocaleString()}`, icon: TrendingUp, color: 'text-[#065F46] dark:text-[#10B981]' },
  ];

  return (
    <div className="max-w-5xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      <PageHeader 
        title={client.name} 
        subtitle={
          <span className="inline-flex items-center gap-1.5 font-medium text-primary bg-primary/5 px-2 py-0.5 rounded-full border border-primary/10">
            {client.email}
          </span>
        }
        actions={
          <div className="flex gap-2">
            <button 
              onClick={onEdit}
              className="px-3 sm:px-4 py-2 bg-surface-container border border-surface-container-highest rounded-lg font-button text-on-surface flex items-center gap-2 hover:bg-surface-container-high transition-colors text-xs sm:text-base"
            >
              <Edit2 className="w-4 h-4" />
              <span className="hidden sm:inline">Edit Profile</span>
              <span className="sm:hidden">Edit</span>
            </button>
            <button 
              onClick={() => setShowConfirmRemove(true)}
              className="px-3 sm:px-4 py-2 bg-error/10 border border-error/20 rounded-lg font-button text-error flex items-center gap-2 hover:bg-error/20 transition-colors text-xs sm:text-base"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>
        }
      />

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="relative overflow-hidden bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 sm:p-5 shadow-sm group">
            <div className="relative z-10 flex items-center justify-between mb-1 sm:mb-3">
              <h3 className="text-[10px] font-semibold text-secondary uppercase tracking-wider">{stat.label}</h3>
            </div>
            <div className="relative z-10 flex items-baseline gap-2 mt-1">
              <p className="text-xl sm:text-3xl font-bold text-on-surface tracking-tight truncate" title={String(stat.value)}>{stat.value}</p>
            </div>
            {/* Background transparent icon */}
            <stat.icon className={`absolute -right-2 -bottom-4 w-16 sm:w-24 h-16 sm:h-24 opacity-[0.06] dark:opacity-[0.08] group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-300 ${stat.color || 'text-primary'}`} />
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-6 sm:gap-8">
        {/* Scope History */}
        <div className="w-full flex flex-col gap-6">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl shadow-sm overflow-hidden flex-1">
            <div className="p-4 sm:p-6 border-b border-surface-container-highest flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className="font-h3 text-on-surface">Scope History</h3>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
                <input 
                  className="w-full sm:w-64 pl-9 pr-4 py-2 bg-surface border border-surface-container-highest rounded-lg font-body-sm text-on-surface focus:outline-none focus:border-primary transition-all" 
                  placeholder="Search scopes..." 
                  type="text"
                />
              </div>
            </div>

            {/* Scope List */}
            <div className="divide-y divide-surface-container-highest">
              {/* Mock Row 1 */}
              <div 
                onClick={() => onViewScope && onViewScope({ id: '1092', description: 'Q3 Analytics Expansion', amount: '$4,200.00', time: 'Oct 12, 2023', status: 'Approved', client: client.name })}
                className="p-4 sm:p-6 hover:bg-surface transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 pr-4">
                    <h4 className="font-bold text-on-surface text-sm sm:text-base leading-tight">Q3 Analytics Expansion</h4>
                    <p className="text-[13px] text-secondary mt-1 line-clamp-1">Added deep tracking requirements.</p>
                  </div>
                  <span className="shrink-0 px-2.5 py-1 rounded bg-green-500/10 text-green-600 text-[10px] font-bold uppercase tracking-wider">
                    Approved
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4 text-[13px] text-secondary">
                  <span>Oct 12, 2023</span>
                  <span className="w-1 h-1 bg-surface-container-highest rounded-full"></span>
                  <span className="text-on-surface font-bold">+$4,200.00</span>
                </div>
              </div>

              {/* Mock Row 2 */}
              <div 
                onClick={() => onViewScope && onViewScope({ id: '1081', description: 'Express Shipping Integration', amount: '$1,850.00', time: 'Sep 05, 2023', status: 'Draft', client: client.name })}
                className="p-6 hover:bg-surface transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-on-surface text-base">Express Shipping Integration</h4>
                    <p className="font-body-sm text-secondary mt-1">Rush request handling fees and API expansion.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-surface-container text-secondary text-xs font-bold uppercase tracking-wider">
                    Draft
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4 font-body-sm text-secondary">
                  <span>Sep 05, 2023</span>
                  <span className="w-1 h-1 bg-surface-container-highest rounded-full"></span>
                  <span className="text-on-surface font-medium">+$1,850.00</span>
                </div>
              </div>

              {/* Mock Row 3 */}
              <div 
                onClick={() => onViewScope && onViewScope({ id: '1001', description: 'Dashboard V1 Setup', amount: 'Baseline', time: 'Jul 22, 2023', status: 'Completed', client: client.name })}
                className="p-6 hover:bg-surface transition-colors cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-on-surface text-base">Dashboard V1 Setup</h4>
                    <p className="font-body-sm text-secondary mt-1">Initial project baseline.</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-[#065F46] text-white shadow-sm text-xs font-bold uppercase tracking-wider">
                    Completed
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-4 font-body-sm text-secondary">
                  <span>Jul 22, 2023</span>
                  <span className="w-1 h-1 bg-surface-container-highest rounded-full"></span>
                  <span className="text-on-surface font-medium">Baseline</span>
                </div>
              </div>
            </div>

            {/* Pagination/Load More */}
            <div className="p-4 border-t border-surface-container-highest bg-surface-container-low text-center">
              <button className="text-primary font-button hover:underline text-sm">
                View All {client.changeOrders} Scopes
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={showConfirmRemove}
        title="Remove Client"
        message={`Are you sure you want to remove ${client.name}? This action cannot be undone and will delete all related records.`}
        confirmText="Remove Client"
        onConfirm={() => {
          setShowConfirmRemove(false);
          onRemove();
        }}
        onCancel={() => setShowConfirmRemove(false)}
      />
    </div>
  );
}
