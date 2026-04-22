import { CheckCircle, XCircle, FileText, Calendar, DollarSign, Clock } from 'lucide-react';

interface ApprovalPortalProps {
  details: any;
  onApprove: () => void;
  onDecline: () => void;
}

export function ApprovalPortalPage({ details, onApprove, onDecline }: ApprovalPortalProps) {
  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-4 selection:bg-primary/20">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-on-surface uppercase italic">ScopeSurcharge</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <p className="font-sans text-sm font-bold text-secondary uppercase tracking-widest">Secure Approval Portal</p>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl shadow-2xl overflow-hidden">
          {/* Status Banner */}
          <div className="bg-primary/5 px-8 py-4 border-b border-primary/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <span className="font-sans text-sm font-bold text-primary uppercase">Draft Change Order #{Math.floor(1000 + Math.random() * 9000)}</span>
            </div>
            <span className="bg-primary-container text-on-primary-container text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">Pending Approval</span>
          </div>

          <div className="p-10 space-y-10">
            {/* Title & Summary */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-on-surface leading-tight">{details.title || 'Project Scope Adjustment'}</h2>
              <p className="text-secondary font-body-base leading-relaxed">
                This change order outlines modifications to the original project scope as discussed.
                Please review the deliverables and adjustments below before proceeding.
              </p>
            </div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-surface-container-low p-6 rounded-xl border border-surface-container-highest">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Price Adjustment</span>
                </div>
                <p className="text-2xl font-bold text-on-surface">${details.priceAdjustment || '0.00'}</p>
              </div>
              <div className="bg-surface-container-low p-6 rounded-xl border border-surface-container-highest">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-[10px] font-bold text-outline uppercase tracking-widest leading-none">Timeline Impact</span>
                </div>
                <p className="text-2xl font-bold text-on-surface">+{details.extraTimeDays || '0'} Days</p>
              </div>
            </div>

            {/* Deliverables */}
            <div className="space-y-6">
              <h3 className="font-sans text-xs font-bold text-on-surface-variant uppercase tracking-[0.2em] border-b border-surface-container-highest pb-2">Proposed Deliverables</h3>
              <div className="bg-surface p-6 rounded-xl border border-surface-container-highest">
                <ul className="space-y-4">
                  {(details.deliverables || '').split('\n').map((line: string, i: number) => (
                    line.trim() && (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span className="text-on-surface font-body-base leading-relaxed">{line.replace(/^-\s*/, '')}</span>
                      </li>
                    )
                  ))}
                </ul>
              </div>
            </div>

            {/* Footer Notice */}
            <div className="flex items-start gap-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
              <Calendar className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-secondary leading-relaxed font-medium">
                By approving this document, you authorize the stated adjustments to the project budget and timeline. 
                Work will commence upon receipt of digital approval.
              </p>
            </div>
          </div>

          {/* Action Bar */}
          <div className="bg-surface-container px-10 py-8 flex flex-col sm:flex-row gap-4 border-t border-surface-container-highest">
            <button 
              onClick={onDecline}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-surface-container-lowest border border-error/50 text-error font-button rounded-xl hover:bg-error/5 transition-all active:scale-[0.98]"
            >
              <XCircle className="w-5 h-5" />
              Decline & Discuss
            </button>
            <button 
              onClick={onApprove}
              className="flex-1 flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary font-button rounded-xl hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]"
            >
              <CheckCircle className="w-5 h-5" />
              Approve Changes
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-outline uppercase tracking-widest">
          Secure Processing provided by ScopeSurcharge Global Ltd.
        </p>
      </div>
    </div>
  );
}
