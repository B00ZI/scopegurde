import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  onNewChangeOrder: () => void;
  isSidebarCollapsed: boolean;
  title?: string;
  onBack?: () => void;
}

export function TopBar({ onNewChangeOrder, isSidebarCollapsed, title, onBack }: TopBarProps) {
  return (
    <header 
      className={`bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container-highest flex justify-between items-center h-16 px-8 fixed top-0 right-0 z-10 shadow-sm transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 rounded-full hover:bg-surface-container text-secondary hover:text-on-surface transition-all active:scale-90"
            title="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        {title && (
          <h2 className="font-sans text-lg font-bold text-on-surface tracking-tight">{title}</h2>
        )}
      </div>
      
      {!onBack && (
        <button 
          onClick={onNewChangeOrder}
          className="bg-primary text-on-primary font-button px-5 py-2 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          New Change Order
        </button>
      )}
    </header>
  );
}
