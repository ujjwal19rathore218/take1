const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    googleID: String,
    displayName: String,
    email: String,
    balance: {
        type: Number,
        required: true,
        default: 1000,
        min: 0,
        set: (v) => Math.round(v * 100) / 100,
    },
}, {timestamps: true})

const userdb = new mongoose.model("Take", userSchema);
module.exports = userdb;
