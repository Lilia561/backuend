import React, { useState, useEffect } from 'react';

import SignInComp from './SignInComp/SignInComp';
import SignUpComp from './SignUpComp/SignUpComp';
import ForgotPasswordComp from './ForgotPasswordComp/ForgotPasswordComp';
import styles from './LoginPage.module.css';

function LoginPage() {
  const [currentView, setCurrentView] = useState('signIn');

  const navigateTo = (view) => {
    setCurrentView(view);
  };

  useEffect(() => {
    const titles = {
      signIn: 'Sign In | Wall-et',
      signUp: 'Sign Up | Wall-et',
      forgotPassword: 'Forgot Password | Wall-et',
    };
    document.title = titles[currentView] || 'MyApp';
  }, [currentView]);

  const renderView = () => {
    switch (currentView) {
      case 'signIn':
        return <SignInComp navigateTo={navigateTo} />;
      case 'signUp':
        return <SignUpComp navigateTo={navigateTo} />;
      case 'forgotPassword':
        return <ForgotPasswordComp navigateTo={navigateTo} />;
      default:
        return <SignInComp navigateTo={navigateTo} />;
    }
  };

  return (
    <div className={styles.authWrapper}>
      {renderView()}
    </div>
  );
}

export default LoginPage;
