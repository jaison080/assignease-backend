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

module.exports = router;
