import React, { useState, useEffect } from 'react'
import './navbar.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { fetchBalance } from '../redux/totalamt/totalamtSlice'

const Navbar = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const amount = useSelector((state) => state.totalamt.value)
  const [userdata, setuserdata] = useState({});
  const dispatch = useDispatch();

  // Get user info from backend with JWT
  const getuser = async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setuserdata({});
      return;
    }
    try {
      // Use your backend endpoint that returns user info. Replace /api/balance if you have a better one!
      const response = await axios.get(`${BACKEND_URL}/api/balance`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setuserdata({
        displayName: response.data.displayName || "User",
        balance: response.data.balance,
        ...response.data,
      });
    } catch (error) {
      setuserdata({});
    }
  }

  useEffect(() => {
    getuser();
    // Optionally, you might want to set up an interval to refresh user data.
  }, [])

  useEffect(() => {
    // Check if the user is logged in before fetching balance
    if (userdata && Object.keys(userdata).length > 0) {
      dispatch(fetchBalance());
    }
  }, [userdata, dispatch]);

  const handlelogout = () => {
    // Remove JWT from localStorage and redirect to backend logout
    localStorage.removeItem("jwtToken");
    window.open(`${BACKEND_URL}/auth/logout`, "_self");
  }

  return (
    <div className='navbar'>
      <Link to="/" className='logo-home-link'>
        <div className="logo-home">
          <img src="/logo.png" alt="" />
          <h1>Take</h1>
        </div>
      </Link>
      <div className="wallet">
        <div className="wallet-total-amount">{amount}</div>
        <div className="currency">INR</div>
        <div className="addmoney">Add</div>
      </div>
      <div className="options">
        <img src="options.png" alt="" />
        {userdata.displayName && (
          <span className='user-name'>{userdata.displayName.split(" ")[0]}</span>
        )}
        {userdata.displayName ? (
          <button onClick={handlelogout} className="login">
            <span className="text">LogOut</span>
          </button>
        ) : (
          <Link to="/login">
            <button className="login">
              <span className="text">SignIn</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  )
}

export default Navbar
