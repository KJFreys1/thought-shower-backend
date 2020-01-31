const mongoose = require('../db/connection')
const Schema = mongoose.Schema

const commentSchema = new Schema({
    user: String,
    message: String
})

const ideaSchema = new Schema({
    user: {
        type: String,
        default: "anonymous"
    },
    uid: {
        type: String,
        default: ''
    },
    title: String,
    category: String,
    post: String,
    likes: {
        type: Number,
        default: 0
    },
    likedBy: [],
    date: {
        type: Date,
        default: Date.now
    },
    comments: [commentSchema]
})

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    register_date: {
        type: Date,
        default: Date.now
    },
    ideas: [ideaSchema]
})

module.exports = {
    User: mongoose.model('User', userSchema),
    Idea: mongoose.model('Idea', ideaSchema),
    Comment: mongoose.model('Comments', commentSchema),
}