const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'myname$shivam';
var jwt = require('jsonwebtoken');
const { findById } = require('../models/User');
const fetchUser = require('../Middleware/fetchUser');

//ROUTE:1 create a user using :POST "api/auth/Createuser"
let success = false;
router.post('/Createuser', [
    body('name').isLength({ min: 5 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),

], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }
    try {
        //check whether the user with this exists already
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success, error: "sorry this email is already exists" })
        }
        const salt = await bcrypt.genSalt(10);
        const secpass = await bcrypt.hash(req.body.password, salt)
        user = await User.create({
            name: req.body.name,
            password: secpass,
            email: req.body.email

        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ success: true, authtoken })
    }
    catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }

})
//ROUTE:1Authenticate  a user using :POST "api/auth/login.No login required"
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('passsword', 'Password cannot be blank').isEmpty(),

], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success, error: "Please try to login correct username" })
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success, error: "Please try to login correct password" })
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)

        res.json({ success: true, authtoken })

    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");
    }
});

//ROUTE:1 Get loggindin Details using :POST "api/auth/getUser.No login required"
router.post('/getUser', fetchUser, async (req, res) => {
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user)
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured");

    }
})

module.exports = router