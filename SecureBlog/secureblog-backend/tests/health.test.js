// health.test.js

const request = require("supertest");
const app = require("../app"); // make sure the path points to your app.js

describe("Health Check Endpoint", () => {
  it("should return status 200 and { ok: true }", async () => {
    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ ok: true });
  });
});
