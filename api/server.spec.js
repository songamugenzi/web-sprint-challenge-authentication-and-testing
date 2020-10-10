const request = require("supertest");
const server = require("./server.js");
const db = require("../database/dbConfig.js");
const testUser = { username: "tester", password: "tester" };

describe("server.js", () => {
  describe("GET request for dad jokes", () => {
    it("should return 400 status code when NOT logged in", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.status).toBe(400);
    });

    it("should return JSON", async () => {
      const res = await request(server).get("/api/jokes");
      expect(res.type).toBe("application/json");
    });
  });

  describe("registering a new user", () => {
    it("should return 201 status code when adding new user", async () => {
      await db("users").truncate();

      const res = await request(server)
        .post("/api/auth/register")
        .send(testUser)
        .expect(res.status)
        .toBe(201);
    });

    it("should return 500 status code with invalid user", async () => {
        const res = await request(server)
        .post("/api/auth/register")
        .send({ user: "tester", pass: "tester" })
        expect(res.status).toBe(500);
    })
  });

  describe("login with user", () => {
      it("should return 200 status code with test user", async () => {
        const res = await request(server)
        .post("/api/auth/login")
        .send(testUser)
        .expect(res.status).toBe(200)
      })

      it("should return 401 status code with non-valid user", async () => {
        const res = await request(server)
        .post("/api/auth/login")
        .send({ username: "does not exist", password: "does not exist" })
        .expect(res.status).toBe(401)
      })
  })
});
