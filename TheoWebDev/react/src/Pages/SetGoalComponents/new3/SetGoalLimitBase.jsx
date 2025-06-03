import React, { useState } from 'react';
import styles from './SetGoalLimitBase.module.css';
import SetGoal from './SetGoalComp/SetGoal';
import SetLimits from './SetLimitsComp/SetLimits';
import { useNavigate } from 'react-router-dom';
import GoalPlanCircle from './CompGoalPlanCircle/GoalPlanCircle';

const SetGoalLimitBase = () => {
  const [selectedOption, setSelectedOption] = useState('SetGoal');
  const navigate = useNavigate();

  // Example values
  const progress = 60;
  const targetBalance = 10000;
  const currentBalance = 6000;

  const renderComponent = () => {
    switch (selectedOption) {
      case 'SetGoal':
        return <SetGoal />;
      case 'SetLimits':
        return <SetLimits />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>← Back</button>
        <h1 className={styles.title}>Set your Goal and Limit</h1>
      </header>

      <div className={styles.container}>
        <aside className={styles.sidebar}>
          {/* Add GoalPlanCircle */}
          <div className={styles.goalWrapper}>
            <GoalPlanCircle
              progress={progress}
              targetBalance={targetBalance}
              currentBalance={currentBalance}
            />
          </div>

          {/* Divider */}
          <hr className={styles.divider} />

          {/* Buttons */}
          <button
            className={`${styles.menuButton} ${selectedOption === 'SetGoal' ? `${styles.active} ${styles.SetGoal}` : ''}`}
            onClick={() => setSelectedOption('SetGoal')}
          >
            Set Goal
          </button>
          <button
            className={`${styles.menuButton} ${selectedOption === 'SetLimits' ? `${styles.active} ${styles.SetLimits}` : ''}`}
            onClick={() => setSelectedOption('SetLimits')}
          >
            Set Limits
          </button>
        </aside>

        <main className={`${styles.mainSection} ${styles[selectedOption]}`}>
          {renderComponent()}
        </main>
      </div>
    </div>
  );
};

export default SetGoalLimitBase;
