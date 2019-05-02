const Scene = require('telegraf/scenes/base')
const scene = new Scene('main_menu')

const { E_User } = require('../module')
const { keyboard } = require('telegraf/markup')

scene.enter(ctx => {
    ctx.reply('Главное меню! \n🎈 - не работает', keyboard([
        ['🧸 MEGA[A]', '🔞 MEGA[H]'],
        ['🐼 Пользовательские настройки'],
        ['🦋 О нас', '❤️ Спасибо'],
        ['💲 Купить рекламу', '😻 Донат'],
        ['🧶 Больше функций 🎈'],
        ['📄 Report 🎈']
    ]).oneTime().resize().extra())
})

scene.hears('🧸 MEGA[A]', ctx => ctx.scene.enter('mega_a'))
scene.hears('🐼 Пользовательские настройки', ctx => ctx.scene.enter('user_settings'))

scene.hears('🔞 MEGA[H]', async ctx => {
    let user = await E_User.findById(ctx.from.id)
    user ? ctx.scene.enter('mega_h') : ctx.reply(ctx.i18n.t('hent_acc'))
})

scene.hears('🦋 О нас', ctx => ctx.replyWithMarkdown(ctx.i18n.t('about', { bot: process.env.VERSION })))
scene.hears('❤️ Спасибо', ctx => ctx.replyWithMarkdown(ctx.i18n.t('thanks')))
scene.hears('💲 Купить рекламу', ctx => ctx.replyWithMarkdown(ctx.i18n.t('pay')))
scene.hears('😻 Донат', ctx => ctx.replyWithMarkdown(ctx.i18n.t('donate')))

module.exports = scene