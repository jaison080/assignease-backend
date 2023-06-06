const Task = require("../models/Task");

const getTasks = async (req, res) => {
  const tasks = await Task.find({});

  return res.status(200).json(tasks);
};

const createTask = async (req, res) => {
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
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user_id,
    });

    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const bidTask = async (req, res) => {
  const { task_id, bid_amount } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "open") {
      return res.status(400).json({ err: "Task is not open" });
    }
    if (req.user_id.toString() === task.user_id.toString()) {
      return res.status(400).json({ err: "User cannot bid on own task" });
    }
    const bid = {
      bidder_id: req.user_id,
      bid_amount,
      bid_time: Date.now(),
    };
    task.bids.push(bid);
    await task.save();
    return res.status(200).json(task);
  } catch (err) {
    return res.status(400).json(err);
  }
};

const assignTask = async (req, res) => {
  const { task_id, bidder_id } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "open") {
      return res.status(400).json({ err: "Task is not open" });
    }
    if (req.user_id.toString() !== task.user_id.toString()) {
      return res.status(400).json({ err: "User is not owner of task" });
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
};

const completeTask = async (req, res) => {
  const { task_id } = req.body;
  try {
    const task = await Task.findById(task_id);
    if (task.status !== "assigned") {
      return res.status(400).json({ err: "Task is not assigned" });
    }
    if (req.user_id.toString() === task.assigned_bid.bidder_id.toString()) {
      task.status = "completed";
      await task.save();
      return res.status(200).json(task);
    }
    return res.status(400).json({ err: "User is not assigned to task" });
  } catch (err) {
    return res.status(400).json(err);
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  bidTask,
  assignTask,
  completeTask,
};
