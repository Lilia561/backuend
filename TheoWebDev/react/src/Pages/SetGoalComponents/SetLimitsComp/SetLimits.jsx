// SetLimits.jsx
import React, { useState, useEffect } from 'react';
import styles from './SetLimits.module.css';
import GoalPlanner from '../CompGoalPlanList/GoalPlanList'; // Assuming GoalPlanner is still used
// TransactionLimits is for the dashboard, not this page, so it's not directly used here
import axiosClient from '../../axios'; // Your Axios client for API calls

const SetLimitComp = () => {
  useEffect(() => {
    document.title = 'Set Limit | Wall-et';
  }, []);

  const [weeklyLimitAmount, setWeeklyLimitAmount] = useState(''); // Renamed for clarity for weekly limit input
  const [categoryName, setCategoryName] = useState(''); // New state for category name
  const [categoryLimitAmount, setCategoryLimitAmount] = useState(''); // New state for category limit amount

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState(null);

  const [currentWeeklyLimit, setCurrentWeeklyLimit] = useState(0); // For displaying the main weekly limit
  const [weeklySpent, setWeeklySpent] = useState(0); // For displaying weekly spent

  const [categoryLimits, setCategoryLimits] = useState([]); // New state to store fetched category limits


  // --- Fetching Data Functions ---

  // Function to fetch the current weekly limit and spent amount
  const fetchWeeklyLimit = async () => {
    setErrors(null);
    try {
      const response = await axiosClient.get('api/user/weekly-limit');
      setCurrentWeeklyLimit(response.data.weekly_limit);
      setWeeklySpent(response.data.weekly_spent_amount);
    } catch (error) {
      console.error('Error fetching weekly limit:', error);
      setErrors({ general: [error.response?.data?.message || 'Failed to fetch weekly limit.'] });
    }
  };

  // Function to fetch all category limits for the user
  const fetchCategoryLimits = async () => {
    setErrors(null);
    try {
      const response = await axiosClient.get('api/user/category-limits');
      setCategoryLimits(response.data.category_limits);
    } catch (error) {
      console.error('Error fetching category limits:', error);
      setErrors({ general: [error.response?.data?.message || 'Failed to fetch category limits.'] });
    }
  };

  // --- useEffect Hooks for Initial Data Fetch ---
  useEffect(() => {
    fetchWeeklyLimit();
    fetchCategoryLimits();
  }, []);


  // --- Handlers for Setting Limits ---

  // Handle setting the overall weekly limit
  const handleSetWeeklyLimit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setMessage('');

    const limitValue = parseFloat(weeklyLimitAmount);
    if (isNaN(limitValue) || limitValue < 0) {
      setErrors({ weekly_limit: ['Please enter a valid non-negative amount for weekly limit.'] });
      return;
    }

    try {
      const response = await axiosClient.post('api/user/set-weekly-limit', { weekly_limit: limitValue });
      setMessage(response.data.message);
      setWeeklyLimitAmount(''); // Clear input
      fetchWeeklyLimit(); // Refresh displayed weekly limit
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error setting weekly limit:', error);
      setErrors({ general: [error.response?.data?.message || 'Failed to set weekly limit.'] });
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      setTimeout(() => setErrors(null), 5000);
    }
  };

  // Handle setting a new category limit
  const handleSetCategoryLimit = async (e) => {
    e.preventDefault();
    setErrors(null);
    setMessage('');

    const limitValue = parseFloat(categoryLimitAmount);
    if (!categoryName.trim()) {
      setErrors({ category_name: ['Category name cannot be empty.'] });
      return;
    }
    if (isNaN(limitValue) || limitValue < 0) {
      setErrors({ limit_amount: ['Please enter a valid non-negative amount for category limit.'] });
      return;
    }

    try {
      const response = await axiosClient.post('api/user/set-category-limit', {
        category_name: categoryName,
        limit_amount: limitValue,
      });
      setMessage(response.data.message);
      setCategoryName(''); // Clear input
      setCategoryLimitAmount(''); // Clear input
      fetchCategoryLimits(); // Refresh displayed category limits
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error setting category limit:', error);
      setErrors({ general: [error.response?.data?.message || 'Failed to set category limit.'] });
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors);
      }
      setTimeout(() => setErrors(null), 5000);
    }
  };


  const remainingWeeklyLimit = currentWeeklyLimit - weeklySpent;

  // Placeholder for GoalPlanner data - still fetch from backend
  const goalProgress = 49;
  const targetBalance = 1000;
  const currentBalance = 510; // Assuming this is remaining goal, adjust as per your GoalPlanner
  const goals = [
    { name: 'Camera', targetAmount: 2400 },
    { name: 'Others', targetAmount: 150 },
  ];

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
        {/* Left Column: Set Weekly Limit Form */}
        <div className={styles.leftColumn}>
          <h2>Set Overall Weekly Limit</h2>
          <form onSubmit={handleSetWeeklyLimit} className={styles.transferForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="weeklyLimitInput">Weekly Limit Amount (₱)</label>
              <input
                type="number"
                id="weeklyLimitInput"
                placeholder="Enter weekly limit (0 for no limit)"
                value={weeklyLimitAmount}
                onChange={(e) => setWeeklyLimitAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.doneButton}>
              Set Weekly Limit
            </button>
          </form>

          <hr className={styles.divider} /> {/* Visual separator */}

          {/* New Section: Set Category Limit Form */}
          <h2>Set Category Limit</h2>
          <form onSubmit={handleSetCategoryLimit} className={styles.transferForm}>
            <div className={styles.inputGroup}>
              <label htmlFor="categoryNameInput">Category Name</label>
              <input
                type="text"
                id="categoryNameInput"
                placeholder="e.g., Food, Shopping"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="categoryLimitInput">Limit Amount (₱)</label>
              <input
                type="number"
                id="categoryLimitInput"
                placeholder="Enter limit for this category"
                value={categoryLimitAmount}
                onChange={(e) => setCategoryLimitAmount(e.target.value)}
                required
              />
            </div>
            <button type="submit" className={styles.doneButton}>
              Set Category Limit
            </button>
          </form>
        </div>

        {/* Right Column: Display Current Limits and Goals */}
        <div className={styles.rightColumn}>
          {/* Current Weekly Limit Display */}
          <div className={styles.transactionLimitsCard}>
            <h2>Current Weekly Limit</h2>
            <p>
              <strong>Set Limit:</strong> ₱<span className={styles.amountValue}>{currentWeeklyLimit.toFixed(2)}</span>
            </p>
            <p>
              <strong>Spent This Week:</strong> ₱<span className={styles.amountValue}>{weeklySpent.toFixed(2)}</span>
            </p>
            <p>
              <strong>Remaining This Week:</strong> ₱<span className={styles.amountValue}>{remainingWeeklyLimit.toFixed(2)}</span>
            </p>
            {currentWeeklyLimit > 0 && remainingWeeklyLimit < 0 && (
              <p className={styles.overLimitWarning}>
                You are ₱{(-remainingWeeklyLimit).toFixed(2)} over your weekly limit!
              </p>
            )}
            {currentWeeklyLimit > 0 && remainingWeeklyLimit >= 0 && remainingWeeklyLimit <= currentWeeklyLimit * 0.10 && (
                <p className={styles.nearLimitWarning}>
                    You are nearing your weekly limit! Remaining: ₱{remainingWeeklyLimit.toFixed(2)}
                </p>
            )}
          </div>

          {/* Display Category Limits */}
          <div className={styles.categoryLimitsDisplayCard}>
            <h2>Limits by Category</h2>
            {categoryLimits.length > 0 ? (
              <div className={styles.categoryLimitList}>
                {categoryLimits.map((limit) => (
                  <div key={limit.id} className={styles.categoryLimitItem}>
                    <p className={styles.categoryName}>{limit.category_name}</p>
                    <div className={styles.progressBarContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${Math.min(100, limit.progressPercentage)}%` }}
                        ></div>
                    </div>
                    <p className={styles.categoryAmounts}>
                      ₱{limit.current_spent_amount.toFixed(2)} / ₱{limit.limit_amount.toFixed(2)}
                    </p>
                    {limit.remaining < 0 && limit.limit_amount > 0 && (
                        <p className={styles.categoryOverLimit}>
                            Over by ₱{(-limit.remaining).toFixed(2)}
                        </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No category limits set yet. Add one above!</p>
            )}
          </div>

          <GoalPlanner
            progress={goalProgress}
            targetBalance={targetBalance}
            currentBalance={currentBalance}
            goalDetails={goals}
          />
        </div>
      </div>
    </div>
  );
};

export default SetLimitComp;