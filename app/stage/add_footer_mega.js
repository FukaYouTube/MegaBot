const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { Creator } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.FooterMega = ctx.message.text
    creator.save().catch(err => console.log(err))

    ctx.reply(`Добавлен!`, keyboard(['На главную']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const m_footer = new WizardScene('add_footer_mega',
ctx => {
    ctx.replyWithMarkdown(`Конец меги`, removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = m_footer