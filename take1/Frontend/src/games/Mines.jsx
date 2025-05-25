import React from 'react'
import './mines.css'
import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, decrementByAmount } from '../redux/totalamt/totalamtSlice'
import useCheckAuth from '../components/checkauth'

const Mines = () => {
  const url = import.meta.env.VITE_API_URL;
  const [colors, setColors] = useState(Array(25).fill(null));
  const [array, setArray] = useState([]);
  const [minesform, setminesform] = useState({ betamount: "0", minesnumber: "3"})
  const [showbet, setshowbet] = useState(true)
  const [showcashout, setshowcashout] = useState(false)
  const [betstart, setbetstart] = useState(false)
  const [totalprofit, settotalprofit] = useState(0);
  const [error, setError] = useState('');
  const [bal, setbal] = useState();
  const balance = useSelector((state) => state.totalamt.value); 
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(array);
  }, [array]);
  const loading = useCheckAuth();

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }
  const apiRequest = async (endpoint, data) => {
    const token = localStorage.getItem("token");
  
    const response = await fetch(`http://localhost:3000${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || "API request failed");
    }
    return result;
  };

  const handleChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setError('Amount cannot be negative.');
    } else {
      setError('');
    }

    // Update the state only if the value is not negative
    if (value >= 0 || value === '') {
      setminesform({ ...minesform, [e.target.name]: e.target.value });
    }
    
  };

  const handlebet = async() => {
    setColors(Array(25).fill(null));
    try {
      const data = {
       betAmount: parseFloat(minesform.betamount),
       minesNumber: parseInt(minesform.minesnumber),
      }
      if (
        isNaN(data.betAmount) ||
        isNaN(data.minesNumber) ||
        data.minesNumber < 1 ||
        data.minesNumber > 25
      ) {
        throw new Error("Invalid bet amount or mines number");
      }
      if (data.betAmount > balance) {
        alert("Insuffucient Balance");
      }
      else{
      const newArray = await apiRequest('/takegames/mines/bet', data);
      setArray(newArray);
      setshowbet(false);
      setshowcashout(true);
      setbetstart(true);
      settotalprofit(0);
      dispatch(decrementByAmount(data.betAmount));
    }

    } catch (error) {
      alert(error.message);
    }
  };

  const handleCashout = async () => {
    try {
      const googleId = localStorage.getItem('googleId'); // Ensure the ID is retrieved correctly
      const data = {
        googleId, // Pass the googleId as part of the request
      };
  
      const result = await apiRequest('/takegames/mines/cashout', data);
  
      if (result.success) {
        console.log("Cashout successful:", result.message);
        // Handle successful cashout logic here
        setshowbet(true);
        setshowcashout(false);
        setbetstart(false);
        handleyoulose();
        dispatch(incrementByAmount(totalprofit)); // Update total amount
      } else {
        console.error("Cashout failed:", result.message);
        // Handle error, such as showing an error message to the user
        alert(`Cashout failed: ${result.message}`);
      }
    } catch (error) {
      console.error("Cashout failed:", error);
      alert("Cashout failed: Internal error");
    }
  };
  
  

  

  const handlemultiply = (m) => {
    const currentBetAmount = parseFloat(minesform.betamount) || 0;
    const newBetAmount = (currentBetAmount * m).toFixed(2);
    setminesform({ ...minesform, betamount: newBetAmount });
  };
  const handleyoulose = async() => {
    const a = Array(25).fill(null);
    for (let i = 0; i < colors.length; i++) {
      const data = {
        id: `sq-${i + 1}`,
      }
      a[i] = await apiRequest('/takegames/mines/sendarrafterbet', data);
    }
    setColors(a);
    
  };
  
  
  const handleMinesSqclick = async(e, i) => {
    if (betstart) {
      if (colors[i] === null) {
        const data = {
          id: `${e.target.id}`,
        }
        const a = await apiRequest('/takegames/mines/sqclick', data);
        const updatedColors = colors.map(
          (item, index) => (index === i ? a : item)
        );
        setColors(updatedColors);
        console.log(updatedColors);
        const prof = await apiRequest('/takegames/mines/profit', data);
        console.log(`this is profit${JSON.stringify(prof)}`);
        settotalprofit(prof.totalProfit);
        if (!a) {
          handleyoulose();
          settotalprofit(0);
          setshowcashout(false);
          setshowbet(true);
          setbetstart(false);
        }
      } else {
        console.log(`Pressed again`);
      }
    } else {
      console.log(`Set bet first`);
    }
  };


  return (
    <div className='mines-game-container'>
      <div className="mines-game-cont">
        <div className="mines-bet-option">
          <div className='bet-form'>
          <label className='bet-amt'>
            <div className="bet-info"><span>Bet Amount</span><span>{minesform.betamount}</span></div>
            <div className='bet-input-cont'><input onChange={handleChange} type="number" id='bet-amount' name='betamount' value={minesform.betamount} /> 
            <button onClick={()=> handlemultiply(0.5)} className='multiplyer'>1/2</button>
            <button onClick={()=> handlemultiply(2)} className='multiplyer'>2x</button></div>
          </label>
          <div className='mines-number-cont'>Mines
          <select onChange={handleChange} name="minesnumber" id="mines" value={minesform.minesnumber}>
             {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
          </select>
          </div>
          {showbet&& <button onClick={()=> handlebet()} id='bet' className='betbutton'>Bet</button>}
          {showcashout && <div className="bet-info margin"><span>Total profit</span><span>{`${(totalprofit / minesform.betamount).toFixed(2)}x`}</span></div>}
          {showcashout && <div className="total-profit">{totalprofit}</div>}
          {showcashout && <button onClick={handleCashout} className='betbutton'>Cashout</button>}
          </div>
        </div>
        <div className="mine-cont">
          <div className="mines-inner-cont">
          {colors.map((item, index) => (
        <div
        key={index}
        id={`sq-${index + 1}`}
        className={`mine-square ${item != null ?(item === 1 ? "green" : "red") : ""}`}
        onClick={(e)=> handleMinesSqclick(e, index)}
        >
        
        </div>
      ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mines
