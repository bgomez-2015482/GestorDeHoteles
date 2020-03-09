'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = Schema({
    name: String,
    phone: Number,
    address: String, 
    role: String,
    username: String, 
    password: String
})

module.exports = mongoose.model('user', userSchema);