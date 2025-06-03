// SetLimits.jsx
import React, { useState, useEffect } from 'react';
import styles from './SetLimits.module.css';
import GoalPlanner from '../CompGoalPlanList/GoalPlanList';
import TransactionLimits from '../CompTransactionLimits/TransactionLimits'; // ⬅️ Updated import
import axiosClient from '../../axios'; // Your Axios client for API calls, consistent with SignInComp.jsx

const SetLimitComp = () => {
  useEffect(() => {
    document.title = 'Set Limit | Wall-et';
  }, []);

  const [limit, setLimit] = useState('');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(null); // State for handling validation errors
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [weeklySpent, setWeeklySpent] = useState(0);


  // Function to fetch the current weekly limit and spent amount
  const fetchWeeklyLimit = async () => {
    setErrors(null); // Clear previous errors
    try {
      // Use axiosClient.get for GET requests
      const response = await axiosClient.get('api/user/weekly-limit');
      // Axios automatically unwraps the response data into response.data
      setWeeklyLimit(response.data.weekly_limit);
      setWeeklySpent(response.data.weekly_spent_amount);
      setMessage('Weekly limit and spent amount loaded successfully.');
      setTimeout(() => setMessage(''), 3000); // Clear success message after 3 seconds
    } catch (error) {
      console.error('Error fetching weekly limit:', error);
      if (error.response) {
        // Handle API errors (e.g., 401 Unauthorized, 500 Internal Server Error)
        setErrors({ general: [error.response.data.message || 'Failed to fetch weekly limit.'] });
      } else {
        setErrors({ general: ['Error connecting to the server.'] });
      }
    }
  };

  useEffect(() => {
    // Fetch the weekly limit when the component mounts
    fetchWeeklyLimit();
  }, []); // Empty dependency array means this runs once on mount

  const handleSetLimit = async (e) => {
    e.preventDefault();

    setErrors(null); // Clear previous errors
    setMessage(''); // Clear previous messages

    const limitAmount = parseFloat(limit);
    if (isNaN(limitAmount) || limitAmount < 0) {
      setErrors({ weekly_limit: ['Please enter a valid non-negative limit amount.'] });
      return;
    }

    try {
      // Use axiosClient.post for POST requests
      const response = await axiosClient.post('api/user/set-weekly-limit', { weekly_limit: limitAmount });

      // Axios automatically unwraps the response data into response.data
      setMessage(response.data.message);
      setLimit(''); // Clear the input field
      fetchWeeklyLimit(); // Refresh the displayed limit and spent amount
      setTimeout(() => setMessage(''), 3000); // Clear success message after 3 seconds

    } catch (error) {
      console.error('Error setting limit:', error);
      if (error.response) {
        if (error.response.status === 422) {
          // Validation errors from Laravel
          setErrors(error.response.data.errors);
        } else {
          // Other API errors
          setErrors({ general: [error.response.data.message || 'Failed to set weekly limit.'] });
        }
      } else {
        setErrors({ general: ['Error connecting to the server.'] });
      }
      setTimeout(() => setErrors(null), 5000); // Clear errors after 5 seconds
    }
  };

  const remainingLimit = weeklyLimit - weeklySpent;

  return (
    <div className={styles.dashboardContainer}>
      {message && <div className={styles.successPopup}>{message}</div>}
      {errors && (
        <div className={styles.errorContainer}>
          {Object.keys(errors).map((key) => (
            <p key={key} className={styles.errorMessage}>
              {errors[key][0]}
            </p>
          ))}
        </div>
      )}

      <div className={styles.dashboardHeader}>
        <h1>Set Spending Limit</h1>
      </div>

      <div className={styles.setGoalGrid}>
        <div className={styles.leftColumn}>
          <form onSubmit={handleSetLimit} className={styles.transferForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="limit">Weekly Limit Amount (₱)</label>
              <input
                type="number"
                id="limit"
                placeholder="Enter weekly limit (0 for no limit)"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                className={styles.authInput} // Reusing authInput style if applicable
                required
              />
            </div>

            <button type="submit" className={styles.doneButton}>
              Set Weekly Limit
            </button>
          </form>
        </div>

        <div className={styles.rightColumn}>
          <div className={styles.transactionLimitsCard}>
            <h2>Current Weekly Limit</h2>
            <p><strong>Set Limit:</strong> ₱{weeklyLimit.toFixed(2)}</p>
            <p><strong>Spent This Week:</strong> ₱{weeklySpent.toFixed(2)}</p>
            <p><strong>Remaining This Week:</strong> ₱{remainingLimit.toFixed(2)}</p>
            {weeklyLimit > 0 && remainingLimit < 0 && (
              <p className={styles.overLimitWarning}>
                You are ₱{(-remainingLimit).toFixed(2)} over your weekly limit!
              </p>
            )}
            {weeklyLimit > 0 && remainingLimit >= 0 && remainingLimit <= weeklyLimit * 0.10 && ( // Example: warn if 90% spent
                <p className={styles.nearLimitWarning}>
                    You are nearing your weekly limit! Remaining: ₱{remainingLimit.toFixed(2)}
                </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetLimitComp;