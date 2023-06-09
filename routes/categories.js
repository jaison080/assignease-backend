const express = require("express");
const router = express.Router();

const { getCategories, getCategory, createCategory } = require("../controllers/categoryController");

router
  .get("/", getCategories)
  .get("/:id", getCategory)
  .post("/", createCategory);

module.exports = router;
