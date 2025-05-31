import { useState } from 'react';
<<<<<<< HEAD
import styles from './EWalletTransferComp.module.css';
import { useNavigate } from 'react-router-dom';

function EWalletTransferComp() {
  const navigate = useNavigate();
=======
import './EWalletTransferComp.css';

function eWalletTransferComp() {
>>>>>>> parent of 798b291 (Added sending of money)
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
<<<<<<< HEAD
=======
  
>>>>>>> parent of 798b291 (Added sending of money)

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !contactNumber || !amount) {
      setMessage('Please fill in Email, Contact Number, and Amount.');
      return;
    }
<<<<<<< HEAD
    if (!/\S+@\S+\.\S+/.test(email)) {
      setMessage('Please enter a valid email address.');
      return;
    }
    if (!/^(09)\d{9}$/.test(contactNumber)) {
      setMessage('Please enter a valid contact number (e.g., 09XXXXXXXXX).');
      return;
    }
    if (parseFloat(amount) <= 0) {
      setMessage('Amount must be greater than zero.');
      return;
=======
    // Basic email validation
    if (!/\S+@\S+\.\S+/.test(email)) {
        setMessage('Please enter a valid email address.');
        return;
    }
    // Basic contact number validation (e.g., 09XXXXXXXXX for PH)
    if (!/^(09)\d{9}$/.test(contactNumber)) {
        setMessage('Please enter a valid contact number (e.g., 09XXXXXXXXX).');
        return;
    }
    if (parseFloat(amount) <= 0) {
        setMessage('Amount must be greater than zero.');
        return;
>>>>>>> parent of 798b291 (Added sending of money)
    }

    let successMsg = `Transferring ₱${amount} to ${email} / ${contactNumber}.`;
    if (purpose) {
      successMsg += ` Purpose: ${purpose}.`;
    }
    setMessage(successMsg);

<<<<<<< HEAD
=======
    // Clear form fields after submission
>>>>>>> parent of 798b291 (Added sending of money)
    setEmail('');
    setContactNumber('');
    setAmount('');
    setPurpose('');
<<<<<<< HEAD
    setTimeout(() => setMessage(''), 7000);
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
=======
    setTimeout(() => setMessage(''), 7000); // Clear message after 7 seconds
  };

  return (
    <div className="ewallet-form-container">
      <div className="ewallet-header">
        <img src="https://placehold.co/40x40/008080/FFFFFF?text=EW" alt="E-Wallet Logo" className="ewallet-logo" />
        <h2>E-Wallet Transfer</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="ewallet-input-group">
          <label htmlFor="ewallet-email">Email Address:</label>
          <input
            type="email"
            id="ewallet-email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="juan.delacruz@example.com"
            required
          />
        </div>
        <div className="ewallet-input-group">
          <label htmlFor="ewallet-contact">Contact Number:</label>
          <input
            type="tel"
            id="ewallet-contact"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
            required
          />
        </div>
        <div className="ewallet-input-group">
          <label htmlFor="ewallet-amount">Amount (₱):</label>
          <input
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
        <div className="ewallet-input-group">
          <label htmlFor="ewallet-purpose">Purpose (Optional):</label>
          <input
            type="text"
            id="ewallet-purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            placeholder="e.g., Payment for goods"
          />
        </div>
        <button type="submit" className="ewallet-submit-button">
          Send Money
        </button>
      </form>
      {message && <p className="ewallet-feedback-message">{message}</p>}
>>>>>>> parent of 798b291 (Added sending of money)
    </div>
  );
}

export default eWalletTransferComp;
