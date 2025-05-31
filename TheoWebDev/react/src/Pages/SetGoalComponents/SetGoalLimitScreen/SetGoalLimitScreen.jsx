
import { useNavigate } from 'react-router-dom'; // ← Import useNavigate
import styles from './SetGoalLimitScreen.module.css'; // ← Use CSS module
import TargetBalance from '../DashboardCompTargetBalance/TargetBalance';
import GoalPlanner from '../DashboardCompGoalPlanner/GoalPlanner';
import React, { useEffect, useState } from 'react';

function SetGoalLimitScreen() {
  useEffect(() => {
    document.title = 'Set Goal & Limits | Wall-et';
  }, []);

    const navigate = useNavigate();
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const goalDetailsData = [
        { name: 'Camera', targetAmount: 24000 },
        { name: 'Others', targetAmount: 150 },
    ];

    const handleDoneClick = () => {
        setShowSuccessMessage(true);
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 3000);
    };

    const handleBackClick = () => {
        navigate(-1); // Navigate back
    };

    return (
        <div className={styles.dashboardContainer} style={{ position: 'relative' }}>
            {showSuccessMessage && (
                <div className={styles.successPopup}>
                    Goal has been set successfully
                </div>
            )}

            {/* Back button */}
            <button className={styles.backButton} onClick={handleBackClick}>
                ← Back
            </button>

            <div className={styles.dashboardHeader}>
                <h1>Set Goal and Limits</h1>
            </div>

            <div className={styles.setGoalGrid}>
                <div className={styles.leftColumn}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="target-balance">Target Balance (PHP)</label>
                        <input type="number" id="target-balance" placeholder="Enter amount" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="target-date">Target Date</label>
                        <input type="date" id="target-date" />
                    </div>
                    <h2 className={styles.subtitle}>Set Goal</h2>
                    <div className={styles.inputGroup}>
                        <label htmlFor="goal-purpose">Purpose</label>
                        <input type="text" id="goal-purpose" placeholder="e.g., New Camera" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label htmlFor="goal-target-balance">Target Balance for Purpose (PHP)</label>
                        <input type="number" id="goal-target-balance" placeholder="Enter amount" />
                    </div>

                    <button className={styles.doneButton} onClick={handleDoneClick}>
                        Done
                    </button>
                </div>

                <div className={styles.rightColumn}>
                    <TargetBalance targetBalance={150} remainingToGoal={150} />
                    <GoalPlanner
                        progress={80}
                        targetBalance={24000}
                        currentBalance={19200}
                        goalDetails={goalDetailsData}
                    />
                </div>
            </div>
        </div>
    );
}

export default SetGoalLimitScreen;
