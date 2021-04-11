const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const User = mongoose.model("User");
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../key')
const requireLogin = require('../middleware/requireLogin')

router.get('/protected',requireLogin, (req, res) => {
    res.send('Hello User')
})

router.post('/signup', (req, res) => {
    const { name, email, password } = req.body
    if (!email || !password || !name) {
        res.status(422).json({ error: "All Fileds are required" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "Email is already exits" })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name
                    })

                    user.save()
                        .then(user => {
                            res.json({ message: "Saved Successfully" })
                        })
                        .catch(error => {
                            console.log(error);
                        })
                })
                .catch(error => {
                    console.log(error);
                })
        })

})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "Please Add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email Or Password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        // res.json({ message: "SuccessFully Signin" })
                        const token = jwt.sign({_id:savedUser._id},JWT_SECRET)
                        res.json({token})
                    } else {
                        return res.status(422).json({ error: "Invalid Email Or Password" })
                    }
                })
                .catch(err => {
                    console.log(err);
                })
        })
})

module.exports = router