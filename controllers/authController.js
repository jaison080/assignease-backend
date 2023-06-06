const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const User = require("../models/User");

const JWT_EXPIRE = process.env.JWT_EXPIRE || "1d";

const userRegistration = async (req, res) => {
  const { name, email, phone_number, password } = req.body;
  try {
    const SALT = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, SALT);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ err: "User already exists" });
    }
    var user = await User.create({
      name,
      email,
      phone_number,
      password: passwordHash,
    });
    user = {
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      }),
      ...user._doc,
    };
    user.password ? delete user?.password : null;
    return res.status(201).json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).json(err);
  }
};

const userLogin = async (req, res) => {
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
};

const userProfile = async (req, res) => {
  const user = await User.findById(req.user_id).select("-password");
  return res.status(200).json(user);
};

module.exports = { userRegistration, userLogin, userProfile };
