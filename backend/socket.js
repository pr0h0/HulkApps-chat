const { Server } = require("socket.io");
const userService = require("./services/user.service");
const conversationService = require("./services/conversation.service");
const messageService = require("./services/message.service");
const redisService = require("./services/redis.service");
const { RateLimiterMemory } = require("rate-limiter-flexible");

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
      async ({ message: text, conversationId, userId }, cb) => {
        try {
          await rateLimiter.consume(userId);

          const message = await messageService.createMessage(
            text,
            conversationId,
            userId
          );
          cb();
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

    socket.on("create-or-join-group", async (groupName, cb) => {
      if (!groupName || !groupName.trim()) {
        return cb({ error: true, message: "Group name is required" });
      }

      const conversation = await conversationService.createGroupConversation(
        groupName.toLowerCase(),
        socket.decoded.user.id
      );

      socket.join(`c-${conversation.id}`);
      socket
        .to(`c-${conversation.id}`)
        .emit("new-person", conversation.id, socket.decoded.user);
      cb(conversation);
    });

    socket.on("get-conversations", async () => {
      const conversations = await conversationService.getConversations(
        socket.decoded.user.id
      );
      socket.emit("conversations", conversations);
    });

    socket.on("leave-group", async (conversationId, cb) => {
      try {
        await conversationService.leaveGroup(
          conversationId,
          socket.decoded.user.id
        );
        socket
          .to(`c-${conversationId}`)
          .emit("leave-person", conversationId, socket.decoded.user);
        socket.leave(`c-${conversationId}`);
        cb(true);
      } catch (err) {
        cb(false, err.message);
      }
    });

    socket.on("find-private-chat", async (username, cb) => {
      const conversation = await conversationService.findOrCreatePrivateChat(
        username,
        socket.decoded.user.id
      );

      if (!conversation && cb) {
        return cb(false);
      }

      const userId = conversation.conversationUsers.find(
        (cu) => cu?.User.id !== socket.decoded.user.id
      )?.User.id;

      if (conversation) {
        socket.join(`c-${conversation.id}`);
      }
      io.to(`u-${socket.decoded.user.id}`)
        .to(`u-${userId}`)
        .emit("private-chat", conversation);
    });

    socket.on("check-online", async (conversationId, cb) => {
      const conversation = await conversationService.getFullConversation(
        conversationId
      );

      const onlineList = [];
      for (const conversationUser of conversation.conversationUsers) {
        const isOnline = await redisService.getUserOnlineStatus(
          conversationUser.User.id
        );
        onlineList.push({ userId: conversationUser.User.id, isOnline });
      }

      cb(onlineList);
    });
  });
};
