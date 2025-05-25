// routes.js

const express = require("express");
const router = express.Router();
const { MinesLogic, MinesSelect, profit, cashout, sendArrAfterBet } = require("./minesLogic");
const authenticateJWT = require("./authMiddleware");



router.post("/bet", authenticateJWT, async (req, res) => {
  try {
    const { betAmount, minesNumber } = req.body;
    const { googleID } = req.user; // Get googleID from the authenticated user

    if (
      isNaN(betAmount) ||
      isNaN(minesNumber) ||
      minesNumber < 1 ||
      minesNumber > 25
    ) {
      throw new Error("Invalid bet amount or mines number");
    }

    const response = await MinesLogic(googleID, betAmount, minesNumber);
    if (response) {
      res.json(response);
    } else {
      res.status(500).json({ error: "Error processing bet" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sqclick", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.body;
    const { googleID } = req.user; // Get googleID from the authenticated user
    console.log(`this is square id${id}`);

    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const response = await MinesSelect(googleID, id);
    if (response !== null) {
      res.json(response);
    } else {
      res.status(500).json({ error: "Error processing square click" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/profit", authenticateJWT, async (req, res) => {
  try {
    const { googleID } = req.user; // Get googleID from the authenticated user
    const totalProfit = await profit(googleID);
    res.json({ totalProfit });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/cashout", authenticateJWT, async (req, res) => {
  try {
    const { googleID } = req.user; // Get googleID from the authenticated user
    const cash = await cashout(googleID);
    if (cash.success) {
      res.json({ success: true, message: "Cashout is successful", balance: cash.newBalance });
    } else {
      res.status(500).json({ error: "Cashout failed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/sendarrafterbet", authenticateJWT, async (req, res) => {
  try {
    const { id } = req.body;
    const { googleID } = req.user;
    if (!id) {
      return res.status(400).json({ error: "ID is required" });
    }

    const response = await sendArrAfterBet(googleID, id);
    if (response !== null) {
      res.json(response);
    } else {
      res.status(500).json({ error: "Error processing send array after bet ends" });
    }
  } catch (error) {}
});

module.exports = { router };
