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
  ShieldCheck,
  ShieldAlert,
  CreditCard as BillingIcon,
  Globe,
  Award,
  LogOut as LogOutIcon
} from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { SearchableDropdown } from '../components/SearchableDropdown';
import { ConfirmDialog } from '../components/ConfirmDialog';

type SettingsTab = 'profile' | 'security' | 'business' | 'payments' | 'preferences';

/**
 * SETTINGS PAGE
 * 
 * Purpose: Central control for user profile, organizational data, 
 * billing preferences, and payment integrations.
 * 
 * Sections:
 * - Profile: Personal details and current plan status.
 * - Security: Password management and account deletion.
 * - Business: Branding details used on public-facing portals.
 * - Payments: Stripe integration and default currencies.
 */
export function SettingsPage({ onLogout }: { onLogout?: () => void }) {
  // --- STATE MANAGEMENT ---
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [stripeConnected, setStripeConnected] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    alerts: true,
  });

  // --- CONFIG: NAVIGATION ITEMS ---
  const sidebarItems = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'business', label: 'Business', icon: Building },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Bell },
  ];

  return (
    <div className="max-w-container-max mx-auto pt-2 pb-8">
      <PageHeader 
        title="Settings" 
        subtitle="Manage your organization's identity and operational details."
      />
      
      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-64 shrink-0 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          <nav className="flex lg:flex-col gap-1.5 p-1 bg-surface-container-low rounded-2xl lg:bg-transparent lg:p-0 min-w-max lg:min-w-0">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as SettingsTab)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-button transition-all text-sm lg:text-base ${
                    isActive 
                      ? 'bg-primary text-on-primary shadow-md' 
                      : 'text-secondary hover:bg-surface-container hover:text-on-surface'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-2xl p-6 lg:p-8 shadow-sm">
            
            {/* Profile Section */}
            {activeTab === 'profile' && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="font-h2 text-on-surface mb-1">Profile Info</h3>
                  <p className="font-body-sm text-secondary">Manage your personal identification details.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue="Jane Doe"
                      className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue="jane.doe@example.com"
                      className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-container-highest">
                  <h3 className="font-h2 text-on-surface mb-1">Current Plan</h3>
                  <p className="font-body-sm text-secondary mb-6">You are currently on the Pro plan with additional features.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Award className="w-20 h-20 text-primary" />
                      </div>
                      <div className="relative z-10">
                        <div className="inline-flex px-2 py-0.5 rounded-full bg-primary text-on-primary text-[10px] font-bold uppercase tracking-wider mb-3">
                          Pro Plan
                        </div>
                        <h4 className="text-2xl font-h2 text-on-surface font-bold mb-1">$15 / month</h4>
                        <p className="text-xs text-secondary mb-6">Next billing date: May 12, 2026</p>
                        <button className="px-4 py-2 bg-surface-container-low border border-surface-container-highest rounded-lg font-button text-sm text-on-surface hover:bg-surface-container-high transition-colors">
                          Manage Billing
                        </button>
                      </div>
                    </div>

                    <div className="p-6 bg-surface-container-low border border-surface-container-highest rounded-2xl flex flex-col justify-center">
                      <h4 className="font-button text-on-surface mb-2">Agency Suite</h4>
                      <p className="text-[11px] text-secondary leading-relaxed mb-6 italic">
                        Need more? Agency plans offer multi-user access and advanced reports.
                      </p>
                      <button className="flex items-center justify-center gap-2 px-4 py-2 bg-surface-container-highest text-on-surface rounded-lg font-button text-xs hover:opacity-80 transition-opacity">
                        Upgrade
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-surface-container-highest flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-h2 text-on-surface mb-1">Session</h3>
                    <p className="font-body-sm text-secondary">Manage your current login session.</p>
                  </div>
                  <button 
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center justify-center gap-3 px-6 py-3 bg-error/10 text-error border border-error/20 rounded-xl font-button hover:bg-error/20 transition-all shadow-sm"
                  >
                    <LogOutIcon className="w-5 h-5" />
                    Log Out of Account
                  </button>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeTab === 'security' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="font-h2 text-on-surface mb-1">Security & Access</h3>
                  <p className="font-body-sm text-secondary">Keep your account guarded with a strong password.</p>
                </div>

                <div className="max-w-2xl bg-surface-container-low border border-surface-container-highest rounded-2xl p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="flex flex-col gap-2 md:col-span-2">
                      <label className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">Current Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">New Password</label>
                      <input 
                        type="password" 
                        placeholder="Min. 12 characters"
                        className="bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="font-label-caps text-on-surface-variant uppercase tracking-wider text-[11px]">Confirm Password</label>
                      <input 
                        type="password" 
                        placeholder="••••••••"
                        className="bg-surface-container-lowest border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      />
                    </div>
                  </div>
                  <div className="mt-8 flex justify-end">
                    <button className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-button hover:opacity-90 transition-all shadow-md">
                      Update Password
                    </button>
                  </div>
                </div>

                <div className="pt-8 border-t border-surface-container-highest">
                  <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h4 className="font-button text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                        <ShieldAlert className="w-5 h-5" />
                        Danger Zone
                      </h4>
                      <p className="font-body-sm text-secondary">Permanently delete your account and all associated data. This action is irreversible.</p>
                    </div>
                    <button className="px-6 py-3 bg-red-600 text-white rounded-xl font-button hover:bg-red-700 transition-colors flex items-center gap-3 shadow-sm text-sm shrink-0">
                      <Trash2 className="w-5 h-5" />
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Business Details Section */}
            {activeTab === 'business' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="font-h2 text-on-surface mb-1">Business Details</h3>
                  <p className="font-body-sm text-secondary">This information will appear on public-facing pages and receipts.</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Company Logo</label>
                  <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-2xl bg-surface-container-high border border-surface-container-highest flex items-center justify-center shrink-0 overflow-hidden group cursor-pointer relative">
                      <CloudUpload className="w-8 h-8 text-secondary group-hover:scale-110 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">Change</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-body-base text-on-surface font-medium mb-1">Select a business logo</p>
                      <p className="font-body-sm text-secondary mb-3">Recommended size 400x400px. PNG, JPG or SVG.</p>
                      <button className="text-sm font-button text-primary hover:underline">Remove logo</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Business/Legal Name</label>
                    <input 
                      type="text" 
                      defaultValue="ScopeGuard Operations LLC"
                      className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Business Address</label>
                    <textarea 
                      rows={3}
                      placeholder="123 Business Way, Suite 100, City, Country"
                      className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    />
                    <p className="text-[11px] text-secondary">Accounting departments usually require a physical address on receipts.</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Public Contact Email</label>
                    <input 
                      type="email" 
                      placeholder="billing@yourcompany.com"
                      className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payments Section */}
            {activeTab === 'payments' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="font-h2 text-on-surface mb-1">Payments & Payouts</h3>
                  <p className="font-body-sm text-secondary">Connect your Stripe account to securely accept credit cards and bank transfers from your clients.</p>
                </div>

                <div className="bg-surface-container border border-surface-container-highest rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stripeConnected ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-primary/5 text-primary'}`}>
                        <Landmark className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-button text-on-surface">Stripe Connection</h4>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${stripeConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                          <span className="text-xs font-semibold text-secondary uppercase tracking-tight">{stripeConnected ? 'Connected' : 'Not Connected'}</span>
                        </div>
                      </div>
                    </div>
                    {stripeConnected ? (
                      <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-surface-container-highest rounded-lg font-button text-on-surface hover:bg-surface-container-highest transition-colors">
                        Manage on Stripe
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    ) : (
                      <button 
                        onClick={() => setStripeConnected(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#635BFF] text-white rounded-lg font-button hover:opacity-90 transition-opacity shadow-sm"
                      >
                        Connect Stripe
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-surface-container-low/50 rounded-xl flex gap-3 items-start border border-dashed border-surface-container-highest">
                    <AlertCircle className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                    <p className="text-[12px] text-secondary leading-relaxed">
                      ScopeGuard uses Stripe to facilitate secure payments. By connecting your account, you agree to Stripe's Services Agreement and the ScopeGuard Terms of Service.
                    </p>
                  </div>
                </div>

                <div className="max-w-xs space-y-6">
                  <SearchableDropdown 
                    label="Default Payout Currency"
                    value="USD"
                    onChange={() => {}}
                    hideSearch={true}
                    options={[
                      { label: 'USD - US Dollar', value: 'USD' },
                      { label: 'EUR - Euro', value: 'EUR' },
                      { label: 'GBP - British Pound', value: 'GBP' },
                      { label: 'CAD - Canadian Dollar', value: 'CAD' },
                      { label: 'AUD - Australian Dollar', value: 'AUD' },
                    ]}
                  />
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeTab === 'preferences' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div>
                  <h3 className="font-h2 text-on-surface mb-1">Preferences & Notifications</h3>
                  <p className="font-body-sm text-secondary">Configure how you interact with the app and staying updated on client activity.</p>
                </div>

                <div className="space-y-4">
                  <h4 className="font-label-caps text-on-surface-variant uppercase tracking-wider">Communication</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-surface-container-low border border-surface-container-highest rounded-xl group transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                          <Mail className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-button text-on-surface">Email Notifications</p>
                          <p className="text-xs text-secondary italic">Send me an email when a client approves or pays a scope.</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.email} 
                          onChange={(e) => setNotifications(prev => ({ ...prev, email: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-surface-container-low border border-surface-container-highest rounded-xl group transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                          <Bell className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-button text-on-surface">App Alerts</p>
                          <p className="text-xs text-secondary italic">Show me smart nudges when deadlines are approaching.</p>
                        </div>
                      </div>
                      <div className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.alerts} 
                          onChange={(e) => setNotifications(prev => ({ ...prev, alerts: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-surface-container-high peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary transition-colors"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-surface-container-highest space-y-6">
                  <div className="flex flex-col gap-2 max-w-sm">
                    <label className="font-label-caps text-on-surface-variant uppercase tracking-wider">Default Expiration</label>
                    <div className="flex items-center gap-3 mt-1">
                      <input 
                        type="number" 
                        defaultValue={7}
                        className="bg-surface-container border border-surface-container-highest rounded-lg px-4 py-2.5 font-body-base text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                      <span className="text-sm text-secondary font-medium">days for new scopes</span>
                    </div>
                    <p className="text-[11px] text-secondary italic mt-1 font-medium">This automatically sets a 'Valid Until' date for every new scope you create.</p>
                  </div>

                  <div className="flex flex-col gap-2 max-w-sm">
                    <SearchableDropdown 
                      label="Visual Currency (UI Only)"
                      value="USD"
                      onChange={() => {}}
                      hideSearch={true}
                      placeholder="Select UI currency"
                      options={[
                        { label: 'USD ($)', value: 'USD' },
                        { label: 'EUR (€)', value: 'EUR' },
                        { label: 'GBP (£)', value: 'GBP' },
                        { label: 'CAD (C$)', value: 'CAD' },
                        { label: 'AUD (A$)', value: 'AUD' },
                      ]}
                    />
                    <p className="text-[11px] text-secondary italic mt-1 font-medium flex items-center gap-1.5">
                      <Globe className="w-3 h-3" />
                      Changes symbols across the dashboard for visual consistency.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-surface-container-highest flex justify-end gap-3">
              <button className="px-6 py-2.5 bg-primary text-on-primary rounded-xl font-button hover:opacity-90 transition-all shadow-md">
                Save Changes
              </button>
            </div>
          </div>
        </main>
      </div>
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out of your account? You will need to sign in again to access ScopeGuard."
        confirmText="Log Out"
        cancelText="Cancel"
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
