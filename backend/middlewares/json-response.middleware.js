const jsonSuccess = (res) => {
  return function ({ msg = "Success", data = null, status = 200 } = {}) {
    res.status(status);
    return res.json({
      error: false,
      data,
      msg,
    });
  };
};

const jsonError = (res) => {
  return function ({
    msg = "Something went wrong",
    status = 400,
    data = null,
  } = {}) {
    res.status(status);
    return res.json({
      error: true,
      data,
      msg,
    });
  };
};

const jsonResponseMiddleware = (req, res, next) => {
  res.jsonSuccess = jsonSuccess(res);
  res.jsonError = jsonError(res);
  next();
};

module.exports = jsonResponseMiddleware;
