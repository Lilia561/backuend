import React, { useState } from "react";
import styles from "./SetGoal.module.css";
import GearIcon from "./GearIcon";
import DeleteGoalModal from "../DeleteGoalModal/DeleteGoalModal";
import EditGoalModal from "../EditGoalModal/EditGoalModal";

const SetGoal = () => {
  const [goal, setGoal] = useState({ purpose: "", description: "", amount: "" });
  const [hasSavedGoal, setHasSavedGoal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // Modals visibility states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (goal.purpose && goal.description && goal.amount) {
      setHasSavedGoal(true);
      setIsAdding(false);
    }
  };

  const handleCancel = () => {
    setGoal({ purpose: "", description: "", amount: "" });
    setIsAdding(false);
  };

  // Save edited goal from modal
  const handleEditSave = () => {
    if (goal.purpose && goal.description && goal.amount) {
      setHasSavedGoal(true);
      setShowEditModal(false);
    }
  };

  // Confirm delete goal
  const handleDeleteConfirm = () => {
    setGoal({ purpose: "", description: "", amount: "" });
    setHasSavedGoal(false);
    setShowDeleteModal(false);
  };

  return (
    <div className={styles.goalSection}>
      <div className={styles.headerRow}>
        <h2>Set Financial Goals</h2>
        <div className={styles.topIcons}>
          <button
            className={`${styles.gearBtn} ${hasSavedGoal ? styles.active : styles.inactive}`}
            title="Edit Goal"
            disabled={!hasSavedGoal}
            onClick={() => setShowEditModal(true)}
          >
            <GearIcon />
          </button>
          <button
            className={`${styles.deleteBtn} ${hasSavedGoal ? styles.active : styles.inactive}`}
            title="Delete Goal"
            disabled={!hasSavedGoal}
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <p>Track, edit, and manage your financial goals.</p>

      {!isAdding && !hasSavedGoal && (
        <button className={styles.addBtn} onClick={() => setIsAdding(true)}>
          + Add Goal
        </button>
      )}

      {isAdding && (
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="purpose">Purpose</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={goal.purpose}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Description</label>
            <input
              type="text"
              id="description"
              name="description"
              value={goal.description}
              onChange={handleChange}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount">Amount</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={goal.amount}
              onChange={handleChange}
            />
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.saveBtn} onClick={handleSave}>
              Save
            </button>
            <button className={styles.cancelBtn} onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {hasSavedGoal && !isAdding && (
        <div className={styles.inputContainer}>
          <div className={styles.displayGroup}>
            <label>Purpose</label>
            <div className={styles.valueBox}>{goal.purpose}</div>
          </div>

          <div className={styles.displayGroup}>
            <label>Description</label>
            <div className={styles.valueBox}>{goal.description}</div>
          </div>

          <div className={styles.displayGroup}>
            <label>Amount</label>
            <div className={styles.valueBox}>₱{goal.amount}</div>
          </div>
        </div>
      )}

      {/* Edit Goal Modal */}
      {showEditModal && (
        <EditGoalModal
          goal={goal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
          onChange={handleChange}
        />
      )}

      {/* Delete Goal Modal */}
      {showDeleteModal && (
        <DeleteGoalModal
          goal={goal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default SetGoal;
