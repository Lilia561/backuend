import React, { useState } from "react";
import styles from "./AddGoalModal.module.css";

const AddGoalModal = ({ onClose, onAdd }) => {
  const [purpose, setPurpose] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const handleAdd = () => {
    if (!purpose || !amount || parseFloat(amount) <= 0) return;

    onAdd({
      id: Date.now(), // simple unique id based on timestamp
      purpose,
      description,
      amount: parseFloat(amount),
    });
    onClose(); // close modal after adding
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Add New Goal</h3>

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
          <button className={styles.saveBtn} onClick={handleAdd}>
            Add Goal
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddGoalModal;
