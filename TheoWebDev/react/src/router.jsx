// AppRouter.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Import all your page components
import Dashboard from './Pages/DashboardComponents/Dashboard';
import AdminPage from './Pages/AdminPageComponents/AdminPage';
import Transfer from './Pages/TransferComponents/Transfer';
import WallEtTransfer from './Pages/eWalletTransferScreenComponents/EWalletTransferComp';
import OtherBanks from './Pages/BankTransferComponents/TransferWrapperComponents/TransferWrapperComp';
import Gcash from './Pages/GcashComponents/Gcash';
import Paymaya from './Pages/PaymayaComponents/Paymaya';
import FeedBack from './Pages/FeedBackComponents/FeedBack';
import LoginPage from './Pages/LoginComponents/LoginPage';
import SetGoalLimitScreen from './Pages/SetGoalComponents/SetGoalLimitScreen/SetGoalLimitScreen';
import TransferWrapperComp from './Pages/BankTransferComponents/TransferWrapperComponents/TransferWrapperComp';

/**
 * AppRouter component centralizes all application routes.
 * This helps keep App.jsx clean and focused on overall application structure.
 */
function AppRouter() {
  return (
    <Routes>
      {/* Default route, navigates to Dashboard */}
      <Route path="/" element={<Dashboard />} />

      {/* Route for other wallet transfers */}
      {/* <Route path="/OtherWallet" element={<TransferWrapperComp />} /> */}

      {/* Route for setting financial goals */}
      <Route path="/setgoal" element={<SetGoalLimitScreen />} />

      {/* Admin page route */}
      <Route path="/admin" element={<AdminPage />} />

      {/* Main transfer page route */}
      <Route path="/transfer" element={<TransferWrapperComp />} />

      {/* Nested transfer routes */}
      <Route path="/transfer/wall-et-transfer" element={<WallEtTransfer />} />
      <Route path="/transfer/otherbanks" element={<OtherBanks />} />
      <Route path="/transfer/otherbanks/gcash" element={<Gcash />} />
      <Route path="/transfer/otherbanks/paymaya" element={<Paymaya />} />

      {/* Feedback page route */}
      <Route path="/feedback" element={<FeedBack />} />

      {/* Login page route */}
      <Route path="/Login" element={<LoginPage />} />

      {/* Optional: Add a catch-all route for 404 Not Found pages or redirects */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default AppRouter;
