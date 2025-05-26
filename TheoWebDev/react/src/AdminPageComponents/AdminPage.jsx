import React, { useState } from "react";
import "./AdminPage.css";

const DashboardSection = () => (
  <div className="admin-section">
    <h2>Dashboard</h2>
    <p>
      Welcome to the admin dashboard! Key metrics and summaries will go here.
    </p>
    <div className="metric-cards">
      <div className="card">
        <h3>Total Users</h3>
        <p>1,234</p>
      </div>
      <div className="card">
        <h3>Total Transactions</h3>
        <p>5,678</p>
      </div>
      <div className="card">
        <h3>Pending Approvals</h3>
        <p>12</p>
      </div>
    </div>
  </div>
);

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

const TransactionHistorySection = () => (
  <div className="admin-section">
    <h2>Transaction History</h2>
    <p>Browse and filter all transactions.</p>
    <p>Transaction data will be displayed here...</p>
  </div>
);

const SettingsSection = () => (
  <div className="admin-section">
    <h2>Settings</h2>
    <p>Configure application settings.</p>
    <form className="settings-form">
      <div className="form-group">
        <label htmlFor="siteName">Site Name:</label>
        <input type="text" id="siteName" defaultValue="eWallet Admin" />
      </div>
      <div className="form-group">
        <label htmlFor="maintenanceMode">Maintenance Mode:</label>
        <select id="maintenanceMode">
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>
      </div>
      <button type="submit" className="submit-btn">
        Save Settings
      </button>
    </form>
  </div>
);

function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardSection />;
      case "users":
        return <UserManagementSection />;
      case "transactions":
        return <TransactionHistorySection />;
      case "settings":
        return <SettingsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="admin-page-container">
      <aside className="sidebar">
        <h1 className="logo">eWallet Admin</h1>
        <nav className="admin-nav">
          <ul>
            <li
              className={activeSection === "dashboard" ? "active" : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={activeSection === "users" ? "active" : ""}
              onClick={() => setActiveSection("users")}
            >
              User Management
            </li>
            <li
              className={activeSection === "transactions" ? "active" : ""}
              onClick={() => setActiveSection("transactions")}
            >
              Transactions
            </li>
            <li
              className={activeSection === "settings" ? "active" : ""}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </li>
          </ul>
        </nav>
        <div className="admin-user-info">
          <p>Admin User</p>
          <button className="logout-btn">Logout</button>
        </div>
      </aside>
      <main className="main-content">{renderSection()}</main>
    </div>
  );
}

export default AdminPage;
