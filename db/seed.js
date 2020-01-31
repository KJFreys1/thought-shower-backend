const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment
const User = require('../models/User').User

User.deleteMany({}).then(() => {
    Idea.deleteMany({}).then(() => {
        Comment.deleteMany({}).then(() => {
            console.log('Seed deleted, creating new data now...')
            createData()
        })
    })
})

function createData() {
    Idea.create({
        user: "Admin",
        title: "Start with a new idea!",
        category: "New Beginings",
        post: "You don't have to be a user to post new ideas or comments! However, if you want to like other people's posts, you'll need to sign up or login first.",
        likes: 0,
        likedBy: [],
        comments: []
    }).then(idea => {
        Promise.all([
            Comment.create({
                user: "Admin",
                message: "Feel free to leave any feedback you'd like, so long as you're being respectful! :)"
            }),
            Comment.create({
                user: "Everyone",
                message: "Welcome to Thought Shower!!"
            })
        ]).then(coms => {
            coms.forEach(com => {
                idea.comments.push(com)
                com.save()
            })
            idea.save()
            console.log("Created idea")
        })
    })
}