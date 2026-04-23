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

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderPreviewDetails, setOrderPreviewDetails] = useState<any>(null);
  const [previewTone, setPreviewTone] = useState('friendly');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isPreviewingPortal, setIsPreviewingPortal] = useState(false);

  // Simple state-based routing
  const renderContent = () => {
    if (currentPage === 'approval') return <ApprovalPage />;
    if (isPreviewingPortal && orderPreviewDetails) {
      return (
        <ApprovalPortalPage 
          details={orderPreviewDetails}
          onApprove={() => {
            setIsPreviewingPortal(false);
            setOrderPreviewDetails(null);
          }}
          onDecline={() => setIsPreviewingPortal(false)}
        />
      );
    }
    if (orderPreviewDetails) return (
      <PreviewSendPage 
        details={orderPreviewDetails} 
        tone={previewTone} 
        onBack={() => setOrderPreviewDetails(null)} 
        onPreviewPortal={() => setIsPreviewingPortal(true)}
      />
    );
    if (isCreatingOrder) return (
      <CreateChangeOrderPage 
        onCancel={() => setIsCreatingOrder(false)}
        onGenerate={(details, tone) => {
          setOrderPreviewDetails(details);
          setPreviewTone(tone);
          setIsCreatingOrder(false);
        }} 
      />
    );

    switch (currentPage) {
      case 'dashboard': return <DashboardPage />;
      case 'clients': return <ClientsPage />;
      case 'notifications': return <NotificationsPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage />;
    }
  };

  // Special layout for approval page or preview mode
  if (currentPage === 'approval' || isPreviewingPortal) {
    return <>{renderContent()}</>;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar 
        currentPage={currentPage} 
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onPageChange={(page) => {
          setCurrentPage(page);
          setIsCreatingOrder(false);
          setOrderPreviewDetails(null);
        }} 
      />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar 
          onNewScope={() => setIsCreatingOrder(true)} 
          isSidebarCollapsed={isSidebarCollapsed} 
          title={orderPreviewDetails ? 'Preview & Send' : isCreatingOrder ? 'Create New Scope' : undefined}
          onBack={orderPreviewDetails ? () => setOrderPreviewDetails(null) : isCreatingOrder ? () => setIsCreatingOrder(false) : undefined}
        />
        <main className={`flex-1 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'} transition-all duration-300 ease-in-out px-8 pt-24 pb-8`}>
          {renderContent()}
        </main>
      </div>
      
      {/* Link to public approval page for demo convenience */}
      {currentPage === 'dashboard' && (
        <button 
          onClick={() => setCurrentPage('approval')}
          className="fixed bottom-6 right-6 bg-slate-900 text-white px-4 py-2 rounded-full shadow-lg font-button flex items-center gap-2 hover:bg-slate-800 transition-all z-50"
        >
          View Client Portal
        </button>
      )}
    </div>
  );
}
