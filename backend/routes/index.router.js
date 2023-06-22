const express = require("express");
const router = express.Router();

const meta = {
  title: "Index router",
  description: "This router handles the index route",
  route: "/",
};

const controller = require("../controllers/index.controller");

// catch all route
router.all(`*`, controller.index);

module.exports = {
  router,
  meta,
};
