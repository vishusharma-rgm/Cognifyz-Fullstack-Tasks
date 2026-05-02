const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let tasks = [
  { id: 1, title: "Learn REST API flow", description: "Connect React with Express" },
  { id: 2, title: "Test CRUD actions", description: "Create, edit, and delete tasks" }
];

let nextId = 3;

app.get("/", (req, res) => {
  res.status(200).json({ message: "Task 5 API is running" });
});

app.get("/api/tasks", (req, res) => {
  res.status(200).json({ success: true, data: tasks });
});

app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((item) => item.id === Number(req.params.id));

  if (!task) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  res.status(200).json({ success: true, data: task });
});

app.post("/api/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  const newTask = {
    id: nextId++,
    title,
    description
  };

  tasks.push(newTask);
  res.status(201).json({ success: true, data: newTask });
});

app.put("/api/tasks/:id", (req, res) => {
  const { title, description } = req.body;
  const taskIndex = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  if (!title || !description) {
    return res.status(400).json({
      success: false,
      message: "Title and description are required"
    });
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title,
    description
  };

  res.status(200).json({ success: true, data: tasks[taskIndex] });
});

app.delete("/api/tasks/:id", (req, res) => {
  const taskIndex = tasks.findIndex((item) => item.id === Number(req.params.id));

  if (taskIndex === -1) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  const deletedTask = tasks.splice(taskIndex, 1)[0];
  res.status(200).json({ success: true, data: deletedTask });
});

app.listen(PORT, () => {
  console.log(`Task 5 API running on http://localhost:${PORT}`);
});
