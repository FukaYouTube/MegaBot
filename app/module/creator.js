const db = require('mongoose')

const creatorSchema = db.Schema({
    _id: { type: Number },
    UserName: { type: String },
    FirstName: { type: String },
    Gif: [{ type: String }],
    EroGif: [{ type: String }],
    Ads: { type: String },
    OpenMega: { type: String },
    ClosedMega: { type: String },
    HeaderMega: { type: String },
    FooterMega: { type: String },
    EroHeaderMega: { type: String },
    EroFooterMega: { type: String }
})

module.exports = creatorSchema