import React, { useState, useEffect } from "react";
import styles from "./EditGoalModal.module.css";

const EditGoalModal = ({ goal, onClose, onSave, onRequestDelete }) => {
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (goal) {
      setPurpose(goal.purpose || "");
      setDescription(goal.description || "");
      setAmount(goal.amount || "");
    }
  }, [goal]);

  if (!goal) return null;

  const handleSave = () => {
    if (!purpose || !amount || parseFloat(amount) <= 0) return;

    onSave({
      ...goal,
      purpose,
      description,
      amount: parseFloat(amount),
    });
  };

  const handleDeleteClick = () => {
    // Call parent to open DeleteGoalModal
    onRequestDelete(goal);
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Edit Goal</h3>

        <div className={styles.inputGroup}>
          <label>Purpose</label>
          <input
            type="text"
            name="purpose"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Description</label>
          <textarea
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>Target Amount (₱)</label>
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.modalActions}>
          <button className={styles.saveBtn} onClick={handleSave}>
            Save Changes
          </button>
          <button className={styles.deleteBtn} onClick={handleDeleteClick}>
            Delete Goal
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;
