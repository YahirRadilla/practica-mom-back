const redis = require("redis");
const { REDIS_URL } = require("../shared/config");

const client = redis.createClient({ url: REDIS_URL });

client.on("error", (err) => console.error("Redis error:", err));

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
    console.log("Conectado a Redis");
  }
}

module.exports = { client, connectRedis };
