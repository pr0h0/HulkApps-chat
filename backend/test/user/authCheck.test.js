const assert = require("chai").assert;
const { expect } = require("chai");
const app = require("../test-app");
const supertest = require("supertest");

const request = supertest.agent(app);

const { username, password } = require("../constants");

let token = null;

describe("User", () => {
  describe("Test is running", () => {
    it("Login user tests are running", () => {});
  });

  describe("AuthCheck", () => {
    before((done) => {
      // register a user with test username if doesnt exist already
      request
        .post("/api/users/register")
        .send({
          username,
          password,
        })
        .end((err, res) => {
          request
            .post("/api/users/login")
            .send({
              username,
              password,
            })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              expect(res.body.error).to.equal(false);
              expect(res.body.token).to.not.equal(null);
              token = res.body.data.token;
              done();
            });
        });
    });

    it("should return unauthorized", (done) => {
      request.get("/api/users/me").end((err, res) => {
        assert.equal(res.status, 401);
        assert.equal(res.text, "Unauthorized");
        done();
      });
    });
    it("should return user", (done) => {
      request
        .get("/api/users/me")
        .set({ Authorization: `Bearer ${token}` })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.equal(res.body.error, false);
          assert.isNotEmpty(res.body.msg);
          done();
        });
    });
  });
});
