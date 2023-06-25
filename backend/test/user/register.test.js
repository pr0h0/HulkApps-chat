const assert = require("chai").assert;
const app = require("../test-app");
const supertest = require("supertest");

const { username, password, invalidPassword } = require("../constants");

const request = supertest.agent(app);

const getRandomUsername = () => `test${Math.random()}`;

describe("User", () => {
  describe("Test is running", () => {
    it("Register user tests are running", () => {});

    before((done) => {
      // register a user with test username if doesnt exist already
      request
        .post("/api/users/register")
        .send({
          username,
          password,
        })
        .end(() => done());
    });
  });

  describe("Register", () => {
    it("should not register a user - username already taken", (done) => {
      request
        .post("/api/users/register")
        .send({
          username,
          password,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, true);
          assert.isNotEmpty(res.body.msg);
          done();
        });
    });
    it("should not register a user - password too short", (done) => {
      request
        .post("/api/users/register")
        .send({
          username: getRandomUsername(),
          password: invalidPassword,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          assert.equal(res.body.error, true);
          assert.isNotEmpty(res.body.msg);
          done();
        });
    });

    it("should register a user", (done) => {
      request
        .post("/api/users/register")
        .send({
          username: getRandomUsername(),
          password,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, false);
          assert.equal(res.body.msg, "User registered successfully");
          done();
        });
    });
  });
});
