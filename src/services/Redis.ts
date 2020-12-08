import RedisIO = require('ioredis');
import { config } from 'dotenv';

config();

const redisOpts: RedisIO.RedisOptions = {
  retryStrategy: (times: number) => Math.min(times * 10000, 15000),
  reconnectOnError: (err: Error) => err.message.includes('READONLY'),
  connectTimeout: 15000,
};

const getRedis = () => new RedisIO(<string>process.env.REDIS_CONNECTION_STRING, redisOpts);

let redisInstance: RedisIO.Redis;

export function redis(newInstance: boolean = false): RedisIO.Redis {
  if (newInstance) {
    return getRedis();
  }

  if (!redisInstance) {
    redisInstance = getRedis();
  }
  return redisInstance;
}
