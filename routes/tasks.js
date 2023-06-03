const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const tasks = await Task.find({ user_id: req.user_id });

  return res.status(200).json(tasks);
});

router.post("/", async (req, res) => {
  const { title, description } = req.body;

  if (req.user_id) {
    try {
      const task = await Task.create({
        title,
        description,
        user_id: req.user_id,
      });
      return res.status(201).json(task);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  }
});

module.exports = router;
