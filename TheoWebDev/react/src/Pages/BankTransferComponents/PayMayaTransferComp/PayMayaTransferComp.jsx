import React, { useState } from 'react';
// Assuming you'll use common styles from GcashTransfer.css or a shared file
// For this example, we'll just import its own CSS which can override/add specifics
import './PaymayaTransferComp.css';
import '../GCashTransferComp/GcashTransferComp.css';
// If you created a shared CSS (e.g., TransferSection.css), import it here
// import '../Shared/TransferSection.css';


function PaymayaTransferComp() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const handleTransfer = (e) => {
    e.preventDefault();
    if (!mobileNumber || !amount) {
      setMessage('Please fill in all fields.');
      return;
    }
    if (!/^(09)\d{9}$/.test(mobileNumber)) {
        setMessage('Invalid PayMaya mobile number format (e.g., 09XXXXXXXXX).');
        return;
    }
    if (parseFloat(amount) <= 0) {
        setMessage('Amount must be greater than zero.');
        return;
    }
    setMessage(`Initiating PayMaya transfer of ₱${amount} to ${mobileNumber}`);
    setMobileNumber('');
    setAmount('');
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="transfer-section paymaya-section">
      <div className="section-header paymaya-header">
        <img src="https://via.placeholder.com/40x40/2E7D32/FFFFFF?text=P" alt="PayMaya Logo" className="logo" />
        <h2>PayMaya Transfer</h2>
      </div>
      <form onSubmit={handleTransfer}>
        <div className="input-group">
          <label htmlFor="paymaya-number">Mobile Number:</label>
          <input
            type="tel"
            id="paymaya-number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            placeholder="09XXXXXXXXX"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="paymaya-amount">Amount (₱):</label>
          <input
            type="number"
            id="paymaya-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="transfer-button paymaya-button">
          Send via PayMaya
        </button>
      </form>
      {message && <p className="transfer-message paymaya-message">{message}</p>}
    </div>
  );
}

export default PaymayaTransferComp;
