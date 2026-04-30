const test = require("node:test");
const assert = require("node:assert/strict");

const app = require("../server");

function renderView(view, data) {
  return new Promise((resolve, reject) => {
    app.render(view, data, (error, html) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(html);
    });
  });
}

test("home page model returns the shared landing model", () => {
  const model = app.buildHomePageModel();

  assert.equal(model.activePage, "home");
  assert.equal(model.pageTitle, "Task 3 - Modern Multi-Page Website");
});

test("home page renders the landing hero only", async () => {
  const html = await renderView("index", app.buildHomePageModel());

  assert.match(html, /Frontend design and development for modern business websites/);
  assert.match(html, /View Features/);
  assert.doesNotMatch(html, /timeline-wrapper/);
  assert.doesNotMatch(html, /Recent frontend project directions/);
});

test("about page renders company information and long-form sections", async () => {
  const html = await renderView("about", app.buildAboutPageModel());

  assert.match(html, /About Cognifyz Solutions/);
  assert.match(html, /A frontend process that stays clear from start to finish/);
  assert.match(html, /From first conversation to final delivery/);
});

test("services page renders service grid cards", async () => {
  const html = await renderView("services", app.buildServicesPageModel());

  assert.match(html, /Frontend services/);
  assert.match(html, /service-grid-card/);
});

test("features page renders the feature cards", async () => {
  const html = await renderView("features", app.buildFeaturesPageModel());

  assert.match(html, /What this website delivers/);
  assert.match(html, /Responsive Systems/);
  assert.match(html, /content-card/);
});

test("solutions page renders the business solution cards", async () => {
  const html = await renderView("solutions", app.buildSolutionsPageModel());

  assert.match(html, /Website solutions for different business needs/);
  assert.match(html, /Service Business Websites/);
  assert.match(html, /Lead Generation/);
});

test("process page renders the vertical timeline", async () => {
  const html = await renderView("process", app.buildProcessPageModel());

  assert.match(html, /Work that looks intentional from the first scroll/);
  assert.match(html, /work-hero-stage/);
  assert.match(html, /timeline-dot/);
});

test("contact page renders the validated contact form", async () => {
  const html = await renderView("contact", app.buildContactPageModel());

  assert.match(html, /Let’s discuss your frontend project/);
  assert.match(html, /contactForm/);
  assert.match(html, /form-error/);
});
