const { beforeEach, test } = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

beforeEach(() => {
  app.clearTemporaryStorage();
});

test("GET / renders the advanced form with inline interaction hooks", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.match(response.text, /Internship Application Form/);
  assert.match(response.text, /onsubmit="return validateApplicationForm\(this\);"/);
  assert.match(response.text, /Applications received: 0/);
});

test("POST \/submit stores a validated submission in temporary memory", async () => {
  const response = await request(app).post("/submit").type("form").send({
    fullName: "Vishu Sharma",
    email: "vishu@example.com",
    phone: "+91 98765 43210",
    role: "Student",
    track: "Full Stack Development",
    workMode: "Remote",
    availability: "2099-12-31",
    portfolio: "https://github.com/vishu",
    skills: ["HTML", "JavaScript", "Node.js"],
    message: "I want to strengthen my full stack skills through real project work.",
    newsletter: "yes",
    consent: "yes"
  });

  assert.equal(response.status, 200);
  assert.match(response.text, /Submission Received/);
  assert.match(response.text, /Validation complete/);
  assert.match(response.text, /Full Stack Development/);
  assert.equal(app.temporarySubmissions.length, 1);
  assert.equal(app.temporarySubmissions[0].fullName, "Vishu Sharma");
});

test("POST \/submit rejects invalid data on the server and does not store it", async () => {
  const response = await request(app).post("/submit").type("form").send({
    fullName: "Vi",
    email: "invalid-email",
    phone: "123",
    role: "Unknown",
    track: "",
    workMode: "",
    availability: "2000-01-01",
    portfolio: "github.com/vishu",
    skills: [],
    message: "Too short",
    consent: ""
  });

  assert.equal(response.status, 400);
  assert.match(response.text, /Please fix the following:/);
  assert.match(response.text, /Please enter a valid email address\./);
  assert.match(response.text, /Select at least one valid skill\./);
  assert.equal(app.temporarySubmissions.length, 0);
});
