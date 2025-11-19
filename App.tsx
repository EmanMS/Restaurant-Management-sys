
import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { POSLayout } from './components/POSLayout';
import { POSMain } from './pages/POS/POSMain';
import { KDSPage } from './pages/KDS';
import { AdminPage } from './pages/Admin';

const AppContent = () => {
  const { state } = useApp();

  const renderView = () => {
    switch (state.view) {
        case 'KDS': return <KDSPage />;
        case 'ADMIN': return <AdminPage />;
        default: return <POSMain />;
    }
  };

  return (
    <POSLayout>
      {renderView()}
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
