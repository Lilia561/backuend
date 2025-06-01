import React, { useEffect, useState, useCallback } from 'react';
import styles from './GoalPlanner.module.css'; // Ensure this path is correct
import axiosClient from '../../axios'; // Import your Axios client
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function GoalPlanner() { // No longer accepts props, fetches its own data
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [currentMoney, setCurrentMoney] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Consolidated data fetching function for GoalPlanner
  const fetchData = useCallback(async () => {
      setLoading(true);
      setError(null);
      let isMounted = true; // Flag to prevent state updates on unmounted component

      try {
          const token = localStorage.getItem('ACCESS_TOKEN');
          if (!token) {
              if (isMounted) navigate('/login'); // Redirect if no token
              return;
          }

          // Fetch goals
          const goalsResponse = await axiosClient.get('api/goals', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (isMounted) setGoals(goalsResponse.data);

          // Fetch current money
          const moneyResponse = await axiosClient.get('api/user/money', {
              headers: { 'Authorization': `Bearer ${token}` }
          });
          if (isMounted) setCurrentMoney(moneyResponse.data.current_money);

      } catch (err) {
          console.error('Error fetching data for GoalPlanner:', err);
          if (isMounted) {
              let errorMessage = 'An unexpected error occurred. Please try again.';
              if (err.response && err.response.data && err.response.data.message) {
                  errorMessage = err.response.data.message;
              }
              setError(errorMessage);
              if (err.response && err.response.status === 401) {
                  navigate('/login'); // Redirect to login on 401 Unauthorized
              }
          }
      } finally {
          if (isMounted) setLoading(false);
      }

      return () => {
          isMounted = false; // Cleanup: set flag to false when component unmounts
      };
  }, [navigate]);

  useEffect(() => {
      fetchData();
  }, [fetchData]);

  // Calculate total target balance from all goals
  const totalTargetBalance = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);

  // Calculate overall progress for the GoalPlanner's progress bar
  const progressPercentage = totalTargetBalance > 0
      ? Math.min(100, (currentMoney / totalTargetBalance) * 100)
      : 0;

  // Calculate remaining to goal for the text display
  const remainingToGoal = Math.max(0, totalTargetBalance - currentMoney);


  const radius = 50;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference;
  const progressColor = progressPercentage >= 100 ? '#4caf50' : '#81c784';

  if (loading) {
      return (
          <div className={styles.goalPlannerCard}>
              <p>Loading goal planner...</p>
          </div>
      );
  }

  if (error) {
      return (
          <div className={styles.goalPlannerCard}>
              <p className={styles.errorMessage}>Error: {error}</p>
          </div>
      );
  }

  return (
    <div className={styles.goalPlannerCard}> {/* Updated class name */}
      <h2 className={styles.goalPlannerHeading}>Goal Planner</h2> {/* Updated class name */}
      <p className={styles.goalText}>Track your Savings</p> {/* Updated class name */}
      <div className={styles.goalCircleContainer}> {/* Updated class name */}
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
            stroke="#e0e0e0"
            strokeWidth={strokeWidth}
          />
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
          <text
            x="50"
            y="52"
            textAnchor="middle"
            dominantBaseline="middle"
            className={styles.goalPercentage} /* Updated class name */
          >
            {Math.round(progressPercentage)}%
          </text>
        </svg>
      </div>

      <p className={styles.goalText}> {/* Updated class name */}
        Remaining to Goal: ₱
        {remainingToGoal.toLocaleString(undefined, {
          minimumFractionDigits: 2,
        })}
      </p>

      <div className={styles.goalDetail}> {/* Updated class name */}
        <h2 className={styles.goalDetailHeading}>Goal Detail</h2> {/* Updated class name */}
        <div className={styles.goalDetailList}> {/* NEW: Added this div and class */}
          {goals && goals.length > 0 ? (
            goals.map((item) => (
              <div className={styles.goalDetailItem} key={item.id}> {/* Updated class name & key */}
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
            <p>No goal details available. Set a new goal!</p>
          )}
        </div> {/* NEW: Closed the div */}
      </div>
    </div>
  );
}

export default GoalPlanner;
