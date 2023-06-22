const express = require("express");
const router = express.Router();

const meta = {
  title: "API Index router",
  description: "This router handles the api root route",
  route: "/api",
};

const controller = require("../controllers/api.controller.js");

// catch all api route
router.all(`/*`, controller.notFound);

module.exports = {
  router,
  meta,
};
