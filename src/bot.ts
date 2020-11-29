import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { regex } from './constants';
import { commands } from './commands';
import { readFileSync } from 'fs';
import path from 'path';

config();

const BOT_TOKEN: string = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN, { username: 'seven_security' });

const start = `
Привет я всего лишь бот не жди от меня исскуственного интелекта или нейро сети но по глупой команде могу дать ответ.
Сейчас я знаю эти команды:
/start
/index
/contacts
/providers
/price
`;

bot.start((ctx) => {
  ctx.reply(start);
});

bot.command('index', (ctx) => {
  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
});

bot.command('providers', (ctx) => {
  ctx.reply(commands.providers, { reply_to_message_id: ctx.message.message_id });
});

bot.command('contacts', (ctx) => {
  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
});

bot.command('price', async (ctx) => {
  try {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    const file = readFileSync(path.resolve(__dirname, '..', 'prices.jpg'));

    bot.telegram.sendPhoto(
      ctx.chat.id,
      {
        source: file,
      },
      {
        reply_to_message_id: ctx.message.message_id,
      },
    );
  } catch (error) {
    console.log(error);
  }
});

bot.hears(regex.askPhone, async (ctx) => {
  bot.telegram.sendChatAction(ctx.chat.id, 'typing');
  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
});

bot.hears(/индекс/gim, async (ctx) => {
  bot.telegram.sendChatAction(ctx.chat.id, 'typing');
  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
});

bot.launch().then(() => {
  console.log('started');
});
