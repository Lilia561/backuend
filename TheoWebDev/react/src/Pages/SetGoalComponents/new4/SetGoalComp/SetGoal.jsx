import React, { useState, useEffect, useCallback } from "react";
import styles from "./SetGoal.module.css";
import GearIcon from "./GearIcon"; // Assuming GearIcon is a component
import DeleteGoalModal from "../DeleteGoalModal/DeleteGoalModal"; // Assuming path is correct
import EditGoalModal from "../EditGoalModal/EditGoalModal";     // Assuming path is correct
import axiosClient from "../../axios"; // Import your Axios client
import { useNavigate } from "react-router-dom"; // Import useNavigate

const SetGoal = () => {
  const navigate = useNavigate();
  // State for the form inputs when ADDING a new goal
  const [newGoalForm, setNewGoalForm] = useState({ purpose: "", description: "", amount: "" });
  // State to hold the list of all goals fetched from the backend
  const [goals, setGoals] = useState([]);
  // State to control visibility of the "Add Goal" input form
  const [showAddForm, setShowAddForm] = useState(false);
  // State for loading and error messages
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for success message after CUD operations
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Modals visibility states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false); // Corrected state setter name
  // State to hold the goal currently being edited/deleted
  const [selectedGoal, setSelectedGoal] = useState(null);

  // Function to fetch goals from the backend
  const fetchGoals = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        navigate("/login");
        return;
      }
      const response = await axiosClient.get("api/goals", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGoals(response.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
      let errorMessage = "Failed to fetch goals.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      setError(errorMessage);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Handle changes in the new goal form inputs
  const handleNewGoalChange = (e) => {
    const { name, value } = e.target;
    setNewGoalForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle adding a new goal
  const handleAddGoal = async () => {
    if (!newGoalForm.purpose || !newGoalForm.amount) {
      alert("Please fill in Purpose and Amount."); // Replace with custom modal
      return;
    }

    const goalData = {
      purpose: newGoalForm.purpose,
      target_balance: parseFloat(newGoalForm.amount), // Map 'amount' to 'target_balance'
      target_date: newGoalForm.description || null, // Map 'description' to 'target_date'
    };

    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        navigate("/login");
        return;
      }

      await axiosClient.post("api/goals", goalData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);

      // Clear form and hide it
      setNewGoalForm({ purpose: "", description: "", amount: "" });
      setShowAddForm(false);
      fetchGoals(); // Re-fetch goals to update the list
    } catch (err) {
      console.error("Error adding goal:", err);
      let errorMessage = "Failed to add goal.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response && err.response.data && err.response.data.errors) {
        errorMessage = Object.values(err.response.data.errors)[0][0];
      }
      alert(`Error: ${errorMessage}`); // Replace with custom modal
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };

  const handleCancelAdd = () => {
    setNewGoalForm({ purpose: "", description: "", amount: "" });
    setShowAddForm(false);
  };

  // --- Edit/Delete Handlers (Will be implemented in modals) ---

  const handleEditClick = (goal) => {
    setSelectedGoal(goal);
    setShowEditModal(true);
  };

  const handleDeleteClick = (goal) => {
    setSelectedGoal(goal);
    setShowDeleteModal(true);
  };

  // This will be called from EditGoalModal after successful save
  const handleEditSave = async (updatedGoalData) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        navigate("/login");
        return;
      }

      await axiosClient.put(`api/goals/${updatedGoalData.id}`, updatedGoalData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setShowEditModal(false);
      setSelectedGoal(null); // Clear selected goal
      fetchGoals(); // Re-fetch goals
    } catch (err) {
      console.error("Error updating goal:", err);
      let errorMessage = "Failed to update goal.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.response && err.response.data && err.response.data.errors) {
        errorMessage = Object.values(err.response.data.errors)[0][0];
      }
      alert(`Error: ${errorMessage}`);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };

  // This will be called from DeleteGoalModal after confirmation
  const handleDeleteConfirm = async (goalId) => {
    try {
      const token = localStorage.getItem("ACCESS_TOKEN");
      if (!token) {
        navigate("/login");
        return;
      }

      await axiosClient.delete(`api/goals/${goalId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      setShowDeleteModal(false);
      setSelectedGoal(null); // Clear selected goal
      fetchGoals(); // Re-fetch goals
    } catch (err) {
      console.error("Error deleting goal:", err);
      let errorMessage = "Failed to delete goal.";
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      }
      alert(`Error: ${errorMessage}`);
      if (err.response && err.response.status === 401) {
        navigate("/login");
      }
    }
  };


  if (loading) {
    return (
      <div className={styles.goalSection}>
        <p>Loading goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.goalSection}>
        <p className={styles.errorMessage}>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className={styles.goalSection}>
      {showSuccessMessage && (
        <div className={styles.successPopup}>
          Operation successful!
        </div>
      )}

      <div className={styles.headerRow}>
        <h2>Set Financial Goals</h2>
        <div className={styles.topIcons}>
          {/* Gear icon for editing the currently displayed goal (if only one) or manage goals */}
          {/* For multiple goals, the edit/delete buttons will be next to each goal item */}
          {/* This gear icon might be repurposed for a 'Manage Goals' view or removed */}
          {/* <button
            className={`${styles.gearBtn} ${goals.length > 0 ? styles.active : styles.inactive}`}
            title="Edit Goal"
            disabled={goals.length === 0}
            onClick={() => {
              if (goals.length > 0) handleEditClick(goals[0]); // Example: edit the first goal
            }}
          >
            <GearIcon />
          </button> */}
          {/* <button
            className={`${styles.deleteBtn} ${goals.length > 0 ? styles.active : styles.inactive}`}
            title="Delete Goal"
            disabled={goals.length === 0}
            onClick={() => {
              if (goals.length > 0) handleDeleteClick(goals[0]); // Example: delete the first goal
            }}
          >
            Delete
          </button> */}
        </div>
      </div>
      <p>Track, edit, and manage your financial goals.</p>

      {/* Always show the "Add Goal" button if the form is not open */}
      {!showAddForm && (
        <button className={styles.addBtn} onClick={() => setShowAddForm(true)}>
          + Add Goal
        </button>
      )}

      {/* Show the add goal form when showAddForm is true */}
      {showAddForm && (
        <div className={styles.inputContainer}>
          <div className={styles.inputGroup}>
            <label htmlFor="purpose">Purpose</label>
            <input
              type="text"
              id="purpose"
              name="purpose"
              value={newGoalForm.purpose}
              onChange={handleNewGoalChange}
              placeholder="e.g., New Camera"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="amount">Target Balance (PHP)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={newGoalForm.amount}
              onChange={handleNewGoalChange}
              placeholder="Enter amount"
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="description">Target Date (Optional)</label>
            <input
              type="date"
              id="description"
              name="description"
              value={newGoalForm.description}
              onChange={handleNewGoalChange}
            />
          </div>

          <div className={styles.actionButtons}>
            <button className={styles.saveBtn} onClick={handleAddGoal}>
              Save
            </button>
            <button className={styles.cancelBtn} onClick={handleCancelAdd}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Display fetched goals */}
      {goals.length > 0 && (
        <div className={styles.goalsListContainer}>
          <h3>Your Current Goals:</h3>
          {goals.map((goalItem) => (
            <div className={styles.goalItemDisplay} key={goalItem.id}>
              <div className={styles.goalInfo}>
                <span>Purpose: {goalItem.purpose}</span>
                <span>Target: ₱{goalItem.targetAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                {goalItem.targetDate && <span>Date: {goalItem.targetDate}</span>}
              </div>
              <div className={styles.goalActions}>
                <button
                  className={styles.editBtn}
                  onClick={() => handleEditClick(goalItem)}
                >
                  Edit
                </button>
                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteClick(goalItem)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Message when no goals are set and the add form is not active */}
      {goals.length === 0 && !showAddForm && (
        <p>No goals set yet. Click "Add Goal" to get started!</p>
      )}


      {/* Edit Goal Modal */}
      {showEditModal && selectedGoal && (
        <EditGoalModal
          goal={selectedGoal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* Delete Goal Modal */}
      {showDeleteModal && selectedGoal && (
        <DeleteGoalModal
          goal={selectedGoal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteConfirm(selectedGoal.id)}
        />
      )}
    </div>
  );
};

export default SetGoal;
