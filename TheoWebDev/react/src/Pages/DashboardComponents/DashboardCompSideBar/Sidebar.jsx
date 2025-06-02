import React, { useState, useEffect } from 'react';
import styles from './sidebar.module.css';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../axios'; // Import your Axios client

const PopupSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('Profile');
  const [userContact, setUserContact] = useState('+63 912 345 6789');
  const [userEmail, setUserEmail] = useState('user@example.com');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const fetchUserDetails = async () => {
    // Get the token from local storage, as stored by SignInComp.jsx
    const token = localStorage.getItem('ACCESS_TOKEN');

    if (!token) {
      console.warn("Authentication token not found. Cannot fetch user details.");
      // If no token, redirect to login page
      navigate('/Login');
      return;
    }

    try {
      // Make a GET request to your Laravel API endpoint for user profile
      // axiosClient is already configured to include the base URL
      const response = await axiosClient.get('api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the bearer token for authentication
        },
      });

      const data = response.data; // Axios puts the response data in .data
      setUserName(data.name || 'User');
      setUserContact(data.contact_number || 'N/A'); // Use N/A if contact_number is null
      setUserEmail(data.email || 'N/A'); // Use N/A if email is null

    } catch (error) {
      console.error("Failed to fetch user details:", error);
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access, e.g., redirect to login
        console.error("Unauthorized. Please log in again.");
        localStorage.removeItem('ACCESS_TOKEN'); // Clear invalid token
        // localStorage.removeItem('user_id'); // If you store user_id separately, clear it too
        navigate('/Login');
      } else {
        // Other types of errors (network, server, etc.)
        console.error('Error fetching user profile:', error);
        // Fallback to default values or handle error gracefully
        setUserName('Profile');
        setUserContact('+63 912 345 6789');
        setUserEmail('user@example.com');
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []); // Run once on component mount

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
          <div className={styles.profileIcon}>{userName.charAt(0).toUpperCase()}</div>
          <div className={styles.profileInfo}>
            <h4>{userName}</h4>
          </div>
        </div>

        <div className={styles.sidebarWallet}>
          <h2>WALLET</h2>
        </div>

        <div className={styles.sidebarContact}>
          <p>
            <strong>Contact Number</strong>
            <br />
            {userContact}
          </p>
          <p>
            <strong>Email Address</strong>
            <br />
            {userEmail}
          </p>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => navigate('/feedback')}>Feedback</button>
          {/* Ensure logout also clears the token */}
          <button onClick={() => {
            localStorage.removeItem('ACCESS_TOKEN'); // Clear token on logout
            navigate('/Login');
          }}>Logout</button>
        </div>
      </aside>

      {isOpen && <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>}
    </div>
  );
};

export default PopupSidebar;