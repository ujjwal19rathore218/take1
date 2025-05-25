import React from 'react'
import './login.css'
import { useEffect } from 'react'
const Login = () => {
  const url = import.meta.env.VITE_API_URL;
  const loginwithGoogle = () => {
    window.open(`http://localhost:3000/auth/google/callback`, "_self");
   
  }
  /*useEffect(() => {
    // Extract token from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    console.log(`this is token ${token}`)

    if (token) {
      // Store token in local storage
      localStorage.setItem("jwtToken", token);
      console.log("Token stored in local storage");

      // Clear token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);*/
  
  
  return (
    <div className='login-cont'>
       <div className="login-inner-cont">
        <h2>Login</h2>
        <div className="alternative-login">
            <button onClick={loginwithGoogle} className="btn google-btn"><img src="google.png" alt="" />Login with Google</button>
            <button className="btn github-btn"><img src="github.png" alt="" />Login with GitHub</button>
        </div>
    </div>
    </div>
  )
}

export default Login
