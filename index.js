require('dotenv').config()
require('mongoose').connect(process.env.MONGO_URL)

const Telegraf = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)

const path = require('path')
const TelegrafI18n = require('telegraf-i18n')

const i18n = new TelegrafI18n({
    defaultLanguage: 'ru',
    allowMissing: true,
    directory: path.resolve(__dirname, 'assets')
})

const session = require('telegraf/session')

// перезагрузка бота
// bot.use(() => { return })

bot.use(session())
bot.use(i18n.middleware())
bot.use(require('./stage'))
bot.use(require('./source/channels'))

// работа с приватными сообщениями
bot.use(Telegraf.optional(ctx => ctx.chat.type === 'private', require('./bot')))

// работа с группами
bot.use(Telegraf.optional(ctx => ctx.chat.type !== 'private', require('./source/group')))

bot.catch(e => console.log(e.stack))
bot.startPolling()