import React, { useState } from 'react';
import { 
  CloudUpload, 
  Landmark, 
  ExternalLink, 
  AlertCircle, 
  User, 
  Building, 
  CreditCard, 
  Bell, 
  Trash2, 
  Lock,
  ChevronRight,
  Mail,
  Globe,
  Award,
  LogOut as LogOutIcon,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { aiStatus } from '../lib/ai';

type SettingsTab = 'profile' | 'security' | 'business' | 'payments' | 'preferences';

/**
 * SETTINGS PAGE
 * 
 * Purpose: Central control for user profile and organization data.
 * Rebuilt with a MOBILE-FIRST architecture and strict overflow prevention.
 */
export function SettingsPage({ onLogout }: { onLogout?: () => void }) {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
  });

  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 overflow-x-hidden">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your identity and business operations."
      />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-4 sm:mt-6">
        {/* Navigation - Icon only on mobile, Side-nav on tablet/desktop */}
        <aside className="w-full lg:w-56 shrink-0">
          <nav className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 scrollbar-hide sticky top-0 bg-background/80 backdrop-blur-md z-10 lg:static lg:bg-transparent lg:backdrop-blur-none py-2 lg:py-0 w-full justify-between sm:justify-start">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className={`flex items-center justify-center lg:justify-start gap-3 p-3 sm:px-4 sm:py-3 rounded-2xl lg:rounded-xl font-bold transition-all shrink-0 lg:shrink lg:w-full border-2 flex-1 lg:flex-none ${
                    isActive 
                      ? 'bg-primary/10 text-primary border-primary/20 lg:bg-primary lg:text-on-primary lg:shadow-sm' 
                      : 'bg-surface-container-low text-secondary border-transparent hover:bg-surface-container'
                  }`}
                  title={item.label}
                >
                  <Icon className={`w-5 h-5 lg:w-4 lg:h-4 shrink-0 transition-transform ${isActive ? 'scale-110' : ''}`} />
                  <span className="hidden sm:block text-[11px] lg:text-sm whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 sm:p-8 shadow-sm">
            
            {/* PROFILE SECTION */}
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Personal Info</h3>
                    <p className="text-xs text-secondary mt-1">Manage your public identity within the organization.</p>
                  </div>
                    <div className="space-y-6 max-w-lg">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Full Name</label>
                        <input 
                          type="text" 
                          defaultValue="Jane Doe"
                          className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Email Address</label>
                        <input 
                          type="email" 
                          defaultValue="jane.doe@example.com"
                          className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                    </div>
                </section>

                <section className="pt-8 border-t border-surface-container-highest">
                  <h3 className="text-lg font-bold text-on-surface mb-4">Subscription</h3>
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex flex-col sm:flex-row items-center gap-4 justify-between">
                    <div className="flex items-center gap-4 min-w-0">
                      <Award className="w-10 h-10 text-primary shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">Pro Plan</p>
                        <p className="text-[11px] text-secondary truncate">May 12, 2026 Billing</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto text-[11px] font-bold text-primary hover:underline transition-all">MANAGE BILLING</button>
                  </div>
                </section>

                <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-surface-container-highest">
                   <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-error/10 text-error rounded-xl font-bold text-xs hover:bg-error/20 active:scale-95 transition-all border border-transparent shadow-sm"
                  >
                    <LogOutIcon className="w-4 h-4" />
                    Sign Out of Account
                  </button>
                </div>
              </div>
            )}

            {/* SECURITY SECTION */}
            {activeTab === 'security' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Security</h3>
                    <p className="text-xs text-secondary mt-1">Protect your account with high-entropy credentials.</p>
                  </div>
                  <div className="space-y-6 max-w-lg">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Current Password</label>
                      <input type="password" placeholder="••••••••" className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">New Password</label>
                        <input type="password" placeholder="Min 12 chars" className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Confirm New</label>
                        <input type="password" placeholder="Repeat" className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-outline" />
                      </div>
                    </div>
                    <div className="pt-2">
                      <button className="w-full sm:w-auto px-8 py-3 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-lg shadow-primary/10 hover:translate-y-[-1px] active:translate-y-0 transition-all">
                        Update Password
                      </button>
                    </div>
                  </div>
                </section>

                <div className="pt-8 border-t border-surface-container-highest">
                  <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                      <ShieldAlert className="w-5 h-5" />
                      <h4 className="font-bold text-sm uppercase tracking-tight">Danger Zone</h4>
                    </div>
                    <p className="text-xs text-secondary leading-relaxed max-w-md">
                      Permanently delete your account and all associated operational data. This action is terminal.
                    </p>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold text-xs active:scale-95 transition-all shadow-sm">
                      Delete Property Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* BUSINESS DETAILS */}
            {activeTab === 'business' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Business Details</h3>
                    <p className="text-xs text-secondary mt-1">Configure your corporate identity and billing profile.</p>
                  </div>
                  
                  <div className="space-y-8 max-w-lg">
                    <div className="flex items-center gap-6 p-5 bg-surface-container-low rounded-2xl border border-surface-container-highest">
                      <div className="w-20 h-20 rounded-2xl bg-surface-container-high flex items-center justify-center relative group shrink-0 overflow-hidden border border-surface-container-highest">
                        <CloudUpload className="w-7 h-7 text-secondary group-hover:scale-110 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                          <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface truncate">Business Logo</p>
                        <p className="text-[10px] text-secondary mt-1">SVG or Transparent PNG preferred.</p>
                        <button className="text-[11px] font-bold text-primary hover:underline mt-2">Replace File</button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Legal Entity Name</label>
                        <input type="text" defaultValue="ScopeGuard Operations LLC" className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Global Contact Email</label>
                        <input type="email" placeholder="operations@company.com" className="w-full bg-surface-container border border-surface-container-highest rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                </section>

                {/* AI ASSISTANT SECTION */}
                <section className="pt-8 border-t border-surface-container-highest">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">AI Assistant</h3>
                    <p className="text-xs text-secondary mt-1">Connects the AI scope extractor and message drafting.</p>
                  </div>
                  <div className={`p-6 rounded-2xl space-y-6 border ${aiStatus.enabled ? 'bg-primary/5 border-primary/20' : 'bg-surface-container-low border-surface-container-highest'}`}>
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${aiStatus.enabled ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-secondary'}`}>
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-black text-on-surface">AI Provider: {aiStatus.provider === 'gemini' ? 'Google Gemini' : 'Offline Mode'}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${aiStatus.enabled ? 'bg-primary' : 'bg-outline'}`} />
                            <span className="text-[9px] font-black uppercase text-secondary tracking-wider">
                              Status: {aiStatus.enabled ? 'Connected' : 'Not configured'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start text-secondary border-t border-surface-container-highest pt-5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed italic">
                        {aiStatus.enabled
                          ? 'AI is active. Brain Dump extraction and message drafting use the configured provider.'
                          : `The app runs in offline mode with no API key required. To enable AI, create a .env file with GEMINI_API_KEY="<your key>" and AI_PROVIDER=gemini.`}
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}
            {activeTab === 'payments' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Payments</h3>
                    <p className="text-xs text-secondary mt-1">Connect financial services for automated settling.</p>
                  </div>
                  <div className="p-6 bg-[#635BFF]/5 border border-[#635BFF]/10 rounded-2xl space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-5 justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#635BFF] flex items-center justify-center text-white shadow-lg shadow-[#635BFF]/20">
                          <Landmark className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-sm font-black text-on-surface">Stripe Gateway</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-outline" />
                            <span className="text-[9px] font-black uppercase text-secondary tracking-wider">Status: Inactive</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setStripeConnected(true)}
                        className="w-full sm:w-auto px-6 py-3 bg-[#635BFF] text-white rounded-xl font-bold text-xs shadow-lg shadow-[#635BFF]/10 active:scale-95 transition-all text-center"
                      >
                        Connect Account
                      </button>
                    </div>
                    <div className="flex gap-4 items-start text-secondary border-t border-[#635BFF]/10 pt-5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed italic">
                        ScopeGuard leverages Stripe to handle all financial transactions securely. Connecting your account takes less than 2 minutes.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* PREFERENCES SECTION */}
            {activeTab === 'preferences' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <section>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-on-surface">Preferences</h3>
                    <p className="text-xs text-secondary mt-1">Tailor your operational alert criteria.</p>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest block mb-2">Alert Channels</label>
                    {[
                      { id: 'email', label: 'Email Summaries', icon: Mail, checked: notifications.email },
                      { id: 'alerts', label: 'Dashboard Notifications', icon: Bell, checked: notifications.alerts }
                    ].map((pref) => (
                      <div key={pref.id} className="flex items-center justify-between p-5 bg-surface-container-low border border-surface-container-highest rounded-2xl hover:border-outline-variant transition-colors group">
                        <div className="flex items-center gap-4 min-w-0">
                          <pref.icon className="w-5 h-5 text-secondary group-hover:text-primary transition-colors" />
                          <p className="text-sm font-bold text-on-surface truncate">{pref.label}</p>
                        </div>
                        <div className="relative inline-flex items-center cursor-pointer shrink-0">
                          <input 
                            type="checkbox" 
                            checked={pref.checked} 
                            onChange={(e) => setNotifications(prev => ({ ...prev, [pref.id]: e.target.checked }))}
                            className="sr-only peer" 
                          />
                          <div className="w-10 h-5 bg-surface-container-high rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* SAVE BUTTON */}
            <div className="mt-10 pt-6 border-t border-surface-container-highest flex justify-end">
              <button className="w-full sm:w-auto px-10 py-3.5 bg-primary text-on-primary rounded-xl font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Continue to Logout?"
        message="Active sessions will be invalidated."
        confirmText="Confirm"
        cancelText="Stay"
        isDestructive={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onLogout?.();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}
