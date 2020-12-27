import { TelegrafContext } from 'telegraf/typings/context';
import { commands } from '../commands';
import { readFileSync } from 'fs';
import { bot, queue, MessageQueue, getRemoveTime } from '../bot';
import path from 'path';
import { Message } from 'telegraf/typings/telegram-types';

const startMessage = `
Привет! Это бот🤖, который поможет ответить на уже известные вопросы, а также сообщить о ЧП в ЖК.
Сейчас бот знает эти команды:
/start Все команды
/index Почтовый интдекс ЖК
/contacts Контакты ЖЭКа
/providers Интернет провайдеры в ЖК
/price Цены услуг ЖЭКа
/keys Ключи для лифтов, колясочной, входной двери
/emergency ЧП в ЖК - теперь можно отправить в ЖЭК, команда работает в личных сообщениях для этого начните общение с ботом, кликай 👉🏻 @seven_security_bot. При вызове команды вы получите инструкцию📝 как сообщить о ЧП.
⚠️ Просьба сообщать о ЧП и не писать 🚫 глупости
`;

const emergencyNotPrivate = (remainingTime: string) => `
⚠️
/emergency ЧП в ЖК - теперь можно отправить в ЖЭК, команда работает в личных сообщениях для этого начните общение с ботом, кликай 👉🏻 @seven_security_bot. При вызове команды вы получите инструкцию📝 как сообщить о ЧП.
⚠️ Просьба сообщать о ЧП и не писать 🚫 глупости

Сообщение с запросом будет удалено автоматически, приблизительно через: ${remainingTime}
`;

const code403 = `
🎉
Привет! Кажется слишком много одинаковых запросов в общей группе 😳 за короткий промежуток времени🤯, чтобы не мусорить в группе я могу отправить информацию лично, но для этого необходимо начать со мной общение. Кликни по этой ссылке и я постараюсь тебе помочь @seven_security_bot.
Сообщения удаляются автоматически.
`;

const messageOnPause = (remainingTime: string) => `
⚠️
😱Wow... Take it easy guys🥂! В течении 30 мин команда вызывалась кем-то.
Начни личное общение, кликай 👉🏻 @seven_security_bot
В личных сообщениях нет ограничений на команды.😎

Сообщение с запросом будет удалено автоматически, приблизительно через: ${remainingTime}
`;

export const handleStartCommand = async (ctx: TelegrafContext) => {
  if ((ctx as any)?.state?.onPause) {
    try {
      const answer = await ctx.reply(messageOnPause(getRemoveTime()));
      removeMessageAddToQueue(ctx, answer);
      return;
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
      const answer = await ctx.reply(messageOnPause(getRemoveTime()));
      removeMessageAddToQueue(ctx, answer);
      return;
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
      const answer = await ctx.reply(messageOnPause(getRemoveTime()));
      removeMessageAddToQueue(ctx, answer);
      return;
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
      const answer = await ctx.reply(messageOnPause(getRemoveTime()));
      removeMessageAddToQueue(ctx, answer);
      return;
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
      const answer = await ctx.reply(messageOnPause(getRemoveTime()));
      removeMessageAddToQueue(ctx, answer);
      return;
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

  const answer = await ctx.reply(emergencyNotPrivate(getRemoveTime()));
  removeMessageAddToQueue(ctx, answer);
};

export const isPrivate = (ctx: TelegrafContext): boolean => {
  return ctx?.chat?.type === 'private';
};

export const removeMessageAddToQueue = async (ctx: TelegrafContext, msg?: Message) => {
  try {
    if (msg) {
      queue.push({ msg: msg.message_id, chat: msg.chat.id });
    }

    queue.push({ msg: ctx.message.message_id, chat: ctx.chat.id });
  } catch (error) {
    console.log(error);
  }
};

const handleForbiden = async (ctx: TelegrafContext, queueLink: MessageQueue[]) => {
  try {
    const msg = await ctx.reply(code403, { reply_to_message_id: ctx.message.message_id });
    queueLink.push({ msg: msg.message_id, chat: ctx.chat.id });
  } catch (error) {
    const msg = await ctx.reply(code403);
    queueLink.push({ msg: msg.message_id, chat: ctx.chat.id });
  }
};
