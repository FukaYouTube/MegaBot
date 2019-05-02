const Stage = require('telegraf/stage')
const stage = new Stage()

const rules = require('../source/rules')
stage.use((ctx, next) => { rules.isArabMid(ctx, next) })
stage.use((ctx, next) => { rules.isBlackMid(ctx, next) })

stage.register(require('./main_menu'))
stage.register(require('./add_channel'))
stage.register(require('./edit_name'))
stage.register(require('./mega_a'))
stage.register(require('./user_settings'))
stage.register(require('./add_ads'))
stage.register(require('./add_closed_mega'))
stage.register(require('./add_footer_mega'))
stage.register(require('./add_open_mega'))
stage.register(require('./add_head_mega'))
stage.register(require('./ero_footer_mega'))
stage.register(require('./ero_head_mega'))
stage.register(require('./mega_h'))
stage.register(require('./add_ero_channel'))
stage.register(require('./ero_edit_name'))

stage.hears('На главную', ctx => ctx.scene.enter('main_menu'))

module.exports = stage