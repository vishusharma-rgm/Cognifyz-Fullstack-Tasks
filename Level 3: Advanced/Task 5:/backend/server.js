require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const projectRoutes = require("./routes/projectRoutes");

const app = express();
const PORT = process.env.PORT || 5100;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Workspace API is running" });
});

app.use("/api/projects", projectRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

async function startServer() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Workspace API running on http://localhost:${PORT}`);
  });
}

startServer();
