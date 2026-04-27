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

const workHeroStats = [
  { value: "04", label: "Immersive story bands" },
  { value: "3D", label: "Depth-led visual direction" },
  { value: "100%", label: "Responsive motion polish" }
];

const workflowScenes = [
  {
    step: "01",
    eyebrow: "Discover",
    title: "We define the story before touching the pixels",
    description:
      "Goals, positioning, page hierarchy, and user attention flow are mapped first so the final interface feels deliberate instead of random.",
    points: ["Goal mapping", "Content flow", "Visual direction"],
    accent: "Strategy board"
  },
  {
    step: "02",
    eyebrow: "Compose",
    title: "Sections are built like cinematic beats, not plain blocks",
    description:
      "Each band gets its own contrast, pacing, and focal point so the scroll feels progressive and premium from top to bottom.",
    points: ["Hero framing", "Section rhythm", "Motion hierarchy"],
    accent: "Scene layout"
  },
  {
    step: "03",
    eyebrow: "Build",
    title: "3D surfaces, layered cards, and motion bring the work alive",
    description:
      "Depth, transforms, glow, and reveal timing are tuned together so the page carries weight and character without becoming noisy.",
    points: ["3D depth", "Hover response", "Scroll reveal"],
    accent: "Interaction pass"
  },
  {
    step: "04",
    eyebrow: "Refine",
    title: "The last pass is where the page starts feeling expensive",
    description:
      "Spacing, mobile behavior, animation pacing, and visual balance are adjusted until the work reads as intentional on every screen.",
    points: ["Responsive fit", "Speed tuning", "Final polish"],
    accent: "Delivery check"
  }
];

const workSignals = [
  {
    title: "Visual hierarchy with weight",
    description:
      "Big sections, strong contrast, and layered framing help the work page feel substantial from the first screen."
  },
  {
    title: "Motion that supports the story",
    description:
      "Reveal timing and scroll-linked movement are used to make the page feel alive without looking chaotic."
  },
  {
    title: "Detail that survives mobile",
    description:
      "The same visual intent is preserved on tablet and mobile with cleaner spacing and controlled depth."
  }
];

const executionMetrics = [
  { value: "12+", label: "Animated surfaces tuned" },
  { value: "4", label: "Narrative sections composed" },
  { value: "1", label: "Single work page with full impact" }
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
      "The final frontend looked clean, organized, and surprisingly polished on every screen we tested.",
    author: "Rohit Kumar",
    role: "Project Reviewer",
    company: "Northline Media",
    project: "Corporate Website Revamp",
    focus: "Visual consistency across desktop and mobile screens",
    outcome: "Approved in the first review round with only minor content edits."
  },
  {
    quote:
      "The layout felt practical and professional while still having enough personality to stand out.",
    author: "Sneha Verma",
    role: "UI Mentor",
    company: "Aster Digital",
    project: "Responsive Landing Page",
    focus: "Balanced branding, spacing, and overall presentation quality",
    outcome: "Used as the preferred reference for the next landing page iteration."
  },
  {
    quote:
      "The feedback area now feels presentation-ready instead of looking like a basic student project block.",
    author: "Aman Shah",
    role: "Design Lead",
    company: "Pixel Forge Studio",
    project: "Brand Refresh Microsite",
    focus: "Client-facing polish and stronger feedback presentation",
    outcome: "Shared directly in the delivery deck without additional redesign."
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
    processSteps,
    workHeroStats,
    workflowScenes,
    workSignals,
    executionMetrics
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
