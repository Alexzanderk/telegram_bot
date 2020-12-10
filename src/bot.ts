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

export const bot = new Telegraf(BOT_TOKEN, { username: 'seven' });

bot.use(oftenCommands);

bot.start(handleStartCommand);

bot.command('index', handleIndexCommand);
bot.command('keys', handleKeysCommand);
bot.command('providers', handleProvidersCommand);
bot.command('contacts', handleContactsCommand);
bot.command('price', handlePriceCommand);

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
