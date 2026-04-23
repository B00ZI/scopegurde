import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  // React component injection for page-specific buttons (e.g., "Add Client" on the Clients page)
  actions?: ReactNode;
  border?: boolean;
}

/**
 * COMPONENT: Reusable Page Header
 * 
 * Purpose: Ensures consistent typography, spacing, and layout at the top 
 * of major application views (Dashboard, Clients, etc). 
 * Prevents repeating the `h1` and `p` layout code in every page file.
 */
export function PageHeader({ title, subtitle, actions, border = false }: PageHeaderProps) {
  return (
    <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 ${border ? 'border-b border-surface-container-highest pb-6' : ''}`}>
      <div>
        <h1 className="font-h1 text-on-surface tracking-tight">{title}</h1>
        {subtitle && <p className="font-body-base text-secondary mt-1">{subtitle}</p>}
      </div>
      {/* Action injection slot */}
      {actions && (
        <div className="flex gap-3 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </header>
  );
}
