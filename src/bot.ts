import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { regex } from './constants';
import { commands } from './commands';
import { readFileSync } from 'fs';
import path from 'path';
import { oftenCommands } from './middlewares/commands';

config();

const BOT_TOKEN: string = process.env.BOT_TOKEN;

const bot = new Telegraf(BOT_TOKEN, { username: 'seven' });

const start = `
Привет! Это бот, который поможет ответить на уже известные вопросы.
Сейчас бот знает эти команды:
/start Все команды
/index Почтовый интдекс ЖК
/contacts Контакты ЖЭКа
/providers Интернет провайдеры в ЖК
/price Цены услуг ЖЭКа
/keys Ключи для лифтов, колясочной, входной двери
`;

bot.use(oftenCommands);

bot.start(async (ctx) => {
  try {
    if ((ctx as any)?.state?.onPause) {
      return ctx.telegram.sendMessage(ctx.from.id, start);
    }
    ctx.reply(start);
  } catch (error) {
    console.log(error);
  }
});

bot.command('index', (ctx) => {
  if ((ctx as any)?.state?.onPause) {
    return ctx.telegram.sendMessage(ctx.from.id, commands.index);
  }

  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
});

bot.command('keys', (ctx) => {
  if ((ctx as any)?.state?.onPause) {
    return ctx.telegram.sendMessage(ctx.from.id, commands.keys);
  }

  ctx.reply(commands.keys, { reply_to_message_id: ctx.message.message_id });
});

bot.command('providers', (ctx) => {
  if ((ctx as any)?.state?.onPause) {
    return ctx.telegram.sendMessage(ctx.from.id, commands.providers);
  }

  ctx.reply(commands.providers, { reply_to_message_id: ctx.message.message_id });
});

bot.command('contacts', (ctx) => {
  if ((ctx as any)?.state?.onPause) {
    return ctx.telegram.sendMessage(ctx.from.id, commands.contacts);
  }

  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
});

bot.command('price', async (ctx) => {
  try {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    const file = readFileSync(path.resolve(__dirname, '..', 'prices.jpg'));

    if ((ctx as any)?.state?.onPause) {
      bot.telegram.sendPhoto(ctx.from.id, {
        source: file,
      });
      return;
    }

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
  console.log('Bot started');
});
