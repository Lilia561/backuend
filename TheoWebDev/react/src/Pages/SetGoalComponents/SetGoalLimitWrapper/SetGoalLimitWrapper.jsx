import React from 'react';
import styles from './SetGoalLimitWrapper.module.css';

function SetGoalLimitWrapper({ children }) {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
}

export default SetGoalLimitWrapper;
