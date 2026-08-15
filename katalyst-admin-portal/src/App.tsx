import React from 'react';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { TopNavbar } from './components/layout/TopNavbar';
import { Footer } from './components/layout/Footer';

// Pages
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { EventManagement } from './components/events/EventManagement';
import { EventDetailView } from './components/events/EventDetailView';
import { LeadsManagement } from './components/leads/LeadsManagement';
import { ApplicationsTracking } from './components/applications/ApplicationsTracking';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { ExportCenter } from './components/exports/ExportCenter';
import { SettingsIntegrations } from './components/settings/SettingsIntegrations';

// Modals & Drawers
import { CreateEventModal } from './components/events/CreateEventModal';
import { QRCodeModal } from './components/events/QRCodeModal';
import { LeadDetailDrawer } from './components/leads/LeadDetailDrawer';

const AdminPortalApp: React.FC = () => {
  const { 
    isAuthenticated, 
    activePage, 
    isCreateEventModalOpen, 
    setIsCreateEventModalOpen,
    isQrModalOpen,
    setIsQrModalOpen,
    activeQrEvent,
    selectedLeadId,
    setSelectedLeadId
  } = useAdmin();

  // If not authenticated, render login page
  if (!isAuthenticated) {
    return <LoginPage />;
  }

  // Active page renderer
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'events':
        return <EventManagement />;
      case 'event-detail':
        return <EventDetailView />;
      case 'leads':
        return <LeadsManagement />;
      case 'applications':
        return <ApplicationsTracking />;
      case 'analytics':
        return <AnalyticsView />;
      case 'exports':
        return <ExportCenter />;
      case 'settings':
        return <SettingsIntegrations />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 antialiased overflow-hidden font-sans">
      {/* Persistent Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Dynamic Page Container */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {renderCurrentPage()}
          </div>
        </main>

        {/* Global Footer */}
        <Footer />
      </div>

      {/* Global Modals & Drawers */}
      <CreateEventModal 
        isOpen={isCreateEventModalOpen} 
        onClose={() => setIsCreateEventModalOpen(false)} 
      />

      <QRCodeModal
        event={activeQrEvent}
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

      <LeadDetailDrawer
        leadId={selectedLeadId}
        onClose={() => setSelectedLeadId(null)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AdminProvider>
      <AdminPortalApp />
    </AdminProvider>
  );
}
