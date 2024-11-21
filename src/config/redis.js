import * as redis from "redis";
import { config } from "dotenv";

config();

const URL_REDIS = `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

export const redisClient = redis.createClient({
  url: URL_REDIS,
});

const redisConfig = {
  connectRedis: async () => {
    try {
      await redisClient.connect();
      console.log('Kết nối RedisDB thành công!');
    } catch (error) {
      console.error('Error connecting to Redis:', error.message);
    }
  },
  pingToRedis: async () => {
    try {
      const result = await redisClient.ping();
      console.log('Ping response from Redis:', result);
      return {
        status: 200
      }
    } catch (error) {
      console.error('Ping error:', error);
      return {
        status: 400
      }
    }
  }
};

export default redisConfig;