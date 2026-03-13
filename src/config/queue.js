import { Queue } from "bullmq";

export const redisConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT) || 6379,
};

export const importQueue = new Queue("csv-import", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: false, // keep completed jobs for status lookup
    removeOnFail: false,
  },
});
