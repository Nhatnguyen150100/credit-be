import { redisClient } from "../config/redis";

const redisService = {
  save: (key, value, timeExpire) => {
    return new Promise(async (resolve, reject) => {
      try {
        if(timeExpire) {
          await redisClient.setEx(key, timeExpire, value);
        } else{
          await redisClient.set(key, value);
        }
        return resolve({
          status: 200,
          message: "Save to Redis success!",
          data: null,
        })
      } catch (error) {
        console.error(error.message);
        reject({
          status: 500,
          message: "Error saving to Redis",
          data: null,
        });
      }
    });
  },
  get: (key) => {
    return new Promise(async (resolve, reject) => {
      try {
        const value = await redisClient.get(key);
        if(value) {
          return resolve(value)
        } else {
          return resolve(null);
        }
      } catch (error) {
        console.error(error.message);
        return reject(null);
      }
    })
  }
};

export default redisService;
