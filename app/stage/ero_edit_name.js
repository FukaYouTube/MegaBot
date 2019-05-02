const Composer = require('telegraf/composer')
const neko = new Composer()
const WizardScene = require('telegraf/scenes/wizard')

const { E_Channel } = require('../module')
const { keyboard, removeKeyboard } = require('telegraf/markup')

neko.on('text', async ctx => {
    let channel = await E_Channel.findById(ctx.session.counter)
    channel.LinkName = ctx.message.text
    channel.save().catch(err => console.log(err))

    ctx.reply(`Канал ${channel.NameChannel} теперь имеет имя заявки: ${channel.LinkName}`, keyboard(['Тупо назад']).oneTime().resize().extra())
    return ctx.scene.leave()
})

const editor = new WizardScene('ero_edit_name',
ctx => {
    ctx.replyWithMarkdown(ctx.i18n.t('edit_name'), removeKeyboard().extra())
    return ctx.wizard.next()
}, neko)

module.exports = editor