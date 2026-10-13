import './landing.css';
import { LandingNav } from './LandingNav';
import { Hero } from './Hero';
import { Problem } from './Problem';
import { HowItWorks } from './HowItWorks';
import { WorkspaceShowcase } from './WorkspaceShowcase';
import { RequestReview } from './RequestReview';
import { Benefits } from './Benefits';
import { Trust } from './Trust';
import { Faq } from './Faq';
import { FinalCta } from './FinalCta';
import { LandingFooter } from './LandingFooter';

interface LandingPageProps {
  /** Opens the real sign-up screen (App.tsx auth flow). */
  onGetStarted: () => void;
  /** Opens the real sign-in screen (App.tsx auth flow). */
  onSignIn: () => void;
}

/**
 * PUBLIC MARKETING LANDING PAGE
 *
 * Fully isolated from the application UI: it lives in src/landing/, styles
 * are scoped under `.lp-*` in landing.css, and it only *reads* the global
 * theme tokens defined in src/index.css. Rendering this component never
 * mounts the dashboard, sidebar, or any app screen — and vice versa.
 */
export function LandingPage({ onGetStarted, onSignIn }: LandingPageProps) {
  return (
    <div className="lp-root min-h-screen flex flex-col font-sans">
      <LandingNav onGetStarted={onGetStarted} onSignIn={onSignIn} />

      <main className="flex-1">
        <Hero onGetStarted={onGetStarted} />
        <Problem />
        <HowItWorks />
        <WorkspaceShowcase />
        <RequestReview />
        <Benefits />
        <Trust />
        <Faq />
        <FinalCta onGetStarted={onGetStarted} />
      </main>

      <LandingFooter />
    </div>
  );
}
