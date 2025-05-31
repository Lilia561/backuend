import React, { useState } from 'react';
import styles from './sidebar.module.css'; // Use CSS module
import { useNavigate } from 'react-router-dom';

const PopupSidebar = () => {
  const navigate = useNavigate();   
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={styles.popupSidebarContainer}>
      {!isOpen && (
        <button
          className={styles.toggleButton}
          onClick={toggleSidebar}
          aria-label="Open Sidebar"
        >
          <div className={styles.hamburgerIcon}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      )}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarProfile}>
          <div className={styles.profileIcon}>P</div>
          <div className={styles.profileInfo}>
            <h4>Profile</h4>
          </div>
        </div>

        <div className={styles.sidebarWallet}>
          <h2>WALLET</h2>
        </div>

        <div className={styles.sidebarContact}>
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

        <nav className={styles.sidebarNav}>
          <ul>
            <li>
              <a href="/">Dashboard</a>
            </li>
            {/* Add other nav links here */}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => navigate('/feedback')}>Feedback</button>
          <button onClick={() => navigate('/Login')}>Logout</button>
        </div>
      </aside>

      {isOpen && <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>}
    </div>
  );
};

export default PopupSidebar;
