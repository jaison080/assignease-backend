const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const tasks = await Task.find({});

  return res.status(200).json(tasks);
});

router.post("/", async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      user_id: req.user_id,
    });
    return res.status(201).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.put("/:id", async (req, res) => {
  const { title, description } = req.body;
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user_id },
      { title, description },
      { new: true }
    );

    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user_id,
    });

    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/bid", async (req, res) => {
  const { task_id, bidder_id, bid_amount, bid_time } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "open") {
      return res.status(400).json({ err: "Task is not open" });
    }
    const bid = {
      bidder_id,
      bid_amount,
      bid_time,
    };
    task.bids.push(bid);
    await task.save();
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/assign", async (req, res) => {
  const { task_id, bidder_id } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "open") {
      return res.status(400).json({ err: "Task is not open" });
    }
    const bid = task.bids.find((bid) => bid.bidder_id.toString() === bidder_id);
    if (!bid) {
      return res.status(400).json({ err: "Bidder is not bidding on task" });
    }
    task.status = "assigned";
    task.assigned_bid = bid;
    await task.save();
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/complete", async (req, res) => {
  const { task_id, bidder_id } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "assigned") {
      return res.status(400).json({ err: "Task is not assigned" });
    }
    if (task.user_id.toString() !== bidder_id) {
      return res.status(400).json({ err: "User is not assigned to task" });
    }
    task.status = "completed";
    await task.save();
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
});

module.exports = router;