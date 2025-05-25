import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './totalamt/totalamtSlice'
import { thunk } from 'redux-thunk'
export const store = configureStore({
  reducer: {
    totalamt: counterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunk),
})