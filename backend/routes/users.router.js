const express = require("express");
const router = express.Router();

const meta = {
  title: "User router",
  description: "This router handles route related to users",
  route: "/api/users",
};

const controller = require("../controllers/users.controller");
const authGuard = require("../middlewares/auth.guard");

router.post("/register", controller.register);
router.post("/login", controller.login);

router.get("/me", authGuard, controller.me);

module.exports = {
  router,
  meta,
};
