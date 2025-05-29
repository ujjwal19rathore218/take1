import React from 'react';
import './login.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Updated to use new backend URL

const Login = () => {
  // Updated Google login handler to use the new BACKEND_URL
  const handleGoogleLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/google`;
  };

  // Placeholder for future GitHub login handler
  const handleGithubLogin = () => {
    window.location.href = `${BACKEND_URL}/auth/github`;
  };

  return (
    <div className='login-cont'>
      <div className="login-inner-cont">
        <h2>Login</h2>
        <div className="alternative-login">
          <button onClick={handleGoogleLogin} className="btn google-btn">
            <img src="google.png" alt="" />Login with Google
          </button>
          <button onClick={handleGithubLogin} className="btn github-btn">
            <img src="github.png" alt="" />Login with GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
