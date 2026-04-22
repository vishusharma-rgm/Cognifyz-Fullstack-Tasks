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

test("homepage model includes the responsive content blocks", () => {
  const model = app.buildHomePageModel();

  assert.equal(model.serviceCards.length, 3);
  assert.equal(model.processSteps.length, 3);
});

test("index view renders the responsive landing content", async () => {
  const html = await renderView("index", app.buildHomePageModel());

  assert.match(html, /Frontend website layout for a small service company/);
  assert.match(html, /Our frontend development services/);
  assert.match(html, /service-card/);
  assert.match(html, /Level 2 Intermediate Task 3/);
});

test("about view renders the separate about page", async () => {
  const html = await renderView("about", app.buildAboutPageModel());

  assert.match(html, /About Cognifyz Solutions/);
  assert.match(html, /Back to Home/);
});
