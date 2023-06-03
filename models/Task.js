const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User ID is required"],
  },
  bids: [
    {
      bidder_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      bid_amount: {
        type: Number,
      },
      bid_time: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  assigned_bid: {
    bidder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    bid_amount: {
      type: Number,
      required: [true, "Bid amount is required"],
    },
    bid_time: {
      type: Date,
      default: Date.now,
    },
  },
  status: {
    type: String,
    enum: ["open", "assigned", "completed"],
    default: "open",
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

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
