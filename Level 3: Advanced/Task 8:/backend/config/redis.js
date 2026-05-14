const { createClient } = require("redis");

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({ url: redisUrl });
let isReady = false;

redisClient.on("ready", () => {
  isReady = true;
  console.log("Redis connected");
});

redisClient.on("end", () => {
  isReady = false;
});

redisClient.on("error", (error) => {
  isReady = false;
  console.error("Redis error:", error.message);
});

async function connectRedis() {
  if (redisClient.isOpen) {
    return;
  }

  try {
    await redisClient.connect();
  } catch (error) {
    console.error("Redis connection skipped:", error.message);
  }
}

function redisIsReady() {
  return isReady;
}

module.exports = {
  connectRedis,
  redisClient,
  redisIsReady
};
