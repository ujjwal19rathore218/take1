import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './dashboard.css';
import { Link } from 'react-router-dom'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Dashboard = () => {
  const [userdata, setuserdata] = useState({});
  const navigate = useNavigate();

  const getuser = async() => {
    try {
      const response = await axios.get(`${BACKEND_URL}/auth/login/success`, { withCredentials: true });
      setuserdata(response.data.user);
    } catch (error) {
      navigate("/login");
    }
  }

  useEffect(() => {
    getuser();
  }, []);

  useEffect(() => {
    handleUrlParameters();
  }, []);

  // Function to extract URL parameters and store them in local storage
  const handleUrlParameters = () => {
    const params = new URLSearchParams(window.location.search);
    params.forEach((value, key) => {
      localStorage.setItem(key, value);
    });
  };

  return (
    <div className='dashboard-container'>
      <h1>{`Hello ${userdata.displayName}, Welcome to Take.com.`}</h1>
      <p>You Have Successfully Logged in to Take.com</p>
      <p>Click the below button to go to the home page</p>
      <Link to="/"><button className="blue-btn-style">Home</button></Link>
    </div>
  )
}

export default Dashboard