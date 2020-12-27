import { TelegrafContext } from 'telegraf/typings/context';
import { commands } from '../commands';
import { readFileSync } from 'fs';
import { bot, queue } from '../bot';
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
/emergency ЧП в ЖК теперь можно отправить в ЖЭК при вызове команды вы получите инструкцию как сообщить о ЧП, но для этого необходимо добавить в личную переписку
`;

const code403 = `
Привет! Кажется слишком много одинаковых запросов в общей группе за короткий промежуток времени, чтобы не мусорить в группе я могу отправить информацию лично, но для этого необходимо начать со мной общение. Кликни по этой ссылке и я постараюсь тебе помочь @seven_security_bot.
Сообщения удаляются автоматически.
`;

export const handleStartCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    try {
      await removeMessageAddToQueue(ctx);

      return await ctx.telegram.sendMessage(ctx.from.id, startMessage);
    } catch (error) {
      if (error.code === 403) {
        return handleForbiden(ctx, queue);
      }
      console.log(error);
    }
  }
  ctx.reply(startMessage);
};

export const handleIndexCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    try {
      await removeMessageAddToQueue(ctx);

      return ctx.telegram.sendMessage(ctx.from.id, commands.index);
    } catch (error) {
      if (error.code === 403) {
        return handleForbiden(ctx, queue);
      }
      console.log(error);
    }
  }

  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
};

export const handleContactsCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    try {
      await removeMessageAddToQueue(ctx);

      return ctx.telegram.sendMessage(ctx.from.id, commands.contacts);
    } catch (error) {
      if (error.code === 403) {
        return handleForbiden(ctx, queue);
      }
      console.log(error);
    }
  }

  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
};

export const handleProvidersCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    try {
      await removeMessageAddToQueue(ctx);

      return ctx.telegram.sendMessage(ctx.from.id, commands.providers);
    } catch (error) {
      if (error.code === 403) {
        return handleForbiden(ctx, queue);
      }
      console.log(error);
    }
  }

  ctx.reply(commands.providers, { reply_to_message_id: ctx.message.message_id });
};

export const handlePriceCommand = async (ctx: TelegrafContext) => {
  try {
    bot.telegram.sendChatAction(ctx.chat.id, 'upload_photo');

    const file = readFileSync(path.resolve(__dirname, '..', '..', 'prices.jpg'));

    if ((ctx as any)?.state?.onPause) {
      await removeMessageAddToQueue(ctx);

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
    try {
      await removeMessageAddToQueue(ctx);

      return ctx.telegram.sendMessage(ctx.from.id, commands.keys);
    } catch (error) {
      if (error.code === 403) {
        return handleForbiden(ctx, queue);
      }
      console.log(error);
    }
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

export const removeMessageAddToQueue = async (ctx: TelegrafContext) => {
  try {
    queue.push(ctx.message.message_id);

    // return await ctx.telegram.deleteMessage(ctx.chat.id, ctx.message.message_id);
  } catch (error) {
    console.log(error);
  }
};

const handleForbiden = async (ctx: TelegrafContext, queueLink: number[]) => {
  const msg = await ctx.reply(code403, { reply_to_message_id: ctx.message.message_id });
  queueLink.push(msg.message_id);
};
