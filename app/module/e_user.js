const db = require('mongoose')

const e_userSchema = db.Schema({
    _id: { type: Number },
    UserName: { type: String },
    FirstName: { type: String },
    Code: { type: Number },
    Warn: { type: Number }
})

module.exports = e_userSchema