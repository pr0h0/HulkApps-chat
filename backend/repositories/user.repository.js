const BaseRepository = require("./base.repository");
const { User } = require("../models");

class UserRepository extends BaseRepository {
  constructor(model) {
    super(model);
    this.#model = model;
  }

  /** @type {typeof User} */
  #model = null;

  findById(id) {
    return this.findOne({ where: { id } });
  }
}

module.exports = new UserRepository(User);
