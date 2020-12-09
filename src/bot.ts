import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { regex } from './constants';
import { oftenCommands } from './middlewares/commands';
import { connect } from './services';
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

config();

connect();
const BOT_TOKEN: string = process.env.BOT_TOKEN;

export const bot = new Telegraf(BOT_TOKEN, { username: 'seven' });

bot.use(oftenCommands);

bot.start(handleStartCommand);

bot.command('index', handleIndexCommand);
bot.command('keys', handleKeysCommand);
bot.command('providers', handleProvidersCommand);
bot.command('contacts', handleContactsCommand);
bot.command('price', handlePriceCommand);

bot.hears(regex.askPhone, handleAskContacts);
bot.hears(/индекс/gim, handleAskPostIndex);

bot.launch().then(() => {
  console.log('Bot started');
});
