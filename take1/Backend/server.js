require("dotenv").config();
const express = require('express');
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const connectToDatabase = require("./dbconnection/database");
const { router: authRouter, passport } = require('./controller/auth');
const { router: minerout } = require('./controller/minesrouting');
const { router: dicerout } = require('./controller/dicerouting');
const userdb = require("./model/userSchema");
const authenticateToken = require('./controller/authMiddleware');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
  origin: process.env.FRONTEND_URL, // <-- FIXED
  methods: "GET, POST, PUT, DELETE",
  credentials: true
}));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false // <-- SAFER
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use("/auth", authRouter);
app.use("/takegames/mines", minerout);
app.use("/takegames/dice", dicerout);

app.get('/api/balance', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.googleID;
    const user = await userdb.findOne({ googleID: userId });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Database Error:', error);
    res.status(500).json({ message: 'Error accessing the database.'});
  }
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}).catch(error => {
  console.error("Failed to connect to the database:", error);
});
