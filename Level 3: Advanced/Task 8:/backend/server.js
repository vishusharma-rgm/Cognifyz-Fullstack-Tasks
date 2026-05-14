require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/db");
const { connectRedis } = require("./config/redis");
const { scheduleWeeklyProjectSummary } = require("./queues/projectSummaryQueue");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(helmet());
app.use(cors());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "ProjectFlow secure API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

async function startServer() {
  await connectDB();
  await connectRedis();
  await scheduleWeeklyProjectSummary();

  app.listen(PORT, () => {
    console.log(`ProjectFlow performance API running on http://localhost:${PORT}`);
  });
}

startServer();
