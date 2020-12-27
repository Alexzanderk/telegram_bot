import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { regex } from './constants';
import { oftenCommands } from './middlewares/commands';
import {
  handleContactsCommand,
  handleIndexCommand,
  handleKeysCommand,
  handlePriceCommand,
  handleProvidersCommand,
  handleStartCommand,
  handleAskContacts,
  handleAskPostIndex,
} from './handlers';
import { handleEmergency, isPrivate } from './handlers/commands';

config();

const BOT_TOKEN: string = process.env.BOT_TOKEN;
export let queue: number[] = [];
export const bot = new Telegraf(BOT_TOKEN, { username: 'seven' });

const res = bot.telegram.getUpdates();

bot.use(oftenCommands);

bot.start(handleStartCommand);

bot.command('index', handleIndexCommand);
bot.command('keys', handleKeysCommand);
bot.command('providers', handleProvidersCommand);
bot.command('contacts', handleContactsCommand);
bot.command('price', handlePriceCommand);

bot.hears('hey', (ctx) => {
  console.log(ctx.chat.id);
  bot.telegram.sendMessage(process.env.TELEGRAM_ME, ctx.chat.id.toString());
});

bot.command('emergency', handleEmergency);

bot.hears(regex.askPhone, handleAskContacts);
bot.hears(/индекс/gim, handleAskPostIndex);

bot.hears(/\#чпжэк/gim, (cxt) => {
  if (!isPrivate(cxt)) return;

  cxt.telegram.forwardMessage(process.env.TELEGRAM_ACTIVE_GROUP, cxt.chat.id, cxt.message.message_id);
});

bot.launch().then(() => {
  console.log('Bot started');
});

setInterval(async () => {
  try {
    if (!queue.length) return;

    const pendings = queue.map(async (msg) => {
      bot.telegram.deleteMessage(process.env.TELEGRAM_PRIVATE_GROUP, msg);
    });
    await Promise.all(pendings);

    queue = [];
  } catch (error) {
    console.log('INTERVAL');
    console.log(error);
  }
}, 1000 * 10 * 1);
