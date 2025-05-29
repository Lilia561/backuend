import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OtherBanks.module.css';

function OtherBanks() {
  useEffect(() => {
    document.title = 'Other Banks | Wall-et';
  }, []);

  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Other Banks</h1>
      <p>Send money securely to any bank with ease!</p>
      <div className={styles.buttonGroup}>
        <button className={styles.button} onClick={() => navigate('/transfer/otherbanks/gcash')}>
          Gcash
        </button>
        <button className={styles.button} onClick={() => navigate('/transfer/otherbanks/paymaya')}>
          Paymaya
        </button>
        <button className={styles.button} onClick={() => navigate('/transfer')}>
          Back
        </button>
      </div>
    </div>
  );
}

export default OtherBanks;
