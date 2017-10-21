const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcryptjs'),
      config = require('../config/database');

const UserSchema = new Schema({
    name: {type: String},
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true}
});

const User = module.exports = mongoose.model('User', UserSchema);

const ExpenseSchema = new Schema({
    category: String,
    amount: Number,
    date: String
});

const Expense = module.exports = mongoose.model('Expense', ExpenseSchema);

module.exports.getUserById = (id, callback) => {
    User.findById(id, callback);
};

module.exports.getUserByUsername = (username, callback) => {
    const query = {username: username}
    User.findOne(query, callback);
};

module.exports.addUser = (newUser, callback) => {
    console.log(newUser.password, callback);
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = (candidatePassword, hash, callback) => {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
};

module.exports.getExpensebyCategory = (category, callback) => {
    const query = {category: category}
    User.find(query, callback);
};