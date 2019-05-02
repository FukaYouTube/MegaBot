const Scene = require('telegraf/scenes/base')
const scene = new Scene('user_settings')

const { User, Channel } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

scene.enter(async ctx => {
    let user = await User.findById(ctx.from.id)
    if(!user){ return ctx.reply('/start для того чтобы записать тебя в базу') }
    ctx.reply(ctx.i18n.t('settings_user', { name: ctx.from.first_name, username: ctx.from.username, warn: user.Warn, code: user.Code }), keyboard([
        ['Обновить свою информацию'],
        ['Очистить каналы'],
        ['Удалить себя'],
        ['На главную']
    ]).oneTime().resize().extra())
})

scene.hears('Обновить свою информацию', async ctx => {
    let user = await User.findById(ctx.from.id)
    if(!user){ return ctx.reply('/start для того чтобы записать тебя в базу') }
    await User.findOneAndUpdate({ _id: user._id }, {
        UserName: ctx.from.username,
        FirstName: ctx.from.first_name
    })
    ctx.reply('Информация обновенна', keyboard(['< Назад']).oneTime().resize().extra())
})
scene.hears('Очистить каналы', async ctx => {
    let user = await User.findById(ctx.from.id)
    if(!user){ return ctx.reply('/start для того чтобы записать тебя в базу') }
    await Channel.remove({ Creator: ctx.from.id })
    ctx.reply('Каналы очищены!', keyboard(['< Назад']).oneTime().resize().extra())
})
scene.hears('Удалить себя', async ctx => {
    let user = await User.findById(ctx.from.id)
    if(!user){ return ctx.reply('/start для того чтобы записать тебя в базу') }
    await User.remove({ _id: ctx.from.id })
    ctx.reply('Удален!', removeKeyboard().extra())
})

scene.hears('< Назад', async ctx => {
    let user = await User.findById(ctx.from.id)
    if(!user){ return ctx.reply('/start для того чтобы записать тебя в базу') }
    ctx.reply(ctx.i18n.t('settings_user', { name: ctx.from.first_name, username: ctx.from.username, warn: user.Warn, code: user.Code }), keyboard([
        ['Обновить свою информацию'],
        ['Очистить каналы'],
        ['Удалить себя'],
        ['На главную']
    ]).oneTime().resize().extra())
})

module.exports = scene