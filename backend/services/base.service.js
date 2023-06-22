class BaseService {
  constructor(repository) {
    this.#repository = repository;
  }
  #repository = null;

  getAll() {
    return this.#repository.getAll();
  }

  getById(id) {
    return this.#repository.getById(id);
  }

  create(entity) {
    return this.#repository.create(entity);
  }

  update(id, entity) {
    return this.#repository.update(id, entity);
  }

  delete(id) {
    return this.#repository.delete(id);
  }

  deleteAll(options) {
    return this.#repository.deleteAll(options);
  }

  destroy(options) {
    return this.#repository.destroy(options);
  }

  findOne(options) {
    return this.#repository.findOne(options);
  }

  findAll(options) {
    return this.#repository.findAll(options);
  }

  count(options) {
    return this.#repository.count(options);
  }
}

module.exports = BaseService;
