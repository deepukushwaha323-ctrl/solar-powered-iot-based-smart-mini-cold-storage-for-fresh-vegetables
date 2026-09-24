import React from 'react';
import { ColdStorageProvider, useColdStorage } from './context/ColdStorageContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { LandingPageView } from './components/views/LandingPageView';
import { LoginView } from './components/views/LoginView';
import { DashboardView } from './components/views/DashboardView';
import { FarmerDashboardView } from './components/views/FarmerDashboardView';
import { ChambersView } from './components/views/ChambersView';
import { RackManagementView } from './components/views/RackManagementView';
import { VegetablesConfigView } from './components/views/VegetablesConfigView';
import { EnergyView } from './components/views/EnergyView';
import { RefrigerationView } from './components/views/RefrigerationView';
import { AlertCenterView } from './components/views/AlertCenterView';
import { HardwareSensorsView } from './components/views/HardwareSensorsView';
import { ReportsAnalyticsView } from './components/views/ReportsAnalyticsView';
import { AiAdvisorView } from './components/views/AiAdvisorView';
import { InventoryView } from './components/views/InventoryView';
import { DigitalTwinCanvas } from './components/digitaltwin/DigitalTwinCanvas';
import { EnvironmentView } from './components/views/EnvironmentView';
import { SystemLogsView } from './components/views/SystemLogsView';
import { SettingsView } from './components/views/SettingsView';
import { CrateDetailDrawer } from './components/digitaltwin/CrateDetailDrawer';
import { ColdChainAICopilot } from './components/ai/ColdChainAICopilot';
import { CommandPalette } from './components/common/CommandPalette';

const MainContent: React.FC = () => {
  const {
    activeTab,
    showLandingPage,
    isLoggedIn,
    userRole,
  } = useColdStorage();

  // 1. Landing Page View (Public Showcase)
  if (showLandingPage) {
    return <LandingPageView />;
  }

  // 2. Authentication View (Role & Farmer Selection)
  if (!isLoggedIn) {
    return <LoginView />;
  }

  // 3. Authenticated App Views
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return userRole === 'FARMER' ? <FarmerDashboardView /> : <DashboardView />;

      case 'chambers':
      case 'chamber_detail':
        return <ChambersView />;

      case 'racks':
      case 'rack_detail':
        return <RackManagementView />;

      case 'vegetables':
        return <VegetablesConfigView />;

      case 'energy':
      case 'solar':
        return <EnergyView />;

      case 'refrigeration':
        return <RefrigerationView />;

      case 'alerts':
        return <AlertCenterView />;

      case 'sensors':
        return <HardwareSensorsView />;

      case 'reports':
      case 'analytics':
        return <ReportsAnalyticsView />;

      case 'ai':
        return <AiAdvisorView />;

      case 'digitaltwin':
      case 'zones':
        return (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                <span>Interactive Cold Room Digital Twin Studio</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                2.5D visual twin representing airflow vectors, rack temperature distributions, and physical chambers.
              </p>
            </div>
            <DigitalTwinCanvas compact={false} />
          </div>
        );

      case 'inventory':
      case 'crates':
        return <InventoryView />;

      case 'users':
      case 'settings':
        return <SettingsView />;

      case 'logs':
        return <SystemLogsView />;

      case 'environment':
        return <EnvironmentView />;

      default:
        return userRole === 'FARMER' ? <FarmerDashboardView /> : <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Collapsible Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Container Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Command Center Header */}
        <Header />

        {/* Scrollable View Content Canvas */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-7 pb-20 md:pb-7">
          <div className="mx-auto max-w-7xl">
            {renderActiveView()}
          </div>
        </main>

        {/* Mobile Bottom Navigation for Phone Viewports */}
        <MobileBottomNav />
      </div>

      {/* Slide-in Crate Detail Operational Drawer */}
      <CrateDetailDrawer />

      {/* Autonomous ColdChain AI Copilot Drawer */}
      <ColdChainAICopilot />

      {/* Global Quick-Action Command Palette (Ctrl+K) */}
      <CommandPalette />
    </div>
  );
};

export default function App() {
  return (
    <ColdStorageProvider>
      <MainContent />
    </ColdStorageProvider>
  );
}
