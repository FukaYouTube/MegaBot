const db = require('mongoose')

const e_channelSchema = db.Schema({
    _id: { type: Number },
    UserChannel: { type: String },
    NameChannel: { type: String },
    Subscribers: { type: Number },
    LinkName: { type: String },
    InvateLink: { type: String },
    Status: { type: String },
    Creator: { type: String }
})

module.exports = e_channelSchema