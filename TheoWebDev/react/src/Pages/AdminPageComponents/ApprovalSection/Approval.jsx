// Approval.jsx
// This component displays a list of users whose accounts are pending approval
// and provides buttons for an admin to approve or reject them.

import React, { useState, useEffect } from 'react';

// IMPORTANT PATH NOTE:
// This import assumes Approval.module.css is in the SAME DIRECTORY as Approval.jsx.
// For example, if Approval.jsx is at 'src/components/Admin/Approval.jsx',
// then Approval.module.css should be at 'src/components/Admin/Approval.module.css'.
import styles from './Approval.module.css';

// IMPORTANT PATH NOTE:
// This import path '../../axios' is RELATIVE to Approval.jsx's location.
// If Approval.jsx is in 'src/components/Admin/', then '../../axios' resolves to 'src/axios'.
// If your axiosClient setup file is elsewhere (e.g., 'src/utils/axios.js'),
// you MUST adjust this path accordingly (e.g., '../../utils/utils/axios').
import axiosClient from '../../axios'; 

const Approval = () => {
  // State to store the list of pending users
  const [pendingUsers, setPendingUsers] = useState([]);
  // State to manage loading status while fetching data
  const [loading, setLoading] = useState(true);
  // State to store any error messages during API calls
  const [error, setError] = useState(null);
  // State to display success messages after actions (approve/reject)
  const [message, setMessage] = useState('');

  // Function to fetch pending users from the backend API
  const fetchPendingUsers = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);   // Clear any previous errors
    setMessage('');   // Clear any previous success messages

    try {
      // Make a GET request to the backend endpoint for pending users
      // This hits the /admin/pending-users route
      const response = await axiosClient.get('api/admin/pending-users');
      setPendingUsers(response.data); // Update the state with the fetched user data
    } catch (err) {
      console.error('Error fetching pending users:', err);
      // Construct a user-friendly error message
      let errorMessage = 'Failed to load pending users. Please check your network or try again.';
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message; // Use the error message from the backend if available
      }
      setError(errorMessage); // Set the error state
    } finally {
      setLoading(false); // Set loading to false after the request completes (success or failure)
    }
  };

  // Function to handle approving or rejecting a user account
  const handleAction = async (userId, actionType) => {
    setMessage(''); // Clear previous messages
    setError(null); // Clear previous errors

    try {
      // Construct the API endpoint dynamically based on the action type ('approve' or 'reject')
      // This will hit either /admin/approve-user/{id} or /admin/reject-user/{id}
      const endpoint = `api/admin/${actionType}-user/${userId}`;
      // Send a POST request to the backend to perform the action
      const response = await axiosClient.post(endpoint);
      setMessage(response.data.message); // Display the success message from the backend

      // Optimistically update the UI: remove the user from the list after a successful action
      setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
    } catch (err) {
      console.error(`Error ${actionType} user ${userId}:`, err);
      // Construct a user-friendly error message for the action
      let errorMessage = `Failed to ${actionType} user. Please try again.`;
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message; // Use the error message from the backend if available
      }
      setError(errorMessage); // Set the error state
    }
  };

  // useEffect hook to fetch pending users when the component mounts
  useEffect(() => {
    fetchPendingUsers();
  }, []); // The empty dependency array ensures this effect runs only once after the initial render

  // Render loading state while data is being fetched
  if (loading) {
    return (
      <div className={styles.approvalContainer}>
        <div className={styles.loading}>Loading pending users...</div>
      </div>
    );
  }

  // Render error state if an error occurred during fetching
  if (error) {
    return (
      <div className={styles.approvalContainer}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  return (
    <div className={styles.approvalContainer}>
      <h2 className={styles.title}>Pending Account Approvals</h2>

      {/* Display success message if the 'message' state is not empty */}
      {message && <div className={styles.successMessage}>{message}</div>}

      {/* Conditional rendering: show 'No pending users' message if the list is empty, otherwise show the user list */}
      {pendingUsers.length === 0 ? (
        <p className={styles.noUsers}>No pending users found.</p>
      ) : (
        <div className={styles.userList}>
          {/* Map through the pendingUsers array to render a card for each user */}
          {pendingUsers.map((user) => (
            <div key={user.id} className={styles.userCard}>
              <div className={styles.userInfo}>
                <p className={styles.userName}>Name: {user.name}</p>
                <p className={styles.userContact}>Contact: {user.contact_number}</p>
                {/* Conditionally display email if it exists */}
                {user.email && <p className={styles.userEmail}>Email: {user.email}</p>}
                <p className={styles.userStatus}>Status: <span className={styles.statusPending}>{user.status}</span></p>
              </div>
              <div className={styles.actions}>
                {/* Approve button: calls handleAction with 'approve' */}
                <button
                  className={`${styles.actionButton} ${styles.approveButton}`}
                  onClick={() => handleAction(user.id, 'approve')}
                  aria-label={`Approve ${user.name}'s account`}
                >
                  Approve
                </button>
                {/* Reject button: calls handleAction with 'reject' */}
                <button
                  className={`${styles.actionButton} ${styles.rejectButton}`}
                  onClick={() => handleAction(user.id, 'reject')}
                  aria-label={`Reject ${user.name}'s account`}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Approval;