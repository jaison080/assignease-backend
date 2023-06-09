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
  getTasksByUser,
  getAssignedTasks,
  getBiddedTasks,
} = require("../controllers/tasksController");

router
  .get("/", getTasks)
  .get("/:user_id", getTasksByUser)
  .post("/", createTask)
  .put("/:id", updateTask)
  .delete("/:id", deleteTask)
  .post("/bid", bidTask)
  .post("/assign", assignTask)
  .get("/tasks/assigned", getAssignedTasks)
  .get("/tasks/bidded", getBiddedTasks)
  .post("/complete", completeTask);

module.exports = router;
