const messageRepository = require("../repositories/message.repository");
const BaseService = require("./base.service");

class MessageService extends BaseService {
  constructor(repository) {
    super(repository);
    this.#repository = repository;
  }

  /** @type {messageRepository} */
  #repository = null;

  getMessages(conversationId, limit = 50, offset = 0) {
    return this.#repository.getMessages(conversationId, limit, offset);
  }

  getMessage(id) {
    return this.#repository.getMessage(id);
  }

  async createMessage(text, conversationId, userId) {
    const message = await this.create({
      text,
      conversationId,
      userId,
    });

    return await this.getMessage(message.id);
  }
}

module.exports = new MessageService(messageRepository);
