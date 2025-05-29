
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './Pages/DashboardComponents/Dashboard';
import AdminPage from './Pages/AdminPageComponents/AdminPage';
import Transfer from './Pages/TransferComponents/Transfer';
import WallEtTransfer from './Pages/WallEtTransferComponents/WallEtTransfer';
import OtherBanks from './Pages/OtherBanksComponents/OtherBanks';
import Gcash from './Pages/GcashComponents/Gcash';
import Paymaya from './Pages/PaymayaComponents/Paymaya';
import FeedBack from './Pages/FeedBackComponents/FeedBack';
import LoginPage from './Pages/LoginComponents/LoginPage';
import SetGoalLimitScreen from './Pages/SetGoalComponents/SetGoalLimitScreen/SetGoalLimitScreen';

function App() {
  return (
    <Router>
            <div className='routes'>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/setgoal" element={<SetGoalLimitScreen />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/transfer" element={<Transfer />} />
                <Route path="/transfer/wall-et-transfer" element={<WallEtTransfer />} />
                <Route path="/transfer/otherbanks" element={<OtherBanks />} />
                <Route path="/transfer/otherbanks/gcash" element={<Gcash />} />
                <Route path="/transfer/otherbanks/paymaya" element={<Paymaya />} />
                <Route path="/feedback" element={<FeedBack />} />
                <Route path="/Login" element={<LoginPage />} />
            </Routes>
          </div>
    </Router>
  );
}

export default App
