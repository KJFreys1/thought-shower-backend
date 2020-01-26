const mongoose = require('../db/connection')

const itemSchema = new mongoose.Schema({
    user: String,
    title: String,
    category: String,
    post: String,
    likes: Number,
    favorites: Number,
    date: {
        type: Date,
        default: Date.now
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = Item