import React from "react";
import styles from "./DashboardSection.module.css";

const DashboardSection = () => (
  <div className={styles.adminSection}>
    <h2>Dashboard</h2>
    <p>
      Welcome to the admin dashboard! Key metrics and summaries will go here.
    </p>
    <div className={styles.metricCards}>
      <div className={styles.card}>
        <h3>Total Users</h3>
        <p>1,234</p>
      </div>
      <div className={styles.card}>
        <h3>Total Transactions</h3>
        <p>5,678</p>
      </div>
      <div className={styles.card}>
        <h3>Pending Approvals</h3>
        <p>12</p>
      </div>
    </div>
  </div>
);

export default DashboardSection;
