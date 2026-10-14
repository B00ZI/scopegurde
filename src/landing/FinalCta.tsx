import { ArrowRight } from 'lucide-react';
import { Reveal } from './ui';

export function FinalCta({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-5 pb-20 md:pb-28">
        <Reveal>
          <div className="relative overflow-hidden bg-primary rounded-3xl px-7 sm:px-16 py-14 sm:py-20 text-center">
            <div className="lp-dots absolute inset-0 opacity-25" aria-hidden="true" />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-on-primary leading-[1.08] max-w-3xl mx-auto">
                Start your next project with a clearer scope.
              </h2>
              <p className="mt-5 text-lg sm:text-xl text-on-primary/85 leading-relaxed max-w-xl mx-auto">
                Add your project, paste the contract, and see what ScopeGuard finds.
              </p>
              <button
                onClick={onGetStarted}
                className="mt-9 inline-flex items-center justify-center gap-2.5 bg-on-primary text-primary font-semibold leading-none text-base px-7 py-4 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
              >
                Get started <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
