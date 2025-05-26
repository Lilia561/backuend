import React, { useState } from "react";
import "../AdminPage.css";

const UserManagementSection = () => {
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Alice Wonderland",
      email: "alice@example.com",
      contact: "123-456-7890",
      status: "Active",
    },
    {
      id: 2,
      name: "Bob The Builder",
      email: "bob@example.com",
      contact: "987-654-3210",
      status: "Inactive",
    },
    {
      id: 3,
      name: "Charlie Brown",
      email: "charlie@example.com",
      contact: "555-555-5555",
      status: "Active",
    },
  ]);

  return (
    <div className="admin-section">
      <h2>User Management</h2>
      <p>View, edit, and manage user accounts.</p>
      <table className="user-table">
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
                <span className={`status ${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </td>
              <td>
                <button className="action-btn edit-btn">Edit</button>
                <button className="action-btn delete-btn">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
