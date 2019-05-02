const Scene = require('telegraf/scenes/base')
const scene = new Scene('add_ero_channel')

const { E_User } = require('../module')
const { inlineKeyboard, callbackButton } = require('telegraf/markup')

scene.enter(ctx => {
    ctx.reply(ctx.i18n.t('add_channels'), inlineKeyboard([
        callbackButton('Показать код', 'view')
    ]).extra())
})
scene.action('view', async ctx => { 
    ctx.answerCbQuery().catch(e => console.log(e))

    let user = await E_User.findById(ctx.from.id)
    user.Code = Math.floor(100000 + Math.random() * 900000) //6
    user.save().catch(e => console.log(e))
    ctx.editMessageText(`AddEroChannel: ${user.Code}`)
})

module.exports = scene