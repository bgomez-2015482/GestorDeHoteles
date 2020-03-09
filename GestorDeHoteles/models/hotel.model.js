'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var hotelSchema = Schema({
   name: String,
   phone: Number,
   location: String, 
   calification: Number,
   username: String, 
   password: String,
   price: Number,
   availability: []
}) 

module.exports = mongoose.model('hotel', hotelSchema);