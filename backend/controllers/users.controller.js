const asyncWrapper = require("../utils/asyncWrapper");
const userService = require("../services/user.service");
const passport = require("passport");
const jwt = require("jsonwebtoken");

module.exports = {
  register: asyncWrapper(register),
  login: asyncWrapper(login),
  me: asyncWrapper(me),
};

async function register(req, res) {
  const { username, password } = req.body;

  if (!username || !password || !username.trim()) {
    return res.jsonError({
      msg: "Username and password are required",
    });
  }

  await userService.register(username, password);

  res.jsonSuccess({
    msg: "User registered successfully",
  });
}

async function login(req, res, next) {
  return passport.authenticate(
    "login",
    async (err, user, info) => {
      try {
        if (err || !user) {
          const error = new Error(info?.message || err.message);
          return next(error);
        }

        req.login(user, { session: false }, async (error) => {
          if (error) return next(error);

          const body = { id: user.id, username: user.username };
          const token = jwt.sign({ user: body }, process.env.JWT_SECRET);

          const { id, username } = await userService.getById(body.id);

          return res.jsonSuccess({
            data: {
              id,
              username,
              token,
            },
          });
        });
      } catch (error) {
        return next(error);
      }
    },
    { session: false }
  )(req, res, next);
}

async function me(req, res) {
  const { id } = req.user;
  const user = await userService.getById(id);

  res.jsonSuccess({
    data: user,
  });
}
