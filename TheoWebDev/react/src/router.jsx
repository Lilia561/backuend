// AppRouter.jsx
import React from 'react';

// Import all your page components
import './App.module.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './Pages/DashboardComponents/Dashboard';
import AdminPage from './Pages/AdminPageComponents/AdminPage';
import LoginPage from './Pages/LoginComponents/LoginPage';
import SetGoalLimitScreen from './Pages/SetGoalComponents/SetGoalLimitScreen/SetGoalLimitScreen';
import Feedback from './Pages/FeedBackComponents/FeedBack';
import FullHistory from './Pages/HistoryPageComponents/FullHistory';
import Transfer from './Pages/TransferComponents/Transfer';
import OtherBanks from './Pages/BankTransferComponents/TransferWrapperComponents/TransferWrapperComp';
import WallEtTransfer from './Pages/eWalletTransferScreenComponents/EWalletTransferComp';

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
      <Route path="/transfer" element={<Transfer />} />

      {/* Nested transfer routes */}
      <Route path="/transfer/wall-et-transfer" element={<WallEtTransfer />} />
      <Route path="/transfer/otherbanks" element={<OtherBanks />} />

      {/* Feedback page route */}
      <Route path="/feedback" element={<Feedback />} />

      {/* Login page route */}
      <Route path="/Login" element={<LoginPage />} />

      {/* Login page route */}
      <Route path="/history" element={<FullHistory />} />

      {/* Optional: Add a catch-all route for 404 Not Found pages or redirects */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
}

export default AppRouter;
