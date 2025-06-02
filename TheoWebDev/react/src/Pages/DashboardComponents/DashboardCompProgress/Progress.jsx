import React, { useState, useEffect } from 'react';
import styles from './Progress.module.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import axiosClient from '../../axios';; // Import your Axios client

function Progress() {
  const [view, setView] = useState('daily');
  const [dailyData, setDailyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFinancialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Using axiosClient as seen in SignInComp.jsx
        // axiosClient is typically configured to include base URL and authentication headers
        const { data } = await axiosClient.get('api/user/financial-progress');

        // The backend should return data in the format:
        // {
        //   daily: [{ name: 'Mon', progress: 100 }, ...],
        //   weekly: [{ name: 'Week 1', progress: 90 }, ...],
        //   monthly: [{ name: 'Jan', progress: 80 }, ...],
        // }
        setDailyData(data.daily || []);
        setWeeklyData(data.weekly || []);
        setMonthlyData(data.monthly || []);

      } catch (err) {
        console.error("Failed to fetch financial data:", err);
        if (err.response) {
          // Axios error structure: err.response.data for server message
          setError(`Failed to load financial data: ${err.response.data.message || 'Server error'}. Please try again.`);
        } else if (err.request) {
          // No response from server (network error)
          setError("Network error: Could not reach the server. Please check your internet connection.");
        } else {
          // Other unexpected errors
          setError("An unexpected error occurred. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialData();
  }, []); // Empty dependency array means this effect runs once on component mount

  /**
   * Returns the appropriate data array based on the current view state.
   * @returns {Array} An array of data points for the Recharts LineChart.
   */
  const getData = () => {
    switch (view) {
      case 'weekly':
        return weeklyData;
      case 'monthly':
        return monthlyData;
      default: // 'daily'
        return dailyData;
    }
  };

  // Display loading indicator while data is being fetched
  if (loading) {
    return (
      <div className={styles['progress-card']}>
        <p>Loading progress data...</p>
      </div>
    );
  }

  // Display error message if data fetching failed
  if (error) {
    return (
      <div className={styles['progress-card']}>
        <p className={styles['error-message']}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles['progress-card']}>
      <div className={styles['progress-header']}>
        <h2>Progress</h2>
        <div className={styles['toggle-buttons']}>
          <button
            className={view === 'daily' ? styles.active : ''}
            onClick={() => setView('daily')}
          >
            Daily
          </button>
          <button
            className={view === 'weekly' ? styles.active : ''}
            onClick={() => setView('weekly')}
          >
            Weekly
          </button>
          <button
            className={view === 'monthly' ? styles.active : ''}
            onClick={() => setView('monthly')}
          >
            Monthly
          </button>
        </div>
      </div>

      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <LineChart data={getData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="progress"
              stroke="#29b6f6"
              strokeWidth={2}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Progress;
