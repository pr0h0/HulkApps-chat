const { Server } = require("socket.io");
const userService = require("./services/user.service");

module.exports = function (appServer) {
  const io = new Server(appServer, {
    cors: {
      origin: "*",
    },
    path: "/socket.io",
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    userService
      .parseJWT(token)
      .then((decoded) => {
        socket.decoded = decoded;
        return next();
      })
      .catch((err) => {
        return next(err);
      });
  });

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("disconnect", () => {
      console.log("user disconnected");
    });

    socket.on("new-message", (message) => {
      console.log(message);
      socket.broadcast.emit("new-message", message);
    });
  });
};
