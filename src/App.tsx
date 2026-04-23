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

/**
 * ENTRY POINT & MAIN LAYOUT CONTROLLER
 * 
 * Architecture Overview:
 * This component acts as the global state manager and router for the application.
 * It uses simple state-based conditional rendering instead of a complex library like React Router,
 * keeping the prototype lightweight and easy to follow.
 * 
 * Data Flow:
 * - Sidebar triggers navigation state changes.
 * - TopBar triggers the "Create Scope" floating state.
 * - CreateChangeOrder generates scope details -> passes to PreviewSend -> passes to ApprovalPortal.
 */
export default function App() {
  // Navigation State: Controls the primary dashboard views (Dashboard, Clients, Settings, etc.)
  const [currentPage, setCurrentPage] = useState('dashboard');
  
  // Layout State: Manages the visual state of the sidebar to maximize workspace area
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Workflow State: Handles the "Create New Scope" funnel.
  // These states overlay the primary navigation, acting like modals or full-screen wizards.
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  
  // Data State: Holds the structured scope output generated from the AI prompt or manual entry
  const [orderPreviewDetails, setOrderPreviewDetails] = useState<any>(null);
  
  // Data State: Holds the tone preference ('friendly', 'neutral', 'firm') for AI message generation
  const [previewTone, setPreviewTone] = useState('friendly');
  
  // Workflow State: Triggers the client-facing approval preview screen
  const [isPreviewingPortal, setIsPreviewingPortal] = useState(false);

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

    // 5. Default Navigation: Standard Admin Dashboard Views
    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'clients': return <ClientsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;
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

  // Standard Admin Layout Structure
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onPageChange={(page) => {
          // Navigating away clears any active wizards
          setCurrentPage(page);
          setIsCreatingOrder(false);
          setOrderPreviewDetails(null);
        }} 
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar 
          onNewScope={() => setIsCreatingOrder(true)} 
          isSidebarCollapsed={isSidebarCollapsed} 
          // Dynamically adjust TopBar title and back button based on active wizard state
          title={orderPreviewDetails ? 'Preview & Send' : isCreatingOrder ? 'Create New Scope' : undefined}
          onBack={orderPreviewDetails ? () => setOrderPreviewDetails(null) : isCreatingOrder ? () => setIsCreatingOrder(false) : undefined}
        />
        {/* Main Workspace Area */}
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out px-8 pt-24 pb-8`}>
          {renderContent()}
        </main>
      </div>
      
      {/* Floating Demo Access: Quick link to view the hardcoded Approval Request demo */}
      {currentPage === 'dashboard' && (
        <button 
          onClick={() => setCurrentPage('approval')}
          className="fixed bottom-6 right-6 bg-slate-900 text-white dark:bg-primary dark:text-on-primary px-4 py-2 rounded-full shadow-lg font-button flex items-center gap-2 hover:opacity-90 transition-all z-50"
        >
          View Client Portal
        </button>
      )}
    </div>
  );
}
