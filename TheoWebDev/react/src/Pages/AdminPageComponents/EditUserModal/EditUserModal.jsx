import React from "react";
import styles from "./EditUserModal.module.css";

const EditUserModal = ({ user, onClose, onSave, onChange }) => {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit User</h3>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={onChange}
        />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={onChange}
        />

        <label>Contact:</label>
        <input
          type="text"
          name="contact"
          value={user.contact}
          onChange={onChange}
        />

        <label>Status:</label>
        <select name="status" value={user.status} onChange={onChange}>
          <option value="Activated">Activated</option>
          <option value="Deactivated">Deactivated</option>
        </select>

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

export default EditUserModal;
