const db = require('mongoose')

const userSchema = db.Schema({
    _id: { type: Number },
    UserName: { type: String },
    FirstName: { type: String },
    Code: { type: Number },
    Warn: { type: Number }
})

module.exports = userSchema