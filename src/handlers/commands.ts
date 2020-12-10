import { TelegrafContext } from 'telegraf/typings/context';
import { commands } from '../commands';
import { readFileSync } from 'fs';
import { bot } from '../bot';
import path from 'path';

const startMessage = `
Привет! Это бот, который поможет ответить на уже известные вопросы, а также сообщить о ЧП в ЖК.
Сейчас бот знает эти команды:
/start Все команды
/index Почтовый интдекс ЖК
/contacts Контакты ЖЭКа
/providers Интернет провайдеры в ЖК
/price Цены услуг ЖЭКа
/keys Ключи для лифтов, колясочной, входной двери
/emergency ЧП в ЖК теперь можно отправить в ЖЭК при вызове команды вы получите инструкцию как сообщить о ЧП
`;

export const handleStartCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    await removeMessage(ctx);
    return ctx.telegram.sendMessage(ctx.from.id, startMessage);
  }
  ctx.reply(startMessage);
};

export const handleIndexCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    await removeMessage(ctx);

    return ctx.telegram.sendMessage(ctx.from.id, commands.index);
  }

  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
};

export const handleContactsCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    await removeMessage(ctx);

    return ctx.telegram.sendMessage(ctx.from.id, commands.contacts);
  }

  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
};

export const handleProvidersCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    await removeMessage(ctx);

    return ctx.telegram.sendMessage(ctx.from.id, commands.providers);
  }

  ctx.reply(commands.providers, { reply_to_message_id: ctx.message.message_id });
};

export const handlePriceCommand = async (ctx: TelegrafContext) => {
  try {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    const file = readFileSync(path.resolve(__dirname, '..', '..', 'prices.jpg'));

    if ((ctx as any)?.state?.onPause) {
      await removeMessage(ctx);

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
};

export const handleKeysCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    await removeMessage(ctx);

    return ctx.telegram.sendMessage(ctx.from.id, commands.keys);
  }

  ctx.reply(commands.keys, { reply_to_message_id: ctx.message.message_id });
};

export const handleEmergency = async (ctx: TelegrafContext) => {
  if (isPrivate(ctx)) {
    return ctx.telegram.sendMessage(ctx.from.id, commands.emergency);
  }
  await bot.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id).catch(console.log);
  return ctx.telegram.sendMessage(ctx.from.id, commands.emergency);
};

export const isPrivate = (ctx: TelegrafContext): boolean => {
  return ctx?.chat?.type === 'private';
};

export const removeMessage = async (ctx: TelegrafContext) => {
  return await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
};
