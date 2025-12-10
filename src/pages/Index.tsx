import { useState } from 'react';
import { TripProvider } from '@/context/TripContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Dashboard } from '@/components/pages/Dashboard';
import { CreateTrip } from '@/components/pages/CreateTrip';
import { ManageParticipants } from '@/components/pages/ManageParticipants';
import { AddExpense } from '@/components/pages/AddExpense';
import { ViewExpenses } from '@/components/pages/ViewExpenses';
import { Settlement } from '@/components/pages/Settlement';
import { Analytics } from '@/components/pages/Analytics';
import { About } from '@/components/pages/About';

const Index = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveSection} />;
      case 'create-trip':
        return <CreateTrip onNavigate={setActiveSection} />;
      case 'participants':
        return <ManageParticipants />;
      case 'add-expense':
        return <AddExpense onNavigate={setActiveSection} />;
      case 'expenses':
        return <ViewExpenses />;
      case 'settlement':
        return <Settlement />;
      case 'analytics':
        return <Analytics />;
      case 'about':
        return <About />;
      default:
        return <Dashboard onNavigate={setActiveSection} />;
    }
  };

  return (
    <TripProvider>
      <AppLayout activeSection={activeSection} onNavigate={setActiveSection}>
        {renderContent()}
      </AppLayout>
    </TripProvider>
  );
};

export default Index;
