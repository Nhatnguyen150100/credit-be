

import { createClient } from "redis";

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  password: process.env.REDIS_PASSWORD || null,
});

const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis successfully");

    client.on("error", (err) => {
      console.error("Redis client error:", err);
    });
  } catch (err) {
    console.error("Failed to connect to Redis:", err);
    process.exit(1);
  }
};

const addData = async (key, value, ttl = 180) => {
  try {
    if (ttl) {
      await client.setEx(key.toString(), ttl, JSON.stringify(value));
    } else {
      await client.set(key.toString(), JSON.stringify(value));
    }
    return true;
  } catch (err) {
    console.error("Error adding data:", err);
    return false;
  }
};

const getData = async (key) => {
  try {
    const value = await client.get(key.toString());
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Error getting data:", err);
    return null;
  }
};

const removeData = async (key) => {
  try {
    const result = await client.del(key);
    return result === 1;
  } catch (err) {
    console.error("Error removing data:", err);
    return false;
  }
};

const disconnectRedis = async () => {
  await client.quit();
};

export {
  connectRedis,
  addData,
  getData,
  removeData,
  disconnectRedis,
  client,
};
