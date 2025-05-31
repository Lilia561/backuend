import React from 'react';
import styles from './GoalPlanner.module.css';

function GoalPlanner({ progress, targetBalance, currentBalance, goalDetails }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2; // offset for stroke centering
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressColor = progress >= 100 ? '#4caf50' : '#81c784'; // green if completed

  return (
    <div className={styles['goal-planner-card']}>
      <h2 className={styles.goalPlannerCardTitle}>Goal Planner</h2>
      <p className={styles.goalPlannerCardParagraph}>Track your Savings</p>
      <div className={styles['goal-circle-container']}>
        <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={normalizedRadius}
            fill="none"
            stroke="#e0e0e0"
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
            className={styles['goal-percentage']}
            fontSize="16"
            fontWeight="bold"
          >
            {progress}%
          </text>
        </svg>
      </div>

      <p className={styles.goalPlannerCardParagraph}>
        Remaining to Goal: ₱{Math.max(0, targetBalance - currentBalance).toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>

      <div className={styles['goal-detail']}>
        <h2 className={styles.goalDetailTitle}>Goal Detail</h2>
        {goalDetails && goalDetails.length > 0 ? (
          goalDetails.map((item, index) => (
            <div className={styles['goal-detail-item']} key={index}>
              <span>{item.name}</span>
              <span>₱{item.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          ))
        ) : (
          <p>No goal details available.</p>
        )}
      </div>
    </div>
  );
}

export default GoalPlanner;
