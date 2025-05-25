const express = require("express");
const mongoose = require("mongoose");

const TakeGames = require("../model/takegame");
const Userdb = require("../model/userSchema");

// Initialize MongoDB connection
/*mongoose.connect('mongodb://localhost:27017/minesweeper', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});*/

const MinesLogic = async (googleId, betamt, minesnumber) => {
  try {
    // Fetch the user's current balance
    const user = await Userdb.findOne({ googleID: googleId });

    if (!user) {
      throw new Error("User not found");
    }

    // Check if the user has enough balance to place the bet
    if (user.balance < betamt) {
      throw new Error("Insufficient balance");
    }

    // Decrement the bet amount from the user's balance
    user.balance -= betamt;
    await user.save(); // Save the updated balance

    // Initialize the mines array
    const length = 25;
    const arr = new Array(length).fill(1);

    // Randomly place mines in the array
    let zerosAdded = 0;
    while (zerosAdded < minesnumber) {
      const randomIndex = Math.floor(Math.random() * length);
      if (arr[randomIndex] === 1) {
        arr[randomIndex] = 0;
        zerosAdded++;
      }
    }

    // Save the user's game state to the database
    const userGame = await TakeGames.findOneAndUpdate(
      { GoogleID: googleId },
      {
        $set: {
          minesarray: arr,
          minestotalprofit: 0,
          betamount: betamt,
          minesnumber: minesnumber,
          numberofclick: 0,
          minesSelectNumber: 0,
          betstart: true,
          betstop: false,
        },
      },
      { upsert: true, new: true }
    );

    return arr;
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};

const MinesSelect = async (googleId, id) => {
  const a = parseInt(id.split("-")[1]) - 1;

  const userGame = await TakeGames.findOne({ GoogleID: googleId });

  if (!userGame || userGame.minesarray.length === 0) {
    console.error(
      "MinesLogic has not been called yet to initialize the array."
    );
    return null;
  }

  const { minesarray, numberofclick, betstart, minesSelectNumber } = userGame;
  if (betstart) {
    userGame.numberofclick++;
    userGame.minesSelectNumber = minesarray[a];

    await userGame.save();
    if (minesarray[a]) {
      return minesarray[a];
    } else {
      const lose = await handlelose(googleId);
      console.log(`you lose setting betstop true`);
      return lose;
    }
  } else {
    console.error("Set bet first");
  }
};

const numberclicks = async (googleId) => {
  const userGame = await TakeGames.findOne({ GoogleID: googleId });
  return userGame ? userGame.numberofclick : 0;
};

const handlelose = async(googleId) => {
  const userGame = await TakeGames.findOne({ GoogleID: googleId });
  const { betstart, betstop } = userGame;
  userGame.betstart = false;
  userGame.betstop = true;
  await userGame.save();
  return 0;
}

const sendArrAfterBet = async(googleId, id) => {
  const userGame = await TakeGames.findOne({ GoogleID: googleId });
  const { betstart, betstop, minesarray } = userGame;
  if(betstop){
    const a = parseInt(id.split("-")[1]) - 1;
    return minesarray[a];
  }
  else{
    console.error("cannot send the information. Stop the bet first");
  }
}


const profit = async (googleId) => {
  const userGame = await TakeGames.findOne({ GoogleID: googleId });

  if (!userGame) {
    console.error("MinesLogic has not been called for this user yet.");
    return 0;
  }

  const { minesSelectNumber, betamount, numberofclick, minesnumber } = userGame;

  if (minesSelectNumber) {
    const safespot = 25 - minesnumber;
    const growth = (11 * betamount * numberofclick) / safespot;
    userGame.minestotalprofit = betamount + growth;

    // Save the updated total profit
    await userGame.save();
  }

  return userGame.minestotalprofit;
};

const cashout = async (googleId) => {
  try {
    // Fetch the user's game state and user details concurrently
    const [userGame, user] = await Promise.all([
      TakeGames.findOne({ GoogleID: googleId }),
      Userdb.findOne({ googleID: googleId }),
    ]);

    if (!userGame || !user) {
      console.error("User or game not found");
      return { success: false, message: "User or game not found" };
    }

    // Check if the game is in a state that allows cashout
    if (!userGame.betstart || userGame.betstop) {
      console.error("Cashout not allowed: Game is not active");
      return { success: false, message: "Cashout not allowed: Game is not active" };
    }

    // Calculate and get the total profit
    const totalProfit = await profit(googleId);

    // Add the total profit to the user's balance
    user.balance += totalProfit;

    // Save the updated balance
    await user.save();

    // Update the game state but retain the minesarray
    await TakeGames.updateOne(
      { GoogleID: googleId },
      {
        $set: {
          minestotalprofit: 0, // Reset the total profit
          numberofclick: 0,    // Reset the number of clicks
          minesSelectNumber: 0,// Reset the mines select number
          betstart: false,
          betstop: true,
          // Optionally keep the minesarray for client-side requests
        },
      }
    );

    console.log("Cashout successful");
    return { success: true, message: "Cashout successful" };
  } catch (error) {
    console.error(`Cashout error: ${error.message}`);
    return { success: false, message: "Internal server error" };
  }
};





module.exports = {
  MinesLogic,
  MinesSelect,
  numberclicks,
  profit,
  cashout,
  sendArrAfterBet,
};
