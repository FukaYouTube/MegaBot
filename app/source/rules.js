const { BlackList } = require('../module')

exports.isArab = async text => {
    let arabic = /[\u0600-\u06FF\u0750-\u077F]/
    result = arabic.test(text)
    return result
}
exports.isArabMid = async (ctx, next) => {
    if(await exports.isArab(ctx.from.first_name)){
        return ctx.reply(ctx.i18n.t('err_2'))
    }else{ next() }
}

exports.isBlack = async user => {
    let black = await BlackList.findById(user)
    return !!black
}
exports.isBlackMid = async (ctx, next) => {
    if(await exports.isBlack(ctx.from.id)){
        return ctx.reply(ctx.i18n.t('err_3'))
    }else{ next() }
}