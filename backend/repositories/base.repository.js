class BaseRepository {
  constructor(model) {
    this.#model = model;
  }

  #model = null;

  getAll() {
    return this.#model.findAll({});
  }

  getById(id) {
    return this.#model.findOne({ where: { id } });
  }

  create(entity) {
    return this.#model.create(entity);
  }

  update(id, entity) {
    return this.#model.update(entity, { where: { id } });
  }

  delete(id) {
    return this.#model.update({ deletedAt: new Date() }, { where: { id } });
  }
  deleteAll(options) {
    return this.#model.update({ deletedAt: new Date() }, options);
  }

  destroy(options) {
    return this.#model.destroy(options);
  }

  findOne(options) {
    return this.#model.findOne(options);
  }

  findAll(options) {
    return this.#model.findAll(options);
  }

  count(options) {
    return this.#model.count(options);
  }
}

module.exports = BaseRepository;
