const db = require('mongoose')

module.exports = {
    User: db.model('User', require('./user')),
    Channel: db.model('Channel', require('./channel')),
    BlackList: db.model('BlackList', require('./black')),
    Admin: db.model('Admin', require('./admin')),
    Creator: db.model('Creator', require('./creator')),
    E_User: db.model('E_User', require('./e_user')),
    E_Channel: db.model('E_Channel', require('./e_channel'))
}