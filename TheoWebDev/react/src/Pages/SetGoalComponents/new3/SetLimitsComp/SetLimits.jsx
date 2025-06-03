import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SetLimits.module.css';
import GoalPlanner from '../CompGoalPlanList/GoalPlanList';
import TransactionLimits from '../CompTransactionLimits/TransactionLimits'; // ⬅️ Updated import

const SetLimitComp = () => {
  useEffect(() => {
    document.title = 'Set Limit | Wall-et';
  }, []);

  const navigate = useNavigate();

  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');

  const goalProgress = 80;
  const targetBalance = 6900;
  const currentBalance = 2100;
  const goals = [
    { name: 'Camera', targetAmount: 2400 },
    { name: 'Others', targetAmount: 150 },
  ];

  const handleSetLimit = (e) => {
    e.preventDefault();

    if (!limit || parseFloat(limit) <= 0) {
      setMessage('Please enter a valid limit amount.');
      return;
    }

    setMessage(`Limit set to ₱${limit}`);
    setLimit('');
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className={styles.dashboardContainer}>
      {message && <div className={styles.successPopup}>{message}</div>}

      <div className={styles.dashboardHeader}>
        <h1>Set Spending Limit</h1>
      </div>

      <div className={styles.setGoalGrid}>
        <div className={styles.leftColumn}>
          <form onSubmit={handleSetLimit} className={styles.transferForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="limit">Limit Amount (₱)</label>
              <input
                type="number"
                id="limit"
                placeholder="Enter limit"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.doneButton}>
              Set Limit
            </button>
          </form>
        </div>

        <div className={styles.rightColumn}>
          <TransactionLimits /> {/* ⬅️ Replaced AvailableBalance */}
          <GoalPlanner
            progress={goalProgress}
            targetBalance={targetBalance}
            currentBalance={currentBalance}
            goalDetails={goals}
          />
        </div>
      </div>
    </div>
  );
};

export default SetLimitComp;
