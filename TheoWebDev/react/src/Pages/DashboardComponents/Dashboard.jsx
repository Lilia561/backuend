import React, { useState, useEffect } from 'react';
import styles from './Dashboard.module.css'; // Updated import
import Sidebar from './DashboardCompSideBar/Sidebar';
import History from './DashboardCompHistory/History';
import Progress from './DashboardCompProgress/Progress';
import GoalPlanner from './DashboardCompGoalPlanner/GoalPlanner';
import TargetBalance from './DashboardCompTargetBalance/TargetBalance';
import LimitByCategory from './DashboardCompLimitByCategory/LimitByCategory';
import TransactionLimits from './DashboardCompTransactionLimits/TransactionLimits';
import TransferAndSetGoal from './DashboardCompTransferAndSetGoal/TransferAndSetGoal';
import AvailableBalance from './DashboardCompAvailableBalance/AvailableBalance';

function Dashboard() {
  const [money] = useState(2100);

  const limitsData = [
    { name: 'Food', spent: 985.0, limit: 2500.0 },
    { name: 'Shopping', spent: 1415.0, limit: 1500.0 },
    { name: 'Bills', spent: 2134.0, limit: 3000.0 },
    { name: 'Others', spent: 523.0, limit: 1000.0 },
  ];

  const goalDetailsData = [
    { name: 'Camera', targetAmount: 24000 },
    { name: 'Others', targetAmount: 150 },
  ];

  useEffect(() => {
    document.title = 'Dashboard | Wall-et';
  }, []);

  return (
    <div className={styles.dashboardRoot}>
    <div style={{ display: 'grid', gridTemplateColumns: '10% 80% 10%', gap: '20px', padding: '2px' }}>
      <div>
        <Sidebar />
      </div>

      <div>
        <div className={styles.dashboardContainer}>
          <div className={styles.dashboardHeader}>
            <h1>Dashboard</h1>
            <TransferAndSetGoal />
          </div>

          <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>
              <div className={styles.topLeftArea}>
                <AvailableBalance money={money} />
                <TargetBalance targetBalance={150} remainingToGoal={150} />
              </div>

              <TransactionLimits remaining={100} weeklyLimit={2500} />
              <LimitByCategory limits={limitsData} />
              <GoalPlanner
                progress={80}
                targetBalance={24000}
                currentBalance={money}
                goalDetails={goalDetailsData}
              />
            </div>

            <div className={styles.rightColumn}>
              <Progress />
              <History />
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Dashboard;
