import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Mines from './games/Mines.jsx'
import './index.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login.jsx'
import Dashboard from './components/Dashboard.jsx'
import Diceroll from './games/Diceroll.jsx'
import Games from './components/Games.jsx'
import Readhere from './components/Readhere.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './redux/store.js'
import { useSelector, useDispatch } from 'react-redux'
import './responsive.css'
//import { incrementByAmount } from './redux/totalamt/totalamtSlice.js'



const router = createBrowserRouter([
  {
    path: "/",
    element: <><Navbar/><App/><Footer/></>,
  },
  {
    path: "/games/mines",
    element: <><Navbar/><Mines/><Footer/></>
  },
  {
    path: "/login",
    element: <><Navbar/><Login/><Footer/></>
  },
  {
    path: "/dashboard",
    element: <><Navbar/><Dashboard/><Footer/></>
  },
  {
    path: "/games",
    element: <><Navbar/><Games/><Footer/></>
  },
  {
    path: "/games/diceroll",
    element: <><Navbar/><Diceroll/><Footer/></>
  },
  {
    path: "About",
    element: <><Navbar/><Readhere/><Footer/></>
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
    <RouterProvider router={router}>
        <Navbar />
        <Footer />
      </RouterProvider>
    </Provider>
  </React.StrictMode>,
)
