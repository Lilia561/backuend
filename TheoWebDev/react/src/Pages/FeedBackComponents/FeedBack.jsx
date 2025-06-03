import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Feedback.module.css';
import axiosClient from '../axios';

function Feedback() {
  useEffect(() => {
      document.title = 'FeedBack | Wall-et';
    }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null); // State to hold API errors

  // Handles changes to the textarea input
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setSubmitted(false);
    setError(null);

    try {
      // Manually retrieve the ACCESS_TOKEN from localStorage
      const token = localStorage.getItem('ACCESS_TOKEN');

      // If no token is found, set an error and stop the submission
      if (!token) {
        setError('You must be logged in to submit feedback. Please sign in.');
        return;
      }

      // Fetch CSRF cookie first (important for Laravel Sanctum)
      await axiosClient.get('/sanctum/csrf-cookie');

      // Send the feedback message to the backend, explicitly adding the Authorization header
      const response = await axiosClient.post('api/feedback', {
        message: formData.message,
      }, {
        // Explicitly add the Authorization header here
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Feedback submitted successfully:', response.data);
      setSubmitted(true);
      setFormData({ message: '' });

      setTimeout(() => setSubmitted(false), 3000);

    } catch (err) {
      if (err.response) {
        if (err.response.status === 422 && err.response.data.errors && err.response.data.errors.message) {
          setError(err.response.data.errors.message[0]);
        } else if (err.response.status === 401) {
          setError('You must be logged in to submit feedback.');
          // Optionally, redirect to login if 401 occurs due to expired/invalid token
          // navigate('/login');
        } else {
          setError(err.response.data.message || 'Failed to submit feedback. Please try again.');
        }
        console.error('Error response:', err.response.data);
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('Network error: No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  return (
    <div className={styles.dashboardRoot}>
      <div className={styles.authWrapper}>
        <div className={styles.feedbackContainer}>
          <button className={styles.backButton} onClick={handleBack}>
            ← Back
          </button>

          <h2 className={styles.feedbackTitle}>We’d Love Your Feedback</h2>
          <form className={styles.feedbackForm} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label htmlFor="message">Your Feedback</label>
              <textarea
                name="message"
                id="message"
                rows="4"
                placeholder="Write your thoughts here..."
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            {error && <p className={styles.errorMessage}>{error}</p>}
            <button className={styles.submitButton} type="submit">Submit</button>
            {submitted && <p className={styles.successMessage}>Thank you for your feedback!</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
