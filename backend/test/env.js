const values = {
  NODE_ENV: "test",
  DEBUG: "backend:*",
  PORT: "3000",
  JWT_SECRET: "123123123123",
  REDIS_URL: "redis://64.188.17.203:6379/test",
};

Object.keys(values).forEach((key) => {
  process.env[key] = values[key];
});

module.exports = values;
