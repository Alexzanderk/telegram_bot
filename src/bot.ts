import { config } from 'dotenv';
import moment from 'moment';
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

export interface MessageQueue {
  msg: number;
  chat: number;
}

const BOT_TOKEN: string = process.env.BOT_TOKEN;
export let queue: MessageQueue[] = [];
export const bot = new Telegraf(BOT_TOKEN, { username: 'seven' });

// const res = bot.telegram.getUpdates();

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

bot.on('new_chat_members', (ctx) => {
  ctx.reply(`
Привет👋🏻 сосед!
Это бот, который поможет ответить на уже известные вопросы, а также сообщить о ЧП в ЖК.
Сейчас бот знает эти команды:
/start Все команды
/index Почтовый интдекс ЖК
/contacts Контакты ЖЭКа
/providers Интернет провайдеры в ЖК
/price Цены услуг ЖЭКа
/keys Ключи для лифтов, колясочной, входной двери
/emergency ЧП в ЖК теперь можно отправить в ЖЭК при вызове команды вы получите инструкцию как сообщить о ЧП, но для этого необходимо добавить в личную переписку

Мы будем рады если ты начнешь личное общение с ботом, чтобы не спамить в общей группе!
`);
});

bot.catch((err: any) => {
  console.log(err);
  console.log('CATCH');
});

bot.launch().then(() => {
  console.log('Bot started');
});

let isActive = false;

let time: number = Date.now();
const INTERVAL: number = 1000 * 60 * 5;

export const getRemoveTime = () => {
  const start = moment();
  const end = moment(time + INTERVAL);
  const diff = end.diff(start);
  return moment(diff).format('mm:ss');
};

setInterval(async () => {
  try {
    if (!queue.length) return;

    if (isActive) return;
    time = Date.now();

    isActive = true;
    let queuePart = [...queue];
    queue = [];
    const pendings = queuePart.map(async (item) => {
      bot.telegram.deleteMessage(item.chat, item.msg);
    });
    await Promise.all(pendings);
    queuePart = [];
    isActive = false;
  } catch (error) {
    console.log('INTERVAL');
    console.log(error);
  }
}, INTERVAL);
