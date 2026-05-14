require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const integrationRoutes = require("./routes/integrationRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 6000;

app.use(cors());
app.use(express.json());
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: "Too many requests. Please try again later." }
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "ProjectFlow secure API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/integrations", integrationRoutes);

app.use((req, res, next) => {
  const error = new Error("Route not found");
  error.statusCode = 404;
  next(error);
});
app.use(errorHandler);

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`ProjectFlow secure API running on http://localhost:${PORT}`);
  });
}

startServer();
