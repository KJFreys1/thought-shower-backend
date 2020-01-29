const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')

const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment

router.get('/', (req, res) => {
    Idea.find({}).then(ideas => {
        res.json(ideas)
    })
})

router.get('/id/:id', (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        res.json(idea)
    })
})

router.post('/', auth, (req, res) => {
    Idea.create(req.body).then(() => {
        Idea.find({}).then(ideas => {
            res.json(ideas)
        })
    })
})

router.delete('/id/:id', auth, (req, res) => {
    Idea.findByIdAndDelete(req.params.id).then(() => {
        Idea.find({}).then(items => {
            res.json(items)
        })
    })
})

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

router.get('/comments/:id', (req, res) => {
    Idea.findById(req.params.id).then(idea => {
        res.json(idea.comments)
    })
})

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

router.delete('/comments/:idid/:comid', (req, res) => {
    Idea.findById(req.params.idid).then(idea => {
        const filter = idea.comments.filter(arr => arr.id != req.params.comid)
        idea.comments = filter
        idea.save()
        res.json(idea)
    })
})

module.exports = router