import { ArrowRight } from 'lucide-react';
import { Reveal } from './ui';

export function FinalCta({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 pb-16 md:pb-24">
        <Reveal>
          <div className="bg-primary rounded-3xl px-6 sm:px-14 py-12 sm:py-16 text-center">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-on-primary leading-[1.15] max-w-2xl mx-auto">
              Start your next project with a clearer scope.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-on-primary/85 leading-relaxed max-w-xl mx-auto">
              Add your project, paste the agreement, and review what ScopeGuard finds.
            </p>
            <button
              onClick={onGetStarted}
              className="mt-8 inline-flex items-center justify-center gap-2 bg-on-primary text-primary font-button px-6 py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
            >
              Get started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
