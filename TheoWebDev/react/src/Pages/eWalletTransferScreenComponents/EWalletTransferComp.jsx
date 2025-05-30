import { useState } from 'react';
import './EWalletTransferComp.css';

function eWalletTransferComp() {
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !contactNumber || !amount) {
      setMessage('Please fill in Email, Contact Number, and Amount.');
      return;
    }
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
    }

    let successMsg = `Transferring ₱${amount} to ${email} / ${contactNumber}.`;
    if (purpose) {
      successMsg += ` Purpose: ${purpose}.`;
    }
    setMessage(successMsg);

    // Clear form fields after submission
    setEmail('');
    setContactNumber('');
    setAmount('');
    setPurpose('');
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
    </div>
  );
}

export default eWalletTransferComp;
