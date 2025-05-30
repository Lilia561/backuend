import React, { useState } from 'react';
import './BancNetTransferComp.css';
import '../GCashTransferComp/GcashTransferComp.css';


function BancNetTransferComp() {
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  const bankOptions = [
    "Select Bank", "BDO Unibank", "Bank of the Philippine Islands (BPI)",
    "Metrobank", "Land Bank of the Philippines", "Security Bank",
    "Philippine National Bank (PNB)", "China Banking Corporation", "UnionBank of the Philippines",
    "RCBC", "Other"
  ];
  const [selectedBank, setSelectedBank] = useState(bankOptions[0]);
  const [otherBankName, setOtherBankName] = useState('');


  const handleTransfer = (e) => {
    e.preventDefault();
    const finalBankName = selectedBank === "Other" ? otherBankName : selectedBank;

    if (!accountNumber || !finalBankName || !amount || finalBankName === "Select Bank") {
      setMessage('Please fill in all fields and select a valid bank.');
      return;
    }
     if (parseFloat(amount) <= 0) {
        setMessage('Amount must be greater than zero.');
        return;
    }
    // Basic account number validation (example: must be digits and certain length)
    if (!/^\d{10,16}$/.test(accountNumber)) {
        setMessage('Invalid account number format (10-16 digits).');
        return;
    }

    setMessage(`Initiating BancNet transfer of ₱${amount} to ${finalBankName} account ${accountNumber}`);
    setAccountNumber('');
    setAmount('');
    setSelectedBank(bankOptions[0]);
    setOtherBankName('');
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="transfer-section bancnet-section">
      <div className="section-header bancnet-header">
        <img src="https://via.placeholder.com/40x40/D32F2F/FFFFFF?text=B" alt="BancNet Logo" className="logo" />
        <h2>Bank Transfer</h2>
      </div>
      <form onSubmit={handleTransfer}>
        <div className="input-group">
          <label htmlFor="bancnet-bank">Bank:</label>
          <select
            id="bancnet-bank"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            required
          >
            {bankOptions.map(bank => <option key={bank} value={bank}>{bank}</option>)}
          </select>
        </div>

        {selectedBank === "Other" && (
          <div className="input-group">
            <label htmlFor="bancnet-other-bank">Specify Bank Name:</label>
            <input
              type="text"
              id="bancnet-other-bank"
              value={otherBankName}
              onChange={(e) => setOtherBankName(e.target.value)}
              placeholder="Enter bank name"
              required={selectedBank === "Other"}
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="bancnet-account">Account Number:</label>
          <input
            type="text" // Use text to allow for hyphens or other chars if banks use them
            pattern="\d*" // Suggests numeric input but doesn't strictly enforce on all browsers
            inputMode="numeric" // Shows numeric keyboard on mobile
            id="bancnet-account"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter account number"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="bancnet-amount">Amount (₱):</label>
          <input
            type="number"
            id="bancnet-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="transfer-button bancnet-button">
          Send via BancNet
        </button>
      </form>
      {message && <p className="transfer-message bancnet-message">{message}</p>}
    </div>
  );
}

export default BancNetTransferComp;
