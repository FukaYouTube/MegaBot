const db = require('mongoose')

const blackSchema = db.Schema({
    _id: { type: Number },
    UserName: { type: String },
    FirstName: { type: String },
    Reason: { type: String }
})

module.exports = blackSchema