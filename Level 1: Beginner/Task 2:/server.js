const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const ROLE_OPTIONS = [
  "Student",
  "Intern",
  "Fresher",
  "Working Professional"
];
const TRACK_OPTIONS = [
  "Frontend Development",
  "Backend Development",
  "Full Stack Development",
  "UI/UX Design"
];
const WORK_MODE_OPTIONS = ["Remote", "Hybrid", "On-site"];
const SKILL_OPTIONS = ["HTML", "CSS", "JavaScript", "Node.js", "React"];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+]?[\d\s-]{10,20}$/;
const TEMPORARY_STORAGE_LIMIT = 10;
const temporarySubmissions = [];

let nextSubmissionId = 1;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function getEmptyFormData() {
  return {
    fullName: "",
    email: "",
    phone: "",
    role: "",
    track: "",
    workMode: "",
    availability: "",
    portfolio: "",
    message: "",
    skills: [],
    newsletter: false,
    consent: false
  };
}

function toArray(value) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function normalizeFormData(raw = {}) {
  return {
    fullName: raw.fullName?.trim() || "",
    email: raw.email?.trim().toLowerCase() || "",
    phone: raw.phone?.trim() || "",
    role: raw.role?.trim() || "",
    track: raw.track?.trim() || "",
    workMode: raw.workMode?.trim() || "",
    availability: raw.availability?.trim() || "",
    portfolio: raw.portfolio?.trim() || "",
    message: raw.message?.trim() || "",
    skills: toArray(raw.skills)
      .map((skill) => skill?.trim())
      .filter(Boolean),
    newsletter: raw.newsletter === "yes",
    consent: raw.consent === "yes"
  };
}

function isValidUrl(value) {
  try {
    const parsedUrl = new URL(value);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch (error) {
    return false;
  }
}

function isFutureOrToday(dateString) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return false;
  }

  const selectedDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(selectedDate.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return selectedDate >= today;
}

function validateFormData(formData) {
  const errors = [];
  const fieldErrors = {};

  function addFieldError(fieldName, message) {
    errors.push(message);
    if (!fieldErrors[fieldName]) {
      fieldErrors[fieldName] = message;
    }
  }

  if (!formData.fullName || formData.fullName.length < 3) {
    addFieldError("fullName", "Full name must be at least 3 characters long.");
  }

  if (!EMAIL_REGEX.test(formData.email)) {
    addFieldError("email", "Please enter a valid email address.");
  }

  if (!PHONE_REGEX.test(formData.phone)) {
    addFieldError("phone", "Please enter a valid phone number.");
  }

  if (!ROLE_OPTIONS.includes(formData.role)) {
    addFieldError("role", "Please select a valid current role.");
  }

  if (!TRACK_OPTIONS.includes(formData.track)) {
    addFieldError("track", "Please choose a valid internship track.");
  }

  if (!WORK_MODE_OPTIONS.includes(formData.workMode)) {
    addFieldError("workMode", "Please choose your preferred work mode.");
  }

  if (
    formData.skills.length === 0 ||
    formData.skills.some((skill) => !SKILL_OPTIONS.includes(skill))
  ) {
    addFieldError("skills", "Select at least one valid skill.");
  }

  if (!isFutureOrToday(formData.availability)) {
    addFieldError(
      "availability",
      "Please choose an availability date from today onward."
    );
  }

  if (formData.portfolio && !isValidUrl(formData.portfolio)) {
    addFieldError(
      "portfolio",
      "Portfolio link must start with http:// or https://."
    );
  }

  if (formData.message.length < 30) {
    addFieldError(
      "message",
      "Motivation message must be at least 30 characters long."
    );
  }

  if (formData.message.length > 400) {
    addFieldError(
      "message",
      "Motivation message must stay within 400 characters."
    );
  }

  if (!formData.consent) {
    addFieldError(
      "consent",
      "You must confirm that the submitted information is accurate."
    );
  }

  return { errors, fieldErrors };
}

function formatTimestamp(date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

function saveSubmission(formData) {
  const savedSubmission = {
    id: nextSubmissionId,
    submittedAt: new Date(),
    ...formData
  };

  nextSubmissionId += 1;
  temporarySubmissions.unshift(savedSubmission);

  if (temporarySubmissions.length > TEMPORARY_STORAGE_LIMIT) {
    temporarySubmissions.pop();
  }

  return savedSubmission;
}

function buildFormViewModel(overrides = {}) {
  return {
    pageTitle: "Task 2 - Inline Styles, Interaction, and Validation",
    formData: getEmptyFormData(),
    errors: [],
    fieldErrors: {},
    roleOptions: ROLE_OPTIONS,
    trackOptions: TRACK_OPTIONS,
    workModeOptions: WORK_MODE_OPTIONS,
    skillOptions: SKILL_OPTIONS,
    recentSubmissions: temporarySubmissions.slice(0, 5),
    storageCount: temporarySubmissions.length,
    ...overrides
  };
}

function renderForm(res, overrides = {}, statusCode = 200) {
  return res.status(statusCode).render("index", buildFormViewModel(overrides));
}

app.get("/", (req, res) => {
  renderForm(res);
});

app.post("/submit", (req, res) => {
  const formData = normalizeFormData(req.body);
  const { errors, fieldErrors } = validateFormData(formData);

  if (errors.length > 0) {
    return renderForm(res, { formData, errors, fieldErrors }, 400);
  }

  const savedSubmission = saveSubmission(formData);

  return res.render("submission", {
    pageTitle: "Submission Received",
    formData: savedSubmission,
    submittedAt: formatTimestamp(savedSubmission.submittedAt),
    totalSubmissions: temporarySubmissions.length,
    recentSubmissions: temporarySubmissions.slice(0, 5)
  });
});

function clearTemporaryStorage() {
  temporarySubmissions.length = 0;
  nextSubmissionId = 1;
}

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.clearTemporaryStorage = clearTemporaryStorage;
module.exports.temporarySubmissions = temporarySubmissions;
module.exports.normalizeFormData = normalizeFormData;
module.exports.validateFormData = validateFormData;
