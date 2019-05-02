const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { Creator } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.EroHeaderMega = ctx.message.text
    creator.save().catch(err => console.log(err))

    ctx.reply(`Добавлен!`, keyboard(['На главную']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const m_head = new WizardScene('ero_header_mega',
ctx => {
    ctx.replyWithMarkdown(`Глава меги`, removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = m_head