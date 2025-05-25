const mongoose = require('mongoose');

const takeGamesSchema = new mongoose.Schema(
  {
    GoogleID: {
      type: String,
      required: true,
      unique: true,
      trim: true,   
    },
    minesarray: {
      type: [Number],
      default: [],
      validate: {
        validator: function (v) {
          return Array.isArray(v);
        },
        message: (props) => `${props.value} is not a valid array!`,
      },
    },
    minestotalprofit: {
      type: Number,
      default: 0,
      min: 0,
    },
    betamount: {
      type: Number,
      min: 0,
    },
    minesnumber: {
      type: Number,
      min: 1,
      max: 25,
    },
    numberofclick: {
      type: Number,
      default: 0,
      min: 0,
    },
    minesSelectNumber: {
      type: Number,
      min: 0, 
      max: 1,
    },
    betstart: {
      type: Boolean,
      default: false,
    },
    betstop: {
      type: Boolean,
      default: false,
    },
    dicerollover: {
      type: Number,
      default: 50,
    },
    dicetotalprofit: {
      type: Number,
      default: true,
    },
    diceval: {
      type: Number,
      default: 0,
    }
  },
  {
    timestamps: true,
  }
);

// Create the model from the schema
const TakeGames = mongoose.model('TakeGames', takeGamesSchema);

module.exports = TakeGames;
