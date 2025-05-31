// DashboardCompAvailableBalance/AvailableBalance.jsx
import React from 'react';
import styles from './AvailableBalance.module.css';

function AvailableBalance({ money }) {
  return (
    <div className={styles.card}>
      <h2>Available Balance</h2>
      <p className={styles.balance}>
        ₱{money.toLocaleString(undefined, { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
}

export default AvailableBalance;
