import React from "react";
import styles from "./DeleteGoalModal.module.css";

const DeleteGoalModal = ({ goal, onClose, onConfirm }) => {
  if (!goal) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Delete Goal</h3>
        <p>
          Are you sure you want to delete the goal for{" "}
          <strong>{goal.purpose}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={onConfirm}>
            Yes, Delete
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalModal;
