import React, { useState } from 'react';
import { Eye, EyeOff, Mail, KeyRound } from '../Icons';
import styles from './ForgotPasswordComp.module.css';

const ForgotPasswordComp = ({ navigateTo }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Frontend Only - Forgot Password Attempt:\nEmail: ${email}\nNew Password: ${newPassword}`);
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Reset Password</h1>
      <p className={styles.authSubtitle}>Enter your email and a new password.</p>

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <Mail className={styles.inputIcon} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.authInput}
          />
        </div>

        <div className={styles.inputGroup}>
          <KeyRound className={styles.inputIcon} />
          <input
            type={showNewPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.authInput}
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className={styles.passwordToggle}
            aria-label={showNewPassword ? "Hide new password" : "Show new password"}
          >
            {showNewPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <div className={styles.inputGroup}>
          <KeyRound className={styles.inputIcon} />
          <input
            type={showConfirmNewPassword ? 'text' : 'password'}
            placeholder="Confirm New Password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className={styles.authInput}
          />
          <button
            type="button"
            onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            className={styles.passwordToggle}
            aria-label={showConfirmNewPassword ? "Hide confirm new password" : "Show confirm new password"}
          >
            {showConfirmNewPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>

        <button type="submit" className={styles.authButton}>
          Reset Password
        </button>
      </form>

      <div className={styles.authLinks}>
        <button onClick={() => navigateTo('signIn')} className={styles.authLink}>
          Back to Sign In
        </button>
      </div>
    </div>
  );
};

export default ForgotPasswordComp;
