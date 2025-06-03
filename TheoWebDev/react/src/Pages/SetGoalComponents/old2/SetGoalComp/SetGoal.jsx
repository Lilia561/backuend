import React, { useState } from "react";
import styles from "./SetGoal.module.css";
import EditGoalModal from "../EditGoalModal/EditGoalModal";
import DeleteGoalModal from "../DeleteGoalModal/DeleteGoalModal";
import AddGoalModal from "../AddGoalModal/AddGoalModal";
import GearIcon from "./GearIcon";

const SetGoal = () => {
  const [goals, setGoals] = useState([
    {
      id: 1,
      purpose: "Vacation",
      description: "Save for summer trip to Palawan",
      amount: "15000",
    },
    {
      id: 2,
      purpose: "Emergency Fund",
      description: "Backup savings for medical or urgent needs",
      amount: "10000",
    },
  ]);

  // Modal states
  const [isEditing, setIsEditing] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [goalToDelete, setGoalToDelete] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Mass delete state
  const [isMassDeleting, setIsMassDeleting] = useState(false);
  const [selectedForMassDelete, setSelectedForMassDelete] = useState(new Set());

  // Open edit modal
  const handleEditClick = (goal) => {
    setSelectedGoal({ ...goal });
    setIsEditing(true);
  };

  // Handle edit input change (optional if controlled inputs)
  const handleInputChange = (e) => {
    setSelectedGoal((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Save edited goal
  const handleSave = () => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal.id === selectedGoal.id ? selectedGoal : goal
      )
    );
    setIsEditing(false);
  };

  // Request delete from edit modal
  const handleRequestDelete = (goal) => {
    setGoalToDelete(goal);
    setIsEditing(false);
  };

  // Open AddGoalModal
  const handleAddClick = () => {
    setIsAdding(true);
  };

  // Save new goal from AddGoalModal
  const handleAddSave = (newGoal) => {
    setGoals((prev) => [
      ...prev,
      { ...newGoal, id: prev.length ? prev[prev.length - 1].id + 1 : 1 },
    ]);
    setIsAdding(false);
  };

  // Cancel adding new goal
  const handleAddCancel = () => {
    setIsAdding(false);
  };

  // Toggle mass delete mode
  const handleMassDeleteClick = () => {
    setIsMassDeleting(true);
    setSelectedForMassDelete(new Set());
  };

  // Cancel mass delete mode
  const handleMassDeleteCancel = () => {
    setIsMassDeleting(false);
    setSelectedForMassDelete(new Set());
  };

  // Confirm mass delete and delete selected goals
  const handleMassDeleteConfirm = () => {
    setGoals((prev) =>
      prev.filter((goal) => !selectedForMassDelete.has(goal.id))
    );
    setIsMassDeleting(false);
    setSelectedForMassDelete(new Set());
  };

  // Toggle checkbox selection for mass delete
  const toggleSelectGoal = (goalId) => {
    setSelectedForMassDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(goalId)) {
        newSet.delete(goalId);
      } else {
        newSet.add(goalId);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.goalSection}>
      <div className={styles.headerWithButtons}>
        <h2>Set Financial Goals</h2>
        <div className={styles.buttonsColumn}>
          {!isMassDeleting ? (
            <>
              <button className={styles.addBtn} onClick={handleAddClick}>
                + Add Goal
              </button>
              <button
                className={styles.massDeleteBtn}
                onClick={handleMassDeleteClick}
              >
                Mass Delete
              </button>
            </>
          ) : (
            <>
              <button
                className={styles.confirmBtn}
                onClick={handleMassDeleteConfirm}
                disabled={selectedForMassDelete.size === 0}
                title={
                  selectedForMassDelete.size === 0
                    ? "Select at least one goal"
                    : ""
                }
              >
                Confirm
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleMassDeleteCancel}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      <p>Track, edit, and manage your financial goals.</p>
      <table className={styles.goalTable}>
        <thead>
          <tr>
            <th>Purpose</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {goals.map((goal) => (
            <tr key={goal.id}>
              <td>{goal.purpose}</td>
              <td>{goal.description}</td>
              <td>₱{goal.amount}</td>
              <td className={styles.actionsCell}>
                {isMassDeleting ? (
                  <input
                    type="checkbox"
                    checked={selectedForMassDelete.has(goal.id)}
                    onChange={() => toggleSelectGoal(goal.id)}
                  />
                ) : (
                  <button
                    className={styles.gearBtn}
                    onClick={() => handleEditClick(goal)}
                    aria-label={`Edit ${goal.purpose}`}
                  >
                    <GearIcon />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modals */}
      {isEditing && (
        <EditGoalModal
          goal={selectedGoal}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onRequestDelete={handleRequestDelete}
          onChange={handleInputChange}
        />
      )}

      {goalToDelete && (
        <DeleteGoalModal
          goal={goalToDelete}
          onClose={() => setGoalToDelete(null)}
          onConfirm={() => {
            setGoals((prev) => prev.filter((g) => g.id !== goalToDelete.id));
            setGoalToDelete(null);
          }}
        />
      )}

      {isAdding && (
        <AddGoalModal
          onClose={handleAddCancel}
          onSave={handleAddSave}
        />
      )}
    </div>
  );
};

export default SetGoal;
