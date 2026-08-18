import { useEffect, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/Dashboard';
import { ClientsPage } from './pages/Clients';
import { NotificationsPage } from './pages/Notifications';
import { SettingsPage } from './pages/Settings';
import { ApprovalPage } from './pages/Approval';
import { AddClientPage } from './pages/AddClient';
import { ClientDetailsPage } from './pages/ClientDetails';
import { LoginPage } from './pages/Login';
import { SignUpPage } from './pages/SignUp';
import { ProjectHistoryPage } from './pages/ProjectHistory';
import { ProjectViewPage } from './pages/ProjectView';
import { EditClientPage } from './pages/EditClient';
import { NewProjectPage } from './pages/NewProject';
import { ClientRoomPage } from './pages/ClientRoom';
import { Client } from './types';
import { useProjects } from './lib/appStore';

/**
 * ENTRY POINT & MAIN LAYOUT CONTROLLER
 * 
 * Architecture Overview:
 * This component acts as the global state manager and router for the application.
 * It uses simple state-based conditional rendering instead of a complex library like React Router,
 * keeping the prototype lightweight and easy to follow.
 * 
 * Data Flow Direction:
 * UI Events -> App State (Routing/Wizards) -> Component Props -> Rendered View
 */
export default function App() {
  // --- AUTHENTICATION STATE ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'signup'>('login');

  // --- NAVIGATION & ROUTING STATE ---
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // --- DRILL-DOWN / SUB-ROUTING STATES ---
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [viewingProjectOrigin, setViewingProjectOrigin] = useState('dashboard');

  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [clientRoomProjectId, setClientRoomProjectId] = useState<string | null>(null);

  const openProject = (id: string) => {
    setViewingProjectOrigin(currentPage);
    setSelectedProjectId(id);
  };

  const projects = useProjects();

  const openClientRoom = (id: string) => {
    setClientRoomProjectId(id);
    window.location.hash = `/room/${id}`;
  };

  const closeClientRoom = () => {
    setClientRoomProjectId(null);
    window.location.hash = '';
  };

  // Hash routing for the public client room (#/room/:projectId)
  useEffect(() => {
    const parse = () => {
      const m = window.location.hash.match(/^#\/room\/(.+)$/);
      if (m) setClientRoomProjectId(decodeURIComponent(m[1]));
    };
    window.addEventListener('hashchange', parse);
    parse();
    return () => window.removeEventListener('hashchange', parse);
  }, []);

  /**
   * Router Logic:
   * Evaluates current state variables in a strict priority order to determine which screen to show.
   * Highest priority: Full-screen public portals -> Preview Modals -> Creation Wizards -> Standard Navigation.
   */
  const renderContent = () => {
    // 1. Full-screen public client room
    if (clientRoomProjectId) {
      return <ClientRoomPage projectId={clientRoomProjectId} onExit={closeClientRoom} />;
    }

    // 2. Standalone Demo Screens (No layout wrappers)
    if (currentPage === 'approval') return <ApprovalPage />;

    // 3. New Project wizard (in-layout)
    if (isNewProjectOpen) {
      return (
        <NewProjectPage
          onDone={(id) => {
            setIsNewProjectOpen(false);
            openProject(id);
          }}
          onCancel={() => setIsNewProjectOpen(false)}
        />
      );
    }

    // Sub-views for Clients area
    if (isAddingClient) {
      return (
        <AddClientPage 
          onCancel={() => setIsAddingClient(false)}
          onSave={() => setIsAddingClient(false)}
        />
      );
    }

    if (editingClient) {
      return (
        <EditClientPage 
          client={editingClient}
          onCancel={() => setEditingClient(null)}
          onSave={() => setEditingClient(null)}
          onDelete={() => setEditingClient(null)}
        />
      );
    }

    if (viewingClient) {
      return (
        <ClientDetailsPage 
          client={viewingClient}
          onBack={() => setViewingClient(null)}
          onEdit={() => setEditingClient(viewingClient)}
          onRemove={() => setViewingClient(null)}
        />
      );
    }

    if (selectedProjectId) {
      return (
        <ProjectViewPage
          projectId={selectedProjectId}
          onBack={() => {
            setSelectedProjectId(null);
            setCurrentPage(viewingProjectOrigin);
          }}
          onOpenRoom={openClientRoom}
        />
      );
    }

    // 5. Default Navigation: Standard Admin Dashboard Views
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNewProject={() => setIsNewProjectOpen(true)} onSelectProject={openProject} onViewHistory={() => setCurrentPage('history')} />;
      case 'clients': return <ClientsPage onAddClient={() => setIsAddingClient(true)} onViewClient={(c) => setViewingClient(c)} onEditClient={(c) => setEditingClient(c)} onDeleteClient={() => {}} />;
      case 'notifications': return <NotificationsPage onSelectProject={openProject} />;
      case 'history': return <ProjectHistoryPage onSelectProject={openProject} />;
      case 'settings': return <SettingsPage onLogout={() => setIsAuthenticated(false)} />;
      default: return <DashboardPage onNewProject={() => setIsNewProjectOpen(true)} onSelectProject={openProject} onViewHistory={() => setCurrentPage('history')} />;
    }
  };

  /**
   * Special Layout Handler:
   * Client-facing screens (like the public client room or approval portal) should NOT render the admin TopBar or Sidebar.
   * If a portal is active, we return the specific content instantly without standard dashboard wrappers.
   */
  if (clientRoomProjectId || currentPage === 'approval') {
    return <>{renderContent()}</>;
  }

  // Authentication Guard
  if (!isAuthenticated) {
    if (authView === 'login') {
      return (
        <LoginPage 
          onLoginSuccess={() => setIsAuthenticated(true)}
          onNavigateToSignUp={() => setAuthView('signup')}
        />
      );
    }
    return (
      <SignUpPage 
        onSignUpSuccess={() => setIsAuthenticated(true)}
        onNavigateToLogin={() => setAuthView('login')}
      />
    );
  }

  // Standard Admin Layout Structure
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        isCollapsed={isSidebarCollapsed}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => setIsAuthenticated(false)}
        onPageChange={(page) => {
          // Navigating away clears any active wizards
          setCurrentPage(page);
          setIsAddingClient(false);
          setViewingClient(null);
          setEditingClient(null);
          setSelectedProjectId(null);
          setIsNewProjectOpen(false);
          setIsMobileMenuOpen(false);
        }} 
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar 
          onNewProject={() => setIsNewProjectOpen(true)} 
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          // Dynamically adjust TopBar title and back button based on active wizard state
          title={
            isNewProjectOpen ? 'New Project' :
            isAddingClient ? 'Add Client' :
            editingClient ? 'Edit Client' :
            viewingClient ? 'Client Summary' :
            selectedProjectId ? projects.find((p) => p.id === selectedProjectId)?.name :
            undefined
          }
          onBack={
            isNewProjectOpen ? () => setIsNewProjectOpen(false) :
            isAddingClient ? () => setIsAddingClient(false) :
            editingClient ? () => setEditingClient(null) :
            viewingClient ? () => setViewingClient(null) :
            selectedProjectId ? () => { setSelectedProjectId(null); setCurrentPage(viewingProjectOrigin); } :
            undefined
          }
        />
        {/* Main Workspace Area */}
        <main className={`flex-1 min-w-0 ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'} ml-0 transition-all duration-300 ease-in-out px-4 sm:px-8 pt-24 pb-8`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
