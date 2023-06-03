const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require('body-parser')
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

const authRouter = require("./routes/auth");
const taskRouter = require("./routes/tasks");

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });

app.listen(PORT, () => {
    console.log("Server is running on port 3000");
  });
  
app.get("/", (req,res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/tasks", taskRouter);