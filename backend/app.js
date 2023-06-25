const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const debug = require("debug")("backend:server");

const jsonResponseMiddleware = require("./middlewares/json-response.middleware");
const errorHandler = require("./utils/errorHandler");

// apply passport config
require("./config/passport.config");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "http://localhost:5173",
    })
  );
}

app.use(logger("dev", { stream: { write: (msg) => debug(msg) } }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(jsonResponseMiddleware);

require("./routes/index").forEach((route) => {
  app.use(route.meta.route, route.router);
});

app.use(errorHandler);

module.exports = app;
