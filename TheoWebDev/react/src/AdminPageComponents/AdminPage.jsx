import React, { useState } from "react";
import SettingsSection from "./SettingsSection/SettingsSection";
import TransactionHistorySection from "./TransactionHistorySection/TransactionHistorySection";
import DashboardSection from "./DashboardSection/DashboardSection";
import UserManagementSection from "./UserManagementSection/UserManagementSection";
import "./AdminPage.css";

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
