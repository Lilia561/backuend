import React, { useState, useEffect } from 'react';
import styles from './TransactionLimits.module.css';
import axiosClient from '../../axios'; // Import your Axios client

function TransactionLimits() {
  const [weeklyLimit, setWeeklyLimit] = useState(0);
  const [weeklySpent, setWeeklySpent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyLimitData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get('api/user/weekly-limit'); // This is the same endpoint we used for SetLimits
        setWeeklyLimit(response.data.weekly_limit);
        setWeeklySpent(response.data.weekly_spent_amount);
      } catch (err) {
        console.error('Error fetching weekly limit data:', err);
        setError(err.response?.data?.message || 'Failed to load transaction limits.');
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyLimitData();
  }, []); // Empty dependency array means this runs once on mount

  const remainingThisWeek = weeklyLimit - weeklySpent;

  if (loading) {
    return (
      <div className={styles.transactionLimitsCard}>
        <h2>Transaction Limits</h2>
        <p>Loading limits...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.transactionLimitsCard}>
        <h2>Transaction Limits</h2>
        <p className={styles.errorMessage}>{error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  return (
    <div className={styles.transactionLimitsCard}>
      <h2>Transaction Limits</h2>
      <p>
        <strong>Remaining this week:</strong> ₱
        <span className={styles.amountValue}>
          {remainingThisWeek.toFixed(2)}
        </span>
      </p>
      <p>
        <strong>Weekly Limit:</strong> ₱
        <span className={styles.amountValue}>
          {weeklyLimit.toFixed(2)}
        </span>
      </p>
      {weeklyLimit > 0 && remainingThisWeek < 0 && (
        <p className={styles.overLimitWarning}>
          You are ₱{(-remainingThisWeek).toFixed(2)} over your weekly limit!
        </p>
      )}
      {weeklyLimit > 0 && remainingThisWeek >= 0 && remainingThisWeek <= weeklyLimit * 0.10 && (
          <p className={styles.nearLimitWarning}>
              You are nearing your weekly limit! Remaining: ₱{remainingThisWeek.toFixed(2)}
          </p>
      )}
    </div>
  );
}

export default TransactionLimits;