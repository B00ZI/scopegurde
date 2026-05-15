import React from 'react';
import { Check, Clock, Lock, Building2 } from 'lucide-react';

interface ApprovalPortalProps {
  details: any;
  onApprove: () => void;
  onDecline: () => void;
}

/**
 * CLIENT-FACING APPROVAL PORTAL
 * 
 * Purpose: The public URL that ends-clients land on.
 * 
 * Design Distinction: 
 * Intentionally bypasses the main app layout (sidebar/topbar) to provide a 
 * "White-Labeled" experience. High focus on the contract details and 
 * call-to-action buttons.
 */
export function ApprovalPortalPage({ details, onApprove, onDecline }: ApprovalPortalProps) {
  // --- RENDER HELPERS ---
  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const deliverablesList = (details.deliverables || '')
    .split('\n')
    .filter((line: string) => line.trim().length > 0);
  return (
    <div className="min-h-screen bg-surface-container-low py-8 sm:py-16 px-4 selection:bg-primary/20 font-sans">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-10">
        
        {/* Brand Header: Simulates the white-labeled agency name */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-surface-container-lowest rounded-xl border border-surface-container-highest shadow-sm transition-transform hover:scale-105">
            <Building2 className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-bold text-on-surface tracking-tight">Acme Consulting</h1>
            <p className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">Scope Request</p>
          </div>
        </div>

        {/* Main Contract Card */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-xl overflow-hidden">
          
          {/* Header Section: Title and Metadata */}
          <div className="p-6 sm:p-10 space-y-6 text-center sm:text-left">
            <h2 className="text-2xl sm:text-[32px] font-extrabold text-on-surface leading-[1.15] tracking-tight">
              {details.title || 'Additional Revision Cycle'}
            </h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-center sm:justify-start">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <p className="text-xs sm:text-sm font-medium text-secondary">
                  Requested on <span className="text-on-surface/80">{formattedDate}</span>
                </p>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-surface-container-highest" />
                <p className="text-xs sm:text-sm font-medium text-secondary">
                  Project: <span className="text-primary font-bold">{details.projectName || 'Q4 Strategy Deck'}</span>
                </p>
              </div>
              
              {details.validUntil && (
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <div className="hidden sm:block w-1 h-1 rounded-full bg-surface-container-highest" />
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 w-fit">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <p className="text-[10px] sm:text-xs font-bold text-amber-700">
                      Offer valid until {new Date(details.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Scope Definitions Map: Parses the textarea input into bullet points */}
          <div className="border-t border-surface-container-highest">
            <div className="p-6 sm:p-10 space-y-6">
              <h3 className="text-[11px] font-bold text-primary uppercase tracking-[0.2em]">What's Included</h3>
              <ul className="space-y-5">
                {deliverablesList.length > 0 ? (
                  deliverablesList.map((line: string, i: number) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-on-surface font-medium leading-relaxed">
                        {line.replace(/^-\s*/, '')}
                      </span>
                    </li>
                  ))
                ) : (
                  <>
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-on-surface font-medium leading-relaxed">One comprehensive round of revisions based on consolidated feedback.</span>
                    </li>
                    <li className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 border border-primary/20">
                        <Check className="w-3.5 h-3.5 text-primary" strokeWidth={3} />
                      </div>
                      <span className="text-on-surface font-medium leading-relaxed">Updates to financial models reflecting new assumptions (max 2 tabs).</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Impact/Cost Bar: Highlights the most critical info for the client */}
          <div className="bg-surface-container-low border-t border-b border-surface-container-highest p-6 sm:p-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-8 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-14 h-14 bg-surface-container-lowest rounded-2xl border border-surface-container-highest flex items-center justify-center shadow-sm">
                  <Clock className="w-7 h-7 text-primary" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Timeline Impact</p>
                  <p className="text-xl font-bold text-on-surface">+{details.extraTimeDays || '3'} Business Days</p>
                </div>
              </div>
              <div className="text-center sm:text-right space-y-0.5">
                <p className="text-[10px] font-bold text-outline uppercase tracking-widest">Additional Cost</p>
                <div className="flex items-baseline justify-center sm:justify-end gap-1">
                  <span className="text-xl font-bold text-on-surface/40 leading-none">$</span>
                  <span className="text-3xl sm:text-[40px] font-bold text-on-surface leading-none tracking-tight">{details.priceAdjustment || '850.00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Area: Approval Options */}
          <div className="p-6 sm:p-10 space-y-8">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Secondary Action: Defer payment */}
                <button 
                  onClick={onApprove}
                  className="flex-[1] h-14 bg-surface-container text-on-surface font-bold rounded-xl hover:bg-surface-container-high transition-all active:scale-[0.98] border border-surface-container-highest"
                >
                  Approve Only
                </button>
                {/* Primary Action: Immediate Settlement */}
                <button 
                  onClick={onApprove}
                  className="flex-[2] h-14 bg-primary text-on-primary font-bold rounded-xl hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-primary/20"
                >
                  <Lock className="w-4 h-4" />
                  Approve & Pay ${details.priceAdjustment || '850.00'}
                </button>
              </div>
              
              {/* Legal confirmation notice for deferring payment */}
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <p className="text-[11px] text-primary/80 leading-relaxed font-medium text-center">
                  Notice: By clicking <span className="font-bold underline">Approve Only</span>, you legally confirm the scope adjustments and agree to settle the balance of <span className="font-bold">${details.priceAdjustment || '850.00'}</span> within your standard billing cycle or as per our professional service agreement.
                </p>
              </div>
            </div>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              <p className="text-center text-[11px] text-secondary font-medium tracking-wide">
                Secured by Stripe Global Payments. Terms of service apply.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="text-center pb-8">
          <button 
            onClick={onDecline}
            className="group inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-all"
          >
            <span>Need to discuss this change?</span>
            <span className="text-on-surface underline decoration-primary/30 underline-offset-4 group-hover:decoration-primary transition-all">Contact Consultant</span>
          </button>
        </div>

      </div>
    </div>
  );
}
