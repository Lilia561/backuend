import React from 'react';
import styles from './GoalPlanCircle.module.css';

function GoalPlanCircle({ progress, targetBalance, currentBalance, goalDetails }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressColor = progress >= 100 ? '#4caf50' : '#4caf50';

  return (
    <div className={styles.goalPlannerCard}>
      <h2 className={styles.goalPlannerHeading}>Goal Planner</h2>
      
      <div className={styles.goalCircleContainer}>
        <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={normalizedRadius}
            fill="none"
            stroke="#aaaec3"
            strokeWidth={strokeWidth}
          />
          {/* Progress ring */}
          <circle
            cx="50"
            cy="50"
            r={normalizedRadius}
            fill="none"
            stroke={progressColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 50 50)"
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.3s ease-out, stroke 0.3s ease-out',
            }}
          />
          {/* Percentage label */}
          <text
            x="50"
            y="52"
            textAnchor="middle"
            dominantBaseline="middle"
            className={styles.goalPercentage}
            fontSize="16"
            fontWeight="bold"
          >
            {progress}%
          </text>
        </svg>
      </div>

      <p className={styles.goalText}>
        Remaining to Goal: ₱{Math.max(0, targetBalance - currentBalance).toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </p>
    </div>
  );
}

export default GoalPlanCircle;
