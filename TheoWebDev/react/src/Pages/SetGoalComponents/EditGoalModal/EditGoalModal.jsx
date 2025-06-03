import React, { useState, useEffect } from 'react';
import styles from './EditGoalModal.module.css'; // Assuming you'll create/have this CSS module

const EditGoalModal = ({ goal, onClose, onSave }) => {
  // Local state for the form inputs, initialized with the passed goal data
  // 'description' from SetGoal.jsx maps to 'targetDate' in the backend
  // 'amount' from SetGoal.jsx maps to 'target_balance' in the backend
  const [editedGoal, setEditedGoal] = useState({
    id: goal.id,
    purpose: goal.purpose || '',
    // The 'description' field in SetGoal.jsx's form is used for targetDate.
    // We'll use 'targetDate' directly here as it's the actual data field.
    targetDate: goal.targetDate || '',
    amount: goal.targetAmount || '', // This is the target_balance from backend
  });

  // Effect to re-initialize modal state if the 'goal' prop changes
  // This is important if the modal is re-used for different goals without unmounting
  useEffect(() => {
    setEditedGoal({
      id: goal.id,
      purpose: goal.purpose || '',
      targetDate: goal.targetDate || '',
      amount: goal.targetAmount || '',
    });
  }, [goal]);

  // Handles changes to any input field in the modal
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedGoal((prev) => ({ ...prev, [name]: value }));
  };

  // Handles the save action, passing the edited data back to the parent
  const handleSave = () => {
    // Basic validation
    if (!editedGoal.purpose || !editedGoal.amount) {
      // Using alert for simplicity, consider a custom modal or toast notification
      alert('Please fill in both Purpose and Amount.');
      return;
    }

    // Prepare data to send to the backend, matching the backend schema
    const dataToSave = {
      id: editedGoal.id, // Ensure the ID is included for the PUT request
      purpose: editedGoal.purpose,
      target_balance: parseFloat(editedGoal.amount), // Convert amount to float for backend
      target_date: editedGoal.targetDate || null, // Send null if targetDate is empty
    };

    onSave(dataToSave); // Call the onSave prop provided by SetGoal.jsx
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}> {/* Using 'modal' class from your original snippet */}
        <h3>Edit Goal</h3>

        <label>Purpose:</label>
        <input
          type="text"
          name="purpose"
          value={editedGoal.purpose}
          onChange={handleChange}
        />

        <label>Target Balance (PHP):</label> {/* Changed label for clarity */}
        <input
          type="number"
          name="amount" // Name corresponds to 'amount' in editedGoal state
          value={editedGoal.amount}
          onChange={handleChange}
        />

        <label>Target Date (Optional):</label> {/* Changed label for clarity */}
        <input
          type="date"
          name="targetDate" // Name corresponds to 'targetDate' in editedGoal state
          value={editedGoal.targetDate}
          onChange={handleChange}
        />

        <div className={styles.modalActions}>
          <button onClick={handleSave} className={styles.saveBtn}>
            Save Changes
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
