const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Task = require("../models/Task");

router.get("/", async (req, res) => {
  const AuthToken = req.headers.authorization;
  let user_id;
  if (!AuthToken) {
    res.status(401).json({ err: "Unauthorized" });
    return;
  }
  const token = AuthToken.split(" ")[1];
  if (!token) {
    res.status(401).json({ err: "Unauthorized" });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized" });
      return;
    }
    user_id = decoded.id;
  });
  const tasks = await Task.find({ user_id: user_id });

  res.status(200).json(tasks);
});

router.post("/", async (req, res) => {
  const AuthToken = req.headers.authorization;
  let user_id;
  if (!AuthToken) {
    res.status(401).json({ err: "Unauthorized" });
    return;
  }
  const token = AuthToken.split(" ")[1];
  if (!token) {
    res.status(401).json({ err: "Unauthorized" });
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({ err: "Unauthorized" });
      return;
    }
    user_id = decoded.id;
  });
  const { title, description } = req.body;
  try {
    const task = await Task.create({
      title,
      description,
      user_id,
    });
    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
