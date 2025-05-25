const express = require("express");
const router = express.Router();
const { dicelogic } = require("./dicelogic");
const authenticateJWT = require("./authMiddleware");

router.post("/bet", authenticateJWT, async (req, res) => {
    try {
      const { betAmount, rollover, reverse } = req.body;
      const { googleID } = req.user; // Get googleID from the authenticated user
  
      if (
        isNaN(betAmount) ||
        isNaN(rollover) ||
        rollover < 1 ||
        rollover > 99
      ) {
        throw new Error("Invalid bet amount or Roll Over");
      }
  
      const response = await dicelogic(googleID, betAmount, rollover, reverse);
      if (response) {
        res.json(response);
      } else {
        res.status(500).json({ error: "Error processing bet" });
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  module.exports = { router };