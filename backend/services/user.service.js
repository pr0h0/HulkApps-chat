const BaseService = require("./base.service");
const UserRepository = require("../repositories/user.repository");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const HttpError = require("../utils/HttpError");

class UserService extends BaseService {
  constructor(repository) {
    super(repository);
    this.#repository = repository;
  }

  /** @type {typeof UserRepository} */
  #repository = null;

  findById(id) {
    return this.#repository.findById(id);
  }

  async isValidPassword(username, password) {
    const user = await this.findOne({ where: { username } });
    if (!user) {
      throw HttpError.BadRequest("User not found");
    }

    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) {
      throw HttpError.BadRequest("Invalid password");
    }

    return true;
  }

  async register(username, password) {
    const alreadyExists = await this.#repository.findOne({
      where: { username },
    });

    if (alreadyExists) {
      throw HttpError.BadRequest("Username already exists");
    }

    if (password.length < 6) {
      throw HttpError.BadRequest("Password must be at least 6 characters");
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    return await this.create({
      username,
      password: hashedPassword,
    });
  }

  parseJWT(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      });
    });
  }
}

module.exports = new UserService(UserRepository);
