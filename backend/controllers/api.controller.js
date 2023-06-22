module.exports = {
  notFound,
};

function notFound(req, res) {
  res.jsonError({
    status: 404,
    message: "Route not found",
  });
}
