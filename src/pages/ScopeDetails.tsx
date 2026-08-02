import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ExternalLink, Mail, CreditCard, Clock, FileText, Check, Lock, Building2, Copy, ChevronDown, Bell, Undo2, X, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBadge } from '../components/StatusBadge';
import { MOCK_SCOPES } from '../lib/mockData';

interface ScopeDetailsProps {
  scope: any; // The row object from Dashboard
  onBack: () => void;
  onViewScope: (scope: any) => void;
}

/**
 * SCOPE DETAILS PAGE
 * 
 * Purpose: Provides a deep dive into a single scope adjustment request.
 * 
 * Features:
 * - Real-time status management with UNDO capability
 * - Client portal preview (shows exactly what the client sees)
 * - "Smart Nudges": context-aware follow-up templates for copying
 * - Activity history timeline
 */
export function ScopeDetailsPage({ scope, onBack, onViewScope }: ScopeDetailsProps) {
  // --- STATE MANAGEMENT ---
  const [internalStatus, setInternalStatus] = useState(scope.status);
  const [initialStatus] = useState(scope.status);
  const [nudgeScenario, setNudgeScenario] = useState<'unread' | 'expiring'>('unread');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isMsgExpanded, setIsMsgExpanded] = useState(false);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // --- DERIVED DATA ---
  // Analytics and context scouts could go here in a real app

  // --- REUSABLE LOGIC: CLICK OUTSIDE DROPDOWN ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- EVENT HANDLERS ---

  const handleStatusChange = (newStatus: string) => {
    if (newStatus === internalStatus) return;
    setInternalStatus(newStatus);
    setIsStatusDropdownOpen(false);
  };

  const handleUndoStatus = () => {
    setInternalStatus(initialStatus);
  };

  const handleCopyNudge = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus('Copied!');
    setTimeout(() => setCopyStatus(null), 2000);
  };

  // --- RENDER HELPERS ---

  const getStatusOptions = () => {
    const allStatuses = ['Draft', 'Sent', 'Approved', 'Paid', 'Expired'];
    return allStatuses.map(s => ({
      value: s,
      disabled: (s === 'Draft' && internalStatus !== 'Draft') // Prevents back-sliding to draft state easily
    }));
  };

  const nudgeMessages = {
    unread: `Hey ${scope.client}, just making sure you saw this change order I sent over! Let me know if you have questions. https://scopeguard.app/approval-portal/${scope.id}`,
    expiring: `Hey ${scope.client}, a quick heads-up that this scope update expires tomorrow (${scope.validUntil || 'soon'}). You can approve it here: https://scopeguard.app/approval-portal/${scope.id}`
  };

  const mockMessagePreview = `Hi ${scope.client} team,
  
I'm reaching out regarding the ${scope.description}. As this falls outside our original agreement, it requires an adjustment to the project scope and budget.
...`;

  const getRelativeExpiration = (dateStr: string) => {
    const targetDate = new Date(dateStr);
    const today = new Date();
    targetDate.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diffDays = Math.ceil((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return `Expired`;
    if (diffDays === 0) return `Today`;
    if (diffDays === 1) return `Tomorrow`;
    return `In ${diffDays} days`;
  };

  return (
    <div className="max-w-4xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      {/* PORTAL PREVIEW MODAL */}
      <AnimatePresence>
        {isPortalModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPortalModalOpen(false)}
              className="absolute inset-0 bg-on-surface/20 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-surface-container-low border border-surface-container-highest shadow-2xl rounded-[2.5rem] overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8 sm:p-12 space-y-10">
                {/* Modal Header */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-widest text-primary">Live Portal Preview</span>
                  </div>
                  <button 
                    onClick={() => setIsPortalModalOpen(false)}
                    className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-secondary" />
                  </button>
                </div>
                
                {/* Simulating the Portal Content */}
                <div className="bg-surface border border-surface-container-highest rounded-3xl overflow-hidden shadow-sm">
                  {/* Agency Branding Mockup */}
                  <div className="p-6 bg-surface-container-lowest border-b border-surface-container-highest flex flex-col items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-surface-container-low border border-surface-container-highest flex items-center justify-center">
                       <Building2 className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Acme Consulting</p>
                  </div>

                  <div className="p-8 space-y-8">
                    <div className="space-y-2">
                      <h5 className="text-2xl font-black text-on-surface leading-tight tracking-tight">{scope.description}</h5>
                      <p className="text-xs font-medium text-secondary">Adjustment for <span className="text-primary font-bold">{scope.client}</span></p>
                    </div>

                    <div className="space-y-4">
                      <h6 className="text-[10px] font-black text-primary uppercase tracking-widest">Included Changes</h6>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                          </div>
                          <p className="text-sm font-medium text-on-surface opacity-80">Full implementation of requested adjustment</p>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                          </div>
                          <p className="text-sm font-medium text-on-surface opacity-80">QA testing and verification report</p>
                        </li>
                      </ul>
                    </div>

                    <div className="p-6 bg-surface-container-low rounded-2xl border border-surface-container-highest flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-outline uppercase tracking-widest">Surcharge</p>
                        <p className="text-2xl font-black text-on-surface tracking-tighter">{scope.amount}</p>
                      </div>
                      <div className="text-right space-y-0.5">
                        <p className="text-[9px] font-black text-outline uppercase tracking-widest">Time Impact</p>
                        <p className="text-base font-bold text-on-surface">+3 Days</p>
                      </div>
                    </div>

                    <button className="w-full h-14 bg-primary text-on-primary rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Approve & Settle
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-primary/60">
                   <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                   <p className="text-[10px] font-bold uppercase tracking-widest">Live Client-Facing View</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HEADER: Title & Global Status */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">{scope.description}</h1>
            <StatusBadge status={internalStatus} size="sm" />
          </div>
          <p className="text-xs font-medium text-secondary">Scope Reference #{scope.id}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-outline">Last Activity</span>
            <span className="text-[11px] font-bold text-on-surface">Just now</span>
          </div>
        </div>
      </div>

      {/* QUICK STATS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <Building2 className="w-3 h-3" /> Client
          </span>
          <p className="text-sm font-bold text-on-surface truncate">{scope.client}</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <CreditCard className="w-3 h-3" /> Adjustment
          </span>
          <p className="text-sm font-black text-[#059669]">{scope.amount}</p>
        </div>
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col gap-1">
          <span className="text-[10px] font-black uppercase tracking-widest text-secondary flex items-center gap-1.5">
            <FileText className="w-3 h-3" /> Issued
          </span>
          <p className="text-sm font-bold text-on-surface truncate">{scope.time}</p>
        </div>
        <div className={`bg-surface-container-lowest border border-surface-container-highest rounded-xl p-4 shadow-sm flex flex-col gap-1 ${scope.validUntil ? 'border-amber-500/30 bg-amber-500/5' : ''}`}>
          <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${scope.validUntil ? 'text-amber-600' : 'text-secondary'}`}>
            <Clock className="w-3 h-3" /> Validity
          </span>
          <p className={`text-sm font-bold ${scope.validUntil ? 'text-amber-600' : 'text-on-surface'}`}>
            {scope.validUntil ? getRelativeExpiration(scope.validUntil) : 'No Expiry'}
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {/* SECTION 1: OPERATIONS - Status & Settlement */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-on-surface">Status Management</h3>
                <p className="text-[11px] text-secondary font-medium">Update progress or finalize settlement</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Status Selection */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-outline uppercase tracking-widest">Internal Progress</h4>
                  <p className="text-[11px] text-secondary leading-relaxed font-medium">Manually adjust the current operational state.</p>
                </div>
                
                <div ref={dropdownRef} className="relative">
                  <button 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full flex items-center justify-between bg-surface-container-low border border-surface-container-highest rounded-xl px-4 py-3 font-semibold text-on-surface focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  >
                    <span>{internalStatus}</span>
                    <ChevronDown className={`w-5 h-5 text-secondary transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.1 }}
                        className="absolute z-10 w-full mt-2 bg-surface shadow-2xl border border-surface-container-highest rounded-xl overflow-hidden"
                      >
                        {getStatusOptions().map((opt) => (
                          <button
                            key={opt.value}
                            disabled={opt.disabled}
                            onClick={() => handleStatusChange(opt.value)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                              opt.disabled
                                ? 'opacity-40 cursor-not-allowed bg-surface-container-lowest text-secondary'
                                : opt.value === internalStatus
                                  ? 'bg-primary text-on-primary font-bold'
                                  : 'text-on-surface hover:bg-surface-container-high'
                            }`}
                          >
                            {opt.value}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {internalStatus !== initialStatus && (
                    <div className="mt-3 flex items-center justify-between bg-surface-container-low/50 border border-dashed border-primary/20 rounded-xl p-3">
                      <span className="text-[11px] text-secondary font-medium italic">Status was {initialStatus}</span>
                      <button onClick={handleUndoStatus} className="text-[11px] font-bold text-primary flex items-center gap-1 hover:underline">
                        <Undo2 className="w-3 h-3" /> Undo
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Settlement Button */}
              <div className="space-y-4">
                 <div className="space-y-1">
                  <h4 className="text-[10px] font-black text-outline uppercase tracking-widest">Final Action</h4>
                  <p className="text-[11px] text-secondary leading-relaxed font-medium">Archive this scope once approved and paid.</p>
                </div>
                <button 
                  onClick={() => {
                    setInternalStatus('Completed');
                    setTimeout(() => { if (onBack) onBack(); }, 600);
                  }}
                  disabled={internalStatus !== 'Paid' && internalStatus !== 'Approved'}
                  className="w-full h-12 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-30 disabled:translate-y-0 disabled:shadow-none"
                >
                  <CheckCircle className="w-5 h-5" /> Mark as Completed
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: SMART NUDGES - Follow-up Strategy */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-base font-bold text-on-surface">Smart Nudges</h3>
                  <p className="text-[11px] text-secondary font-medium">Generated templates for quick follow-ups</p>
                </div>
              </div>
              <div className="flex bg-surface-container-low rounded-xl border border-surface-container-highest p-1 self-start sm:self-auto">
                <button 
                  onClick={() => setNudgeScenario('unread')} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${nudgeScenario === 'unread' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' : 'text-secondary hover:text-on-surface'}`}
                >
                  Unread
                </button>
                <button 
                  onClick={() => setNudgeScenario('expiring')} 
                  className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${nudgeScenario === 'expiring' ? 'bg-primary/10 text-primary shadow-sm border border-primary/20' : 'text-secondary hover:text-on-surface'}`}
                >
                  Expiring
                </button>
              </div>
            </div>

            <div className="relative group">
              <div className="w-full bg-surface-container-low border border-surface-container-highest rounded-2xl p-6 pr-16 text-sm text-on-surface font-medium leading-relaxed italic shadow-inner">
                "{nudgeMessages[nudgeScenario]}"
              </div>
              <button 
                onClick={() => handleCopyNudge(nudgeMessages[nudgeScenario])}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all active:scale-90 shadow-sm"
                title="Copy Nudge"
              >
                {copyStatus ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
              </button>
              {copyStatus && (
                <motion.span 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute -top-8 right-0 text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded border border-primary/20 backdrop-blur-sm"
                >
                  {copyStatus}
                </motion.span>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: COMMUNICATION - Message */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-on-surface">Outbound Message</h3>
                <p className="text-[11px] text-secondary font-medium">Dispatched at {scope.time}</p>
              </div>
            </div>
            
            <div className="bg-surface-container-low rounded-2xl border border-surface-container-highest p-6 relative overflow-hidden">
              <div className={`transition-all duration-700 ease-in-out ${isMsgExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-24 opacity-80 italic'}`}>
                <p className="whitespace-pre-wrap font-sans text-on-surface leading-loose text-sm italic">
                  {mockMessagePreview}
                </p>
              </div>
              {!isMsgExpanded && (
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface-container-low to-transparent pointer-events-none" />
              )}
            </div>
            
            <button 
              onClick={() => setIsMsgExpanded(!isMsgExpanded)}
              className="mt-4 w-full flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-secondary hover:text-on-surface transition-colors"
            >
              {isMsgExpanded ? 'Collapse Message' : 'Read Full Message'}
              <ChevronDown className={`w-3 h-3 transition-transform ${isMsgExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* SECTION 4: HISTORY - Activity Log */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 sm:p-8 shadow-sm">
           <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-base font-bold text-on-surface">Activity Log</h3>
                <p className="text-[11px] text-secondary font-medium">Recorded audit trail for this scope</p>
              </div>
            </div>
           
           <div className="space-y-8 relative before:absolute before:inset-y-2 before:left-[11.5px] before:w-px before:bg-surface-container-highest">
             <div className="flex gap-6 relative items-start">
               <div className="relative z-10 w-6 flex justify-center shrink-0 mt-[5px] bg-surface-container-lowest py-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/20"></div>
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-bold text-on-surface">Status changed to {internalStatus}</p>
                 <p className="text-xs text-secondary font-medium">Manual update via dashboard operator</p>
                 <p className="text-[10px] font-bold text-outline uppercase tracking-tighter mt-1">Just Now</p>
               </div>
             </div>
             
             <div className="flex gap-6 opacity-80 relative group items-start">
               <div className="relative z-10 w-6 flex justify-center shrink-0 mt-[5px] bg-surface-container-lowest py-2">
                 <div className="w-2 h-2 rounded-full bg-surface-container-highest ring-4 ring-surface-container-highest/20 group-hover:bg-outline transition-colors"></div>
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-bold text-on-surface">Email Dispatched</p>
                 <p className="text-xs text-secondary font-medium">Secure portal link sent to primary contact</p>
                 <p className="text-[10px] font-medium text-outline uppercase mt-1">{scope.time}</p>
               </div>
             </div>
             
             <div className="flex gap-6 opacity-60 relative group items-start">
               <div className="relative z-10 w-6 flex justify-center shrink-0 mt-[5px] bg-surface-container-lowest py-2">
                 <div className="w-2 h-2 rounded-full bg-surface-container-highest ring-4 ring-surface-container-highest/20 group-hover:bg-outline transition-colors"></div>
               </div>
               <div className="space-y-1">
                 <p className="text-sm font-bold text-on-surface">Draft Initialized</p>
                 <p className="text-xs text-secondary font-medium">Automatic extraction completed via AI assistant</p>
                 <p className="text-[10px] font-medium text-outline uppercase mt-1">{scope.time}</p>
               </div>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
