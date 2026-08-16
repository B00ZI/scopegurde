import { useState } from 'react';
import { LayoutDashboard, Users, Bell, Settings, LogOut, ChevronLeft, ChevronRight, Archive } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { ConfirmDialog } from './ConfirmDialog';

interface SidebarProps {
  // Drives global app routing
  currentPage: string;
  onPageChange: (page: string) => void;
  // Mobile drawer state
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
  // Drives layout width updates across the app (Sidebar + TopBar width calculations)
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  // Auth control
  onLogout?: () => void;
}

/**
 * COMPONENT: Global Sidebar Navigation
 * 
 * Purpose: Provides primary navigation links. It holds local configuration for 
 * the nav items array mapping to the root router switch statement in App.tsx.
 */
export function Sidebar({ 
  currentPage, 
  onPageChange, 
  isCollapsed, 
  isMobileOpen,
  onCloseMobile,
  onToggleCollapse, 
  onLogout 
}: SidebarProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  // Primary navigation map. IDs directly match the case statements in `App.tsx -> renderContent`
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'history', label: 'Project History', icon: Archive },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const isEffectiveCollapsed = isCollapsed && !isMobileOpen;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onCloseMobile}
        />
      )}

      <nav className={`bg-surface-container-lowest border-r border-surface-container-highest h-screen flex flex-col fixed left-0 top-0 py-6 transition-all duration-300 ease-in-out z-50 
        ${isMobileOpen ? 'translate-x-0 w-64 px-4' : '-translate-x-full lg:translate-x-0'} 
        ${isCollapsed ? 'lg:w-20 lg:px-3' : 'lg:w-64 lg:px-4'}`}
      >
        
        {/* SECTION 1: Brand & Collapse Controls */}
        <div className={`mb-8 flex items-center justify-between ${isCollapsed ? 'lg:px-2' : 'px-3'}`}>
          {(!isCollapsed || isMobileOpen) && (
            <div className="overflow-hidden">
              <h1 className="text-lg font-black tracking-tight text-on-surface whitespace-nowrap">ScopeGuard</h1>
              <p className="font-sans text-sm font-medium text-secondary whitespace-nowrap">Logistics & Surcharge</p>
            </div>
          )}
          <button 
            onClick={onToggleCollapse}
            className={`hidden lg:block p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

      {/* SECTION 2: Navigation Links */}
      <ul className="flex flex-col gap-1.5 flex-1">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center rounded-lg font-sans text-sm font-medium transition-all duration-200 ease-in-out group ${
                isEffectiveCollapsed ? 'lg:justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } ${
                currentPage === item.id
                  ? 'text-primary bg-primary/10 font-semibold shadow-sm'
                  : 'text-secondary hover:bg-surface-container/50 hover:text-on-surface'
              }`}
              title={isEffectiveCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${currentPage === item.id ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`} />
              {(!isEffectiveCollapsed || isMobileOpen) && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      {/* Theme and Logout buttons at the bottom */}
      <div className="pt-4 border-t border-surface-container-highest mt-4 space-y-1">
        <ThemeToggle 
          variant="full" 
          label={(!isEffectiveCollapsed || isMobileOpen) ? "Appearance" : undefined}
          className={isEffectiveCollapsed ? 'lg:justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'}
        />

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`w-full flex items-center rounded-lg font-sans text-sm font-medium transition-all duration-200 ease-in-out group hover:bg-error/5 text-secondary hover:text-error ${
            isEffectiveCollapsed ? 'lg:justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
          }`}
          title={isEffectiveCollapsed ? "Log Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 text-outline group-hover:text-error" />
          {(!isEffectiveCollapsed || isMobileOpen) && <span className="whitespace-nowrap">Log Out</span>}
        </button>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Confirm Log Out"
        message="Are you sure you want to log out? You will need to sign in again to access ScopeGuard."
        confirmText="Log Out"
        cancelText="Cancel"
        isDestructive={true}
        onConfirm={() => {
          setShowLogoutConfirm(false);
          onLogout?.();
        }}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </nav>
    </>
  );
}
