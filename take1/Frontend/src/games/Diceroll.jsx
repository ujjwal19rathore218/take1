import React from 'react'
import './diceroll.css'
import { useState, useEffect, useRef } from 'react'
import useCheckAuth from '../components/checkauth'
import { useSelector, useDispatch } from 'react-redux'
import { setBalance, incrementByAmount, decrementByAmount } from '../redux/totalamt/totalamtSlice'
const Diceroll = () => {
  const [betform, setbetform] = useState({ betamount: "0", rollover: "50"});
  const [dicenum, setdicenum] = useState(0);
  const [showdice, setshowdice] = useState(false);
  const [zindex, setzindex] = useState(false);
  const [error, setError] = useState('');
  const [slidereverse, setslidereverse] = useState(false);
  const [gettingres, setgettingres] = useState(false)

  const percentage = (betform.rollover / 100) * 100;
  const dispatch = useDispatch();
  const timeoutRef = useRef(null);
  const zIndexTimeoutRef = useRef(null);

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
  const resetDiceTimer = () => {
    setzindex(true);
    setshowdice(true);
    // Clear the previous timeout if the button is clicked again
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (zIndexTimeoutRef.current) {
      clearTimeout(zIndexTimeoutRef.current);
    }
    // Set a new timeout to hide the div after 3 seconds
    timeoutRef.current = setTimeout(() => {
      setshowdice(false);
    }, 3000);
    zIndexTimeoutRef.current = setTimeout(() => {
      setzindex(false);
    }, 4000);
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
      setbetform({ ...betform, [e.target.name]: e.target.value });
    }
    
  };
  const handlemultiply = (m) => {
    const currentBetAmount = parseFloat(betform.betamount) || 0;
    const newBetAmount = (currentBetAmount * m).toFixed(2);
    setbetform({ ...betform, betamount: newBetAmount });
  };
  const sliderStyle = {
    background: `linear-gradient(to right, red ${percentage}%, rgb(0, 223, 0) ${percentage}%)`
  };
  const reverseSliderStyle = {
    background: `linear-gradient(to right, rgb(0, 223, 0) ${percentage}%, red ${percentage}%)`
  };
  const diceslide =  {
    left: `${dicenum}%`
  };
  const dicetext = () => slidereverse ? dicenum >= betform.rollover : dicenum <= betform.rollover;
  
  
  const calculateResult = (input) => {
    return slidereverse ?(100 / input).toFixed(4) : (100 / (100-input)).toFixed(4);
  };

  const handlebet = async () => {
    setgettingres(true);
    try {
      const data = {
        betAmount: parseFloat(betform.betamount),
        rollover: parseFloat(betform.rollover),
        reverse: slidereverse,
      };
  
      // Send a POST request to the API endpoint
      const result = await apiRequest('/takegames/dice/bet', data);
  
      // Parse the result JSON to get the randdice and balance
      const { randdice, balance } = result;
  
      // Check if the dice roll is greater than or equal to the rollover
        dispatch(setBalance(balance));
      
  
      console.log(`Dice roll is ${randdice}`);
      setdicenum(randdice);
      setshowdice(true);
      resetDiceTimer();
      console.log(`Updated balance is ${balance}`);
    } catch (error) {
      console.error('Error in handlebet:', error.message);
    }
    finally{
      setTimeout(() => {
        setgettingres(false);
      }, 500);
      
    }
  };
  
  const handlereverse = () => {
    slidereverse ? setslidereverse(false) : setslidereverse(true);
    setbetform({ ...betform, rollover: `${100 - parseInt(betform.rollover)}` });
  }
  
  
  

  return (
    <div className='dice-game-container'>
      <div className="dice-inner-container">
        <div className="dice-bet-option">
        <div className='bet-form'>
          <label className='bet-amt'>
            <div className="bet-info"><span>Bet Amount</span><span>{betform.betamount}</span></div>
            <div className='bet-input-cont'><input onChange={handleChange} type="number" id='bet-amount' name='betamount' value={betform.betamount} /> 
            <button onClick={()=> handlemultiply(0.5)} className='multiplyer'>1/2</button>
            <button onClick={()=> handlemultiply(2)} className='multiplyer'>2x</button></div>
          </label>
          
          <div className="bet-info margin"><span>Profit on win</span><span>{(betform.betamount * calculateResult(parseInt(betform.rollover))).toFixed(2)}</span></div>
          <div className="total-profit">{(betform.betamount * calculateResult(parseInt(betform.rollover))).toFixed(2)}</div>
          <button disabled = {gettingres} onClick={()=> handlebet()} id='bet' className={gettingres ? `disablebtn` : `btn-grad`}>Bet</button>
          </div>
        </div>
        <div className="dice-container">
          <div className="dice-game-main">

            <div className="input-number-container">
                <span className="input-number">0</span>
                <span className="input-number">25</span>
                <span className="input-number">50</span>
                <span className="input-number">75</span>
                <span className="input-number">100</span>
            </div>
            <div className="slider-container">
              <div className="dice-pointer-container">
                <div className={`${zindex ? "" : "zindex"} ${showdice ? "opacitytrue" : "opacityfalse"} dice-pointer`} style={diceslide}>
                  <span><img draggable = "false" src="/dice.png" alt="" /></span>
                  <span className={`dice-num-info ${dicetext() ? "redtext" : "greentext"}`}>{dicenum}</span>
                </div>
              </div>
               <input type="range" id="slider" min="2" max="98" value={betform.rollover} onChange={handleChange} className="slider" name='rollover' style={slidereverse ? reverseSliderStyle : sliderStyle} />
               
            </div>
          </div>
          <div className="slider-info">
              <label htmlFor="slide-multip">Multiplier
                 <input type="text" className="slider-info-input total-profit" name='slide-multip' value={calculateResult(parseInt(betform.rollover))} readOnly/>
              </label>
              <label htmlFor="rollover">{slidereverse ? "Roll Under" : "Roll Over"}
                <div onClick={handlereverse} className='slider-info-input reset total-profit'><span>{betform.rollover}</span><span><img id='resetimg' src="/reset.png" alt="" /></span></div>
              </label>
              <label htmlFor="dice-win-chance">Win Chance
                <input type="text" className='slider-info-input total-profit' name='dice-win-chance' value={100 - betform.rollover} readOnly/>
              </label>
          </div>
          </div>
        </div>

        
      </div>
  )
}

export default Diceroll
