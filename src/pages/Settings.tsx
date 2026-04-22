import { CloudUpload, Landmark, ExternalLink, AlertCircle } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

export function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto w-full py-8">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your organization's identity and operational details."
      />
      
      <div className="flex flex-col gap-10">
        {/* Profile Setup Section */}
        <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6">
          <div className="mb-6">
            <h2 className="font-h2 text-on-surface mb-1">Organization Profile</h2>
            <p className="font-body-sm text-secondary">Manage your company's identity and operational details.</p>
          </div>
          
          <div className="grid grid-cols-1 gap-10">
            {/* Logo Upload Zone */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Company Logo</label>
              <div className="border-2 border-dashed border-surface-container-highest rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-surface-container-high flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <CloudUpload className="text-outline w-8 h-8" />
                </div>
                <p className="font-body-base text-on-surface font-medium mb-1">Drop your logo here, or browse</p>
                <p className="font-body-sm text-secondary">Supports SVG, PNG, JPG (max 2MB)</p>
              </div>
            </div>
            
            {/* Organization Name */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider" htmlFor="orgName">Legal Entity Name</label>
              <input 
                className="w-full bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-3 font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-shadow" 
                id="orgName" 
                type="text" 
                defaultValue="ScopeSurcharge Operations LLC"
              />
            </div>
            
            <div className="pt-4 border-t border-surface-container-highest flex justify-end">
              <button className="bg-surface-container text-on-surface font-button px-6 py-2.5 rounded-lg border border-surface-container-highest hover:bg-surface-container-high transition-colors">
                Save Profile
              </button>
            </div>
          </div>
        </section>

        {/* Financial Integration Section */}
        <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <Landmark className="text-primary bg-primary/10 p-2 rounded-lg w-10 h-10" />
                <h2 className="font-h2 text-on-surface">Financial Integration</h2>
              </div>
              <p className="font-body-sm text-secondary mb-4 max-w-lg">
                Connect your payment gateway to automate surcharge processing, manage disputes, and reconcile logistics billing in real-time.
              </p>
              <div className="inline-flex items-center gap-2 bg-surface px-3 py-1.5 rounded border border-surface-container-highest">
                <AlertCircle className="text-error w-4 h-4" />
                <span className="font-body-sm text-on-surface font-medium">Gateway Not Configured</span>
              </div>
            </div>
            <div className="flex-shrink-0 pt-2 sm:pt-0">
              <button className="w-full sm:w-auto bg-primary text-on-primary font-button px-6 py-3 rounded-lg hover:opacity-90 transition-colors flex items-center justify-center gap-2 shadow-sm">
                Connect Stripe
                <ExternalLink className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
