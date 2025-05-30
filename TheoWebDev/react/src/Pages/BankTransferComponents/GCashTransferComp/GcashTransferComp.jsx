import React, { useState } from 'react';
import './GcashTransferComp.css';

function GcashTransferComp() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!mobileNumber || !amount) {
      setMessage('Please fill in all fields.');
      return;
    }
    // Basic validation for mobile number (example)
    if (!/^(09)\d{9}$/.test(mobileNumber)) {
        setMessage('Invalid GCash mobile number format (e.g., 09XXXXXXXXX).');
        return;
    }
    if (parseFloat(amount) <= 0) {
        setMessage('Amount must be greater than zero.');
        return;
    }
    setMessage(`Initiating GCash transfer of ₱${amount} to ${mobileNumber}`);
    // In a real app, you'd call an API here.
    // For demo, clear fields after "transfer"
    setMobileNumber('');
    setAmount('');
    // Optionally, clear message after some time
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="transfer-section gcash-section">
      <div className="section-header gcash-header">
        <img src="https://www.pinterest.com/pin/brand-refresh-2019-gcash--399272323216692375/" alt="GCash Logo" className="logo" />
        <h2>GCash Transfer</h2>
      </div>
      <form onSubmit={handleTransfer}>
        <div className="input-group">
          <label htmlFor="gcash-number">Mobile Number:</label>
          <input
            type="tel"
            id="gcash-number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="gcash-amount">Amount (₱):</label>
          <input
            type="number"
            id="gcash-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="transfer-button gcash-button">
          Send via GCash
        </button>
      </form>
      {message && <p className="transfer-message gcash-message">{message}</p>}
    </div>
  );
}

export default GcashTransferComp;