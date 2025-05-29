import React from "react";
import styles from "./SettingsSection.module.css";

const SettingsSection = () => (
  <div className={styles.adminSection}>
    <h2>Settings</h2>
    <p>Configure application settings.</p>
    <form className={styles.settingsForm}>
      <div className={styles.formGroup}>
        <label htmlFor="siteName">Site Name:</label>
        <input type="text" id="siteName" defaultValue="eWallet Admin" />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="maintenanceMode">Maintenance Mode:</label>
        <select id="maintenanceMode">
          <option value="off">Off</option>
          <option value="on">On</option>
        </select>
      </div>
      <button type="submit" className={styles.submitBtn}>
        Save Settings
      </button>
    </form>
  </div>
);

export default SettingsSection;
