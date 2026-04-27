import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onNewScope: () => void;
  isSidebarCollapsed: boolean;
  title?: string;
  onBack?: () => void;
}

/**
 * COMPONENT: Top Navigation Bar
 * 
 * Responsibilities:
 * 1. Global Action: Triggers the "New Scope" workflow.
 * 2. Context Aware: Displays a back button and title when inside a workflow (like Preview).
 * 3. Theme Manager: Controls application-wide Light/Dark mode state and persists it.
 */
export function TopBar({ onNewScope, isSidebarCollapsed, title, onBack }: TopBarProps) {
  return (
    <header 
      // Layout shifts dynamically based on Sidebar width for a smooth animation
      className={`bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container-highest flex justify-between items-center h-16 px-8 fixed top-0 right-0 z-40 shadow-sm transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'left-20' : 'left-64'
      }`}
    >
      <div className="flex items-center gap-4 flex-1">
        {/* Render a context-aware back button if in a specific workflow step */}
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
          <h2 className="font-h3 text-on-surface">{title}</h2>
        )}
      </div>
      
      <div className="flex items-center gap-4">
        {/* Only show the New Scope button if we aren't already deep inside a workflow */}
        {!onBack && (
          <button 
            onClick={onNewScope}
            className="bg-primary text-on-primary font-button px-5 py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-95"
          >
            + New Scope
          </button>
        )}
      </div>
    </header>
  );
}

