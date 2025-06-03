import React from "react";
import styles from "./DeleteGoalModal.module.css"; // Assuming you'll create/have this CSS module

const DeleteGoalModal = ({ goal, onClose, onConfirm }) => {
  if (!goal) return null;

  // Handles the confirmation of deletion
  const handleDelete = () => {
    onConfirm(goal.id); // Call the onConfirm prop with the goal's ID
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}> {/* Using 'modal' class from your original snippet */}
        <h3>Delete Goal</h3>
        <p>
          Are you sure you want to delete the goal for{" "}
          <strong>{goal.purpose}</strong>?
        </p>
        <div className={styles.modalActions}>
          <button className={styles.confirmBtn} onClick={handleDelete}> {/* Using 'confirmBtn' class */}
            Yes, Delete
          </button>
          <button className={styles.cancelBtn} onClick={onClose}> {/* Using 'cancelBtn' class */}
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteGoalModal;
