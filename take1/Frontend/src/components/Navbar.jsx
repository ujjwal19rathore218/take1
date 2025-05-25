import React from 'react'
import { useState, useEffect } from 'react'
import './navbar.css'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { fetchBalance } from '../redux/totalamt/totalamtSlice'
const Navbar = () => {
  const url = import.meta.env.VITE_API_URL;
  const amount = useSelector((state) => state.totalamt.value)
  const [userdata, setuserdata] = useState({});
  const dispatch = useDispatch();
  
  console.log("response", userdata);
  const getuser = async() => {
    try {
      const response = await axios.get(`http://localhost:3000/auth/login/success`, {withCredentials: true});
      
      setuserdata(response.data.user)
    } catch (error) {
      console.log(`this is error`);
    }
  }
  useEffect(() => {
    getuser();
  }, [])

  useEffect(() => {
    // Check if the user is logged in before fetching balance
    if (userdata && Object.keys(userdata).length > 0) {  // Ensure userdata is not empty
      dispatch(fetchBalance());
    }
  }, [userdata, dispatch]);
  
  const handlelogout = () => {
    window.open(`http://localhost:3000/auth/logout`, "_self");
  }
  
  
  return (
    <div className='navbar'>
      <Link to= "/" className='logo-home-link'><div className="logo-home">
        <img src="/logo.png" alt="" />
        <h1>Take</h1>
      </div></Link>
      <div className="wallet">
        <div className="wallet-total-amount">{amount}</div>
        <div className="currency">INR</div>
        <div className="addmoney">Add</div>
      </div>
      <div className="options"><img src="options.png" alt="" />
        {Object.keys(userdata)?.length > 0 && <span className='user-name'>{userdata.displayName.split(" ")[0]}</span>}
        {Object.keys(userdata)?.length > 0 ? <button onClick={handlelogout} className="login"><span className="text">LogOut</span></button> : <Link to="/login"><button className="login"><span className="text">SignIn</span></button></Link>}</div>
      
    </div>
  )
}

export default Navbar
