const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ROLE_OPTIONS = ["Frontend Intern", "Backend Intern", "Full Stack Intern"];
const TRACK_OPTIONS = ["JavaScript", "React", "Node.js", "UI Systems"];
const applications = [];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function validateApplication(data = {}) {
  const errors = {};

  if (!data.fullName || data.fullName.trim().length < 3) {
    errors.fullName = "Full name must be at least 3 characters long.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "")) {
    errors.email = "Please enter a valid email address.";
  }

  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(
      data.password || ""
    )
  ) {
    errors.password =
      "Password must be 8+ characters with uppercase, lowercase, number, and symbol.";
  }

  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Confirm password must match the password.";
  }

  if (!ROLE_OPTIONS.includes(data.role)) {
    errors.role = "Please choose a valid internship role.";
  }

  if (!TRACK_OPTIONS.includes(data.track)) {
    errors.track = "Please choose a valid specialization track.";
  }

  if (!data.bio || data.bio.trim().length < 20) {
    errors.bio = "Professional summary must be at least 20 characters long.";
  }

  if (!data.acceptTerms) {
    errors.acceptTerms = "You must accept the application terms.";
  }

  return errors;
}

function buildPageModel() {
  return {
    pageTitle: "Task 4 - Complex Form Validation and Dynamic DOM Manipulation",
    roleOptions: ROLE_OPTIONS,
    trackOptions: TRACK_OPTIONS,
    totalApplications: applications.length
  };
}

function submitApplication(payload) {
  const errors = validateApplication(payload);

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const savedApplication = {
    id: applications.length + 1,
    fullName: payload.fullName,
    email: payload.email,
    role: payload.role,
    track: payload.track,
    bio: payload.bio
  };

  applications.unshift(savedApplication);

  return {
    ok: true,
    application: savedApplication,
    totalApplications: applications.length
  };
}

app.get("/", (req, res) => {
  res.render("index", buildPageModel());
});

app.post("/api/applications", (req, res) => {
  const payload = {
    fullName: req.body.fullName?.trim() || "",
    email: req.body.email?.trim() || "",
    password: req.body.password || "",
    confirmPassword: req.body.confirmPassword || "",
    role: req.body.role?.trim() || "",
    track: req.body.track?.trim() || "",
    bio: req.body.bio?.trim() || "",
    acceptTerms: Boolean(req.body.acceptTerms)
  };

  const result = submitApplication(payload);

  if (!result.ok) {
    return res.status(400).json(result);
  }

  return res.json(result);
});

function clearApplications() {
  applications.length = 0;
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task 4 server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.clearApplications = clearApplications;
module.exports.applications = applications;
module.exports.validateApplication = validateApplication;
module.exports.buildPageModel = buildPageModel;
module.exports.submitApplication = submitApplication;
