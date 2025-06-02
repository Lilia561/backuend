import { Eye, EyeOff, Mail, Lock, Phone, User } from '../Icons';
import styles from './SignUpComp.module.css';
import React, { useState, useRef} from 'react';
import axiosClient from '../../axios'; // Your Axios client for API calls

const SignUpComp = ({ navigateTo }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState(null); // ADDED: State to hold validation errors

  const nameRef = useRef();
  const contactNumberRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  /**
   * Handles the form submission for user registration.
   * Prevents default form submission, constructs payload, and sends it to the backend.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh

    // Construct the payload from ref values
    const payload = {
      name: nameRef.current.value,
      contact_number: contactNumberRef.current.value, // <--- This line is supposed to get the contact number
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordRef.current.value, // Required for Laravel's 'confirmed' rule
    };

    try {
      await axiosClient.get('/sanctum/csrf-cookie');

      // Send the registration data to the backend
      const { data } = await axiosClient.post('/register', payload);

      // On successful registration, store the access token
      localStorage.setItem('ACCESS_TOKEN', data.token);

      // Navigate to the dashboard or home page
      navigateTo('/'); // Assuming '/' is your dashboard/home route
      console.log('Registration successful:', data);

    } catch (error) {
      // Handle registration errors
      if (error.response && error.response.status === 422) {
        // Validation errors from Laravel
        setErrors(error.response.data.errors); // This will now work
        console.error('Validation errors:', error.response.data.errors);
      } else if (error.response && error.response.status === 419) {
        // Specifically handle the 419 CSRF error for clearer debugging
        setErrors({ general: ['Session expired or CSRF token mismatch. Please refresh the page and try again.'] }); // This will now work
        console.error('CSRF Token Mismatch Error (419):', error);
      } else {
        // Other types of errors (network, server, etc.)
        console.error('Registration failed:', error);
        setErrors({ general: ['An unexpected error occurred. Please try again.'] }); // This will now work
      }
    }
  };

  return (
     <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Create Account</h1>
      <p className={styles.authSubtitle}>Join us today!</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {/* Display errors if any */}
        {errors && ( // ADDED: Conditional rendering for error display
          <div className={styles.errorContainer}>
            {Object.keys(errors).map((key) => (
              <p key={key} className={styles.errorMessage}>
                {errors[key][0]} {/* Display the first error message for each field */}
              </p>
            ))}
          </div>
        )}
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><User /></span>
          <input ref={nameRef} type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={styles.authInput} />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Mail /></span>
          <input ref={emailRef} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.authInput} />
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Phone /></span>
          <input ref={contactNumberRef} type="tel" placeholder="+639XXXXXXXXX" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={styles.authInput} />
        </div>
        <p className={styles.inputHint}>Philippines format: +63 followed by 10 digits.</p>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Lock /></span>
          <input ref={passwordRef} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.authInput} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <span className={styles.inputIcon}><Lock /></span>
          <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={styles.authInput} />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className={styles.passwordToggle} aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
            {showConfirmPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <button type="submit" className={styles.authButton}>Sign Up</button>
      </form>
      <div className={styles.authLinks}>
        <button onClick={() => navigateTo('signIn')} className={styles.authLink}>Already have an account? Sign In</button>
      </div>
    </div>
  );
};

export default SignUpComp;
