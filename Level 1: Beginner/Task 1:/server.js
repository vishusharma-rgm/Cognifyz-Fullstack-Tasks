const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index", {
    pageTitle: "Task 1 - HTML Structure and Basic Server",
    formData: {
      fullName: "",
      email: "",
      role: "",
      message: ""
    },
    errors: []
  });
});

app.post("/submit", (req, res) => {
  const formData = {
    fullName: req.body.fullName?.trim() || "",
    email: req.body.email?.trim() || "",
    role: req.body.role?.trim() || "",
    message: req.body.message?.trim() || ""
  };

  const errors = [];

  if (!formData.fullName) {
    errors.push("Full name is required.");
  }

  if (!formData.email) {
    errors.push("Email address is required.");
  }

  if (!formData.role) {
    errors.push("Please select your role.");
  }

  if (!formData.message) {
    errors.push("Message is required.");
  }

  if (errors.length > 0) {
    return res.status(400).render("index", {
      pageTitle: "Task 1 - HTML Structure and Basic Server",
      formData,
      errors
    });
  }

  res.render("submission", {
    pageTitle: "Submission Received",
    submittedAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    }),
    formData
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
