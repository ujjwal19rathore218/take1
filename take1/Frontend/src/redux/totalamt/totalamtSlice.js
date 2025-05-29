import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const totalamtSlice = createSlice({
  name: 'totalamt',
  initialState: {
    value: 0,
    status: 'idle',
    error: null,
  },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    },
    decrementByAmount: (state, action) => {
      state.value -= action.payload;
    },
    setBalance: (state, action) => {
      state.value = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  setBalance,
  setStatus,
  setError,
} = totalamtSlice.actions;

// Thunk to fetch balance using axios and JWT from localStorage
export const fetchBalance = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await axios.get(`${BACKEND_URL}/api/balance`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    dispatch(setBalance(response.data.balance));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    console.error('Error fetching balance:', error);
    dispatch(setError(error.message || 'Failed to fetch balance'));
    dispatch(setStatus('failed'));
  }
};

// Uncomment the following if you want to use fetch instead of axios
/*
export const fetchBalance = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found. Please log in.');

    const response = await fetch(`${BACKEND_URL}/api/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json();
    dispatch(setBalance(data.balance));
    dispatch(setStatus('succeeded'));
  } catch (error) {
    console.error('Error fetching balance:', error);
    dispatch(setError(error.message));
    dispatch(setStatus('failed'));
  }
};
*/

export default totalamtSlice.reducer;
