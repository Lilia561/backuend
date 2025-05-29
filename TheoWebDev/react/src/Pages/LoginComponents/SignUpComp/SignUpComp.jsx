import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, Phone, User } from '../Icons';
import styles from './SignUpComp.module.css';

const SignUpComp = ({ navigateTo }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Frontend Only - Sign Up Attempt:\nFull Name: ${fullName}\nEmail: ${email}\nContact: ${contactNumber}\nPassword: ${password}`);
  };

  return (
    <div className={styles.authContainer}>
      <h1 className={styles.authTitle}>Create Account</h1>
      <p className={styles.authSubtitle}>Join us today!</p>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className={styles.inputGroup}>
          <User />
          <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} className={styles.authInput} />
        </div>
        <div className={styles.inputGroup}>
          <Mail />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.authInput} />
        </div>
        <div className={styles.inputGroup}>
          <Phone />
          <input type="tel" placeholder="+639XXXXXXXXX" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className={styles.authInput} />
        </div>
        <p className={styles.inputHint}>Philippines format: +63 followed by 10 digits.</p>
        <div className={styles.inputGroup}>
          <Lock />
          <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={styles.authInput} />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className={styles.passwordToggle} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        <div className={styles.inputGroup}>
          <Lock />
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
