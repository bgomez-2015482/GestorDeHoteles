'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'clave_super_hiper_mega_secreta';

exports.createHotelToken = (hotel)=>{
    var payload = {
     sub: hotel._id,
     name: hotel.name,
     username: hotel.username,
     iat: moment().unix(),
     exp: moment().add(60, "minutes").unix()
    }

    return jwt.encode(payload, key);
}

exports.createUserToken = (user)=>{
    var payload = {
     sub: user._id,
     name: user.name,
     username: user.username,
     role: user.role,
     iat: moment().unix(),
     exp: moment().add(60, "minutes").unix()
    }

    return jwt.encode(payload, key);
}



module.exports = api;