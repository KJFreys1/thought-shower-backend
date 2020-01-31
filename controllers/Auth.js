const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const auth = require('../middleware/auth')

const User = require('../models/User').User
const Idea = require('../models/User').Idea
const Comment = require('../models/User').Comment

router.get('/', (req, res) => {
    User.find({}).then(users => {
        res.json(users)
    })
})

//Login
router.post('/', (req, res) => {
    const { email, password } = req.body
    
    //Input validation
    if(!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' })
    }

    //Check for existing user
    User.findOne({ email }).then(user => {
        if(!user) return res.status(400).json({ msg: 'User does not exist' })

        //Validate password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(!isMatch) return res.status(400).json({ msg: 'Inavlid credentials' })
                jwt.sign(
                    { id: user.id },
                    config.get('jwtSecret'),
                    { expiresIn: 3600 },
                    (err, token) => {
                        if(err) throw err
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        })
                    }
                )
            })
    })
})

router.get('/user', auth, (req, res) => {
    User.findById(req.user.id)
        .select('-password')
        .then(user => res.json(user))
})

module.exports = router