
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { POSLayout } from './components/POSLayout';
import { POSMain } from './pages/POS/POSMain';
import { KDSPage } from './pages/KDS';
import { AdminPage } from './pages/Admin';

const AppContent = () => {
  const { state } = useApp();

  // Determine which view to show inside the layout
  // If shift is closed, POSMain automatically renders the Login screen
  let view: React.ReactNode = <POSMain />;
  
  // Only allow switching views if shift is open
  if (state.shift.isOpen) {
    if (state.view === 'KDS') {
      view = <KDSPage />;
    } else if (state.view === 'ADMIN') {
      view = <AdminPage />;
    }
  }

  return <POSLayout children={view} />;
};

const App = () => {
  return <AppProvider children={<AppContent />} />;
};

export default App;
