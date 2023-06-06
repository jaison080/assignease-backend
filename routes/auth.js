const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  userRegistration,
  userLogin,
  userProfile,
} = require("../controllers/authController");

router.post("/register", userRegistration)
      .post("/login", userLogin)
      .get("/profile", userProfile);

module.exports = router;