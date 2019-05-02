const Scene = require('telegraf/scenes/base')
const scene = new Scene('add_channel')

const { User } = require('../module')
const { inlineKeyboard, callbackButton } = require('telegraf/markup')

scene.enter(ctx => {
    ctx.deleteMessage().catch(e => console.log(e))
    ctx.reply(ctx.i18n.t('add_channels'), inlineKeyboard([
        callbackButton('Показать код', 'view')
    ]).extra())
})
scene.action('view', async ctx => { 
    ctx.answerCbQuery().catch(e => console.log(e))

    let user = await User.findById(ctx.from.id)
    if(!user){
        user = new User({
            _id: ctx.from.id,
            UserName: ctx.from.username,
            FirstName: ctx.from.first_name,
            Code: Math.floor(100000000 + Math.random() * 900000000), //9
            Warn: 0
        }); user.save().catch(e => console.log(e))
        ctx.editMessageText(`Added: ${user.Code}`)
    }else{
        user.Code = Math.floor(100000000 + Math.random() * 900000000) //9
        user.save().catch(e => console.log(e))
        ctx.editMessageText(`Added: ${user.Code}`)
    }
})

module.exports = scene