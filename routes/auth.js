const express = require("express");
const router = express.Router();
require("dotenv").config();

const {
  userRegistration,
  userLogin,
  userProfile,
  top5Users,
  userLogout,
} = require("../controllers/authController");

router
  .post("/register", userRegistration)
  .post("/login", userLogin)
  .get("/profile", userProfile)
  .get("/top5", top5Users)
  .get("/logout", userLogout);

module.exports = router;
