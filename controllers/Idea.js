const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment

//@route        GET /ideas
//@desc         Retrieves all ideas
router.get('/', (req, res) => {
    Idea.find({}).then(ideas => {
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
    console.log(req.body)
    Idea.create(req.body).then(() => {
        Idea.find({}).then(ideas => {
            res.json(ideas)
        })
    })
})

//@route        DELETE /ideas/id/:id
//@desc         Removes idea by id
router.delete('/id/:id', auth, (req, res) => {
    Idea.findByIdAndDelete(req.params.id).then(() => {
        Idea.find({}).then(items => {
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
        Idea.find({}).then(ideas => {
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

module.exports = router