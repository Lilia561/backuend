import React from "react";
import styles from "./EditUserModal.module.css";

const EditUserModal = ({ user, onClose, onSave, onChange }) => {
  if (!user) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit User</h3>

        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={user.name || ''} // Ensure default empty string for controlled component
          onChange={onChange}
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={user.email || ''} // Ensure default empty string
          onChange={onChange}
        />

        <label htmlFor="contact_number">Contact Number:</label> {/* Changed name to contact_number */}
        <input
          type="text"
          id="contact_number"
          name="contact_number" // Changed name to contact_number
          value={user.contact_number || ''} // Ensure default empty string, use contact_number
          onChange={onChange}
        />


        {/* Account Activity Status (active, inactive) */}
        <label htmlFor="account_status">Account Activity Status:</label>
        <select
          id="account_status"
          name="account_status"
          value={user.account_status || 'active'} // Default to 'active' if not set
          onChange={onChange}
        >
          <option value="active">Active</option>
          <option value="inactive">Deactivated</option>
        </select>

        {/* Money Field */}
        <label htmlFor="current_money">Money:</label>
        <input
          type="number" // Use type="number" for money
          id="current_money"
          name="current_money"
          value={user.current_money || 0} // Default to 0, ensure numeric value
          onChange={onChange}
          step="0.01" // Allow decimal values for currency
        />

        {/* Role Field */}
        <label htmlFor="role">Role:</label>
        <select
          id="role"
          name="role"
          value={user.role || 'user'} // Default to 'user'
          onChange={onChange}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
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
