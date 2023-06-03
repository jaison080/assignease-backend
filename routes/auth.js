const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.post("/register", async (req, res) => {
    const { name, email, phone_number, password, role } = req.body;
    try 
    {
        const passwordHash = await bcrypt.hash(password, 10);
        const existingUser = await User.findOne({ email });
        if (existingUser)
        {
            res.status(400).json({ err: "User already exists" });
            return;
        }
        const user = await User.create({
            name,
            email,
            phone_number,
            password: passwordHash,
            role,
        });
        res.status(201).json(user);
    }
    catch (err)
    {
        console.log(err);
        res.status(400).json(err);
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try
    {
        const user = await User.findOne({ email });
        if (!user)
        {
            res.status(404).json({ err: "User not found" });
            return;
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
        {
            res.status(400).json({ err: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        res.status(200).json({ user, token });
    }
    catch (err)
    {
        console.log(err);
        res.status(400).json({ err });
    }
});

module.exports = router;