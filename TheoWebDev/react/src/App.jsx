
import './App.css'
import History from './DashboardComponents/DashboardCompHistory/History'
import GoalPlanner from './DashboardComponents/DashboardCompGoalPlanner/GoalPlanner'
import TargetBalance from './DashboardComponents/DashboardCompTargetBalance/TargetBalance'
import LimitByCategory from './DashboardComponents/DashboardCompLimitByCategory/LimitByCategory'
import TransactionLimits from './DashboardComponents/DashboardCompTransactionLimits/TransactionLimits'
import TransferAndSetGoal from './DashboardComponents/DashboardCompTransferAndSetGoal/TransferAndSetGoal'
import Progress from './DashboardComponents/DashboardCompProgress/Progress'
import Dashboard from './DashboardComponents/Dashboard'
import PopupSidebar from './DashboardComponents/DashboardCompSideBar/Sidebar'



function App() {

   return (
    <div>
        <Dashboard />
    </div>
  );
}

export default App
