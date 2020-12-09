import { TelegrafContext } from 'telegraf/typings/context';
import { bot } from '../bot';
import { commands } from '../commands';

export const handleAskContacts = async (ctx: TelegrafContext) => {
  bot.telegram.sendChatAction(ctx.chat.id, 'typing');
  ctx.reply(commands.contacts, { reply_to_message_id: ctx.message.message_id });
};

export const handleAskPostIndex = async (ctx: TelegrafContext) => {
  bot.telegram.sendChatAction(ctx.chat.id, 'typing');
  ctx.reply(commands.index, { reply_to_message_id: ctx.message.message_id });
};
