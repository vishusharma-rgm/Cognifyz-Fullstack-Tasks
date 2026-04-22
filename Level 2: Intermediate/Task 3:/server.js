const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const homeFeatureCards = [
  {
    title: "Responsive Layouts",
    description:
      "Web pages that stay clean and readable across desktop, tablet, and mobile devices."
  },
  {
    title: "Frontend Development",
    description:
      "Bootstrap-based UI development with simple components, forms, and reusable styling."
  },
  {
    title: "Project Delivery",
    description:
      "Structured implementation with testing, refinement, and final review before release."
  }
];

const serviceCards = [
  {
    title: "Company Website Design",
    description:
      "Simple and professional websites for startups, agencies, and service businesses."
  },
  {
    title: "Responsive Frontend Development",
    description:
      "Modern responsive pages built with Bootstrap, clean HTML, and practical CSS."
  },
  {
    title: "Landing Page Development",
    description:
      "Focused landing pages with strong visual hierarchy, CTA sections, and responsive layout."
  },
  {
    title: "Dashboard UI Support",
    description:
      "Clear interface sections for admin panels, reports, and internal tools."
  },
  {
    title: "UI Refactoring",
    description:
      "Improving old frontend layouts with better spacing, typography, and alignment."
  },
  {
    title: "Maintenance and Updates",
    description:
      "Ongoing frontend fixes, page enhancements, and structured improvements over time."
  }
];

const processSteps = [
  {
    step: "01",
    title: "Requirement Discussion",
    description:
      "We collect project goals, content needs, and design preferences before starting the UI work."
  },
  {
    step: "02",
    title: "Wireframe and Structure",
    description:
      "The page structure is planned section by section so the layout remains clear and practical."
  },
  {
    step: "03",
    title: "Design and Development",
    description:
      "We build the frontend using Bootstrap and custom CSS with consistent spacing and responsive behavior."
  },
  {
    step: "04",
    title: "Testing and Delivery",
    description:
      "Before delivery, the layout is checked on different screen sizes and refined for better usability."
  }
];

const aboutHighlights = [
  "Focused on practical frontend development for business websites",
  "Uses Bootstrap, clean CSS, and responsive design principles",
  "Builds layouts that feel structured, readable, and production-ready"
];

const aboutStats = [
  { value: "12+", label: "Project layouts created" },
  { value: "5", label: "Core service areas" },
  { value: "100%", label: "Responsive-first approach" }
];

const testimonials = [
  {
    quote:
      "The final frontend looked clean, organized, and easy to review across all devices.",
    author: "Rohit Kumar",
    role: "Project Reviewer",
    company: "Northline Media",
    project: "Corporate Website Revamp"
  },
  {
    quote:
      "The layout felt practical and professional without looking overdesigned.",
    author: "Sneha Verma",
    role: "UI Mentor",
    company: "Aster Digital",
    project: "Responsive Landing Page"
  }
];

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

function buildSharedPageModel(activePage, pageTitle) {
  return {
    activePage,
    pageTitle
  };
}

function buildHomePageModel() {
  return {
    ...buildSharedPageModel("home", "Task 3 - Modern Multi-Page Website"),
    featureCards: homeFeatureCards,
    processSteps,
    testimonials
  };
}

function buildAboutPageModel() {
  return {
    ...buildSharedPageModel("about", "About - Cognifyz Solutions"),
    aboutHighlights,
    aboutStats
  };
}

function buildServicesPageModel() {
  return {
    ...buildSharedPageModel("services", "Services - Cognifyz Solutions"),
    serviceCards
  };
}

function buildProcessPageModel() {
  return {
    ...buildSharedPageModel("process", "Work Process - Cognifyz Solutions"),
    processSteps
  };
}

function buildContactPageModel() {
  return {
    ...buildSharedPageModel("contact", "Contact - Cognifyz Solutions")
  };
}

app.get("/", (req, res) => {
  res.render("index", buildHomePageModel());
});

app.get("/about", (req, res) => {
  res.render("about", buildAboutPageModel());
});

app.get("/services", (req, res) => {
  res.render("services", buildServicesPageModel());
});

app.get("/process", (req, res) => {
  res.render("process", buildProcessPageModel());
});

app.get("/contact", (req, res) => {
  res.render("contact", buildContactPageModel());
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Task 3 server running at http://localhost:${PORT}`);
  });
}

module.exports = app;
module.exports.buildHomePageModel = buildHomePageModel;
module.exports.buildAboutPageModel = buildAboutPageModel;
module.exports.buildServicesPageModel = buildServicesPageModel;
module.exports.buildProcessPageModel = buildProcessPageModel;
module.exports.buildContactPageModel = buildContactPageModel;
