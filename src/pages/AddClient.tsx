import { Building2, Save, X } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';

interface AddClientPageProps {
  onCancel: () => void;
  onSave: () => void;
}

/**
 * PAGE COMPONENT: Add New Client
 * 
 * Purpose: Form for entering a new client into the CRM.
 */
export function AddClientPage({ onCancel, onSave }: AddClientPageProps) {
  return (
    <div className="max-w-6xl mx-auto pt-2 pb-8 animate-in fade-in duration-300">
      {/* Header Injection */}
      <PageHeader 
        title="Add New Client" 
        subtitle="Create a new client profile to track scopes and revenue."
      />

      {/* Main Form Card */}
      <section className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-surface-container-highest">
          <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-secondary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-h3 text-on-surface">Client Details</h2>
            <p className="font-body-sm text-secondary">Enter primary business entity and contact info.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Company Name</label>
              <input 
                type="text" 
                placeholder="e.g. Acme Corp Logistics" 
                className="px-4 py-2.5 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
            
            {/* Support Email Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Primary Email</label>
              <input 
                type="email" 
                placeholder="billing@company.com" 
                className="px-4 py-2.5 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Industry Input */}
            <div className="flex flex-col gap-2">
              <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Industry</label>
              <select className="px-4 py-2.5 bg-surface-container-lowest border border-surface-container-highest rounded-lg font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                <option value="logistics">Logistics & Freight</option>
                <option value="retail">Retail & E-commerce</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-8 mt-4 border-t border-surface-container-highest flex justify-end gap-4">
            <button 
              onClick={onCancel}
              className="px-6 py-2.5 bg-surface-container text-on-surface font-button rounded-lg hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2 border border-surface-container-highest shadow-sm"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button 
              onClick={onSave}
              className="px-8 py-2.5 bg-primary text-on-primary font-button rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              Save Client
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
