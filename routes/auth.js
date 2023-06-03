const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
  const { name, email, phone_number, password, role } = req.body;
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      phone_number,
      password: passwordHash,
      role,
    });
    return res.status(201).json(user);
  } catch (err) {
    return res.status(400).json(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ err: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ err: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

module.exports = router;
