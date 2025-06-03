
import styles from './SetGoal.module.css';

import SetGoalLimitWrapper from './SetGoalLimitWrapper/SetGoalLimitWrapper';
import SetGoalLimitScreen from './SetGoalLimitScreen/SetGoalLimitScreen';

function SetGoal() {
  return (
    <div className={styles.wrapper}>
      <SetGoalLimitWrapper>
        <SetGoalLimitScreen />
      </SetGoalLimitWrapper>
    </div>
  );
}

export default SetGoal;
