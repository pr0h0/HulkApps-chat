const { message, User } = require("../models");
const BaseRepository = require("./base.repository");

class MessageRepository extends BaseRepository {
  constructor(model) {
    super(model);
    this.#model = model;
  }

  #model = null;

  async getMessages(conversationId, limit = 50, offset = 0) {
    const messages = await this.findAll({
      where: { conversationId },
      limit,
      offset,
    });
    return messages;
  }

  async getMessage(id) {
    const message = await this.findOne({
      where: { id },
      include: [
        {
          model: User,
        },
      ],
    });
    return message;
  }
}

module.exports = new MessageRepository(message);
