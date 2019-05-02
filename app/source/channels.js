const Composer = require('telegraf/composer')
const app = new Composer()

const channels = require('./channels/add_channels')

app.on('channel_post', ctx => {
    if(ctx.update.channel_post.text){
        let text = ctx.update.channel_post.text.toLowerCase()
        let cmd = text.split(' ')
    
        if(cmd[0] === 'added:' && Number(cmd[1])){
            channels.add_channels(ctx, Number(cmd[1]))
        }
        if(cmd[0] === 'adderochannel:' && Number(cmd[1])){
            channels.add_ero_channels(ctx, Number(cmd[1]))
        }
    }
})

module.exports = app