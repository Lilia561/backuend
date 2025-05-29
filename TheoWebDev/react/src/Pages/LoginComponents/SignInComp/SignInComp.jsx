import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from '../Icons';
import styles from './SignInComp.module.css';
import { useNavigate } from 'react-router-dom';

const SignInComp = ({ navigateTo }) => {
  const navigate = useNavigate();  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Welcome Back!</h1>
      <p className={styles.authSubtitle}>Please sign in to continue.</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Mail /></span>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.authInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Lock /></span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.authInput}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className={styles.passwordToggle}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            <span className={styles.passwordToggleIcon}>
              {showPassword ? <EyeOff /> : <Eye />}
            </span>
          </button>
        </div>
        <button type="submit" className={styles.authButton}>
          Sign In
        </button>
      </form>
      <div className={styles.authLinks}>
        <button onClick={() => navigateTo('signUp')} className={styles.authLink}>
          Don't have an account? Sign Up
        </button>
        <button onClick={() => navigateTo('forgotPassword')} className={styles.authLink}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
};

export default SignInComp;
