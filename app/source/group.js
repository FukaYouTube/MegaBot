const Composer = require('telegraf/composer')
const app = new Composer()

const schedule = require('node-schedule-tz')

let started = require('./group/is_started')
let openned = require('./group/is_openned')
let timer = require('./timer')

app.start(async ctx => {
    let list = await ctx.telegram.getChatAdministrators(ctx.chat.id)
    ctx.state.isAdmin = list.findIndex(e => e.user.id === ctx.message.from.id) !== -1
    if(!ctx.state.isAdmin){ return }

    if(ctx.chat.title === `FMP - [Mega 0+]` && started.mega_0){
        once(ctx)
        started.mega_0 = false
    }
    if(ctx.chat.title === `FMP - [Mega 1k+]` && started.mega_1){
        once(ctx)
        started.mega_1 = false
    }
    if(ctx.chat.title === `FMP - [Mega 18+]` && started.mega_18){
        once(ctx)
        started.mega_18 = false
    }
    
    ctx.deleteMessage()
})

var once = ctx => {
    schedule.scheduleJob(timer.open, () => {
        if(ctx.chat.title === `FMP - [Mega 0+]`){
            require('./group/openned').openned(ctx)
        }
        if(ctx.chat.title === `FMP - [Mega 1k+]`){
            require('./group/openned').openned(ctx)
        }
        if(ctx.chat.title === `FMP - [Mega 18+]`){
            require('./group/openned').openned(ctx)
        }
    })
    schedule.scheduleJob(timer.closed, () => {
        if(ctx.chat.title === `FMP - [Mega 0+]`){
            require('./group/closed').closed_1m(ctx)
        }
        if(ctx.chat.title === `FMP - [Mega 1k+]`){
            require('./group/closed').closed_2m(ctx)
        }
        if(ctx.chat.title === `FMP - [Mega 18+]`){
            require('./group/closed').closed_3m(ctx)
        }
    })
    ctx.reply('Принято!').then(message => { setTimeout(() => { ctx.deleteMessage(message.message_id) }, 8000) })
}

app.command('channels', async ctx => {
    if(ctx.chat.title === `FMP - [TestGroup_Mega]`){
        require('./group/all_channel').channels_1v(ctx)
    }
})
app.command('open', async ctx => {
    let list = await ctx.telegram.getChatAdministrators(ctx.chat.id)
    ctx.state.isAdmin = list.findIndex(e => e.user.id === ctx.message.from.id) !== -1
    if(!ctx.state.isAdmin){ return }

    if(ctx.chat.title === `FMP - [Mega 0+]`){
        require('./group/openned').openned(ctx)
        openned.mega_0 = false
    }
    if(ctx.chat.title === `FMP - [Mega 1k+]`){
        require('./group/openned').openned(ctx)
        openned.mega_1 = false
    }
    if(ctx.chat.title === `FMP - [Mega 18+]`){
        require('./group/openned').openned(ctx)
        openned.mega_18 = false
    }
})
app.command('closed', async ctx => {
    let list = await ctx.telegram.getChatAdministrators(ctx.chat.id)
    ctx.state.isAdmin = list.findIndex(e => e.user.id === ctx.message.from.id) !== -1
    if(!ctx.state.isAdmin){ return }

    if(ctx.chat.title === `FMP - [Mega 0+]` && !openned.mega_0){
        require('./group/closed').closed_1m(ctx)
        openned.mega_0 = true
    }
    if(ctx.chat.title === `FMP - [Mega 1k+]` && !openned.mega_1){
        require('./group/closed').closed_1m(ctx)
        openned.mega_1 = true
    }
    if(ctx.chat.title === `FMP - [Mega 18+]` && !openned.mega_18){
        require('./group/closed').closed_1m(ctx)
        openned.mega_18 = true
    }
})

module.exports = app