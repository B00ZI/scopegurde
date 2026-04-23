import { Building2, ClipboardList, Clock, CheckCircle } from 'lucide-react';

/**
 * PAGE COMPONENT: Hardcoded Client Approval Demo
 * 
 * Purpose: This was the original static mockup of the client approval page.
 * It is currently linked to the floating "View Client Portal" button on the dashboard
 * to serve as a fast structural preview.
 * 
 * Note: The live, dynamic version of this layout driven by AI output is `ApprovalPortal.tsx`.
 */
export function ApprovalPage() {
  return (
    <div className="bg-background min-h-screen text-on-background flex flex-col font-body-base">
      <main className="flex-grow flex items-center justify-center p-6 md:p-10">
        <div className="max-w-3xl w-full">
          {/* Header / Logo */}
          <div className="mb-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-surface-container border border-surface-container-highest mb-4">
              <Building2 className="text-primary w-8 h-8" />
            </div>
            <h1 className="font-h2 text-on-surface">Acme Logistics Corp</h1>
            <p className="font-body-sm text-secondary mt-1">Surcharge Approval Request</p>
          </div>

          {/* Approval Card */}
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl overflow-hidden shadow-sm">
            {/* Card Header */}
            <div className="p-8 md:p-10 border-b border-surface-container-highest bg-surface-bright flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-primary-container/10 text-primary font-label-caps mb-4">Pending Approval</span>
                <h2 className="font-h1 text-on-surface">Expedited Freight Surcharge</h2>
                <p className="font-body-base text-on-surface-variant mt-4 max-w-xl">
                  Due to supply chain delays at the port, expedited ground freight is required to meet the original delivery deadline.
                </p>
              </div>
              <div className="text-left md:text-right">
                <p className="font-label-caps text-secondary mb-1">Additional Cost</p>
                <p className="font-h1 text-on-surface">$2,450.00</p>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-8 md:p-10 flex flex-col md:flex-row gap-10">
              {/* Left Column: Details */}
              <div className="flex-1 space-y-8">
                <div>
                  <h3 className="font-h3 text-on-surface flex items-center gap-3 mb-6">
                    <ClipboardList className="text-outline w-6 h-6" />
                    What's Included
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      <span className="font-body-sm text-on-surface-variant">Dedicated team driver for cross-country transit</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      <span className="font-body-sm text-on-surface-variant">Priority offloading at destination facility</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
                      <span className="font-body-sm text-on-surface-variant">Real-time GPS tracking access</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-h3 text-on-surface flex items-center gap-3 mb-6">
                    <Clock className="text-outline w-6 h-6" />
                    Timeline Impact
                  </h3>
                  <div className="bg-surface-container rounded-lg p-5 border border-surface-container-highest">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-body-sm text-secondary">Original Delivery:</span>
                      <span className="font-body-sm text-on-surface line-through">Oct 24, 2023</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-body-sm text-secondary">New Delivery (with surcharge):</span>
                      <span className="font-body-sm text-primary font-medium">Oct 22, 2023</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Meta */}
              <div className="w-full md:w-64 space-y-4">
                <div className="bg-surface-bright border border-surface-container-highest rounded-lg p-4">
                  <p className="font-label-caps text-secondary mb-1">Reference ID</p>
                  <p className="font-body-sm text-on-surface font-medium">SRCH-8924-A</p>
                </div>
                <div className="bg-surface-bright border border-surface-container-highest rounded-lg p-4">
                  <p className="font-label-caps text-secondary mb-1">Requested By</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-surface-container overflow-hidden">
                      <img 
                        src="https://picsum.photos/seed/sarah/100/100" 
                        alt="Sarah Jenkins" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="font-body-sm text-on-surface font-medium">Sarah Jenkins</p>
                      <p className="font-label-caps text-secondary text-[10px]">Logistics Manager</p>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-bright border border-surface-container-highest rounded-lg p-4">
                  <p className="font-label-caps text-secondary mb-1">Date Issued</p>
                  <p className="font-body-sm text-on-surface">Oct 15, 2023</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-8 md:p-10 border-t border-surface-container-highest bg-surface flex flex-col sm:flex-row gap-4 items-center justify-end">
              <button className="w-full sm:w-auto px-6 py-2 rounded-lg border border-outline text-on-surface font-button hover:bg-surface-container-high transition-colors">
                Decline
              </button>
              <button className="w-full sm:w-auto px-10 py-2.5 rounded-lg bg-primary text-on-primary font-button hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <CheckCircle className="w-4 h-4" />
                Approve & Pay $2,450.00
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="font-body-sm text-secondary">
              Powered by <span className="font-medium text-on-surface-variant">ScopeGuard</span>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
