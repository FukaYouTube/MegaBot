const Composer = require('telegraf/composer')
const app = new Composer()

const { User, Channel, Creator, Admin } = require('../module')
const { keyboard, inlineKeyboard, callbackButton } = require('telegraf/markup')

app.command('creator', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    if(!creator){
        creator = new Creator({
            _id: ctx.from.id,
            UserName: ctx.from.username,
            FirstName: ctx.from.first_name
        }); creator.save().catch(e => console.log(e))
        ctx.reply(`Зарегестрирован!!`)
    }else{
        ctx.reply(`Добро пожаловать мой хозяин ${ctx.from.first_name}!\n\n${ctx.i18n.t('creator')}`, keyboard([
            ['Очистить каналы'],
            ['Очистить пользователей'],
            ['Просм всех администраторов'],
            ['На главную']
        ]).oneTime().resize().extra())
    }
})

app.hears('Очистить каналы', ctx => {
    ctx.reply('Уверены?', inlineKeyboard([
        [callbackButton('Да', 'yes_clr_channel'), callbackButton('Нет', 'no_clr_channel')]
    ]).extra())
})
app.action('yes_clr_channel', async ctx => {
    await Channel.remove({})
    ctx.editMessageText('Очистка выполнена!')
})
app.action('no_clr_channel', async ctx => {
    ctx.editMessageText('Отмена выполнена!')
})

app.hears('Очистить пользователей', ctx => {
    ctx.reply('Уверены?', inlineKeyboard([
        [callbackButton('Да', 'yes_clr_user'), callbackButton('Нет', 'no_clr_user')]
    ]).extra())
})
app.action('yes_clr_user', async ctx => {
    await User.remove({})
    ctx.editMessageText('Очистка выполнена!')
})
app.action('no_clr_user', async ctx => {
    ctx.editMessageText('Отмена выполнена!')
})

app.hears('Просм всех администраторов', async ctx => {
    let admin = await Admin.find({})
    let ink = `Все администраторы проекта:\n\n`
    admin.map(c => ink += `${c._id} ~\n@${c.UserName} > ${c.FirstName} \n❤️ ${c.Like}   ⚠️ ${c.Warn}\n\n`)
    ctx.reply(ink)
})

app.hears(/addAdmin\s([^+\"]+)/i, async ctx => {
    let admin = await Admin.findById(ctx.match[1])
    let user = await User.findById(ctx.match[1])
    if(!user){ return ctx.reply('Этого пользователя нету в базе данных') }
    if(!admin){
        admin = new Admin({
            _id: user._id,
            UserName: user.UserName,
            FirstName: user.FirstName,
            Like: 0,
            Warn: 0
        }); admin.save().catch(e => console.log(e))
        ctx.reply('Добавлен!')
    }else{ ctx.reply('Этот пользователь уже существует') }
})
app.hears(/remAdmin\s([^+\"]+)/i, async ctx => {
    let admin = await Admin.findById(ctx.match[1])
    if(admin){
        await Admin.remove({ _id: ctx.match[1] })
    }else{ return ctx.reply('Не найден!') }
})

app.command('addAds', ctx => {
    ctx.scene.enter('add_ads')
})

app.hears(/addGif\s([^+\"]+)/i, async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.Gif.push(ctx.match[1])
    creator.save().catch(e => console.log(e))
    ctx.reply('Гиф сохранен!')
})
app.hears(/eroGif\s([^+\"]+)/i, async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    creator.EroGif.push(ctx.match[1])
    creator.save().catch(e => console.log(e))
    ctx.reply('Эро Гиф сохранен!')
})

app.command('mega_open', ctx => {
    ctx.scene.enter('add_open_mega')
})
app.command('mega_closed', ctx => {
    ctx.scene.enter('add_closed_mega')
})
app.command('mega_header', ctx => {
    ctx.scene.enter('add_header_mega')
})
app.command('mega_footer', ctx => {
    ctx.scene.enter('add_footer_mega')
})

app.command('mega_view', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    ctx.reply(`Открытия: \n\n${creator.OpenMega}`)
    ctx.reply(`Закрытия: \n\n${creator.ClosedMega}`)

    setTimeout(() => {
        let ink = creator.HeaderMega + `\n\n`
        ink += `1.1k NameChannel \n0.1k NameChannel \n3.1k NameChannel \n`
        ink += `\n` + creator.FooterMega
        ctx.replyWithMarkdown(ink)
    }, 1000)
})

app.command('ero_mega_header', ctx => {
    ctx.scene.enter('ero_header_mega')
})
app.command('ero_mega_footer', ctx => {
    ctx.scene.enter('ero_footer_mega')
})

app.command('ero_mega_view', async ctx => {
    let creator = await Creator.findById(ctx.from.id)
    let ink = creator.EroHeaderMega + `\n\n`
    ink += `1.1k Ero NameChannel \n0.1k Ero NameChannel \n3.1k Ero NameChannel \n`
    ink += `\n` + creator.EroFooterMega
    ctx.replyWithMarkdown(ink)
})

module.exports = app