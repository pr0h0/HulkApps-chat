// apply env config
require("./env");

const app = require("../app");
const debug = require("debug")("backend:test");

app.set("port", process.env.PORT || 3000);

const server = app.listen(app.get("port"), () => {
  debug(`Express running → PORT ${server.address().port}`);
});

module.exports = server;
