import { TelegrafContext } from 'telegraf/typings/context';
import { redisInstance } from '../lib/redis';
import { TTL } from '../constants';

export const oftenCommands = async (cxt: TelegrafContext, next: () => Promise<void>) => {
  if (cxt.chat.type === 'supergroup') {
    const message = cxt?.message?.text;
    const isExists = await redisInstance.keyExists(message);
    if (isExists) {
      (cxt as any).state.onPause = true;
      return next();
    }

    await redisInstance.setExpireToRedis(message, {}, TTL);
  }

  return next();
};
