const { User, Channel, Creator } = require('../../module')

const { webPreview } = require('telegraf/extra')

exports.openned = async ctx => {
    let date = new Date()
    let mon = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
    let view = date.getDate() + ' ' + mon[date.getMonth()] + ' ' + date.getFullYear()

    let channel = await Channel.find({})
    let creator = await Creator.findById(471556440)
    ctx.replyWithMarkdown(`${ctx.i18n.t('openned', { date: view })}\n${creator.OpenMega}`)//.then(msg => ctx.pinChatMessage(msg.message_id))
    setTimeout(() => {
        channel.map(async c => {
            let user = await User.findById(c.Creator)
            ctx.replyWithMarkdown(`@${user.UserName}!\nКанал [${c.NameChannel}](${c.InvateLink}) добавлен в список меги!`, webPreview(false))
            ctx.telegram.sendMessage(user._id, `Твой канал ${c.NameChannel} добавлен в список меги!`)
        })       
    }, 2000)
}