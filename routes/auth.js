const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";

router.post("/register", async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  try {
    const SALT = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, SALT);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: "User already exists" });
    }
    const user = await User.create({
      name,
      email,
      phone_number,
      password: passwordHash
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
      expiresIn: JWT_EXPIRE,
    });
    return res.status(200).json({ user, token });
  } catch (err) {
    return res.status(400).json({ err });
  }
});

router.get("/profile", async (req, res) => {
  const user = await User.findById(req.user_id).select("-password");
  return res.status(200).json(user);
});

module.exports = router;
