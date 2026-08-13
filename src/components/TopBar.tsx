import { ArrowLeft, Menu } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

interface TopBarProps {
  onNewProject: () => void;
  isSidebarCollapsed: boolean;
  onToggleMobileMenu?: () => void;
  title?: string;
  onBack?: () => void;
}

/**
 * COMPONENT: Top Navigation Bar
 * 
 * Responsibilities:
 * 1. Global Action: Triggers the "New Project" workflow.
 * 2. Context Aware: Displays a back button and title when inside a workflow (like Preview).
 * 3. Theme Manager: Controls application-wide Light/Dark mode state and persists it.
 */
export function TopBar({ onNewProject, isSidebarCollapsed, onToggleMobileMenu, title, onBack }: TopBarProps) {
  return (
    <header 
      // Layout shifts dynamically based on Sidebar width for a smooth animation
      className={`bg-surface-container-lowest/80 backdrop-blur-md border-b border-surface-container-highest flex justify-between items-center h-16 sm:h-20 px-4 sm:px-8 fixed top-0 right-0 z-40 shadow-sm transition-all duration-300 ease-in-out ${
        isSidebarCollapsed ? 'lg:left-20' : 'lg:left-64'
      } left-0`}
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-1">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg hover:bg-surface-container text-secondary transition-all"
        >
          <Menu className="w-6 h-6" />
        </button>

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
          <h2 className="font-h3 text-on-surface text-sm sm:text-lg lg:text-xl truncate max-w-[120px] xs:max-w-[180px] sm:max-w-none">{title}</h2>
        )}
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Only show the New Project button if we aren't already deep inside a workflow */}
        {!onBack && (
          <button 
            onClick={onNewProject}
            className="bg-primary text-on-primary font-button px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg hover:opacity-90 transition-all flex items-center gap-2 shadow-sm active:scale-95 text-xs sm:text-sm"
          >
            <span className="sm:inline hidden">+ New Project</span>
            <span className="sm:hidden">+ New</span>
          </button>
        )}
      </div>
    </header>
  );
}

