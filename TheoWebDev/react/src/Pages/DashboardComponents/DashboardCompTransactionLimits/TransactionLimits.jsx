import React from 'react';
import styles from './TransactionLimits.module.css'; // 👈 Import the CSS module

function TransactionLimits() {
  return (
    <div className={styles.transactionLimitsCard}>
      <h2>Transaction Limits</h2>
      <p>Remaining this week:</p>
      <p>Weekly Limit:</p>
    </div>
  );
}

export default TransactionLimits;
