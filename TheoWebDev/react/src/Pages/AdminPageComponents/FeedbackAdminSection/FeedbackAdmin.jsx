import React, { useState, useEffect, useCallback } from 'react';
import axiosClient from '../../axios'; // Your Axios client for API calls
import styles from './FeedbackAdmin.module.css'; // Import the CSS module

function FeedbackAdmin() {
  // State to store the list of feedback messages
  const [feedbackList, setFeedbackList] = useState([]);
  // State to manage loading status during API calls
  const [loading, setLoading] = useState(true);
  // State to store any error messages from API calls
  const [error, setError] = useState(null);
  // State for the search term entered by the admin
  const [searchTerm, setSearchTerm] = useState('');

  // Function to fetch feedback data from the backend
  const fetchFeedback = useCallback(async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    try {
      // Fetch CSRF cookie first (important for Laravel Sanctum)
      await axiosClient.get('/sanctum/csrf-cookie');
      // Make the API call to get all feedback, passing the search term as a query parameter
      const response = await axiosClient.get('api/admin/feedback', {
        params: { search: searchTerm }
      });
      // Update the feedback list with the data from the response
      setFeedbackList(response.data.feedback);
      console.log('Feedback fetched successfully:', response.data.feedback);
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        // Server responded with a status other than 2xx
        console.error('Error fetching feedback:', err.response.data);
        setError(err.response.data.message || 'Failed to fetch feedback.');
      } else if (err.request) {
        // Request was made but no response was received
        console.error('No response received:', err.request);
        setError('Network error: No response from server.');
      } else {
        // Something else happened while setting up the request
        console.error('Error setting up request:', err.message);
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false); // Set loading to false after fetch attempt
    }
  }, [searchTerm]); // Re-run fetchFeedback when searchTerm changes

  // useEffect hook to call fetchFeedback when the component mounts or searchTerm changes
  useEffect(() => {
    document.title = 'Admin Feedback | Wall-et'; // Set page title
    fetchFeedback(); // Initial fetch
  }, [fetchFeedback]); // Dependency array includes fetchFeedback to prevent infinite loops

  // Handle changes in the search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value); // Update the search term state
  };

  return (
    <div className={styles.feedbackAdminRoot}>
      <h1 className={styles.feedbackAdminTitle}>User Feedback</h1>

      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by message or user name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {/* You can add filter buttons here if needed, e.g., filter by date, status */}
      </div>

      {loading && <p className={styles.loadingMessage}>Loading feedback...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!loading && !error && feedbackList.length === 0 && (
        <p className={styles.noFeedbackMessage}>No feedback found.</p>
      )}

      <div className={styles.feedbackList}>
        {!loading && !error && feedbackList.map((feedback) => (
          <div key={feedback.id} className={styles.feedbackItem}>
            <p className={styles.feedbackMessage}>{feedback.message}</p>
            <div className={styles.feedbackMeta}>
              {/* Display user name if available, otherwise "Anonymous" */}
              <span className={styles.feedbackUser}>
                By: {feedback.user ? feedback.user.name : 'Anonymous'}
              </span>
              {/* Display the creation timestamp */}
              <span className={styles.feedbackDate}>
                On: {new Date(feedback.created_at).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FeedbackAdmin;
