const { Server } = require("socket.io");
const { RateLimiterMemory } = require("rate-limiter-flexible");

const userService = require("./services/user.service");
const conversationService = require("./services/conversation.service");
const messageService = require("./services/message.service");
const redisService = require("./services/redis.service");

const rateLimiter = new RateLimiterMemory({
  points: 10, // x attempts
  duration: 60, // per x second
});

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
    console.log("user connected", socket.decoded.user.username);
    redisService.setUserOnlineStatus(socket.decoded.user.id, true);
    socket.on("disconnect", () => {
      redisService.setUserOnlineStatus(socket.decoded.user.id, false);
      console.log("user disconnected", socket.decoded.user.username);
    });

    const userId = socket.decoded.user.id;
    socket.join(`u-${userId}`);
    conversationService.getConversations(userId).then((conversations) => {
      conversations.forEach((conversation) => {
        socket.join(`c-${conversation.id}`);
      });
    });

    socket.on(
      "new-message",
      async ({ message: text, conversationId, userId }, callback) => {
        try {
          await rateLimiter.consume(userId);

          const message = await messageService.createMessage(
            text,
            conversationId,
            userId
          );
          callback();
          io.to(`c-${conversationId}`).emit("new-message", message);
        } catch (err) {
          console.log(err);
          socket.emit(
            "warning",
            "You are sending too many messages. Please wait a minute and try again."
          );
        }
      }
    );

    socket.on("create-or-join-group", async (groupName, callback) => {
      if (!groupName || !groupName.trim()) {
        return callback({ error: true, message: "Group name is required" });
      }

      const conversation = await conversationService.createGroupConversation(
        groupName.toLowerCase(),
        socket.decoded.user.id
      );

      socket.join(`c-${conversation.id}`);
      socket
        .to(`c-${conversation.id}`)
        .emit("new-person", conversation.id, socket.decoded.user);
      callback(conversation);
    });

    socket.on("get-conversations", async () => {
      const conversations = await conversationService.getConversations(
        socket.decoded.user.id
      );
      socket.emit("conversations", conversations);
    });

    socket.on("leave-group", async (conversationId, callback) => {
      try {
        await conversationService.leaveGroup(
          conversationId,
          socket.decoded.user.id
        );
        socket
          .to(`c-${conversationId}`)
          .emit("leave-person", conversationId, socket.decoded.user);
        socket.leave(`c-${conversationId}`);
        callback(true);
      } catch (err) {
        callback(false, err.message);
      }
    });

    socket.on("find-private-chat", async (username, callback) => {
      const conversation = await conversationService.findOrCreatePrivateChat(
        username,
        socket.decoded.user.id
      );

      if (!conversation && typeof callback === "function") {
        return callback(false);
      }

      if (conversation) {
        socket.join(`c-${conversation.id}`);

        const userId = conversation.conversationUsers.find(
          (cu) => cu?.User.id !== socket.decoded.user.id
        )?.User.id;

        io.to(`u-${socket.decoded.user.id}`)
          .to(`u-${userId}`)
          .emit("private-chat", conversation);
      }
    });

    socket.on("check-online", async (conversationId, callback) => {
      const conversationUsers = await conversationService.getConversationUsers(
        conversationId
      );

      const onlineList = [];
      for (const conversationUser of conversationUsers) {
        const isOnline = await redisService.getUserOnlineStatus(
          conversationUser.User.id
        );
        onlineList.push({ userId: conversationUser.User.id, isOnline });
      }

      callback(onlineList);
    });
  });
};
