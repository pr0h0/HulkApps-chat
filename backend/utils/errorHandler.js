const HttpError = require("./HttpError");

function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    res.jsonError({
      status: err.status,
      msg: err.message,
      data: err.data,
    });
  } else {
    res.jsonError({
      status: 500,
      msg: err.message,
      data: null,
    });
  }
}

module.exports = errorHandler;
