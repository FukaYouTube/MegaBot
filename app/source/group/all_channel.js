const { Channel } = require('../../module')
const { webPreview } = require('telegraf/extra')

exports.channels_1v = async ctx => {
    let channel = await Channel.find({})
    let ink = `Все каналы: \n\n`
    channel.map(c => ink += `🧸 [${c.NameChannel}](${c.InvateLink}) подписчиков: ${c.Subscribers}\n`)
    ctx.replyWithMarkdown(ink, webPreview(false))
}