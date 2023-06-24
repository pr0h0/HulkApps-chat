const { conversation, conversationUsers, User, message } = require("../models");
const BaseRepository = require("./base.repository");

class ConversationRepository extends BaseRepository {
  constructor(model) {
    super(model);
    this.#model = model;
  }

  /** @type { typeof conversation } */
  #model = null;

  createPrivateConversation(userId) {
    return this.create({
      name: "",
      userId,
      type: "private",
    });
  }

  createGroupConversation(name, userId) {
    return this.create({
      name,
      userId,
      type: "group",
    });
  }

  async addUserToConversation(conversationId, userId) {
    const userAlreadyInConversation = await conversationUsers.findOne({
      where: {
        conversationId,
        userId,
      },
    });

    if (userAlreadyInConversation) {
      return;
    }

    await conversationUsers.create({
      conversationId,
      userId,
    });
  }

  async getFullConversation(conversationId) {
    return this.findOne({
      where: {
        id: conversationId,
      },
      include: [
        {
          model: conversationUsers,
          include: User,
        },
        {
          model: User,
        },
        {
          model: message,
          include: User,
        },
      ],
    });
  }

  async getConversations(userId) {
    const conversations = await conversationUsers.findAll({
      where: {
        userId,
      },
      attributes: ["conversationId"],
    });

    const conversationIds = conversations.map((c) => c.conversationId);

    const conversationsPromise = await Promise.all(
      conversationIds.map((id) => this.getFullConversation(id))
    );

    return conversationsPromise;
  }

  async removeUserFromConversation(conversationId, userId) {
    await conversationUsers.update(
      { deletedAt: new Date() },
      {
        where: {
          conversationId,
          userId,
        },
      }
    );
  }

  async findPrivateConversation(userId, otherUserId) {
    const user1Conversations = (
      await conversationUsers.findAll({
        where: {
          userId,
        },
        attributes: ["conversationId"],
        include: {
          model: conversation,
          where: {
            type: "private",
          },
        },
      })
    ).map((c) => c.conversationId);

    const user2Conversations = (
      await conversationUsers.findAll({
        where: {
          userId: otherUserId,
        },
        attributes: ["conversationId"],
        include: {
          model: conversation,
          where: {
            type: "private",
          },
        },
      })
    ).map((c) => c.conversationId);

    const commonConversations = user1Conversations.filter((c) =>
      user2Conversations.includes(c)
    );

    if (commonConversations.length === 0) {
      return null;
    }

    const commonConversation = await this.getFullConversation(
      commonConversations[0]
    );

    return commonConversation;
  }
}

module.exports = new ConversationRepository(conversation);
