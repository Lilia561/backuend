
import SettingsSection from "./SettingsSection/SettingsSection";
import TransactionHistorySection from "./TransactionHistorySection/TransactionHistorySection";
import DashboardSection from "./DashboardSection/DashboardSection";
import UserManagementSection from "./UserManagementSection/UserManagementSection";
import Feedback from "./FeedbackAdminSection/FeedbackAdmin"
import Approval from "./ApprovalSection/Approval";
import styles from "./AdminPage.module.css"; 
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';

function AdminPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const navigate = useNavigate();

  useEffect(() => {
      const titles = {
        dashboard: 'DashBoard | Wall-et',
        users: 'Users | Wall-et',
        transactions: 'Transactions | Wall-et',
        settings: 'Settings | Wall-et',
      };
      document.title = titles[activeSection] || 'MyApp';
    }, [activeSection]);

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
      case "feedback":
        return <Feedback />;
      case "approval":
        return <Approval />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className={styles.adminPageContainer}>
      <aside className={styles.sidebar}>
        <h1 className={styles.logo}>eWallet Admin</h1>
        <nav className={styles.adminNav}>
          <ul>
            <li
              className={activeSection === "dashboard" ? styles.active : ""}
              onClick={() => setActiveSection("dashboard")}
            >
              Dashboard
            </li>
            <li
              className={activeSection === "users" ? styles.active : ""}
              onClick={() => setActiveSection("users")}
            >
              User Management
            </li>
            <li
              className={activeSection === "transactions" ? styles.active : ""}
              onClick={() => setActiveSection("transactions")}
            >
              Transactions
            </li>
            <li
              className={activeSection === "feedback" ? styles.active : ""}
              onClick={() => setActiveSection("feedback")}
            >
              Feedback
            </li>
             <li
              className={activeSection === "approval" ? styles.active : ""}
              onClick={() => setActiveSection("approval")}
            >
              Approval
            </li>
            <li
              className={activeSection === "settings" ? styles.active : ""}
              onClick={() => setActiveSection("settings")}
            >
              Settings
            </li>
          </ul>
        </nav>
        <div className={styles.adminUserInfo}>
          <p>Admin User</p>
          <button 
          className={styles.logoutBtn}
          onClick={() => navigate('/login')}
          >Logout</button>
        </div>
      </aside>
      <main className={styles.mainContent}>{renderSection()}</main>
    </div>
  );
}

export default AdminPage;
