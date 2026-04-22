const { beforeEach, test } = require("node:test");
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

beforeEach(() => {
  app.clearApplications();
});

test("index view renders the routed application portal", async () => {
  const html = await renderView("index", app.buildPageModel());

  assert.match(html, /Internship Application/);
  assert.match(html, /window\.formConfig/);
  assert.match(html, /data-route="review"/);
});

test("submitApplication accepts a valid application", () => {
  const result = app.submitApplication({
    fullName: "Vishu Sharma",
    email: "vishu@example.com",
    password: "Strong@123",
    confirmPassword: "Strong@123",
    role: "Full Stack Intern",
    track: "React",
    bio: "I enjoy building interfaces and want to grow through production projects.",
    acceptTerms: true
  });

  assert.equal(result.ok, true);
  assert.equal(result.application.role, "Full Stack Intern");
  assert.equal(app.applications.length, 1);
});

test("submitApplication rejects weak or incomplete data", () => {
  const result = app.submitApplication({
    fullName: "Vi",
    email: "bad-email",
    password: "weak",
    confirmPassword: "no-match",
    role: "Unknown",
    track: "",
    bio: "Too short",
    acceptTerms: false
  });

  assert.equal(result.ok, false);
  assert.match(result.errors.password, /Password must be 8\+/);
  assert.match(result.errors.fullName, /at least 3 characters/);
  assert.equal(app.applications.length, 0);
});
