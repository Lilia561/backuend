import React, { useState } from 'react';
import './Dashboard.css';
import Sidebar from './DashboardCompSideBar/Sidebar';
import History from './DashboardCompHistory/History';
import Progress from './DashboardCompProgress/Progress';
import GoalPlanner from './DashboardCompGoalPlanner/GoalPlanner';
import TargetBalance from './DashboardCompTargetBalance/TargetBalance';
import LimitByCategory from './DashboardCompLimitByCategory/LimitByCategory';
import TransactionLimits from './DashboardCompTransactionLimits/TransactionLimits';
import TransferAndSetGoal from './DashboardCompTransferAndSetGoal/TransferAndSetGoal';
import PopupSidebar from './DashboardCompSideBar/Sidebar';
import axiosClient from '../axios';

function Dashboard() {
    // Mock data for the components (replace with your actual data)
    const limitsData = [
        { name: 'Food', spent: 985.00, limit: 2500.00 },
        { name: 'Shopping', spent: 1415.00, limit: 1500.00 },
        { name: 'Bills', spent: 2134.00, limit: 3000.00 },
        { name: 'Others', spent: 523.00, limit: 1000.00 },
    ];

    const goalDetailsData = [
        { name: 'Camera', targetAmount: 24000 },
        { name: 'Others', targetAmount: 150 },
    ];

   
    const [ money , setMoney ] = useState(); 
    axiosClient.get('/token');

    console.log("Hello")
    axiosClient.get("/token")
        .then(({data})=>{
            setMoney(data);
        })
    return (
        <>

    <div style={{ display: 'grid', gridTemplateColumns: '10% 80% 10%', gap: '20px', padding: '2px' }}>
      <div>
        <PopupSidebar />
      </div>
        <div>
            <div className="dashboard-container" >
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <TransferAndSetGoal />
            </div>
                <div className="dashboard-grid">
                    <div className="left-column">
                        <div className="top-left-area"> {/* New container for Available and Target Balance */}
                            <div className="available-balance-card">
                                <h2>Available Balance</h2>
                                <p className="available-balance">{money}</p>
                            </div>
                            <TargetBalance targetBalance={150} remainingToGoal={150} />
                        </div>
                        <TransactionLimits remaining={100} weeklyLimit={2500} />
                        <LimitByCategory limits={limitsData} />
                        <GoalPlanner
                            progress={80}
                            targetBalance={24000}
                            currentBalance={19200}
                            goalDetails={goalDetailsData}
                        />
                    </div>

                    <div className="right-column">
                        <Progress />
                        <History />
                    </div>
                </div>
            </div>
        </div>
    
    </div>
        </>
    
    );
}

export default Dashboard;