import React, { useState } from 'react';
import { Mail, Lock, Building2, ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

interface LoginProps {
  onLoginSuccess: () => void;
  onNavigateToSignUp: () => void;
}

/**
 * LOGIN PAGE
 * 
 * Purpose: First point of entry for the admin workspace.
 * Features:
 * - Brand Storyboard (Left Pane): Highlights the mission.
 * - Authentication (Right Pane): Supports Email/Pass and OAuth (simulated).
 */
export function LoginPage({ onLoginSuccess, onNavigateToSignUp }: LoginProps) {
  // --- STATE MANAGEMENT ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- HANDLERS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate auth success
    onLoginSuccess();
  };

  /**
   * REUSABLE COMPONENT: Google Logo
   * Extracted to keep the main JSX flow clean.
   */
  const GoogleIcon = () => (
    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex selection:bg-primary/20 bg-surface-container-lowest">
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      {/* LEFT: Abstract Image & Branding */}
      <div className="hidden md:flex md:w-[40%] relative overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80" 
          alt="Abstract gradient" 
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col justify-between p-16 h-full text-white">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-white" />
            <span className="font-label-caps tracking-widest text-sm uppercase text-white">ScopeGuard</span>
          </div>
          
          <div className="mb-12">
            <h1 className="text-4xl lg:text-5xl font-h1 font-bold leading-[1.1] max-w-lg mb-6 text-white">
              Welcome back to your workspace.
            </h1>
            <p className="text-lg lg:text-xl font-body-base max-w-md leading-relaxed text-gray-200">
              Pick up right where you left off and keep your projects moving forward securely.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT: Login Form Area */}
      <div className="w-full md:w-[60%] flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left mb-8">
            <div className="flex justify-center mb-6 md:hidden">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
            </div>
            <h2 className="text-3xl font-h2 font-bold text-on-surface tracking-tight mb-2">
              Welcome back
            </h2>
            <p className="text-secondary font-body-base">
              Sign in to manage your workspace and active projects.
            </p>
          </div>

          <div className="space-y-6">
            <button 
              type="button"
              className="w-full flex justify-center items-center gap-3 py-3 px-4 rounded-xl border border-surface-container-highest bg-surface-container-lowest text-on-surface hover:bg-surface-container transition-colors shadow-sm font-button"
              onClick={onLoginSuccess}
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-surface-container-highest" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface-container-lowest text-secondary text-sm">
                  or
                </span>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-2.5 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                    placeholder="you@company.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-on-surface">
                    Password
                  </label>
                  <a href="#" className="font-medium text-sm text-primary hover:text-primary-container transition-colors">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-11 pr-4 py-2.5 bg-surface border border-surface-container-highest rounded-xl font-body-base text-on-surface placeholder:text-outline-variant focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 rounded-xl shadow-md cursor-pointer font-button bg-[#065F46] text-white hover:bg-[#047857] transition-all active:scale-[0.98] mt-4"
              >
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>

            <p className="text-center text-secondary font-body-base mt-8">
              Don't have an account?{' '}
              <button
                onClick={onNavigateToSignUp}
                className="font-semibold text-primary hover:text-primary-container transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
