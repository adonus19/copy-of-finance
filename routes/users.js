const express = require('express'),
      router = express.Router(),
      User = require('../models/user'),
      Expense = require('../models/user'),
      passport = require('passport'),
      jwt = require('jsonwebtoken'),
      config = require('../config/database'),
      _ = require('lodash');

//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    
    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({success: false, msg: 'Failed to register user'});
        } else {
            res.json({success: true, msg: 'User registered'});
        }
    });
});

//Authenticate-login
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) throw err;
        if (!user) {
            return res.json({success: false, msg: "User not found"});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
                const token = jwt.sign({data: user}, config.secret, {
                    expiresIn: 604800 //1 week
                });
                res.json({success: true, token: 'JWT ' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }});
            } else {
                return res.json({success: false, msg: "Invalid password"});
            }
        });
    });
});

//profile
router.get('/dashboard', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

//log expenses    test code
router.put('/expenses', (req, res, next) => {
    let newExpense = new Expense({
        category: req.body.category,
        amount: req.body.amount,
        datepickerModel: req.body.datepickerModel
    });
    User.findById(req.body.id, (err, user) => {
        console.log()
        if (err) {
            res.json({success: false, msg: 'could not find user', error: err});
        }
        if (user) {
            _.merge(user, newExpense);
            user.save((err) => {
                if (err) {
                    res.json({success: false, msg: 'error during new expense log', error: err});
                }
                res.json({success: true, msg: 'expense logged succesfully'});
            });
        } else {
            res.json({msg: 'user not found'});
        }
    });
});

router.get('/expenses', (req, res, next) => {
    console.log(res.send(this.user.username));
});

module.exports = router;


/* old code
router.put('/expenses', (req, res, next) => {
    let newExpense = new Expense({
        category: req.body.category,
        amount: req.body.amount,
        datepickerModel: req.body.datepickerModel
    });
    res.json(newExpense);
});

*/