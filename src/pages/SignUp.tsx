import React, { useState } from 'react';
import { Mail, Lock, Building2, User, ArrowRight, UploadCloud, Check, Briefcase } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

interface SignUpProps {
  onSignUpSuccess: () => void;
  onNavigateToLogin: () => void;
}

/**
 * SIGN UP PAGE (MULTI-STEP WIZARD)
 * 
 * Purpose: Onboarding funnel for new users.
 * Steps:
 * 1. ACCOUNT: Basic credentials (Name, Email, Pass).
 * 2. WORKSPACE: Business branding and settings.
 * 3. PLAN: Monetization selection (Free vs Paid tier).
 */
export function SignUpPage({ onSignUpSuccess, onNavigateToLogin }: SignUpProps) {
  // --- STATE MANAGEMENT ---
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [plan, setPlan] = useState<'starter' | 'pro' | 'agency'>('pro');

  // --- HANDLERS ---
  const goToNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 3) setStep(step + 1);
  };

  const handleFinish = () => {
    // Simulate final account creation
    onSignUpSuccess();
  };

  /**
   * UI HELPER: Step Progress Bar
   */
  const ProgressIndicator = () => (
    <div className="mb-10 w-full max-w-md">
      <div className="flex justify-between text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3 relative">
        <span className={`transition-colors duration-500 z-10 bg-surface-container-lowest pr-2 ${step >= 1 ? 'text-[#065F46]' : 'text-secondary'}`}>Account</span>
        <span className={`transition-colors duration-500 z-10 bg-surface-container-lowest px-2 ${step >= 2 ? 'text-[#065F46]' : 'text-secondary'}`}>Workspace</span>
        <span className={`transition-colors duration-500 z-10 bg-surface-container-lowest pl-2 ${step >= 3 ? 'text-[#065F46]' : 'text-secondary'}`}>Plan</span>
      </div>
      <div className="w-full bg-surface-container-highest rounded-full h-2.5 overflow-hidden">
        <div 
          className="bg-[#065F46] h-full rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${(step / 3) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex selection:bg-primary/20 bg-surface-container-lowest">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT: Abstract Image & Branding - ONLY FOR STEP 1 */}
      {step === 1 && (
        <div className="hidden md:flex md:w-[40%] relative overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80" 
            alt="Team collaborating" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
          
          <div className="relative z-10 flex flex-col justify-between p-12 lg:p-16 h-full text-white">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-white" />
              <span className="font-label-caps tracking-widest text-sm uppercase text-white">ScopeGuard</span>
            </div>
            
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-h1 font-bold leading-[1.1] max-w-lg mb-6 text-white">
                Join hundreds of freelancers stopping scope creep today!
              </h1>
              <p className="text-lg lg:text-xl font-body-base max-w-md leading-relaxed text-gray-200">
                Setup takes less than 2 minutes and saves you hours of unbilled time.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* RIGHT: Form Area */}
      <div className={`w-full flex-col justify-center p-6 sm:p-12 overflow-y-auto min-h-screen flex ${step === 1 ? 'md:w-[60%]' : 'md:w-full items-center'}`}>
        <div className={`w-full mx-auto relative flex-1 flex flex-col justify-center ${step === 3 ? 'max-w-4xl' : 'max-w-md'}`}>
          
          <div className="flex justify-start mb-6 md:hidden">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
              <Building2 className="w-6 h-6 text-primary" />
            </div>
          </div>

          <ProgressIndicator />

          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-h2 font-bold text-on-surface tracking-tight mb-2">Create an account</h2>
                <p className="text-secondary font-body-base">Enter your details to get started.</p>
              </div>

              <form className="space-y-5" onSubmit={goToNextStep}>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-outline" />
                    </div>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full pl-11 pr-4 py-2.5 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" placeholder="Jane Doe" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-outline" />
                    </div>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-11 pr-4 py-2.5 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" placeholder="jane@company.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-outline" />
                    </div>
                    <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full pl-11 pr-4 py-2.5 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" placeholder="••••••••" />
                  </div>
                </div>

                <button type="submit" className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md cursor-pointer font-button bg-[#065F46] text-white hover:bg-[#047857] transition-all active:scale-[0.98] mt-6">
                  Continue Setup
                  <ArrowRight className="w-5 h-5" />
                </button>
              </form>

              <p className="text-left text-secondary font-body-base mt-8">
                Already have an account?{' '}
                <button onClick={onNavigateToLogin} className="font-semibold text-primary hover:text-primary-container transition-colors">
                  Log in
                </button>
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-h2 font-bold text-on-surface tracking-tight mb-2">Personalize workspace</h2>
                <p className="text-secondary font-body-base">Add your branding for professional client portals.</p>
              </div>

              <form className="space-y-6" onSubmit={goToNextStep}>
                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Business / Legal Entity Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Briefcase className="h-5 w-5 text-outline" />
                    </div>
                    <input type="text" required value={company} onChange={(e) => setCompany(e.target.value)} className="block w-full pl-11 pr-4 py-3 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm" placeholder="Acme Consulting LLC" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Business Address</label>
                  <textarea rows={2} required value={address} onChange={(e) => setAddress(e.target.value)} className="block w-full px-4 py-3 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm resize-none" placeholder="123 Business Way, Suite 100..." />
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Payout Currency</label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="block w-full px-4 py-3 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm appearance-none"
                  >
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface mb-1.5">Upload your Logo</label>
                  <label className="flex flex-col items-center justify-center w-full h-36 px-4 py-6 bg-surface text-secondary border-2 border-dashed border-surface-container-highest rounded-xl cursor-pointer hover:border-primary/50 hover:bg-surface-container-low transition-colors">
                    <UploadCloud className="w-8 h-8 mb-3 text-primary" />
                    <span className="font-medium text-on-surface">Click to upload</span>
                    <span className="text-xs mt-1">SVG, PNG, JPG (max. 2MB)</span>
                    <input type="file" className="hidden" />
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={() => setStep(1)} className="flex-1 py-3.5 px-4 rounded-xl border border-surface-container-highest text-on-surface bg-surface font-button hover:bg-surface-container transition-colors">Back</button>
                  <button type="submit" className="flex-[2] flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md cursor-pointer font-button bg-[#065F46] text-white hover:bg-[#047857] transition-all active:scale-[0.98]">
                    Continue 
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-h2 font-bold text-on-surface tracking-tight mb-2">Choose your plan</h2>
                <p className="text-secondary font-body-base">Select the best option for your operational needs.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                 {/* STARTER PLAN */}
                 <div 
                   className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col ${plan === 'starter' ? 'border-[#065F46] bg-[#065F46]/5' : 'border-surface-container-highest bg-surface hover:border-outline'}`} 
                   onClick={() => setPlan('starter')}
                 >
                    <h3 className="font-bold text-xl text-on-surface mb-2">Starter</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-on-surface">Free</span>
                    </div>
                    <p className="text-sm text-secondary mb-6">Perfect for solo freelancers just starting out.</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {['1 Active Project', 'Basic Templates', 'Standard Support'].map((feat, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                           <Check className="w-4 h-4 text-[#065F46]" /> {feat}
                        </li>
                      ))}
                    </ul>

                    <div className={`w-full py-3 px-4 rounded-xl text-center font-button text-sm transition-colors ${plan === 'starter' ? 'bg-[#065F46] text-white' : 'bg-surface-container border border-surface-container-highest text-on-surface hover:bg-surface-container-highest'}`}>
                       {plan === 'starter' ? 'Selected' : 'Select Starter'}
                    </div>
                 </div>

                 {/* PRO PLAN */}
                 <div 
                   className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col ${plan === 'pro' ? 'border-[#065F46] bg-[#065F46]/5' : 'border-surface-container-highest bg-surface hover:border-outline'}`} 
                   onClick={() => setPlan('pro')}
                 >
                    {plan === 'pro' && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#065F46] text-white px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">Most Popular</div>}
                    
                    <h3 className="font-bold text-xl text-on-surface mb-2">Pro</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-on-surface">$15</span><span className="text-secondary">/mo</span>
                    </div>
                    <p className="text-sm text-secondary mb-6">Everything you need to stop scope creep.</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {['Unlimited Projects', 'Custom Branding', 'Client Approval Portals', 'Priority Support'].map((feat, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                            <Check className="w-4 h-4 text-[#065F46]" /> {feat}
                         </li>
                      ))}
                    </ul>

                    <div className={`w-full py-3 px-4 rounded-xl text-center font-button text-sm transition-colors ${plan === 'pro' ? 'bg-[#065F46] text-white shadow-md' : 'bg-surface-container border border-surface-container-highest text-on-surface hover:bg-surface-container-highest'}`}>
                       {plan === 'pro' ? 'Selected' : 'Select Pro'}
                    </div>
                 </div>

                 {/* AGENCY PLAN */}
                 <div 
                   className={`relative p-8 rounded-2xl border-2 transition-all cursor-pointer flex flex-col ${plan === 'agency' ? 'border-[#065F46] bg-[#065F46]/5' : 'border-surface-container-highest bg-surface hover:border-outline'}`} 
                   onClick={() => setPlan('agency')}
                 >
                    <h3 className="font-bold text-xl text-on-surface mb-2">Agency</h3>
                    <div className="mb-4">
                      <span className="text-4xl font-bold text-on-surface">$49</span><span className="text-secondary">/mo</span>
                    </div>
                    <p className="text-sm text-secondary mb-6">For teams managing multiple clients.</p>
                    
                    <ul className="space-y-3 mb-8 flex-1">
                      {['Unlimited Workspaces', 'Team Members', 'API Access', 'White-glove Onboarding'].map((feat, i) => (
                         <li key={i} className="flex items-center gap-3 text-sm text-on-surface">
                            <Check className="w-4 h-4 text-[#065F46]" /> {feat}
                         </li>
                      ))}
                    </ul>

                    <div className={`w-full py-3 px-4 rounded-xl text-center font-button text-sm transition-colors ${plan === 'agency' ? 'bg-[#065F46] text-white' : 'bg-surface-container border border-surface-container-highest text-on-surface hover:bg-surface-container-highest'}`}>
                       {plan === 'agency' ? 'Selected' : 'Select Agency'}
                    </div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-sm mx-auto">
                 <button type="button" onClick={() => setStep(2)} className="flex-1 py-3.5 px-4 rounded-xl border border-surface-container-highest text-on-surface font-button bg-surface hover:bg-surface-container transition-colors">Go Back</button>
                 <button onClick={handleFinish} className="flex-[2] py-3.5 px-4 rounded-xl shadow-md cursor-pointer font-button bg-[#065F46] text-white hover:bg-[#047857] transition-all active:scale-[0.98]">
                    Complete Sign Up
                 </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
