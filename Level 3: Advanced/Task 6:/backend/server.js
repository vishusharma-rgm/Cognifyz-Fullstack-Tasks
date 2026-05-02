require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const dataRoutes = require("./routes/dataRoutes");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Task 6 authenticated API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/data", dataRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Task 6 API running on http://localhost:${PORT}`);
  });
}

startServer();
