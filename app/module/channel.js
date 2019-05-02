const db = require('mongoose')

const channelSchema = db.Schema({
    _id: { type: Number },
    UserChannel: { type: String },
    NameChannel: { type: String },
    Subscribers: { type: Number },
    LinkName: { type: String },
    InvateLink: { type: String },
    Status: { type: String },
    Creator: { type: String }
})

module.exports = channelSchema