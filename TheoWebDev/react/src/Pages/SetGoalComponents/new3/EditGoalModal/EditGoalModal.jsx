import React from "react";
import styles from "./EditGoalModal.module.css"; // Reusing same styles

const EditGoalModal = ({ goal, onClose, onSave, onChange }) => {
  if (!goal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Goal</h3>

        <label>Purpose:</label>
        <input
          type="text"
          name="purpose"
          value={goal.purpose}
          onChange={onChange}
        />

        <label>Description:</label>
        <input
          type="text"
          name="description"
          value={goal.description}
          onChange={onChange}
        />

        <label>Amount:</label>
        <input
          type="number"
          name="amount"
          value={goal.amount}
          onChange={onChange}
        />

        <div className={styles.modalActions}>
          <button onClick={onSave} className={styles.saveBtn}>
            Save
          </button>
          <button onClick={onClose} className={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;
