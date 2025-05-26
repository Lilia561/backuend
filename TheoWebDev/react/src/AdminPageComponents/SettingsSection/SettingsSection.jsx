import React from "react";
import "./SettingsSection.css";

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

export default SettingsSection;
