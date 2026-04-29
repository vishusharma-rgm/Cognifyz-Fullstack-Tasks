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

test("home page model includes features, timeline steps, and testimonials", () => {
  const model = app.buildHomePageModel();

  assert.equal(model.featureCards.length, 3);
  assert.equal(model.processSteps.length, 4);
  assert.equal(model.testimonials.length, 3);
});

test("home page renders the hero, services preview, and timeline", async () => {
  const html = await renderView("index", app.buildHomePageModel());

  assert.match(html, /Frontend design and development for modern business websites/);
  assert.match(html, /timeline-wrapper/);
  assert.match(html, /Explore Services/);
  assert.match(html, /data-feedback-trigger/);
  assert.match(html, /feedbackModal/);
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
