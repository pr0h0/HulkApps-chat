const redis = require("redis");

class RedisService {
  constructor(redisUrl) {
    this.#instance = redis.createClient({ url: redisUrl });
    this.#instance.connect();

    this.#instance.on("error", (err) =>
      console.error("Redis Client Error", err)
    );
  }

  #instance = null;

  async setUserOnlineStatus(userId, status) {
    return await this.#instance.set(
      `user-online::${userId}`,
      status?.toString()
    );
  }

  async getUserOnlineStatus(userId) {
    const result = await this.#instance.get(`user-online::${userId}`);
    return result === "true";
  }
}

module.exports = new RedisService(process.env.REDIS_URL);
