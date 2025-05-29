import React from 'react';
import styles from './TargetBalance.module.css';

function TargetBalance({ targetBalance = 150, remainingToGoal = 150 }) {
    const reached = targetBalance - remainingToGoal;
    const progress = targetBalance > 0 ? (reached / targetBalance) * 100 : 0;

    return (
        <div className={styles.targetBalanceCard}>
            <h2 className={styles.heading}>Target Balance</h2>
            <div className={styles.targetBalanceInfo}>
                <span>Target Balance</span>
                <span>₱{targetBalance}.00</span>
            </div>
            <div className={styles.remainingGoalInfo}>
                <span>Remaining Goal</span>
                <span>&nbsp; ₱{remainingToGoal}.00</span>
            </div>
            <div className={styles.progressBarContainer}>
                <div
                    className={styles.progressBar}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

export default TargetBalance;
