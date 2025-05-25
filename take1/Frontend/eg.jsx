/*import React from 'react'
import './mines.css'
import { useState, useEffect } from 'react'
import {MinesLogic, MinesSelect, numberclicks, profit} from './MinesLogic'
import { useSelector, useDispatch } from 'react-redux'
import { incrementByAmount, decrementByAmount } from '../redux/totalamt/totalamtSlice'
import useCheckAuth from '../components/checkauth'
import axios from 'axios'

const Mines = () => {
  const [colors, setColors] = useState(Array(25).fill(null));
  const [array, setArray] = useState([]);
  const [minesform, setminesform] = useState({ betamount: "0", minesnumber: "3"})
  const [showbet, setshowbet] = useState(true)
  const [showcashout, setshowcashout] = useState(false)
  const [betstart, setbetstart] = useState(false)
  const [totalprofit, settotalprofit] = useState(0)
  const dispatch = useDispatch();
  const loading = useCheckAuth();

  

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }
  
  useEffect(() => {
    const postmine = async() => {
      try {
        const a = await axios.post("http://localhost:3000/takegames/mines/");
      } catch (error) {
        console.log('cannot post take game');
      }
    }
    postmine();
    
  }, [])
  

  const handleChange = (e) => {
    setminesform({ ...minesform, [e.target.name]: e.target.value });
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
        minesNumber < 1 ||
        minesNumber > 25
      ) {
        throw new Error("Invalid bet amount or mines number");
      }
      const newArray = await axios.post("http://localhost:3000/takegames/mines/bet", data);
      setArray(newArray);
      setshowbet(false);
      setshowcashout(true);
      setbetstart(true);
      settotalprofit(0);
      //dispatch(decrementByAmount(data.betAmount));

    } catch (error) {
      alert(error.message);
    }
  };

  const handleCashout = async() => {
    const cash = await axios.post("http://localhost:3000/takegames/mines/cashout");
    setshowbet(cash);
    setshowcashout(!cash);
    setbetstart(false); 
    handleyoulose();   
  };

  useEffect(() => {
    console.log(array);
  }, [array]);

  const handlemultiply = (m) => {
    const currentBetAmount = parseFloat(minesform.betamount) || 0;
    const newBetAmount = (currentBetAmount * m).toFixed(2);
    setminesform({ ...minesform, betamount: newBetAmount });
  };
  const handleyoulose = async() => {
    const a = Array(25).fill(null);
    for (let i = 0; i < colors.length; i++) {
      a[i] = await axios.post("http://localhost:3000/takegames/mines/sqclick", e.target.id);
    }
    setColors(a);
    
  };
  
  
  const handleMinesSqclick = async(e, i) => {
    if (betstart) {
      if (colors[i] === null) {
        const a = await axios.post("http://localhost:3000/takegames/mines/sqclick", e.target.id);
        const updatedColors = colors.map(
          (item, index) => (index === i ? a : item)
        );
        setColors(updatedColors);
        console.log(updatedColors);
        console.log(numberclicks());
        const reqprofit = await axios.post("http://localhost:3000/takegames/mines/profit", e.target.id)
        settotalprofit(reqprofit);
        if (!a) {
          handleyoulose();
          settotalprofit(0);
          setshowcashout(false);
          setshowbet(true);
          console.log(`You lose`);
        }
      } else {
        console.log(`Pressed again`);
      }
    } else {
      console.log(`Set bet first`);
    }
  };


  return (
    <div className='game-container'>
      <div className="mines-game-cont">
        <div className="mines-bet-option">
          <div className='bet-form'>
          <label className='bet-amt'>
            <div className="bet-info"><span>Bet Amount</span><span>0.0rs</span></div>
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
          {showcashout && <div className="bet-info margin"><span>Total profit</span><span>0.0rs</span></div>}
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
        {index + 1}
        
        </div>
      ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Mines*/
