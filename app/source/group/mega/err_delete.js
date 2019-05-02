const { Admin, User, Channel, BlackList } = require('../../../module')

exports.err_delete = async (ctx, err, channel) => {
    if(!err){ return }
    console.log(err)

    let user = await User.findById(channel.Creator)
    let warn = user.Warn
    await User.findOneAndUpdate({ _id: user._id }, { Warn: ++warn })
    
    if(warn >= 3){
        let black = new BlackList({
            _id: user._id,
            UserName: user.UserName,
            FirstName: user.FirstName,
            Reason: ctx.i18n.t('err_1')
        }); black.save().catch(e => console.log(e))
        await Channel.remove({ Creator: user._id })
        ctx.telegram.sendMessage(user._id, ctx.i18n.t('err_3'))
        ctx.telegram.kickChatMember(ctx.chat.id, user._id)
    }else{
        ctx.telegram.sendMessage(user._id, ctx.i18n.t('err_31', { warn: warn }))
    }
}