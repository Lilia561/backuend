import React from 'react';
import './GoalPlanner.css';

function GoalPlanner({ progress = 80, targetBalance = 24000, currentBalance = 19200, goalDetails }) {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const progressColor = progress >= 100 ? '#4caf50' : '#81c784'; // Change color if goal reached

    return (
        <div className="goal-planner-card">
            <h2>Goal Planner</h2>
            <p>Track your Savings</p>
            <div className="goal-circle-container">
                <svg width={radius * 2} height={radius * 2}>
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius}
                        fill="none"
                        stroke="#e0e0e0"
                        strokeWidth="8"
                    />
                    <circle
                        cx={radius}
                        cy={radius}
                        r={radius}
                        fill="none"
                        stroke={progressColor}
                        strokeWidth="8"
                        strokeDasharray={`${circumference} ${circumference}`}
                        strokeDashoffset={strokeDashoffset}
                        transform={`rotate(-90 ${radius} ${radius})`}
                        style={{ transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out' }}
                    />
                    <text x={radius} y={radius + 5} textAnchor="middle" className="goal-percentage">
                        {progress}%
                    </text>
                </svg>
            </div>
            <p>Remaining to Goal: ₱{targetBalance - currentBalance}.00</p>
            <div className="goal-detail">
                <h2>Goal Detail</h2>
                {goalDetails && goalDetails.map((item, index) => (
                    <div className="goal-detail-item" key={index}>
                        <span>{item.name}</span>
                        <span>₱{item.targetAmount}.00</span>
                    </div>
                ))}
                {!goalDetails && <p>No goal details available.</p>}
            </div>
        </div>
    );
}

export default GoalPlanner;