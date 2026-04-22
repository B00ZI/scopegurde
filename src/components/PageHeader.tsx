import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  border?: boolean;
}

export function PageHeader({ title, subtitle, actions, border = false }: PageHeaderProps) {
  return (
    <header className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4 ${border ? 'border-b border-surface-container-highest pb-6' : ''}`}>
      <div>
        <h1 className="font-h1 text-on-surface tracking-tight">{title}</h1>
        {subtitle && <p className="font-body-base text-secondary mt-1">{subtitle}</p>}
      </div>
      {actions && (
        <div className="flex gap-3 w-full sm:w-auto">
          {actions}
        </div>
      )}
    </header>
  );
}
