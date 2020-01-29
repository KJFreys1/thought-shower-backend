const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment

Idea.deleteMany({}).then(() => {
    Comment.deleteMany({}).then(() => {
        console.log('Seed deleted, creating new data now...')
        createData()
    })
})

function createData() {
    Idea.create({
        user: "User123",
        title: "First post",
        category: "Computer Science",
        post: "Hello world! My name is User 123 and I am happy to be here!",
        likes: 0,
        favorites: 0,
        comments: []
    }).then(idea => {
        Promise.all([
            Comment.create({
                user: "OtherUser",
                message: "Hello User123!"
            }),
            Comment.create({
                user: "anonymous",
                message: "hi"
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

    Idea.create({
        user: "anonymous",
        title: "Test post",
        category: "Computer Science",
        post: "This is a test to see if I still need all the reuired information in the creation of the model."
    }).then(idea => {
        Promise.all([
            Comment.create({
                user: "someUser",
                message: "This is a good test!"
            }),
            Comment.create({
                user: "Carl",
                message: "hi I'm carl"
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