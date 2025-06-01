import React from 'react';
import styles from './TargetBalance.module.css'; // Assuming you have a CSS module for this

function TargetBalance({ targetBalance, remainingToGoal }) {
    // No internal state or complex logic needed here, just display props
    // The progress bar calculation is now handled by the parent (SetGoalLimitScreen)
    // and passed down as 'remainingToGoal' which is directly used.

    // Calculate progress for the internal bar (how much of the target has been reached)
    const reached = targetBalance - remainingToGoal;
    const progress = targetBalance > 0 ? (reached / targetBalance) * 100 : 0;

    return (
        <div className={styles.targetBalanceCard}>
            <h2 className={styles.heading}>Target Balance</h2>
            <div className={styles.targetBalanceInfo}>
                <span>Target Balance</span>
                <span>₱{targetBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.remainingGoalInfo}>
                <span>Remaining Goal</span>
                <span>&nbsp; ₱{remainingToGoal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
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
