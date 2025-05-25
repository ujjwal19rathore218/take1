const mongoose = require("mongoose");

const TakeGames = require("../model/takegame");
const Userdb = require("../model/userSchema");

const dicelogic = async (googleId, betamt, rollover, reverse) => {
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
    if (betamt < 0) {
      throw new Error("Cannot Bet with Negative Number");
    }

    // Decrement the bet amount from the user's balance
    user.balance -= betamt;
    await user.save(); // Save the updated balance

    // Generate a random dice value between 0 and 100, up to 2 decimal places
    const randdice = parseFloat((Math.random() * 100).toFixed(2));

    // Determine the profit based on game logic
    let totalProfit = 0;
    if (!reverse && randdice >= rollover) {
      totalProfit = parseFloat((betamt * (100 / (100 - rollover))).toFixed(2));
    } else if (reverse && randdice <= rollover) {
      totalProfit = parseFloat((betamt * (100 / rollover)).toFixed(2));
    }

    // Update the user's balance and game state
    user.balance += totalProfit;
    await user.save(); // Save the updated balance

    // Save the user's game state to the database or create a new entry if not existing
    const userGame = await TakeGames.findOneAndUpdate(
      { GoogleID: googleId },
      {
        $set: {
          betamount: betamt,
          dicerollover: rollover,
          diceval: randdice,
          dicetotalprofit: totalProfit,
        },
      },
      { upsert: true, new: true }
    );

    await userGame.save(); // Save the updated game state

    return {
      randdice,
      balance: user.balance,
    };
  } catch (error) {
    console.error(error.message);
    return { error: error.message };
  }
};

module.exports = { dicelogic };
