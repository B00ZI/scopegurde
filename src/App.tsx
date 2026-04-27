import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { DashboardPage } from './pages/Dashboard';
import { ClientsPage } from './pages/Clients';
import { NotificationsPage } from './pages/Notifications';
import { SettingsPage } from './pages/Settings';
import { CreateChangeOrderPage } from './pages/CreateChangeOrder';
import { PreviewSendPage } from './pages/PreviewSend';
import { ApprovalPage } from './pages/Approval';
import { ApprovalPortalPage } from './pages/ApprovalPortal';
import { AddClientPage } from './pages/AddClient';
import { ClientDetailsPage } from './pages/ClientDetails';
import { LoginPage } from './pages/Login';
import { SignUpPage } from './pages/SignUp';
import { ScopeDetailsPage } from './pages/ScopeDetails';
import { CompletedScopesPage } from './pages/CompletedScopes';
import { EditClientPage } from './pages/EditClient';
import { Client } from './types';

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

  // --- WORKFLOW: CREATE SCOPE WIZARD ---
  // isCreatingOrder -> orderPreviewDetails -> isPreviewingPortal
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderPreviewDetails, setOrderPreviewDetails] = useState<any>(null);
  const [previewTone, setPreviewTone] = useState('friendly');
  const [isPreviewingPortal, setIsPreviewingPortal] = useState(false);

  // --- DRILL-DOWN / SUB-ROUTING STATES ---
  const [isAddingClient, setIsAddingClient] = useState(false);
  const [viewingClient, setViewingClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [viewingScope, setViewingScope] = useState<any>(null);

  /**
   * Router Logic:
   * Evaluates current state variables in a strict priority order to determine which screen to show.
   * Highest priority: Full-screen public portals -> Preview Modals -> Creation Wizards -> Standard Navigation.
   */
  const renderContent = () => {
    // 1. Standalone Demo Screens (No layout wrappers)
    if (currentPage === 'approval') return <ApprovalPage />;
    
    // 2. Client-Facing Public Portal Preview
    if (isPreviewingPortal && orderPreviewDetails) {
      return (
        <ApprovalPortalPage 
          details={orderPreviewDetails}
          onApprove={() => {
             // Reset back to dashboard on success
            setIsPreviewingPortal(false);
            setOrderPreviewDetails(null);
          }}
          onDecline={() => setIsPreviewingPortal(false)}
        />
      );
    }
    
    // 3. Admin View: AI-Generated Message Preview
    if (orderPreviewDetails) return (
      <PreviewSendPage 
        details={orderPreviewDetails} 
        tone={previewTone} 
        onBack={() => setOrderPreviewDetails(null)} 
        onPreviewPortal={() => setIsPreviewingPortal(true)}
      />
    );
    
    // 4. Admin View: Scope Document Creation Form
    if (isCreatingOrder) return (
      <CreateChangeOrderPage 
        onCancel={() => setIsCreatingOrder(false)}
        onGenerate={(details, tone) => {
          // Transition state from "Creating" to "Previewing" while passing payload forward
          setOrderPreviewDetails(details);
          setPreviewTone(tone);
          setIsCreatingOrder(false);
        }} 
      />
    );

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
          onRemove={() => setViewingClient(null)} // Mock removal
          onViewScope={(s) => {
            setViewingClient(null); // Optional: if we want to drop the client context, or we can just set viewingScope
            setViewingScope(s);
          }}
        />
      );
    }

    if (viewingScope) {
      return (
        <ScopeDetailsPage 
          scope={viewingScope}
          onBack={() => setViewingScope(null)}
          onViewScope={(s) => setViewingScope(s)}
        />
      );
    }

    // 5. Default Navigation: Standard Admin Dashboard Views
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onViewScope={(s) => setViewingScope(s)} />;
      case 'clients': return <ClientsPage onAddClient={() => setIsAddingClient(true)} onViewClient={(c) => setViewingClient(c)} onEditClient={(c) => setEditingClient(c)} onDeleteClient={() => {}} />;
      case 'notifications': return <NotificationsPage onViewScope={(s) => setViewingScope(s)} />;
      case 'history': return <CompletedScopesPage onViewScope={(s) => setViewingScope(s)} />;
      case 'settings': return <SettingsPage onLogout={() => setIsAuthenticated(false)} />;
      default: return <DashboardPage />;
    }
  };

  /**
   * Special Layout Handler:
   * Client-facing screens (like the public approval portal) should NOT render the admin TopBar or Sidebar.
   * If a portal is active, we return the specific content instantly without standard dashboard wrappers.
   */
  if (currentPage === 'approval' || isPreviewingPortal) {
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
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={() => setIsAuthenticated(false)}
        onPageChange={(page) => {
          // Navigating away clears any active wizards
          setCurrentPage(page);
          setIsCreatingOrder(false);
          setOrderPreviewDetails(null);
          setIsAddingClient(false);
          setViewingClient(null);
          setEditingClient(null);
          setViewingScope(null);
        }} 
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar 
          onNewScope={() => setIsCreatingOrder(true)} 
          isSidebarCollapsed={isSidebarCollapsed} 
          // Dynamically adjust TopBar title and back button based on active wizard state
          title={
            orderPreviewDetails ? 'Preview & Send' : 
            isCreatingOrder ? 'Create New Scope' : 
            isAddingClient ? 'Add Client' :
            editingClient ? 'Edit Client' :
            viewingClient ? 'Client Summary' :
            viewingScope ? `Scope #${viewingScope.id}` :
            undefined
          }
          onBack={
            orderPreviewDetails ? () => setOrderPreviewDetails(null) : 
            isCreatingOrder ? () => setIsCreatingOrder(false) : 
            isAddingClient ? () => setIsAddingClient(false) :
            editingClient ? () => setEditingClient(null) :
            viewingClient ? () => setViewingClient(null) :
            viewingScope ? () => setViewingScope(null) :
            undefined
          }
        />
        {/* Main Workspace Area */}
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out px-8 pt-24 pb-8`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
