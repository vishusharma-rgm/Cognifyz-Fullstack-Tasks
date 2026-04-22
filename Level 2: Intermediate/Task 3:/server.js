const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const serviceCards = [
  {
    title: "Website Planning",
    description:
      "We plan page structure, content sections, and layout flow before starting development.",
    badge: "01"
  },
  {
    title: "Responsive UI Design",
    description:
      "We create simple responsive pages that work properly across desktop, tablet, and mobile screens.",
    badge: "02"
  },
  {
    title: "Frontend Development",
    description:
      "We build clean Bootstrap-based interfaces with practical sections, forms, and reusable styling.",
    badge: "03"
  }
];

const processSteps = [
  {
    title: "Requirement Discussion",
    description:
      "We first understand the page purpose, target users, and the content that needs to be shown clearly."
  },
  {
    title: "Layout and Styling",
    description:
      "Next we prepare the layout using Bootstrap grid and apply simple styling for a clean interface."
  },
  {
    title: "Testing and Delivery",
    description:
      "Finally we test responsiveness, improve spacing, and share the completed frontend for review."
  }
];

const aboutPoints = [
  "Small business website design and development",
  "Responsive Bootstrap-based user interfaces",
  "Clean frontend code suitable for student projects"
];

const aboutValues = [
  "Focus on clear and readable layouts",
  "Write simple and maintainable frontend code",
  "Build pages that look practical and realistic"
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

function buildHomePageModel() {
  return {
    pageTitle: "Task 3 - Advanced CSS Styling and Responsive Design",
    serviceCards,
    processSteps
  };
}

function buildAboutPageModel() {
  return {
    pageTitle: "About - Cognifyz Solutions",
    aboutPoints,
    aboutValues
  };
}

app.get("/", (req, res) => {
  res.render("index", buildHomePageModel());
});

app.get("/about", (req, res) => {
  res.render("about", buildAboutPageModel());
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task 3 server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.buildHomePageModel = buildHomePageModel;
module.exports.buildAboutPageModel = buildAboutPageModel;
