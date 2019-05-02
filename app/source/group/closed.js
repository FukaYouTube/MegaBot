const { Channel, E_Channel, Creator } = require('../../module')
const { markdown, webPreview } = require('telegraf/extra')

const schedule = require('node-schedule-tz')

let timer = require('../timer')

const { err_delete } = require('./mega/err_delete')
const { err_send } = require('./mega/err_send')

let date = new Date()
let mon = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"]
let view = date.getDate() + ' ' + mon[date.getMonth()] + ' ' + date.getFullYear()

exports.closed_1m = async ctx => {
    let channel = await Channel.find({ Subscribers: { $lte: 1000 } })
    let creator = await Creator.findById(471556440)
    ctx.replyWithMarkdown(`${ctx.i18n.t('closed', { date: view })}\n${creator.ClosedMega}`).then(msg => ctx.pinChatMessage(msg.message_id))
    setTimeout(() => {
        channel.sort(() => { return 0.5 - Math.random() })
        creator.Gif.sort(() => { return 0.5 - Math.random() })
        let a = String.fromCharCode(0x200C)
        let ink = `[${a}](${creator.Gif})${creator.HeaderMega}\n\n`
        channel.map(c => {
            function number(num){
                return Math.abs(num) > 0 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
            }
            if(c.Status === `Run`){
                ink += `${number(c.Subscribers)} [${c.LinkName}](${c.InvateLink})\n`
            }
        })
        ink += `\n ${creator.FooterMega}`
        ctx.replyWithMarkdown(ink, webPreview(true))
        channel.map(c => {
            if(c.Status === `Run`){
                ctx.telegram.sendMessage(c._id, ink, markdown().webPreview(true)).catch(err => err_send(ctx, err, c))
                .then(message => {
                    schedule.scheduleJob(timer.deleted, function(message){
                        return ctx.telegram.deleteMessage(c._id, message.message_id).then(res => console.log(res)).catch(err => err_delete(ctx, err, c))
                    }.bind(null, message))
                })
                setTimeout(() => { ctx.replyWithMarkdown(`🧸 На канале [${c.NameChannel}](${c.InvateLink}) мега опубликована!`, webPreview(false)) }, 2000)
            }
        })
    }, 2000)
}
exports.closed_2m = async ctx => {
    let channel = await Channel.find({ Subscribers: { $gte: 1000 } })
    let creator = await Creator.findById(471556440)
    ctx.replyWithMarkdown(`${ctx.i18n.t('closed', { date: view })}\n${creator.ClosedMega}`).then(msg => ctx.pinChatMessage(msg.message_id))
    setTimeout(() => {
        channel.sort(() => { return 0.5 - Math.random() })
        creator.Gif.sort(() => { return 0.5 - Math.random() })
        let a = String.fromCharCode(0x200C)
        let ink = `[${a}](${creator.Gif})${creator.HeaderMega}\n\n`
        channel.map(c => {
            function number(num){
                return Math.abs(num) > 0 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
            }
            if(c.Status === `Run`){
                ink += `${number(c.Subscribers)} [${c.LinkName}](${c.InvateLink})\n`
            }
        })
        ink += `\n ${creator.FooterMega}`
        ctx.replyWithMarkdown(ink, webPreview(true))
        channel.map(c => {
            if(c.Status === `Run`){
                ctx.telegram.sendMessage(c._id, ink, markdown().webPreview(true)).catch(err => err_send(ctx, err, c))
                .then(message => {
                    schedule.scheduleJob(timer.deleted, function(message){
                        return ctx.telegram.deleteMessage(c._id, message.message_id).then(res => console.log(res)).catch(err => err_delete(ctx, err, c))
                    }.bind(null, message))
                })
                setTimeout(() => { ctx.replyWithMarkdown(`🔥 На канале [${c.NameChannel}](${c.InvateLink}) мега опубликована!`, webPreview(false)) }, 2000)
            }
        })
    }, 2000)
}
exports.closed_3m = async ctx => {
    let channel = await E_Channel.find({})
    let creator = await Creator.findById(471556440)
    ctx.replyWithMarkdown(`${ctx.i18n.t('closed', { date: view })}\n${creator.ClosedMega}`).then(msg => ctx.pinChatMessage(msg.message_id))
    setTimeout(() => {
        channel.sort(() => { return 0.5 - Math.random() })
        creator.Gif.sort(() => { return 0.5 - Math.random() })
        let a = String.fromCharCode(0x200C)
        let ink = `[${a}](${creator.Gif})${creator.EroHeaderMega}\n\n`
        channel.map(c => {
            function number(num){
                return Math.abs(num) > 0 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
            }
            if(c.Status === `Run`){
                ink += `${number(c.Subscribers)} [${c.LinkName}](${c.InvateLink})\n`
            }
        })
        ink += `\n ${creator.EroFooterMega}`
        ctx.replyWithMarkdown(ink, webPreview(true))
        channel.map(c => {
            if(c.Status === `Run`){
                ctx.telegram.sendMessage(c._id, ink, markdown().webPreview(true)).catch(err => err_send(ctx, err, c))
                .then(message => {
                    schedule.scheduleJob(timer.deleted, function(message){
                        return ctx.telegram.deleteMessage(c._id, message.message_id).then(res => console.log(res)).catch(err => err_delete(ctx, err, c))
                    }.bind(null, message))
                })
                setTimeout(() => { ctx.replyWithMarkdown(`🔞 На канале [${c.NameChannel}](${c.InvateLink}) мега опубликована!`, webPreview(false)) }, 2000)
            }
        })
    }, 2000)
}