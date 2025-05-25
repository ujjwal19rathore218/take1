import React, { useState, useEffect } from 'react';
import './mines.css';
import { MinesLogic, MinesSelect, numberclicks, profit } from './MinesLogic';
import { useSelector, useDispatch } from 'react-redux';
import { incrementByAmount, decrementByAmount } from '../redux/totalamt/totalamtSlice';
import useCheckAuth from '../components/checkauth';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Mines = () => {
  const [colors, setColors] = useState(Array(25).fill(null));
  const [array, setArray] = useState([]);
  const [minesform, setminesform] = useState({ betamount: "0", minesnumber: "3" });
  const [showbet, setshowbet] = useState(true);
  const [showcashout, setshowcashout] = useState(false);
  const [betstart, setbetstart] = useState(false);
  const [totalprofit, settotalprofit] = useState(0);
  const dispatch = useDispatch();
  const loading = useCheckAuth();

  if (loading) {
    return <div className='loading'>Loading...</div>;
  }

  useEffect(() => {
    const postmine = async () => {
      try {
        await axios.post(`${BACKEND_URL}/takegames/mines/`);
      } catch (error) {
        console.log('cannot post take game');
      }
    };
    postmine();
  }, []);

  const handlebet = async () => {
    setColors(Array(25).fill(null));
    try {
      const data = {
        betAmount: parseFloat(minesform.betamount),
        minesNumber: parseInt(minesform.minesnumber),
      };
      if (
        isNaN(data.betAmount) ||
        isNaN(data.minesNumber) ||
        data.minesNumber < 1 ||
        data.minesNumber > 25
      ) {
        throw new Error("Invalid bet amount or mines number");
      }
      const response = await axios.post(`${BACKEND_URL}/takegames/mines/bet`, data);
      setArray(response.data);
      setshowbet(false);
      setshowcashout(true);
      setbetstart(true);
      settotalprofit(0);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCashout = async () => {
    const response = await axios.post(`${BACKEND_URL}/takegames/mines/cashout`);
    setshowbet(response.data);
    setshowcashout(!response.data);
    setbetstart(false);
    handleyoulose();
  };

  const handleyoulose = async () => {
    const a = Array(25).fill(null);
    for (let i = 0; i < colors.length; i++) {
      const response = await axios.post(`${BACKEND_URL}/takegames/mines/sqclick`, i);
      a[i] = response.data;
    }
    setColors(a);
  };

  const handleMinesSqclick = async (e, i) => {
    if (betstart) {
      if (colors[i] === null) {
        const response = await axios.post(`${BACKEND_URL}/takegames/mines/sqclick`, e.target.id);
        const updatedColors = colors.map(
          (item, index) => (index === i ? response.data : item)
        );
        setColors(updatedColors);
        const profitResponse = await axios.post(`${BACKEND_URL}/takegames/mines/profit`, e.target.id);
        settotalprofit(profitResponse.data);
        if (!response.data) {
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
              <div className="bet-info">
                <span>Bet Amount</span>
                <span>0.0rs</span>
              </div>
              <div className='bet-input-cont'>
                <input
                  onChange={handleChange}
                  type="number"
                  id='bet-amount'
                  name='betamount'
                  value={minesform.betamount}
                />
                <button onClick={() => handlemultiply(0.5)} className='multiplyer'>1/2</button>
                <button onClick={() => handlemultiply(2)} className='multiplyer'>2x</button>
              </div>
            </label>
            <div className='mines-number-cont'>
              Mines
              <select
                onChange={handleChange}
                name="minesnumber"
                id="mines"
                value={minesform.minesnumber}
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
            {showbet && (
              <button onClick={() => handlebet()} id='bet' className='betbutton'>
                Bet
              </button>
            )}
            {showcashout && (
              <div className="bet-info margin">
                <span>Total profit</span>
                <span>0.0rs</span>
              </div>
            )}
            {showcashout && <div className="total-profit">{totalprofit}</div>}
            {showcashout && (
              <button onClick={handleCashout} className='betbutton'>
                Cashout
              </button>
            )}
          </div>
        </div>
        <div className="mine-cont">
          <div className="mines-inner-cont">
            {colors.map((item, index) => (
              <div
                key={index}
                id={`sq-${index + 1}`}
                className={`mine-square ${item != null ? (item === 1 ? "green" : "red") : ""}`}
                onClick={(e) => handleMinesSqclick(e, index)}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mines;