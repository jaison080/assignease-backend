const express = require("express");
const router = express.Router();

const {
  getTasks,
  createTask,
  updateTask,
  bidTask,
  assignTask,
  deleteTask,
  completeTask,
} = require("../controllers/tasksController");

router.get("/", getTasks)
      .post("/", createTask)
      .put("/:id", updateTask)
      .delete("/:id", deleteTask)
      .post("/bid", bidTask)
      .post("/assign", assignTask)
      .post("/complete", completeTask);

module.exports = router;
