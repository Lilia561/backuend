import React, { useState, useRef } from 'react';
import { Eye, EyeOff, Mail, Lock, Phone } from '../Icons'; // Assuming these icons are correctly imported
import styles from './SignInComp.module.css';
import axiosClient from '../../axios'; // Your Axios client for API calls

const SignInComp = ({ navigateTo }) => {
  // State variables for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contacts, setContacts] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState(null);

  // Refs for direct access to input values (useful for forms)
  const contactNumberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  /**
   * Handles the form submission for user login.
   * Prevents default form submission, constructs payload, and sends it to the backend.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setErrors(null);

    const payload = {
      email: emailRef.current.value,
      identifier: contactNumberRef.current.value,
      password: passwordRef.current.value,
    };

    try {
      await axiosClient.get('/sanctum/csrf-cookie');

      const { data } = await axiosClient.post('/login', payload);

      // Store the access token
      localStorage.setItem('ACCESS_TOKEN', data.token);
      // Store the admin status
      localStorage.setItem('IS_ADMIN', data.is_admin ? 'true' : 'false'); // Store as string

      console.log('Login successful:', data);

      // Redirect based on admin status
      if (data.is_admin) {
        navigateTo('/admin'); // Redirect to admin dashboard
      } else {
        navigateTo('/'); // Redirect to regular user dashboard
      }

    } catch (error) {
      if (error.response && error.response.status === 422) {
        setErrors(error.response.data.errors);
        console.error('Validation errors:', error.response.data.errors);
      } else if (error.response && error.response.status === 419) {
        setErrors({ general: ['Session expired or CSRF token mismatch. Please refresh the page and try again.'] });
        console.error('CSRF Token Mismatch Error (419):', error);
      } else if (error.response && error.response.status === 401) {
        setErrors({ general: ['Invalid contact number or password. Please try again.'] });
        console.error('Login failed: Invalid credentials.', error);
      } else {
        console.error('Login failed:', error);
        setErrors({ general: ['An unexpected error occurred. Please try again.'] });
      }
    }
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Welcome Back!</h1>
      <p className={styles.authSubtitle}>Please sign in to continue.</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {errors && (
          <div className={styles.errorContainer}>
            {Object.keys(errors).map((key) => (
              <p key={key} className={styles.errorMessage}>
                {errors[key][0]}
              </p>
            ))}
          </div>
        )}

        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Mail /></span>
          <input
            ref={emailRef}
            type="email"
            placeholder="Email Address (Optional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.authInput}
          />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Phone /></span>
          <input
            ref={contactNumberRef}
            type="text"
            placeholder="Contact Number"
            value={contacts}
            onChange={(e) => setContacts(e.target.value)}
            className={styles.authInput}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Lock /></span>
          <input
            ref={passwordRef}
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.authInput}
            required
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