const express = require('express')
const router = express.Router()

const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment

//@route        GET /ideas
//@desc         Retrieves all ideas
router.get('/', (req, res) => {
    Idea.find({})
        .sort({date: -1})
        .then(ideas => {
            res.json(ideas)
        })
})

//@route        GET /ideas/id/:id
//@desc         Gets a specific idea by id
router.get('/id/:id', (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        res.json(idea)
    })
})

//@route        POST /ideas
//@desc         Adds a new idea
router.post('/', (req, res) => {
    Idea.create(req.body).then(() => {
        Idea.find({})
            .sort({date: -1})
            .then(ideas => {
                res.json(ideas)
            })
    })
})

//@route        DELETE /ideas/id/:id
//@desc         Removes idea by id
router.delete('/id/:id', (req, res) => {
    Idea.findByIdAndDelete(req.params.id).then(() => {
        Idea.find({})
            .sort({date: -1})
            .then(items => {
                res.json(items)
            })
    })
})

//@route        PUT /ideas/id/:id
//@desc         Updates an idea by id
router.put('/id/:id', (req, res) => {
    Idea.findByIdAndUpdate(
        req.params.id,
        req.body
    ).then(() => {
        Idea.find({})
            .sort({date: -1})
            .then(ideas => {
                res.json(ideas)
            })
    })
})

//@route        GET /ideas/comments/:id
//@desc         Gets all comments withing a specific idea located by id
router.get('/comments/:id', (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        res.json(idea.comments)
    })
})

//@route        POST /ideas/comments/:id
//@desc         Creates a new comments and pushes it into specifc idea 
//              located by id
router.post('/comments/:id', (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        Comment.create(req.body).then(com => {
            idea.comments.push(com)
        }).then(() => {
            idea.save()
            res.json(idea)
        })
    })
})

//@route        DELETE /ideas/comments/:idid/:comid
//@desc         Locates an idea with first parameter, then deletes the 
//              comment with the same id as the second parameter
router.delete('/comments/:idid/:comid', (req, res) => {
    Idea.findById(req.params.idid).then(idea => {
        const filter = idea.comments.filter(arr => arr.id != req.params.comid)
        idea.comments = filter
        idea.save()
        res.json(idea)
    })
})

//@route        POST /ideas/likes/:idid/:like
//@desc         Finds idea with first parameter, then modifies it's likes
//              and list of users who liked it
router.post('/likes/:idid/:like', (req, res) => {
    Idea.findById(req.params.idid).then(idea => {
        const likeNum = idea.likes
        const user = {
            id: req.body._id,
            liked: req.params.like === 'true' ? true : false
        }

        //Check for if this user already liked this post
        const filter = idea.likedBy.filter(arr => arr.id === user.id)

        //If filter comes back undefined, then user has NOT liked this post yet
        if (!filter.length) {
            idea.likedBy.push(user)
            if (user.liked) {
                idea.likes = likeNum + 1
            } else {
                idea.likes = likeNum - 1
            }
        } 
        //If filter comes back defined, user has liked this post before
        else {
            //If this action is different than previous action, inverse to new action
            if (filter[0].liked !== user.liked) {
                const index = idea.likedBy.indexOf(filter[0])
                idea.likedBy.splice(index, 1, user)
                if (user.liked) {
                    idea.likes = likeNum + 2
                } else {
                    idea.likes = likeNum - 2
                }
            }
        }
        idea.save()
        res.json(idea)
    })
})

module.exports = router