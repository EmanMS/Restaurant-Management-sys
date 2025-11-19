import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { POSLayout } from './components/POSLayout';
import { POSMain } from './pages/POS/POSMain';
import { KDSPage } from './pages/KDS';
import { AdminPage } from './pages/Admin';

const AppContent = () => {
  const { state } = useApp();

  // If shift is not open, show Login screen (POSMain handles this state)
  // We do NOT wrap this in POSLayout to hide the sidebar, fulfilling the requirement
  // to not show the sidebar on the login page.
  if (!state.shift.isOpen) {
      return <POSMain />;
  }

  // Determine which view to show inside the layout
  let view;
  switch (state.view) {
      case 'KDS': 
        view = <KDSPage />;
        break;
      case 'ADMIN': 
        view = <AdminPage />;
        break;
      default: 
        // If shift is open, POSMain renders Menu or FloorPlan
        view = <POSMain />;
  }

  return (
    <POSLayout>
      {view}
    </POSLayout>
  );
};

const App = () => {
  return (
    <AppProvider>
        <AppContent />
    </AppProvider>
  );
};

export default App;