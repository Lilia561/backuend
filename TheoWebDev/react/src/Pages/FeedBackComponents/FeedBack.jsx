import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Feedback.module.css';

function Feedback() {
  useEffect(() => {
      document.title = 'FeedBack | Wall-et';
    }, []);

  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    setSubmitted(true);
    setFormData({ name: '', message: '' });

    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleBack = () => {
    navigate('/'); // Go back to the previous page
  };

  return (
    <div className={styles.feedbackContainer}>
      <button className={styles.backButton} onClick={handleBack}>
        ← Back
      </button>

      <h2 className={styles.feedbackTitle}>We’d Love Your Feedback</h2>
      <form className={styles.feedbackForm} onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <label htmlFor="name">Your Email</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your Email here"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
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
        <button className={styles.submitButton} type="submit">Submit</button>
        {submitted && <p className={styles.successMessage}>Thank you for your feedback!</p>}
      </form>
    </div>
  );
}

export default Feedback;
