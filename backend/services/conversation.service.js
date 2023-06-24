const conversationRepository = require("../repositories/conversation.repository");
const userRepository = require("../repositories/user.repository");
const BaseService = require("./base.service");

class ConversationService extends BaseService {
  constructor(repository) {
    super(repository);
    this.#repository = repository;
  }

  /** @type {typeof conversationRepository} */
  #repository;

  async createPrivateConversation(userId, otherUserId) {
    const alreadyExists = await this.#repository.findPrivateConversation(
      userId,
      otherUserId
    );
    if (alreadyExists) {
      return alreadyExists;
    }

    const conversation = await this.#repository.createPrivateConversation(
      userId
    );

    await this.#repository.addUserToConversation(conversation.id, userId);
    await this.#repository.addUserToConversation(conversation.id, otherUserId);

    return this.#repository.getFullConversation(conversation.id);
  }

  async createGroupConversation(name, userId) {
    const alreadyExists = await this.findOne({ where: { name } });
    if (alreadyExists) {
      await this.#repository.addUserToConversation(alreadyExists.id, userId);
      return this.getFullConversation(alreadyExists.id);
    }

    const conversation = await this.#repository.createGroupConversation(
      name,
      userId
    );

    await this.#repository.addUserToConversation(conversation.id, userId);

    return this.#repository.getFullConversation(conversation.id);
  }

  async getConversations(userId) {
    return this.#repository.getConversations(userId);
  }

  async getFullConversation(conversationId) {
    return this.#repository.getFullConversation(conversationId);
  }

  async leaveGroup(conversationId, userId) {
    return this.#repository.removeUserFromConversation(conversationId, userId);
  }

  async findOrCreatePrivateChat(username, userId) {
    const user = await userRepository.findOne({ where: { username } });
    if (!user) {
      return null;
    }
    const conversation = await this.#repository.findPrivateConversation(
      user.id,
      userId
    );

    if (conversation) {
      return conversation;
    }

    return this.createPrivateConversation(userId, user.id);
  }
}

module.exports = new ConversationService(conversationRepository);
