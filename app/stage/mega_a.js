const Scene = require('telegraf/scenes/base')
const scene = new Scene('mega_a')

const { Channel } = require('../module')
const { keyboard, inlineKeyboard, callbackButton } = require('telegraf/markup')

scene.enter(ctx => {
    ctx.reply('Меню', keyboard([
        ['Добавить канал', 'Лист каналов'],
        ['На главную']
    ]).oneTime().resize().extra())
})

scene.hears('Добавить канал', ctx => ctx.scene.enter('add_channel'))
scene.hears('Лист каналов', async ctx => {
    let channel = await Channel.find({ Creator: ctx.from.id })
    if(channel){
        ctx.reply(ctx.message.text, keyboard(channel.map(c => c.NameChannel)).oneTime().resize().extra())
        setTimeout(() => { 
            ctx.reply('Назад?', inlineKeyboard([ callbackButton('<- Назад', 'back') ]).extra())
        }, 500)
    }else{
        ctx.reply('У тебя нету каналов', keyboard(['На главную']).oneTime().resize().extra())
    }
})

scene.on('text', async (ctx, next) => {
    let channel = await Channel.find({ Creator: ctx.from.id })
    let channels = channel.find(c => c.NameChannel === ctx.message.text)
    if(channels){
        ctx.session.counter = channels._id
        ctx.reply(ctx.message.text,
        keyboard([
            ['Редактировать'],
            ['Автопостинг'],
            ['Удалить канал'],
            ['< Назад']
        ]).oneTime().resize().extra())
    } next()
})

scene.hears('Редактировать', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    channel ? ctx.scene.enter('edit_name') : ctx.reply('Упс, не известная ошибка или отсутвует канал!', keyboard(['< Назад']).oneTime().resize().extra())
})

scene.hears('Автопостинг', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    if(channel.Status === `Run`){
        ctx.reply(`✅ Автопост включен!`,
        inlineKeyboard([ callbackButton('🔴 Отключить автопост', 'auto-off') ]).extra())
    }else{
        ctx.reply(`🔴 Автопост отключен!`,
        inlineKeyboard([ callbackButton('✅ Включить автопост', 'auto-on') ]).extra())
    }
})

scene.action('auto-off', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    channel.Status = `Cansel`
    channel.save().catch(err => console.log(err))

    ctx.editMessageText(`🔴 Автопост отключен!`,
    inlineKeyboard([
        [callbackButton('✅ Включить автопост', 'auto-on')],
        [callbackButton('<- Назад', 'back')]
    ]).extra())
})
scene.action('auto-on', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    channel.Status = `Run`
    channel.save().catch(err => console.log(err))

    ctx.editMessageText(`✅ Автопост включен!`,
    inlineKeyboard([
        [callbackButton('🔴 Отключить автопост', 'auto-off')],
        [callbackButton('<- Назад', 'back')]
    ]).extra())
})

scene.hears('Удалить канал', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    await Channel.remove({ _id: ctx.session.counter })
    ctx.reply(`Канал: ${channel.NameChannel} удален!`,
    inlineKeyboard([
        callbackButton('<- Назад', 'back')
    ]).extra())
})

scene.action('back', ctx => {
    ctx.deleteMessage()
    ctx.reply('Меню', keyboard([
        ['Добавить канал', 'Лист каналов'],
        ['На главную']
    ]).oneTime().resize().extra())
})

scene.action('< Назад', ctx => {
    ctx.reply('Меню', keyboard([
        ['Добавить канал', 'Лист каналов'],
        ['На главную']
    ]).oneTime().resize().extra())
})

module.exports = scene