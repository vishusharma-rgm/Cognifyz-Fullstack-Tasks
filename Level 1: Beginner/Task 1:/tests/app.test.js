const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const app = require("../server");

test("GET / renders the input form", async () => {
  const response = await request(app).get("/");

  assert.equal(response.status, 200);
  assert.match(response.text, /<form action="\/submit" method="POST" class="user-form">/);
  assert.match(response.text, /HTML Structure and Basic Server/);
});

test("POST /submit renders submitted form data", async () => {
  const response = await request(app).post("/submit").type("form").send({
    fullName: "Vishu Sharma",
    email: "vishu@example.com",
    role: "Student",
    message: "I want to learn full stack development."
  });

  assert.equal(response.status, 200);
  assert.match(response.text, /Submission Received/);
  assert.match(response.text, /Vishu Sharma/);
});

test("POST /submit returns validation errors for missing fields", async () => {
  const response = await request(app).post("/submit").type("form").send({
    fullName: "",
    email: "",
    role: "",
    message: ""
  });

  assert.equal(response.status, 400);
  assert.match(response.text, /Please fix the following:/);
  assert.match(response.text, /Full name is required\./);
});
