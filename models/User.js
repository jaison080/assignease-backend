const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
  },
  phone_number: {
    type: Number,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
    default: "User",
  },
  web3: {
    type: Boolean,
    default: false,
  },
  wallet_address: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
