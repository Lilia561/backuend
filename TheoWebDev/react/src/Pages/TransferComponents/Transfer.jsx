import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Transfer.module.css';

function Transfer() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Transfer | Wall-et';
  }, []);

  return (
    <div className={styles.dashboardRoot}>
      <div className={styles.authWrapper}>
        <div className={styles.container}>
          <h1 className={styles.heading}>Transfer Option</h1>
          <p>Send money securely to any bank with ease!</p>
          <div className={styles.buttonGroup}>
            <button className={styles.button} onClick={() => navigate('/transfer/wall-et-transfer')}>
              Wall-et
            </button>
            <button className={styles.button} onClick={() => navigate('/transfer/otherbanks')}>
              Other Banks
            </button>
            <button className={styles.button} onClick={() => navigate('/dashboard')}>
              Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Transfer;
