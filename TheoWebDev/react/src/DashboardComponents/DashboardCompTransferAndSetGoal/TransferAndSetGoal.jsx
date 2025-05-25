import React from 'react';
import './TransferAndSetGoal.css';

function TransferAndSetGoal() {
    return (
        <div className="transfer-and-set-goal">
            <button
                className="transfer-button"
                onClick={() => {
                    // In a real app, you'd use your routing library (e.g., React Router)
                    // to navigate to the transfer page.  For this example, we'll just
                    // simulate a navigation with an alert.
                    alert('Navigating to Transfer Page...');
                }}
            >
                Transfer
            </button>
            <button
                className="set-goal-button"
                onClick={() => {
                    // Simulate navigation to the set goal/limit page.
                    alert('Navigating to Set Goal/Limit Page...');
                }}
            >
                Set Goal and Limit
            </button>
        </div>
    );
}

export default TransferAndSetGoal;