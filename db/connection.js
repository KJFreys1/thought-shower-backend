const mongoose = require('mongoose')
mongoose.Promise = Promise
const MONGODB_URI = process.env.DB_URL || 'mongodb://localhost/thoughtshower'
mongoose.connect(MONGODB_URI, { useNewUrlParser: true })
module.exports = mongoose