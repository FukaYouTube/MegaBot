const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { Creator } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.OpenMega = ctx.message.text
    creator.save().catch(err => console.log(err))

    ctx.reply(`Добавлен!`, keyboard(['На главную']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const m_open = new WizardScene('add_open_mega',
ctx => {
    ctx.replyWithMarkdown(`Открытия меги`, removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = m_open