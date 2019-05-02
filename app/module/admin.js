const db = require('mongoose')

const adminSchema = db.Schema({
    _id: { type: Number },
    UserName: { type: String },
    FirstName: { type: String },
    Like: { type: Number },
    Warn: { type: Number }
})

module.exports = adminSchema