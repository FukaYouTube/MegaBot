const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { Creator } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.ClosedMega = ctx.message.text
    creator.save().catch(err => console.log(err))

    ctx.reply(`Добавлен!`, keyboard(['На главную']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const m_closed = new WizardScene('add_closed_mega',
ctx => {
    ctx.replyWithMarkdown(`Закрытия меги`, removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = m_closed