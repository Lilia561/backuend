import React from 'react';
import styles from './GoalPlanCircle.module.css'; // Assuming you have a CSS module for this

function GoalPlanner({ progress, targetBalance, currentBalance, goalDetails }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressColor = progress >= 100 ? '#4caf50' : '#81c784'; // Green if 100%, lighter green otherwise

  return (
    <div className={styles.goalPlannerCard}>
      <h2 className={styles.goalPlannerHeading}>Goal Planner</h2>
      <p className={styles.goalText}>Track your Savings</p>
      <div className={styles.goalCircleContainer}>
        <svg
          width={radius * 2 + strokeWidth}
          height={radius * 2 + strokeWidth}
          viewBox="0 0 100 100"
        >
          <circle
            cx="50"
            cy="50"
            r={normalizedRadius}
            fill="none"
            stroke="#e0e0e0" // Background circle color
            strokeWidth={strokeWidth}
          />
          <circle
            cx="50"
            cy="50"
            r={normalizedRadius}
            fill="none"
            stroke={progressColor} // Progress circle color
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)" // Start from the top
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out',
            }}
          />
          <text
            x="50"
            y="52" // Adjust y for vertical centering
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              fill: '#333',
            }}
          >
            {Math.round(progress)}% {/* Display rounded percentage */}
          </text>
        </svg>
      </div>

      <p className={styles.goalText}>
        Remaining to Goal: ₱
        {Math.max(0, targetBalance - currentBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </p>

      <div className={styles.goalDetail}>
        <h2 className={styles.goalDetailHeading}>Goal Detail</h2>
        {goalDetails && goalDetails.length > 0 ? (
          goalDetails.map((item, index) => (
            <div className={styles.goalDetailItem} key={item.id || index}> {/* Use item.id if available, otherwise index */}
              <span>{item.purpose}</span> {/* Changed from item.name to item.purpose */}
              <span>
                ₱
                {item.targetAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))
        ) : (
          <p>No goal details available. Set a new goal!</p> // More descriptive message
        )}
      </div>
    </div>
  );
}

export default GoalPlanner;
