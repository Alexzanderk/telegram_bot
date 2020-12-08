import { redis } from '../services';
import RedisIO from 'ioredis';

interface IRedis {
  getFromRedis(key: string): Promise<any>;
  keyExists(key: string): Promise<any>;
  setExpireToRedis(key: string, data: any, ttl?: number): Promise<string>;
}

export class Redis implements IRedis {
  private redis: RedisIO.Redis;

  constructor(newInstanse: boolean = false) {
    this.redis = redis(newInstanse);
  }

  public async getFromRedis(key: string): Promise<any> {
    try {
      const result = await this.redis.get(key);
      const parsedResult = JSON.parse(result);
      return parsedResult;
    } catch (error) {
      console.log(error);
    }
  }

  public async keyExists(key: string): Promise<any> {
    try {
      return await this.redis.exists(key);
    } catch (error) {
      console.log(error);
    }
  }

  public async setExpireToRedis(key: string, data: any, ttl?: number): Promise<string> {
    try {
      const dataStringify = JSON.stringify(data);
      return await this.redis.set(key, dataStringify, 'EX', ttl);
    } catch (error) {
      console.log(error);
    }
  }
}

export const redisInstance = new Redis();
