import React from 'react';
import { Link } from 'react-router-dom';
import styles from './History.module.css';

function History() {
  return (
    <div className={styles['history-card']}>
      <div className={styles['history-header']}>
        <h2 className={styles['history-cardTitle']}>History</h2>
        <Link to="/history" className={styles['view-history-btn']}>
          View Full History
        </Link>
      </div>

      <div className={styles['history-list']}>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>10/10/2025</span>
            <span className={`${styles['transaction-type']} grocery`}>GROCERY</span>
          </div>
          <span className={styles['pending']}>PENDING</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>10/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles.salary}`}>SALARY</span>
          </div>
          <span className={styles['transaction-amount']}>+₱300.00</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>09/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles['electric-bill']}`}>ELECTRIC BILL</span>
          </div>
          <span className={styles['transaction-amount']}>-₱120.00</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>08/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles.shopping}`}>SHOPPING</span>
          </div>
          <span className={styles['transaction-amount']}>-₱55.00</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>07/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles.food}`}>FOOD</span>
          </div>
          <span className={styles['transaction-amount']}>-₱25.00</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>06/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles.transfer}`}>TRANSFER</span>
          </div>
          <span className={styles['transaction-amount']}>-₱100.00</span>
        </div>
        <div className={styles['history-item']}>
          <div className={styles['transaction-details']}>
            <span>05/10/1999</span>
            <span className={`${styles['transaction-type']} ${styles.salary}`}>SALARY</span>
          </div>
          <span className={styles['transaction-amount']}>+₱350.00</span>
        </div>
      </div>
    </div>
  );
}

export default History;
