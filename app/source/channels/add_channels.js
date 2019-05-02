const { User, Channel, E_User, E_Channel } = require('../../module')
const { markdown } = require('telegraf/extra')
const { keyboard } = require('telegraf/markup')

const info = require('./group_info')

exports.add_channels = async (ctx, code) => {
    let number = await ctx.getChatMembersCount(ctx.update.channel_post.chat.id)

    let user = await User.findOne({ Code: code })
    let channel = await Channel.findById(ctx.update.channel_post.chat.id)
    if(user){
        if(!channel){
            if(ctx.update.channel_post.chat.username){
                channel = new Channel({
                    _id: ctx.update.channel_post.chat.id,
                    UserChannel: ctx.update.channel_post.chat.username,
                    NameChannel: ctx.update.channel_post.chat.title,
                    Subscribers: number,
                    InvateLink: `https://t.me/${ctx.update.channel_post.chat.username}`,
                    Status: `Run`,
                    Creator: user._id
                }); channel.save().catch(e => console.log(e))

                if(number <= 1000){
                    ctx.telegram.sendMessage(user._id, `Канал: @${channel.UserChannel} успешно добавлен! \nСсылка на группу: ${info.mega1.link}`, keyboard(['+ Дать имя заяки']).oneTime().resize().extra())
                    ctx.telegram.sendMessage(info.mega1.id, `🧸 Добавлен новый канал: @${channel.UserChannel}! \nКоличество подписчиков: ${channel.Subscribers}`)
                }else{
                    ctx.telegram.sendMessage(user._id, `Канал: @${channel.UserChannel} успешно добавлен! \nСсылка на группу: ${info.mega2.link}`, keyboard(['+ Дать имя заяки']).oneTime().resize().extra())
                    ctx.telegram.sendMessage(info.mega2.id, `🔥 Добавлен новый канал: @${channel.UserChannel}! \nКоличество подписчиков: ${channel.Subscribers}`)
                }
            }else{
                channel = new Channel({
                    _id: ctx.update.channel_post.chat.id,
                    NameChannel: ctx.update.channel_post.chat.title,
                    Subscribers: number,
                    InvateLink: await ctx.exportChatInviteLink(ctx.update.channel_post.chat.id),
                    Status: `Run`,
                    Creator: user._id
                }); channel.save().catch(e => console.log(e))

                if(number <= 1000){
                    ctx.telegram.sendMessage(user._id, `Приватный канал: [${channel.NameChannel}](${channel.InvateLink}) успешно добавлен! \nСсылка на группу: ${info.mega1.link}`, markdown().webPreview(false))
                    ctx.telegram.sendMessage(user._id, `...`, keyboard(['+ Дать имя заяки']).oneTime().resize().extra())
                    ctx.telegram.sendMessage(info.mega1.id, `🧸 Добавлен новый приватный канал: [${channel.NameChannel}](${channel.InvateLink})! \nКоличество подписчиков: ${channel.Subscribers}`, markdown().webPreview(false))
                }else{
                    ctx.telegram.sendMessage(user._id, `Приватный канал: [${channel.NameChannel}](${channel.InvateLink}) успешно добавлен! \nСсылка на группу: ${info.mega2.link}`, markdown().webPreview(false))
                    ctx.telegram.sendMessage(user._id, `...`, keyboard(['+ Дать имя заяки']).oneTime().resize().extra())
                    ctx.telegram.sendMessage(info.mega2.id, `🔥 Добавлен новый приватный канал: [${channel.NameChannel}](${channel.InvateLink})! \nКоличество подписчиков: ${channel.Subscribers}`, markdown().webPreview(false))
                }
            }
            ctx.deleteMessage()
        }else{
            ctx.telegram.sendMessage(user._id, `Данный канал уже существует!`)
            ctx.deleteMessage()
        }
    }
}

exports.add_ero_channels = async (ctx, code) => {
    let number = await ctx.getChatMembersCount(ctx.update.channel_post.chat.id)

    let user = await E_User.findOne({ Code: code })
    let channel = await E_Channel.findById(ctx.update.channel_post.chat.id)
    if(user){
        if(!channel){
            if(ctx.update.channel_post.chat.username){
                channel = new E_Channel({
                    _id: ctx.update.channel_post.chat.id,
                    UserChannel: ctx.update.channel_post.chat.username,
                    NameChannel: ctx.update.channel_post.chat.title,
                    Subscribers: number,
                    InvateLink: `https://t.me/${ctx.update.channel_post.chat.username}`,
                    Status: `Run`,
                    Creator: user._id
                }); channel.save().catch(e => console.log(e))

                ctx.telegram.sendMessage(user._id, `Канал: @${channel.UserChannel} успешно добавлен! \nСсылка на группу: ${info.mega3.link}`, keyboard(['+ Дать имя заяки хентай каналу']).oneTime().resize().extra())
                ctx.telegram.sendMessage(info.mega3.id, `🔞 Добавлен новый канал: @${channel.UserChannel}! \nКоличество подписчиков: ${channel.Subscribers}`)
            }else{
                channel = new E_Channel({
                    _id: ctx.update.channel_post.chat.id,
                    NameChannel: ctx.update.channel_post.chat.title,
                    Subscribers: number,
                    InvateLink: await ctx.exportChatInviteLink(ctx.update.channel_post.chat.id),
                    Status: `Run`,
                    Creator: user._id
                }); channel.save().catch(e => console.log(e))

                ctx.telegram.sendMessage(user._id, `Приватный канал: [${channel.NameChannel}](${channel.InvateLink}) успешно добавлен! \nСсылка на группу: ${info.mega1.link}`, markdown().webPreview(false))
                ctx.telegram.sendMessage(user._id, `...`, keyboard(['+ Дать имя заяки хентай каналу']).oneTime().resize().extra())
                ctx.telegram.sendMessage(info.mega1.id, `🔞 Добавлен новый приватный канал: [${channel.NameChannel}](${channel.InvateLink})! \nКоличество подписчиков: ${channel.Subscribers}`, markdown().webPreview(false))
            }
            ctx.deleteMessage()
        }else{
            ctx.telegram.sendMessage(user._id, `Данный канал уже существует!`)
            ctx.deleteMessage()
        }
    }
}