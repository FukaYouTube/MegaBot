const Composer = require('telegraf/composer')
const app = new Composer()

const { User, E_Channel, Channel, Admin } = require('./module')
const { inlineKeyboard, callbackButton, keyboard } = require('telegraf/markup')

const rules = require('./source/rules')
app.use((ctx, next) => { rules.isArabMid(ctx, next) })
app.use((ctx, next) => { rules.isBlackMid(ctx, next) })

// панель администратора
app.use(Composer.optional(async ctx => await Admin.findById(ctx.from.id), require('./source/admin')))

// панель создателя
app.use(Composer.optional(ctx => ctx.from.username === `FukaChanYT`, require('./source/creator')))

app.start(async ctx => {
    let user = await User.findById(ctx.from.id)
    !user ? ctx.reply(ctx.i18n.t('welcome', { name: ctx.from.first_name }), inlineKeyboard([ callbackButton('+ Добавить канал', 'next') ]).extra()) : ctx.scene.enter('main_menu')
})
app.action('next', ctx => { ctx.answerCbQuery(); ctx.scene.enter('add_channel') })

app.hears('+ Дать имя заяки', async ctx => {
    let channel = await Channel.find({ Creator: ctx.from.id })
    ctx.reply('Выбери канал', keyboard(channel.map(c => `Редактировать: ${c.NameChannel}`)).oneTime().resize().extra())
})
app.hears('Назад', async ctx => {
    let channel = await Channel.find({ Creator: ctx.from.id })
    ctx.reply('Выбери канал', keyboard(channel.map(c => `Редактировать: ${c.NameChannel}`)).oneTime().resize().extra())
    setTimeout(() => { ctx.reply('Назад?', inlineKeyboard([ callbackButton('На главную', 'back') ]).extra()) }, 500)
})

app.hears('+ Дать имя заяки хентай каналу', async ctx => {
    let channel = await E_Channel.find({ Creator: ctx.from.id })
    ctx.reply('Выбери канал', keyboard(channel.map(c => `Ред. хентай канал: ${c.NameChannel}`)).oneTime().resize().extra())
})
app.hears('Тупо назад', async ctx => {
    let channel = await E_Channel.find({ Creator: ctx.from.id })
    ctx.reply('Выбери канал', keyboard(channel.map(c => `Ред. хентай канал: ${c.NameChannel}`)).oneTime().resize().extra())
    setTimeout(() => { ctx.reply('Назад?', inlineKeyboard([ callbackButton('На главную', 'back') ]).extra()) }, 500)
})

app.action('back', ctx => { ctx.answerCbQuery(); ctx.deleteMessage(); ctx.scene.enter('main_menu') })

app.on('text', async (ctx, next) => {
    let channel = await Channel.find({ Creator: ctx.from.id })
    let channels = channel.find(c => `Редактировать: ${c.NameChannel}` === ctx.message.text)

    let ero_channel = await E_Channel.find({ Creator: ctx.from.id })
    let ero_channels = ero_channel.find(c => `Ред. хентай канал: ${c.NameChannel}` === ctx.message.text)

    if(ero_channels){
        ctx.session.counter = ero_channels._id
        ctx.scene.enter('ero_edit_name')
    }

    if(channels){
        ctx.session.counter = channels._id
        ctx.scene.enter('edit_name')
    }; next()
})

module.exports = app