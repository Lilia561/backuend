import React from 'react';
import './TargetBalance.css';

function TargetBalance({ targetBalance = 150, remainingToGoal = 150 }) {
    const reached = targetBalance - remainingToGoal;
    const progress = targetBalance > 0 ? (reached / targetBalance) * 100 : 0;

    return (
        <div className="target-balance-card">
            <h2>Target Balance</h2>
            <div className="target-balance-info">
                <span>Target Balance</span>
                <span>₱{targetBalance}.00</span>
            </div>
            <div className="remaining-goal-info">
                <span>Remaining Goal</span>
                <span>&nbsp; ₱{remainingToGoal}.00</span>
            </div>
            <div className="progress-bar-container">
                <div
                    className="progress-bar"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}

export default TargetBalance;