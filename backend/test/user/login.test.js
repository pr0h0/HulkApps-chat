const assert = require("chai").assert;
const app = require("../test-app");
const supertest = require("supertest");

const request = supertest.agent(app);

const {
  username,
  password,
  invalidPassword,
  invalidUsername,
} = require("../constants");

describe("User", () => {
  describe("Test is running", () => {
    it("Login user tests are running", () => {});
  });

  describe("Login", () => {
    before((done) => {
      // register a user with test username if doesnt exist already
      request
        .post("/api/users/register")
        .send({
          username,
          password,
        })
        .end((err, res) => {
          done();
        });
    });

    it("should not login a user - inavlid username", (done) => {
      request
        .post("/api/users/login")
        .send({
          username: invalidUsername,
          password,
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          assert.equal(res.body.error, true);
          assert.isNotEmpty(res.body.msg);
          done();
        });
    });
    it("should not login a user - inavlid password", (done) => {
      request
        .post("/api/users/login")
        .send({
          username,
          password: invalidPassword,
        })
        .end((err, res) => {
          assert.equal(res.status, 500);
          assert.equal(res.body.error, true);
          assert.isNotEmpty(res.body.msg);
          done();
        });
    });
    it("should login a user", (done) => {
      request
        .post("/api/users/login")
        .send({
          username,
          password,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, false);
          assert.isNotEmpty(res.body.msg);
          assert.isNotNull(res.body.data);
          assert.isNotNull(res.body.data.token);
          done();
        });
    });
  });
});
