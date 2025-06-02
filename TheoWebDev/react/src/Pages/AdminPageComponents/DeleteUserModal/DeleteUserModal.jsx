import React from "react";
import styles from "./DeleteUserModal.module.css";

const DeleteUserModal = ({ user, onClose, onConfirm }) => {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Delete User</h3>
        <p>Are you sure you want to delete the account for <strong>{user.name}</strong> (ID: {user.id})?</p> {/* Added user ID for clarity */}
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

export default DeleteUserModal;
