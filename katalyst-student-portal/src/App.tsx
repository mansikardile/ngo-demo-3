import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { OfflineBanner } from './components/common/OfflineBanner';
import { ToastContainer } from './components/common/Toast';
import { EventSelectorModal } from './components/common/EventSelectorModal';

import { EventLandingPage } from './components/event/EventLandingPage';
import { EventErrorPage } from './components/event/EventErrorPage';
import { RegistrationForm } from './components/registration/RegistrationForm';
import { RegistrationSuccessPage } from './components/registration/RegistrationSuccessPage';
import { ApplicationForm } from './components/application/ApplicationForm';
import { ApplicationSuccessPage } from './components/application/ApplicationSuccessPage';
import { ApplicationStatusPage } from './components/status/ApplicationStatusPage';
import { HelpCenterPage } from './components/help/HelpCenterPage';
import { AboutKatalystPage } from './components/about/AboutKatalystPage';

const AppContent: React.FC = () => {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'event-landing':
        return <EventLandingPage />;
      case 'event-error':
        return <EventErrorPage />;
      case 'register':
        return <RegistrationForm />;
      case 'register-success':
        return <RegistrationSuccessPage />;
      case 'apply':
        return <ApplicationForm />;
      case 'apply-success':
        return <ApplicationSuccessPage />;
      case 'status':
        return <ApplicationStatusPage />;
      case 'help':
        return <HelpCenterPage />;
      case 'about':
        return <AboutKatalystPage />;
      default:
        return <EventLandingPage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 antialiased selection:bg-rose-900 selection:text-white">
      {/* Network / Simulator Status Bar */}
      <OfflineBanner />

      {/* Navigation Header */}
      <Header />

      {/* Dynamic View Canvas */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Toasts & Overlays */}
      <ToastContainer />
      <EventSelectorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
