const router = require('express').Router();

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userProfileValidation, loginValidation } = require('../utils/validation');

// Login
router.post('/login', async (req, res) => {
    console.log('Someone wants to login...');
    // VALIDATE THE USER
    const { error } = loginValidation(req.body);

    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    // check if email exists 
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).json('This email does not exists!');

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).json('This email/password does not match!')
    }

    // Create and assign a token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

// User registration
router.post('/register', async (req, res) => {

    // Validate user profile
    const { error } = userProfileValidation(req.body);

    if (error) {
        return res.status(400).json(error.details[0].message);
    }

    // check first whether username/email already exists 
    const userExists = await User.findOne()
        .or([{ email: req.body.email }, {username: req.body.username}]);
    if (userExists) return res.status(400).json('username/email already exists!');
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt)
    // create new user
    const newUser = new User({
        username: req.body.username,
        password: hashPassword,
        email: req.body.email,
        nickname: req.body.nickname
    });

    newUser.save()
        .then((user) => res.json(user))
        .catch(err => res.status(400).json('Error: ' + err));
    // TODO: redirect

});

// TODO: Get user profile

// TODO: Update user profile

module.exports = router;