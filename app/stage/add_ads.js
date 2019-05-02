const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { Creator } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.Ads = ctx.message.text
    creator.save().catch(e => console.log(e))
    ctx.reply('Готово!', keyboard(['На главную']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const editor = new WizardScene('add_ads',
ctx => {
    ctx.replyWithMarkdown(`Ну тип рекламу сюды:`, removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = editor