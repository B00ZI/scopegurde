import { LayoutDashboard, Users, Bell, Settings, LogOut, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ currentPage, onPageChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`bg-surface-container-lowest border-r border-surface-container-highest h-screen flex flex-col fixed left-0 top-0 py-6 transition-all duration-300 ease-in-out z-20 ${isCollapsed ? 'w-20 px-3' : 'w-64 px-4'}`}>
      <div className={`mb-8 flex items-center justify-between ${isCollapsed ? 'px-2' : 'px-3'}`}>
        {!isCollapsed && (
          <div className="overflow-hidden">
            <h1 className="text-lg font-black tracking-tight text-on-surface whitespace-nowrap">ScopeGuard</h1>
            <p className="font-sans text-sm font-medium text-secondary whitespace-nowrap">Logistics & Surcharge</p>
          </div>
        )}
        <button 
          onClick={onToggleCollapse}
          className={`p-1.5 rounded-lg hover:bg-surface-container text-outline hover:text-on-surface transition-all ${isCollapsed ? 'mx-auto' : ''}`}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <ul className="flex flex-col gap-1.5">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => onPageChange(item.id)}
              className={`w-full flex items-center rounded-lg font-sans text-sm font-medium transition-all duration-200 ease-in-out group ${
                isCollapsed ? 'justify-center px-0 py-3' : 'gap-3 px-3 py-2.5'
              } ${
                currentPage === item.id
                  ? 'text-primary bg-primary/10 font-semibold shadow-sm'
                  : 'text-secondary hover:bg-surface-container/50 hover:text-on-surface'
              }`}
              title={isCollapsed ? item.label : undefined}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${currentPage === item.id ? 'text-primary' : 'text-outline group-hover:text-on-surface-variant'}`} />
              {!isCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-6 border-t border-surface-container-highest">
        <div className={`flex items-center justify-between gap-2 mb-4 ${isCollapsed ? 'flex-col px-0' : 'px-3'}`}>
          <div className={`flex items-center gap-3 overflow-hidden flex-nowrap ${isCollapsed ? 'flex-col' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-primary-container overflow-hidden border border-surface-container-highest flex-shrink-0">
              <img 
                src="https://picsum.photos/seed/sarah/100/100" 
                alt="Sarah Jenkins" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="font-sans text-[13px] font-semibold text-on-surface truncate whitespace-nowrap leading-none mb-1">Sarah Jenkins</p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-secondary font-bold whitespace-nowrap">Enterprise Plan</p>
                </div>
              </div>
            )}
          </div>
          <button className={`p-1.5 rounded-lg hover:bg-error/5 text-outline hover:text-error transition-all flex-shrink-0 ${isCollapsed ? 'mt-2' : ''}`} title="Log Out">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
        
        <button 
          className={`w-full flex items-center transition-all group ${isCollapsed ? 'justify-center py-3' : 'gap-3 px-3 py-2 rounded-lg hover:bg-surface-container/50'}`}
          title={isCollapsed ? "Manage Subscription" : undefined}
        >
          <CreditCard className={`w-4 h-4 text-outline group-hover:text-primary transition-colors flex-shrink-0`} />
          {!isCollapsed && <span className="font-sans text-xs font-medium whitespace-nowrap">Manage Subscription</span>}
        </button>
      </div>
    </nav>
  );
}
