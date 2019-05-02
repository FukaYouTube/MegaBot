const Composer = require('telegraf/composer')
const app = new Composer()

const { Admin, User, Channel, BlackList, Creator, E_User, E_Channel } = require('../module')
const { keyboard, inlineKeyboard, callbackButton } = require('telegraf/markup')
const { webPreview } = require('telegraf/extra')

app.command('admin', ctx => {
    ctx.reply(ctx.i18n.t('admin', { name: ctx.from.first_name }), keyboard([
        ['[A]Все пользователи', '[A]Все каналы'],
        ['[H]Все пользователи', '[H]Все каналы'],
        ['Моя иформация'],
        ['Черный сисок'],
        ['На главную']
    ]).oneTime().resize().extra())
})

app.hears('[A]Все пользователи', async ctx => {
    let user = await User.find({})
    let ink = `Все пользователи данного проекта:\n\n`
    user.map(c => ink += `${c._id} ~\n@${c.UserName} > ${c.FirstName}\n\n`)
    ctx.reply(ink)
})
app.hears('[A]Все каналы', async ctx => {
    let channel = await Channel.find({})
    let ink = `Все каналы данного проекта:\n\n`
    channel.map(c => ink += `${c._id} ~\n[${c.NameChannel}](${c.InvateLink})\n\n`)
    ctx.replyWithMarkdown(ink, webPreview(false))
})
app.hears('[H]Все пользователи', async ctx => {
    let user = await E_User.find({})
    let ink = `Все пользователи данного проекта:\n\n`
    user.map(c => ink += `${c._id} ~\n@${c.UserName} > ${c.FirstName}\n\n`)
    ctx.reply(ink)
})
app.hears('[H]Все каналы', async ctx => {
    let channel = await E_Channel.find({})
    let ink = `Все каналы данного проекта:\n\n`
    channel.map(c => ink += `${c._id} ~\n[${c.NameChannel}](${c.InvateLink})\n\n`)
    ctx.replyWithMarkdown(ink, webPreview(false))
})
app.hears('Моя иформация', async ctx => {
    let admin = await Admin.findById(ctx.from.id)
    ctx.reply(ctx.i18n.t('info_admin', {
        name: ctx.from.first_name, username: ctx.from.username, like: admin.Like, warn: admin.Warn
    }))
})
app.hears('Черный сисок', async ctx => {
    let black = await BlackList.find({})
    let ink = `Пользователи в черном списке проекта:\n\n`
    black.map(c => ink += `@${c.UserName} > ${c.FirstName}\nПричина: ${c.Reason}\n\n`)
    ctx.reply(ink)
})

app.hears(/more_u\s([^+\"]+)/i, async ctx => {
    let user = await User.findById(ctx.match[1])
    let channel = await Channel.find({ Creator: ctx.match[1] })
    if(!user){ return ctx.reply('Пользователя не существует!') }
    ctx.session.counter = user._id
    ctx.replyWithMarkdown(ctx.i18n.t('info_user', {
        name: user.FirstName, id: user._id, username: user.UserName, warn: user.Warn, channel: channel.map(c => `[${c.NameChannel}](${c.InvateLink})`)
    }), inlineKeyboard([
        [callbackButton('Добавить в 18+ мегу', 'add_ero')],
        [callbackButton('Удалить с 18+ меги', 'rem_ero')],
        [callbackButton('Обнулить варн', 'warn_ull')],
        [callbackButton('Удалить пользователя', 'remove_user')],
        [callbackButton('В черный список', 'add_black')]
    ]).extra())
})
app.action('add_ero', async ctx => {
    ctx.answerCbQuery().catch(e => console.log(e))
    let user = await User.findById(ctx.session.counter)
    let ero_user = await E_User.findById(ctx.session.counter)
    if(!ero_user){
        ero_user = new E_User({
            _id: user._id,
            UserName: user.UserName,
            FirstName: user.FirstName,
            Warn: 0
        }); ero_user.save().catch(e => console.log(e))
        ctx.editMessageText('Добавлен!', inlineKeyboard([
            [callbackButton('Удалить с 18+ меги', 'rem_ero')],
            [callbackButton('Обнулить варн', 'warn_ull')],
            [callbackButton('Удалить пользователя', 'remove_user')],
            [callbackButton('В черный список', 'add_black')]
        ]).extra())
    }else{ return ctx.reply('Пользователь существует!') }
})
app.action('rem_ero', async ctx => {
    ctx.answerCbQuery().catch(e => console.log(e))
    let ero_user = await E_User.findById(ctx.session.counter)
    if(ero_user){
        await E_User.remove({ _id: ctx.session.counter })
        ctx.editMessageText('Пользователь удален с 18+ меги!', inlineKeyboard([
            [callbackButton('Добавить в 18+ мегу', 'add_ero')],
            [callbackButton('Обнулить варн', 'warn_ull')],
            [callbackButton('Удалить пользователя', 'remove_user')],
            [callbackButton('В черный список', 'add_black')]
        ]).extra())
    }else{ return ctx.reply('Пользователь не найден!') }
})
app.action('warn_ull', async ctx => {
    ctx.answerCbQuery().catch(e => console.log(e))
    await User.findOneAndUpdate({ _id: ctx.session.counter }, { Warn: 0 })
    ctx.editMessageText('Обнулирован!', inlineKeyboard([
        [callbackButton('Добавить в 18+ мегу', 'add_ero')],
        [callbackButton('Удалить с 18+ меги', 'rem_ero')],
        [callbackButton('Удалить пользователя', 'remove_user')],
        [callbackButton('В черный список', 'add_black')]
    ]).extra())
})
app.action('remove_user', async ctx => {
    ctx.answerCbQuery().catch(e => console.log(e))
    let admin = await Admin.findById(ctx.session.counter)
    if(!admin){
        await Channel.remove({ Creator: ctx.session.counter })
        await User.remove({ _id: ctx.session.counter })
        ctx.editMessageText('Удален!', inlineKeyboard([
            [callbackButton('Добавить в 18+ мегу', 'add_ero')],
            [callbackButton('Удалить с 18+ меги', 'rem_ero')],
            [callbackButton('Обнулить варн', 'warn_ull')],
            [callbackButton('В черный список', 'add_black')]
        ]).extra())
    }else{ return ctx.reply(`Данный пользователь является администратором проекта`) }
})
app.action('add_black', async ctx => {
    ctx.answerCbQuery().catch(e => console.log(e))
    let user = await User.findById(ctx.session.counter)
    let admin = await Admin.findById(ctx.session.counter)
    if(!admin){
        let black = await BlackList.findById(ctx.session.counter)
        if(!black){
            black = new BlackList({
                _id: user._id,
                UserName: user.UserName,
                FirstName: user.FirstName,
                Reason: `Баз причины`
            }); black.save().catch(e => console.log(e))
            await Channel.remove({ Creator: ctx.session.counter })
            ctx.editMessageText('Данный пользователь добавлен в черный список', inlineKeyboard([
                [callbackButton('Добавить в 18+ мегу', 'add_ero')],
                [callbackButton('Удалить с 18+ меги', 'rem_ero')],
                [callbackButton('Обнулить варн', 'warn_ull')],
                [callbackButton('Удалить пользователя', 'remove_user')]
            ]).extra())
        }else{ return ctx.reply('Данный пользователь в черном списке') }
    }else{ return ctx.reply(`Данный пользователь является администратором проекта`) }
})

app.hears(/more_c\s([^+\"]+)/i, async ctx => {
    let channel = await Channel.findById(ctx.match[1])
    if(!channel){ return ctx.reply('Канала не существует!') }
    ctx.session.counter = channel._id
    let user = await User.findById(channel.Creator)
    ctx.reply(ctx.i18n.t('info_channel', {
        id: channel._id, name: channel.NameChannel, user: channel.UserChannel, link: channel.InvateLink, creator: user.FirstName, user_creator: user.UserName, id_creator: user._id
    }), inlineKeyboard([ 
        [callbackButton('Обновить информацию', 'update')],
        [callbackButton('Удалить канал', 'remove_channel')]
    ]).extra())
})
app.action('update', async ctx => {
    let channel = await Channel.findById(ctx.session.counter)
    if(channel.UserChannel){
        await Channel.findOneAndUpdate({ _id: channel._id }, {
            Subscribers: await ctx.getChatMembersCount(channel._id),
            Status: `Run`
        })
    }else{
        await Channel.findOneAndUpdate({ _id: channel._id }, {
            InvateLink: await ctx.exportChatInviteLink(channel._id),
            Subscribers: await ctx.getChatMembersCount(channel._id),
            Status: `Run`
        })
    }
    ctx.editMessageText('Обнавлен!')
})
app.action('remove_channel', async ctx => {
    await Channel.remove({ _id: ctx.session.counter })
    ctx.editMessageText('Канал удален!')
})

app.hears(/add_black\s([^+\"]+)/i, async ctx => {
    let user = await User.findById(ctx.match[1])
    if(user){
        let admin = await Admin.findById(ctx.match[1])
        if(admin){ return ctx.reply(`Данный пользователь является администратором проекта`) }

        let black = await BlackList.findById(ctx.match[1])
        if(!black){
            black = new BlackList({
                _id: user._id,
                UserName: user.UserName,
                FirstName: user.FirstName,
                Reason: `Баз причины`
            }); black.save().catch(e => console.log(e))
            await Channel.remove({ Creator: ctx.session.counter })
            ctx.reply('Данный пользователь добавлен в черный список')
        }else{ return ctx.reply('Пользователь в черном списке!') }
    }else{ return ctx.reply('Пользователь не найден!') }
})
app.hears(/remove_black\s([^+\"]+)/i, async ctx => {
    let user = await User.findById(ctx.match[1])
    if(user){
        let black = await BlackList.findById(ctx.match[1])
        if(black){
            await BlackList.remove({ _id: user._id })
        }else{ return ctx.reply('Пользователь не найден!') }
    }else{ return ctx.reply('Пользователь не найден!') }
})

app.command('gif', async ctx => {
    let creator = await Creator.findById(471556440)
    ctx.reply(`Гиф: ${creator.Gif.length} \nЭро гифки: ${creator.EroGif.length}`)
    setTimeout(() => {
        ctx.reply(creator.Gif)
        ctx.reply(creator.EroGif)
    }, 500)
})

app.hears(/e_user\s([^+\"]+)/i, async ctx => {
    let user = await User.findById(ctx.match[1])
    if(user){
        let e_user = await E_User.findById(ctx.match[1])
        if(!e_user){
            e_user = new E_User({
                _id: user._id,
                UserName: user.UserName,
                FirstName: user.FirstName,
                Warn: 0
            }); e_user.save().catch(e => console.log(e))
            ctx.reply('Добавлен!')
        }else{ return ctx.reply('Пользователь существует!') }
    }else{ return ctx.reply('Пользователь не найден!') }
})
app.hears(/r_user\s([^+\"]+)/i, async ctx => {
    let user = await E_User.findById(ctx.match[1])
    if(user){
        await E_User.remove({ _id: ctx.match[1] })
        ctx.reply('Удален!')
    }else{ return ctx.reply('Пользователь не найден!') }
})

module.exports = app