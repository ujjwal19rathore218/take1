import React from 'react'
import { Link } from 'react-router-dom'
import './games.css'
const Games = () => {
  return (
    <div className='games-container'>
      <h1>All Games</h1>
      <div className="game-cont">
        <div className="game-img">
            <Link to="/games/mines"><img src="https://mediumrare.imgix.net/15a51a2ae2895872ae2b600fa6fe8d7f8d32c9814766b66ddea2b288d04ba89c?&dpr=1.25&format=auto&auto=format&q=50&w=167" alt="" /></Link>
        </div>
        <div className="game-description"><p><strong>Mines</strong> is a simple yet engaging game where players aim to uncover hidden prizes without triggering any mines. The game board is filled with hidden mines and prizes. Players choose tiles to reveal, with the goal of uncovering as many prizes as possible before hitting a mine.</p>
        
           <h3>How It Works:</h3>
           <ul>
               <li><strong>Game Board:</strong> The board consists of a grid with a mix of hidden mines and prizes.</li>
               <li><strong>Gameplay:</strong> Players click on tiles to reveal their contents. Each tile may either uncover a prize or trigger a mine.</li>
               <li><strong>Objective:</strong> The aim is to reveal as many tiles with prizes as possible without uncovering any mines.</li>
               <li><strong>Winning:</strong> The more tiles you uncover without hitting a mine, the greater your winnings.</li>
            </ul>
        </div>
      </div>
      <div className="game-cont">
        <div className="game-img">
            <Link to="/games/diceroll"><img src="https://mediumrare.imgix.net/30688668d7d2d48d472edd0f1e2bca0758e7ec51cbab8c04d8b7f157848640e0?&dpr=2.0000000298023224&format=auto&auto=format&q=50&w=167" alt="" /></Link>
        </div>
        <div className="game-description"><p><strong>Dice</strong> is an exciting and fast-paced game where players place bets on the outcome of a virtual dice roll. The game is based on chance, with players trying to predict whether the dice roll will result in a number higher or lower than a certain threshold.</p>
        
        <h3>How It Works:</h3>
        <ul>
            <li><strong>Game Mechanics:</strong> Players place a bet and choose a target number. The outcome of a virtual dice roll determines if they win or lose based on whether the roll meets their prediction.</li>
            <li><strong>Betting:</strong> Players can set their desired threshold for winning, such as betting on whether the roll will be above or below a specific number.</li>
            <li><strong>Objective:</strong> The goal is to correctly predict the outcome of the dice roll and win the bet placed.</li>
            <li><strong>Winning:</strong> Payouts are determined by the probability of the dice roll meeting the player's prediction, with higher risks yielding higher rewards.</li>
        </ul>
        </div>
      </div>
    </div>
  )
}

export default Games
