import { useState } from 'react'
import './App.css'
import { Link } from 'react-router-dom'

function App() {


  return (
    <>
    
    <div className="container">
      <div className="welcome">
        <h1>Welcome to Take</h1>
        <h2>An Ultimate Site to Lose ALL MONEY</h2>
        <h2>Play different Games to continue losing the Money in streak</h2>
        <div className='start-options'> 
        <Link to="/games"><button className="get-start blue-btn-style">Start Here</button></Link>
        <Link to="/About"><button className="read-here blue-btn-style">Read Here</button></Link>
        </div>
      </div>
      <div className="top-games">
        <h1>Top Games</h1>
        <div className="top-games-type">
          <Link to= "/games/mines"><img src="https://mediumrare.imgix.net/15a51a2ae2895872ae2b600fa6fe8d7f8d32c9814766b66ddea2b288d04ba89c?&dpr=1.25&format=auto&auto=format&q=50&w=167" alt="" /></Link>
          <Link to = "/games/diceroll"><img src="https://mediumrare.imgix.net/30688668d7d2d48d472edd0f1e2bca0758e7ec51cbab8c04d8b7f157848640e0?&dpr=2.0000000298023224&format=auto&auto=format&q=50&w=167" alt="" /></Link>
        </div>
      </div>
    </div>
    
    </>
  )
}

export default App
