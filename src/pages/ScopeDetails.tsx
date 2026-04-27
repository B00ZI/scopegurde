import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, ExternalLink, Mail, CreditCard, Clock, FileText, Check, Lock, Building2, Copy, ChevronDown, Bell, Undo2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { StatusBadge } from '../components/StatusBadge';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    <div className="max-w-6xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      {/* HEADER: Title & Global Status */}
      <div className="flex items-center mb-8">
        <div className="flex-1 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-h1 text-on-surface tracking-tight">{scope.description}</h1>
              <StatusBadge status={internalStatus} size="lg" />
            </div>
            <p className="text-secondary font-body-base mt-1">Scope #{scope.id} • {scope.client}</p>
          </div>
          
          <div className="text-right flex flex-col justify-center">
            <span className="text-xs font-bold uppercase tracking-wider text-secondary">Last Updated</span>
            <span className="text-sm font-medium text-on-surface">Just now</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content: Info & Previews */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-secondary" /> Scope Summary
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-surface border border-surface-container-highest rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] uppercase tracking-wider font-bold text-secondary mb-1 flex items-center justify-center gap-1 w-full">
                  <Building2 className="w-3.5 h-3.5 text-secondary" /> Client
                </p>
                <p className="font-medium text-on-surface truncate w-full">{scope.client}</p>
              </div>
              
              <div className="bg-surface border border-surface-container-highest rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] uppercase tracking-wider font-bold text-secondary mb-1 flex items-center justify-center gap-1 w-full">
                  <CreditCard className="w-3.5 h-3.5 text-secondary" /> Amount
                </p>
                <p className="font-medium text-on-surface text-lg text-[#065F46] dark:text-[#10B981] w-full">{scope.amount}</p>
              </div>
              
              <div className="bg-surface border border-surface-container-highest rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <p className="text-[11px] uppercase tracking-wider font-bold text-secondary mb-1 flex items-center justify-center gap-1 w-full">
                  <FileText className="w-3.5 h-3.5 text-secondary" /> Created
                </p>
                <p className="font-medium text-on-surface truncate w-full">{scope.time}</p>
              </div>
              
              {scope.validUntil ? (
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-amber-600 dark:text-amber-500 mb-1 flex items-center justify-center gap-1 w-full">
                    <Clock className="w-3.5 h-3.5" /> Expires
                  </p>
                  <p className="font-medium text-amber-700 dark:text-amber-400 truncate w-full">
                    {getRelativeExpiration(scope.validUntil)}
                  </p>
                </div>
              ) : (
                <div className="bg-surface border border-surface-container-highest rounded-xl p-4 opacity-50 flex flex-col items-center justify-center text-center">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-secondary mb-1 flex items-center justify-center gap-1 w-full">
                    <Clock className="w-3.5 h-3.5 text-secondary" /> Expires
                  </p>
                  <p className="font-medium text-secondary truncate w-full">None</p>
                </div>
              )}
            </div>
          </div>

          {/* Sent Message Preview */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-0 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-surface-container-highest bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <Mail className="w-5 h-5 text-secondary" /> Sent Message Preview
              </h3>
            </div>
            <div className="p-6 bg-surface">
              <p className="whitespace-pre-wrap font-body-base text-on-surface leading-relaxed text-sm">
                {mockMessagePreview}
              </p>
              <div className="mt-4 p-3 bg-surface-container-low rounded-lg border border-dashed border-surface-container-highest text-secondary text-xs italic">
                Full message details would be expanded here in production.
              </div>
            </div>
          </div>

          {/* Client Portal Preview */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-0 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-surface-container-highest bg-surface-container-low flex justify-between items-center">
              <h3 className="font-bold text-on-surface flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-secondary" /> Client Portal Preview
              </h3>
            </div>
            {/* Embedded visually accurate client portal preview */}
            <div className="p-4 sm:p-8 bg-surface-container-low border-t border-surface-container-highest flex items-center justify-center">
               <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-xl w-full max-w-lg overflow-hidden transform scale-90 sm:scale-100 origin-top">
                  <div className="p-6 space-y-4">
                     <div className="flex justify-between items-start">
                        <div className="w-10 h-10 bg-surface-container-lowest border border-surface-container-highest rounded-lg flex items-center justify-center shadow-sm">
                           <Building2 className="w-5 h-5 text-primary" />
                        </div>
                        <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Scope Request</p>
                     </div>
                     <h2 className="text-2xl font-extrabold text-on-surface leading-[1.15] tracking-tight mt-2">
                        {scope.description}
                     </h2>
                  </div>
                  
                  <div className="border-t border-surface-container-highest p-6">
                     <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">What's Included</h3>
                     <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                           <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                              <Check className="w-3 h-3 text-primary" strokeWidth={3} />
                           </div>
                           <span className="text-on-surface font-medium text-sm leading-relaxed">Additional work beyond initial agreement.</span>
                        </li>
                     </ul>
                  </div>

                  <div className="bg-surface-container p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-b border-surface-container-highest">
                     <div className="space-y-0.5 w-full sm:w-auto">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Timeline</p>
                        <p className="text-base font-bold text-on-surface">TBD</p>
                     </div>
                     <div className="space-y-0.5 w-full sm:text-right">
                        <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Additional Cost</p>
                        <p className="text-2xl font-bold text-on-surface tracking-tight">{scope.amount}</p>
                     </div>
                  </div>

                  <div className="p-6">
                     <button className="w-full h-12 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 opacity-50 cursor-not-allowed">
                        <Lock className="w-4 h-4" /> Approve & Pay
                     </button>
                  </div>
               </div>
            </div>
          </div>
          
        </div>

        {/* Sidebar: Actions */}
        <div className="space-y-6">
          
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-on-surface mb-4">Internal Actions</h3>
            <p className="text-sm text-secondary font-body-base mb-6 leading-relaxed">
              Manually update the status if the client acted outside of the application.
            </p>
            
            <div className="space-y-4">
              <div ref={dropdownRef}>
                <label className="block font-label-caps text-on-surface-variant mb-2 uppercase">Current Status</label>
                <div className="relative">
                  <button 
                    onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                    className="w-full flex items-center justify-between bg-surface border border-surface-container-highest rounded-lg px-4 py-3 font-body-base text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  >
                    <span>{internalStatus}</span>
                    <ChevronDown className={`w-5 h-5 text-secondary transition-transform ${isStatusDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isStatusDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute z-10 w-full mt-2 bg-surface shadow-lg border border-surface-container-highest rounded-lg overflow-hidden"
                      >
                        {getStatusOptions().map((opt) => (
                          <button
                            key={opt.value}
                            disabled={opt.disabled}
                            onClick={() => handleStatusChange(opt.value)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                              opt.disabled
                                ? 'opacity-50 cursor-not-allowed bg-surface-container-lowest text-secondary'
                                : opt.value === internalStatus
                                  ? 'bg-primary/5 text-primary font-medium'
                                  : 'text-on-surface hover:bg-surface-container-low'
                            }`}
                          >
                            {opt.value}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {internalStatus !== initialStatus && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-surface-container-low border border-surface-container-highest rounded-lg p-3 flex justify-between items-center gap-2">
                        <p className="text-xs text-secondary font-medium">
                          Status changed from <span className="font-bold text-on-surface">{initialStatus}</span> to <span className="font-bold text-on-surface">{internalStatus}</span>.
                        </p>
                        <button 
                          onClick={handleUndoStatus}
                          className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 transition-colors shrink-0"
                        >
                          <Undo2 className="w-3.5 h-3.5" /> Undo
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button 
                onClick={() => {
                  setInternalStatus('Completed');
                  setTimeout(() => {
                    if (onBack) onBack();
                  }, 600);
                }}
                disabled={internalStatus !== 'Paid' && internalStatus !== 'Approved'}
                className="w-full py-3 px-4 rounded-xl shadow-sm font-button flex justify-center items-center gap-2 border border-transparent transition-all disabled:bg-surface-container-highest disabled:text-outline disabled:cursor-not-allowed bg-[#065F46] text-white hover:bg-[#047857]"
              >
                <CheckCircle className="w-5 h-5" /> 
                Mark as Completed
              </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-on-surface flex items-center gap-2">
                <Bell className="w-5 h-5 text-secondary" /> Smart Nudges
              </h3>
            </div>
            <p className="text-sm text-secondary font-body-base mb-4 leading-relaxed">
              Pre-written follow-ups based on the scope's state.
            </p>
            
            <div className="space-y-4">
              <div className="flex border border-surface-container-highest rounded-lg p-1 bg-surface-container-low mb-4">
                <button 
                  onClick={() => setNudgeScenario('unread')}
                  className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${nudgeScenario === 'unread' ? 'bg-surface shadow-sm text-on-surface' : 'text-secondary hover:text-on-surface'}`}
                >
                  Unread
                </button>
                <button 
                  onClick={() => setNudgeScenario('expiring')}
                  className={`flex-1 text-sm font-medium py-1.5 rounded-md transition-colors ${nudgeScenario === 'expiring' ? 'bg-surface shadow-sm text-on-surface' : 'text-secondary hover:text-on-surface'}`}
                >
                  Expiring
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-[13px] text-on-surface-variant">
                  {nudgeScenario === 'unread' 
                    ? "It looks like the client hasn't opened this yet. Send a quick reminder." 
                    : "This scope expires soon! Create urgency to get it approved."}
                </p>
                <div className="relative group">
                  <div className="bg-surface border border-surface-container-highest rounded-lg p-4 text-sm text-on-surface leading-relaxed whitespace-pre-wrap">
                    {nudgeMessages[nudgeScenario]}
                  </div>
                  <button 
                    onClick={() => handleCopyNudge(nudgeMessages[nudgeScenario])}
                    className="absolute top-2 right-2 p-2 rounded-md bg-surface-container border border-surface-container-highest text-on-surface hover:text-primary transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
                  >
                    {copyStatus ? <span className="text-xs font-bold text-primary">{copyStatus}</span> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-sm text-on-surface uppercase tracking-wider mb-4 flex items-center gap-2">
               <FileText className="w-4 h-4" /> Other Scopes
             </h3>
             <p className="text-xs text-secondary mb-4">Scopes with {scope.client}</p>
             {relatedScopes.length > 0 ? (
               <ul className="space-y-3">
                 {relatedScopes.map(rs => (
                   <li 
                     key={rs.id} 
                     onClick={() => onViewScope(rs)}
                     className="p-3 border border-surface-container-highest rounded-lg bg-surface hover:bg-surface-container transition-colors cursor-pointer group"
                   >
                     <div className="flex justify-between items-center mb-1">
                       <p className="font-medium text-sm text-on-surface group-hover:text-primary transition-colors">{rs.amount}</p>
                       <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                         rs.status === 'Completed' ? 'bg-[#065F46] text-white' :
                         rs.status === 'Paid' ? 'bg-green-500/20 text-green-700' : 
                         rs.status === 'Approved' ? 'bg-green-500/10 text-green-600' :
                         rs.status === 'Sent' ? 'bg-amber-500/10 text-amber-600' :
                         rs.status === 'Expired' ? 'bg-error/10 text-error' :
                         'bg-surface-container text-secondary'
                       }`}>{rs.status}</span>
                     </div>
                     <p className="text-xs text-secondary truncate">{rs.description}</p>
                   </li>
                 ))}
               </ul>
             ) : (
               <p className="text-sm text-secondary">No other recent scopes found.</p>
             )}
          </div>

          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 shadow-sm">
             <h3 className="font-bold text-sm text-secondary uppercase tracking-wider mb-4 flex items-center gap-2">
               <Clock className="w-4 h-4" /> Activity History
             </h3>
             <ul className="space-y-4">
               <li className="flex gap-3">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-primary shrink-0"></div>
                 <div>
                   <p className="text-sm font-medium text-on-surface">Status updated to {internalStatus}</p>
                   <p className="text-xs text-secondary mt-0.5">Just now</p>
                 </div>
               </li>
               <li className="flex gap-3 text-secondary">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-surface-container-highest shrink-0"></div>
                 <div>
                   <p className="text-sm font-medium">Message sent to client</p>
                   <p className="text-xs mt-0.5">{scope.time}</p>
                 </div>
               </li>
               <li className="flex gap-3 text-secondary">
                 <div className="w-2 h-2 mt-1.5 rounded-full bg-surface-container-highest shrink-0"></div>
                 <div>
                   <p className="text-sm font-medium">Scope drafted</p>
                   <p className="text-xs mt-0.5">{scope.time}</p>
                 </div>
               </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
