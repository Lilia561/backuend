import React, { useState, useEffect } from "react";
import styles from "./DashboardSection.module.css";
import axiosClient from '../../axios'; // Import your Axios client

const DashboardSection = () => {
  const [totalUsers, setTotalUsers] = useState('...'); // Initialize with placeholder
  const [totalTransactions, setTotalTransactions] = useState('...'); // Initialize with placeholder
  const [pendingApprovals, setPendingApprovals] = useState('...'); // Initialize with placeholder
  const [error, setError] = useState(null); // State for error handling

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      const token = localStorage.getItem('ACCESS_TOKEN'); // Get token from local storage

      if (!token) {
        setError("Authentication token not found. Please log in as an admin.");
        return;
      }

      try {
        const response = await axiosClient.get('api/admin/dashboard-metrics', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the bearer token
          },
        });

        const data = response.data;
        setTotalUsers(data.totalUsers);
        setTotalTransactions(data.totalTransactions);
        setPendingApprovals(data.pendingApprovals);
        setError(null); // Clear any previous errors

      } catch (err) {
        console.error("Error fetching admin dashboard metrics:", err);
        if (err.response && err.response.status === 401) {
          setError("Unauthorized access. Please ensure you are logged in as an admin.");
          // Optionally redirect to login or show a specific message
        } else if (err.response && err.response.status === 403) {
          setError("Access Denied. You do not have permission to view this dashboard.");
        } else {
          setError("Failed to load dashboard metrics. Please try again.");
        }
        // Set placeholders or default values on error
        setTotalUsers('N/A');
        setTotalTransactions('N/A');
        setPendingApprovals('N/A');
      }
    };

    fetchAdminMetrics();
  }, []); // Empty dependency array means this runs once on component mount

  return (
    <div className={styles.adminSection}>
      <h2>Dashboard</h2>
      <p>
        Welcome to the admin dashboard! Key metrics and summaries will go here.
      </p>

      {error && <p className={styles.errorMessage}>{error}</p>} {/* Display error message */}

      <div className={styles.metricCards}>
        <div className={styles.card}>
          <h3>Total Users</h3>
          <p>{totalUsers}</p> {/* Display dynamic total users */}
        </div>
        <div className={styles.card}>
          <h3>Total Transactions</h3>
          <p>{totalTransactions}</p> {/* Display dynamic total transactions */}
        </div>
        <div className={styles.card}>
          <h3>Pending Approvals</h3>
          <p>{pendingApprovals}</p> {/* Display dynamic pending approvals */}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;