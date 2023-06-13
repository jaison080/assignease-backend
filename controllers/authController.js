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
      web3: false,
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
    return res.status(400).json(err);
  }
};

const userLogin = async (req, res) => {
  if (req.body.web3) {
    const { wallet_address } = req.body;
    try {
      const user = await User.findOne({ wallet_address });
      if (!user) {
        const user = await User.create({
          wallet_address,
          web3: true,
          name: "Web3 User",
        });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: JWT_EXPIRE,
        });
        return res.status(200).json({ user, token });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: JWT_EXPIRE,
      });
      return res.status(200).json({ user, token });
    } catch (err) {
      return res.status(400).json({ err });
    }
  }
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

const userLogout = async (req, res) => {
  return res.status(200).json({ msg: "User logged out" });
};

const userProfile = async (req, res) => {
  const user = await User.findById(req.user_id).select("-password");
  return res.status(200).json(user);
};

const top5Users = async (req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "tasks",
        localField: "_id",
        foreignField: "assigned_bid.bidder_id",
        as: "tasks",
      },
    },
    {
      $project: {
        password: 0,
        tasks: { $size: "$tasks" },
        earnings: {
          $reduce: {
            input: "$tasks",
            initialValue: 0,
            in: { $add: ["$$value", "$$this.assigned_bid.bid_amount"] },
          },
        },
      },
    },
    { $sort: { earnings: -1 } },
    { $limit: 5 },
  ]);

  return res.status(200).json(users);
};

module.exports = {
  userRegistration,
  userLogin,
  userProfile,
  top5Users,
  userLogout,
};
