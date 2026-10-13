import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ChangeScopeDecision } from '../types';

/** Button recipes mirrored from the app's existing button styles (read, not modified). */
export const lpBtnPrimary =
  'inline-flex items-center justify-center gap-2 bg-primary text-on-primary font-button px-5 py-3 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm';

export const lpBtnGhost =
  'inline-flex items-center justify-center gap-2 bg-surface-container-lowest border border-surface-container-highest text-on-surface hover:bg-surface-container font-button px-5 py-3 rounded-lg transition-colors shadow-sm';

export const lpBtnSmPrimary =
  'inline-flex items-center justify-center gap-1.5 bg-primary text-on-primary font-button px-4 py-2 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all shadow-sm text-sm';

export const lpBtnSmGhost =
  'inline-flex items-center justify-center gap-1.5 bg-surface-container-lowest border border-surface-container-highest text-on-surface hover:bg-surface-container font-button px-4 py-2 rounded-lg transition-colors shadow-sm text-sm';

/** Scope status pills — exact classes used by the app (ProjectView / ClientRoom). */
export const SCOPE_PILL: Record<ChangeScopeDecision, string> = {
  'In Scope': 'bg-primary/10 text-primary border border-primary/20',
  'Needs Review': 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20',
  'Out of Scope': 'bg-secondary/10 text-secondary border border-secondary/20',
};

export function ScopePill({ decision, children }: { decision: ChangeScopeDecision; children?: ReactNode }) {
  return (
    <span
      data-static
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${SCOPE_PILL[decision]}`}
    >
      {children ?? decision}
    </span>
  );
}

export function SoftPill({
  children,
  className = 'bg-surface-container text-secondary border border-surface-container-highest',
  title,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
}) {
  return (
    <span
      data-static
      title={title}
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}

/** ScopeGuard brand mark — same tonal icon-tile pattern used in the app's Client Room. */
export function BrandMark({ size = 'md' }: { size?: 'sm' | 'md' }) {
  const tile = size === 'md' ? 'w-10 h-10 rounded-xl' : 'w-8 h-8 rounded-lg';
  const icon = size === 'md' ? 'w-5 h-5' : 'w-4 h-4';
  return (
    <span className="inline-flex items-center gap-2.5">
      <span className={`${tile} bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0`}>
        <ShieldCheck className={`${icon} text-primary`} />
      </span>
      <span className="text-lg font-black tracking-tight text-on-surface whitespace-nowrap">ScopeGuard</span>
    </span>
  );
}

/** Subtle scroll reveal. Static when the user prefers reduced motion. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
