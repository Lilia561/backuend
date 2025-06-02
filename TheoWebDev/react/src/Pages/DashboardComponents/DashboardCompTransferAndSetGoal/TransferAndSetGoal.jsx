import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './TransferAndSetGoal.module.css'; // ⬅ Import CSS module

function TransferAndSetGoal() {
  const navigate = useNavigate();

  return (
    <div className={styles.transferAndSetGoal}>
      <button
        className={styles.transferButton}
        onClick={() => navigate('/transfer')}
      >
        Transfer
      </button>
      <button
        className={styles.setGoalButton}
        onClick={() => navigate('/setgoal')}
      >
        Set Goal and Limit
      </button>
      <button
        className={styles.adminPageButton}
        onClick={() => navigate('/admin')}
      >
        Admin
      </button>
    </div>
  );
}

export default TransferAndSetGoal;
