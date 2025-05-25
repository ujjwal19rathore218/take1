// totalamtSlice.js

import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios'; // We'll use axios for HTTP requests

export const totalamtSlice = createSlice({
  name: 'totalamt',
  initialState: {
    value: 0,
    status: 'idle', // Track loading status
    error: null, // Track any errors
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

// Action creators are generated for each case reducer function
export const {
  increment,
  decrement,
  incrementByAmount,
  decrementByAmount,
  setBalance,
  setStatus,
  setError,
} = totalamtSlice.actions;

// Thunk to fetch balance from the server using fetch
export const fetchBalance = () => async (dispatch) => {
  try {
    dispatch(setStatus('loading'));
    const token = localStorage.getItem('token'); // Get token from local storage
    console.log('Token:', token); // Log the token for debugging

    const response = await fetch('http://localhost:3000/api/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch balance');
    }

    const data = await response.json(); // Await the parsed JSON
    console.log('Response Data:', data); // Log the data for debugging

    dispatch(setBalance(data.balance)); // Correctly dispatch the balance
    dispatch(setStatus('succeeded'));
  } catch (error) {
    console.error('Error fetching balance:', error); // Log any errors
    dispatch(setError(error.message));
    dispatch(setStatus('failed'));
  }
};

// Alternatively, use axios for fetching balance
// Uncomment the following code if you want to use axios instead of fetch

// export const fetchBalance = () => async (dispatch) => {
//   try {
//     dispatch(setStatus('loading'));
//     const token = localStorage.getItem('token'); // Get token from local storage
//     console.log('Token:', token); // Log the token for debugging

//     const response = await axios.get('http://localhost:3000/api/balance', {
//       headers: {
//         'Authorization': `Bearer ${token}`
//       }
//     });

//     console.log('Response Data:', response.data); // Log the response for debugging

//     dispatch(setBalance(response.data.balance)); // Set balance from axios response
//     dispatch(setStatus('succeeded'));
//   } catch (error) {
//     console.error('Error fetching balance:', error); // Log any errors
//     dispatch(setError(error.message));
//     dispatch(setStatus('failed'));
//   }
// };

export default totalamtSlice.reducer;
