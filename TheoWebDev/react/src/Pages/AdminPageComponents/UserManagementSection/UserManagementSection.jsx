import React, { useState } from "react";
import styles from "./UserManagementSection.module.css";
import EditUserModal from "../EditUserModal/EditUserModal";
import DeleteUserModal from "../DeleteUserModal/DeleteUserModal";

const UserManagementSection = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Wonderland",
      email: "alice@example.com",
      contact: "123-456-7890",
      status: "Activated",
    },
    {
      id: 2,
      name: "Bob The Builder",
      email: "bob@example.com",
      contact: "987-654-3210",
      status: "Deactivated",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      contact: "555-555-5555",
      status: "Activated",
    },
  ]);

  const [isEditing, setIsEditing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);


  const handleEditClick = (user) => {
    setSelectedUser({ ...user });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    setSelectedUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUser.id ? selectedUser : user
      )
    );
    setIsEditing(false);
  };

  return (
    <div className={styles.adminSection}>
      <h2>User Management</h2>
      <p>View, edit, and manage user accounts.</p>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.contact}</td>
              <td>
                <span
                  className={`${styles.status} ${
                    user.status === "Activated"
                      ? styles.statusActivated
                      : styles.statusDeactivated
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td>
                <button
                  className={`${styles.actionBtn} ${styles.editBtn}`}
                  onClick={() => handleEditClick(user)}
                >
                  Edit
                </button>
                <button
                  className={`${styles.actionBtn} ${styles.deleteBtn}`}
                  onClick={() => setUserToDelete(user)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Render modal if editing */}
      {isEditing && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setIsEditing(false)}
          onSave={handleSave}
          onChange={handleInputChange}
        />
      )}
      {/* Render modal if deleting */}
      {userToDelete && (
        <DeleteUserModal
          user={userToDelete}
          onClose={() => setUserToDelete(null)}
          onConfirm={() => {
            setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default UserManagementSection;
