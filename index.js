const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");

const app = express();

// Middleware
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(methodOverride("_method"));

// MongoDB connect
mongoose.connect("mongodb://localhost:27017/todoDB", { useNewUrlParser: true, useUnifiedTopology: true });

// Schema
const taskSchema = new mongoose.Schema({
  name: String
});

const Task = mongoose.model("Task", taskSchema);

// Default tasks
const defaultTasks = [
  new Task({ name: "Learn DSA" }),
  new Task({ name: "Complete Project" }),
  new Task({ name: "Read Documentation" })
];

// Routes
app.get("/", async (req, res) => {
  try {
    const tasks = await Task.find();

    // Insert default tasks only if DB is empty
    if (tasks.length === 0) {
      await Task.insertMany(defaultTasks);
      return res.redirect("/");
    }

    res.render("list", { dayej: tasks });
  } catch (err) {
    console.log(err);
    res.status(500).send("Error loading tasks");
  }
});

// Add new task
app.post("/", async (req, res) => {
  const itemName = req.body.elel;
  const newTask = new Task({ name: itemName });
  await newTask.save();
  res.redirect("/");
});

// Delete task
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await Task.findByIdAndDelete(id);
  res.redirect("/");
});

// Update task
app.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  const newName = req.body.name;
  await Task.findByIdAndUpdate(id, { name: newName });
  res.redirect("/");
});

// Server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
