import React from 'react';
import styles from '../CompGoalPlanList/GoalPlanList.module.css';

function GoalPlanList({ progress, targetBalance, currentBalance, goalDetails }) {
  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  const progressColor = progress >= 100 ? '#4caf50' : '#81c784';

  return (
    <div className={styles.goalPlannerCard}>
      <h2 className={styles.goalPlannerHeading}>Goal Planner</h2>
      
      <div className={styles.goalDetail}>
        <h2 className={styles.goalDetailHeading}>Goal Detail</h2>
        {goalDetails && goalDetails.length > 0 ? (
          goalDetails.map((item, index) => (
            <div className={styles.goalDetailItem} key={index}>
              <span>{item.name}</span>
              <span>
                ₱{item.targetAmount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
          ))
        ) : (
          <p className={styles.goalText}>No goal details available.</p>
        )}
      </div>
    </div>
  );
}

export default GoalPlanList;
