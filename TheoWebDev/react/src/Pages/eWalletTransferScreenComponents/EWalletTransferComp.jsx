import { useState, useRef } from 'react';
import styles from './EWalletTransferComp.module.css';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axios';

function EWalletTransferComp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [, setErrors] = useState(null); // For displaying validation errors


  const emailRef = useRef();
  const contactNumberRef = useRef();
  const amountRef = useRef();
  const purposeRef = useRef();


  /**
   * Handles the form submission for E-Wallet transfer.
   * Constructs the payload and sends it to the backend API.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh

    setMessage(''); // Clear previous messages
    setErrors(null); // Clear previous errors

    // Determine the recipient identifier. Prioritize contact number if provided,
    // otherwise use email. Your backend handles either.
    const recipientIdentifier = contactNumberRef.current.value || emailRef.current.value;

    // Construct the payload for the API call
    const payload = {
      recipient_identifier: recipientIdentifier,
      amount: parseFloat(amountRef.current.value), // Convert amount to a number
      purpose: purposeRef.current.value,
    };

    // Basic client-side validation (optional, but good practice)
    if (!payload.recipient_identifier) {
      setErrors({ general: ['Please provide either an email or a contact number for the recipient.'] });
      return;
    }
    if (isNaN(payload.amount) || payload.amount <= 0) {
      setErrors({ general: ['Please enter a valid amount greater than 0.'] });
      return;
    }

    try {
      // Get CSRF cookie if your Laravel setup requires it (Sanctum)
      await axiosClient.get('/sanctum/csrf-cookie');

      // Send the money transfer request to the backend
      // The endpoint is '/e-wallet/transfer' as defined in your api.php
      const { data } = await axiosClient.post('api/e-wallet/transfer', payload);

      // On successful transfer
      setMessage(data.message || 'Money sent successfully!');
      // Optionally clear form fields after successful submission
      setEmail('');
      setContactNumber('');
      setAmount('');
      setPurpose('');
      console.log('Transfer successful:', data);

    } catch (error) {
      // Handle transfer errors
      if (error.response) {
        // Server responded with a status other than 2xx
        if (error.response.status === 422) {
          // Validation errors from Laravel
          setErrors(error.response.data.errors);
          console.error('Validation errors:', error.response.data.errors);
        } else if (error.response.status === 401) {
          // Unauthorized (e.g., sender not authenticated)
          setMessage('Error: You are not authenticated. Please log in.');
          console.error('Unauthorized:', error.response.data.message);
        } else if (error.response.status === 400) {
          // Bad Request (e.g., insufficient balance, self-transfer)
          setMessage(`Error: ${error.response.data.message}`);
          console.error('Bad Request:', error.response.data.message);
        } else if (error.response.status === 404) {
          // Recipient not found
          setMessage(`Error: ${error.response.data.message}`);
          console.error('Recipient not found:', error.response.data.message);
        } else {
          // Other server errors
          setMessage('An unexpected error occurred during transfer. Please try again.');
          console.error('Server error:', error.response.data.message);
        }
      } else if (error.request) {
        // The request was made but no response was received (e.g., network error)
        setMessage('Network error. Please check your internet connection.');
        console.error('Network error:', error.request);
      } else {
        // Something else happened while setting up the request
        setMessage('An unknown error occurred. Please try again.');
        console.error('Error:', error.message);
      }
    }
  };

  return (
    <div className={styles.dashboardRoot}>
      <div className={styles.authWrapper}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          ←Back
        </button>
        <div className={styles.ewalletFormContainer}>
          <div className={styles.ewalletHeader}>
            <img
              src="https://placehold.co/40x40/008080/FFFFFF?text=EW"
              alt="E-Wallet Logo"
              className={styles.ewalletLogo}
            />
            <h2>E-Wallet Transfer</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className={styles.ewalletInputGroup}>
              <label htmlFor="ewallet-email">Email Address:</label>
              <input
                ref = {emailRef}
                type="email"
                id="ewallet-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="juan.delacruz@example.com"
                required
              />
            </div>
            <div className={styles.ewalletInputGroup}>
              <label htmlFor="ewallet-contact">Contact Number:</label>
              <input
                ref = {contactNumberRef}
                type="tel"
                id="ewallet-contact"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="09XXXXXXXXX"
                required
              />
            </div>
            <div className={styles.ewalletInputGroup}>
              <label htmlFor="ewallet-amount">Amount (₱):</label>
              <input
                ref = {amountRef}
                type="number"
                id="ewallet-amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className={styles.ewalletInputGroup}>
              <label htmlFor="ewallet-purpose">Purpose (Optional):</label>
              <input
                ref={purposeRef}
                type="text"
                id="ewallet-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="e.g., Payment for goods"
              />
            </div>
            <button type="submit" className={styles.ewalletSubmitButton}>
              Send Money
            </button>
          </form>
          {message && <p className={styles.ewalletFeedbackMessage}>{message}</p>}
        </div>
      </div>
    </div>
  );
}

export default EWalletTransferComp;
