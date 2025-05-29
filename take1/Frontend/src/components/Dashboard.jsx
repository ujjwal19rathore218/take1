import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { Link } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [userdata, setuserdata] = useState({});
  const navigate = useNavigate();

  // Extract token from URL and store in localStorage, then clean URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('jwtToken', token);
      // Remove token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  // Fetch user data using JWT
  useEffect(() => {
    const getuser = async () => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        navigate("/login");
        return;
      }
      try {
        // Here we fetch user data from a JWT-protected endpoint
        // Replace /api/balance with your own user info endpoint if needed
        const response = await axios.get(`${BACKEND_URL}/api/balance`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Synthesize a "user" object for display purposes
        setuserdata({
          displayName: response.data.displayName || "User",
          balance: response.data.balance,
          ...response.data,
        });
      } catch (error) {
        localStorage.removeItem('jwtToken');
        navigate("/login");
      }
    };
    getuser();
  }, [navigate]);

  return (
    <div className='dashboard-container'>
      <h1>{`Hello ${userdata.displayName || ""}, Welcome to Take.com.`}</h1>
      <p>You Have Successfully Logged in to Take.com</p>
      <p>Click the below button to go to the home page</p>
      <Link to="/"><button className="blue-btn-style">Home</button></Link>
    </div>
  )
}

export default Dashboard
