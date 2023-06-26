const { conversation, conversationUsers, User, message } = require("../models");
const BaseRepository = require("./base.repository");
const conversationUserRepository = require("./conversationUser.repository");

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
    const userAlreadyInConversation =
      await conversationUserRepository.getUserInConversation(
        conversationId,
        userId
      );

    if (userAlreadyInConversation) {
      return;
    }

    await conversationUserRepository.create({
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

  async getConversationUsers(conversationId) {
    const conversation = await this.findOne({
      where: {
        id: conversationId,
      },
      include: [
        {
          model: conversationUsers,
          include: User,
        },
      ],
    });

    return conversation.conversationUsers;
  }

  async getConversations(userId) {
    const conversationsIds =
      await conversationUserRepository.getUserConversationList(userId);

    const conversationsPromise = Promise.all(
      conversationsIds.map((id) => this.getFullConversation(id))
    );

    return conversationsPromise;
  }

  async findPrivateConversation(userId, otherUserId) {
    const user1Conversations =
      await conversationUserRepository.getUserPrivateConversationList(userId);
    const user2Conversations =
      await conversationUserRepository.getUserPrivateConversationList(
        otherUserId
      );

    const commonConversations = user1Conversations.filter((c) =>
      user2Conversations.includes(c)
    );

    if (!commonConversations?.length) {
      return null;
    }

    const commonConversation = this.getFullConversation(commonConversations[0]);

    return commonConversation;
  }
}

module.exports = new ConversationRepository(conversation);
