const express = require('express')
const router = express.Router()

const Idea = require('../models/Idea')

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

router.post('/', (req, res) => {
    Idea.create(req.body).then(() => {
        Idea.find({}).then(ideas => {
            res.json(ideas)
        })
    })
})

router.delete('/id/:id', (req, res) => {
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

module.exports = router