import React, { useState } from 'react';
import './Sidebar.css'; // Import the CSS file
import { useNavigate } from 'react-router-dom';

const PopupSidebar = () => {
  const navigate = useNavigate();   
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    
    <div className="popup-sidebar-container">
      {!isOpen && (
        <button className="toggle-button" onClick={toggleSidebar} aria-label="Open Sidebar">
          <div className="hamburger-icon">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-profile">
          <div className="profile-icon">P</div>
          <div className="profile-info">
            <h4>Profile</h4>
          </div>
        </div>

        <div className="sidebar-wallet">
          <h2>WALLET</h2>
        </div>

        <div className="sidebar-contact">
          <p>
            <strong>Contact Number</strong>
            <br />
            +63 912 345 6789
          </p>
          <p>
            <strong>Email Address</strong>
            <br />
            user@example.com
          </p>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><a href="/">Dashboard</a></li>
            {/* ... other navigation links ... */}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => {navigate('/feedback');}}>Feedback</button>
          <button onClick={() => {navigate('/Login');}}>Logout</button>
        </div>
      </aside>

      {isOpen && <div className="sidebar-overlay" onClick={toggleSidebar}></div>}
    </div>
  );
};

export default PopupSidebar;