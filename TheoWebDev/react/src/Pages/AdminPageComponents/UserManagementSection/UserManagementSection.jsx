// UserManagementSection.jsx
import React, { useState, useEffect, useCallback } from "react";
import styles from "./UserManagementSection.module.css";
import EditUserModal from "../EditUserModal/EditUserModal";
import DeleteUserModal from "../DeleteUserModal/DeleteUserModal";
import axiosClient from "../../axios";

const UserManagementSection = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchBy, setSearchBy] = useState("name");

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("api/admin/users");
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to fetch users.");
      } else if (err.request) {
        setError("No response from server. Please check your network connection.");
      } else {
        setError("An unexpected error occurred while fetching users.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      const newFilteredUsers = users.filter((user) => {
        if (searchBy === "name") {
          return user.name.toLowerCase().includes(lowerCaseSearchTerm);
        } else if (searchBy === "contact_number") {
          return user.contact_number && user.contact_number.toLowerCase().includes(lowerCaseSearchTerm);
        }
        return false;
      });
      setFilteredUsers(newFilteredUsers);
    }
  }, [searchTerm, searchBy, users]);

  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setSelectedUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!selectedUser) return;

    // The 'payload' should contain the updated 'status' (approval) and 'account_status' (active/deactivated)
    // Make sure your EditUserModal is sending the correct enum values for both.
    const payload = { ...selectedUser };

    try {
      await axiosClient.put(`api/admin/users/${payload.id}`, payload);
      setIsEditing(false);
      fetchUsers(); // Re-fetch to show updated data
    } catch (err) {
      console.error("Error saving user:", err);
      if (err.response) {
        // Log validation errors for better debugging
        if (err.response.status === 422 && err.response.data.errors) {
            console.log("Validation Errors:", err.response.data.errors);
            const errorMessages = Object.values(err.response.data.errors).flat();
            setError("Validation failed: " + errorMessages.join(", "));
        } else {
            setError(err.response.data.message || "Failed to save user changes.");
        }
      } else {
        setError("An unexpected error occurred while saving user changes.");
      }
    }
  };

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    try {
      await axiosClient.delete(`api/admin/users/${userToDelete.id}`);
      setUserToDelete(null);
      fetchUsers(); // Re-fetch to show updated data
    } catch (err) {
      console.error("Error deleting user:", err);
      if (err.response) {
        setError(err.response.data.message || "Failed to delete user.");
      } else {
        setError("An unexpected error occurred while deleting user.");
      }
    }
  };

  return (
    <div className={styles.adminSection}>
      <h2>User Management</h2>
      <p>View, edit, and manage user accounts.</p>

      {/* Search Bar and Filters */}
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder={`Search by ${searchBy === "name" ? "Name" : "Contact Number"}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <button
          onClick={() => setSearchBy("name")}
          className={`${styles.searchBtn} ${searchBy === "name" ? styles.activeSearchBtn : ''}`}
        >
          Search by Name
        </button>
        <button
          onClick={() => setSearchBy("contact_number")}
          className={`${styles.searchBtn} ${searchBy === "contact_number" ? styles.activeSearchBtn : ''}`}
        >
          Search by Contact
        </button>
      </div>

      {isLoading && <p>Loading users...</p>}
      {error && <p className={styles.errorMessage}>{error}</p>}

      {!isLoading && !error && (
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact Number</th>
              <th>Approval Status</th> {/* Renamed header */}
              <th>Account Status</th> {/* NEW HEADER */}
              <th>Money</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="8" className={styles.noDataMessage}> {/* Updated colspan */}
                  {searchTerm ? "No matching users found." : "No users found."}
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.contact_number}</td>
                  <td>
                    {/* Display based on the original 'status' field */}
                    <span
                      className={`${styles.status} ${
                        user.status === "approved"
                          ? styles.statusActivated
                          : styles.statusDeactivated
                      }`}
                    >
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)} {/* Display Pending/Approved/Rejected */}
                    </span>
                  </td>
                  <td>
                    {/* Display based on the NEW 'account_status' field */}
                    <span
                      className={`${styles.status} ${
                        user.account_status === "active"
                          ? styles.statusActivated
                          : styles.statusDeactivated
                      }`}
                    >
                      {user.account_status === "active" ? "Active" : "Deactivated"}
                    </span>
                  </td>
                  <td>${parseFloat(user.current_money || 0).toFixed(2)}</td>
                  <td>
                    <button
                      className={`${styles.actionBtn} ${styles.editBtn}`}
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.deleteBtn}`}
                      onClick={() => setUserToDelete(user)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {isEditing && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onChange={handleInputChange}
        />
      )}
      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
};

export default UserManagementSection;
