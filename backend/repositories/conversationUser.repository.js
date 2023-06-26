const BaseRepository = require("./base.repository");
const { conversationUsers, conversation } = require("../models");

class ConversatoinUserRepository extends BaseRepository {
  constructor(model) {
    super(model);

    this.#model = model;
  }

  /** @type { typeof conversationUsers} */
  #model = null;

  async getUserConversationList(userId) {
    const conversations = await this.findAll({
      where: {
        userId,
      },
      attributes: ["conversationId"],
    });

    return conversations.map((c) => c.conversationId);
  }

  async getUserPrivateConversationList(userId) {
    const conversations = await this.findAll({
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
    });

    return conversations.map((c) => c.conversationId);
  }

  removeUserFromConversation(conversationId, userId) {
    return this.deleteAll({
      where: {
        conversationId,
        userId,
      },
    });
  }

  getUserInConversation(conversationId, userId) {
    return this.findOne({
      where: {
        conversationId,
        userId,
      },
    });
  }
}

module.exports = new ConversatoinUserRepository(conversationUsers);
