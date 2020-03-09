'use strict'

var express = require('express');
var hotelController = require('../controllers/hotel.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/saveHotel/:id',middlewareAuth.ensureAuthAdmin, hotelController.saveHotel);
api.get('/hotelLogin', hotelController.hotelLogin);
api.get('/hotelMiddleware', middlewareAuth.ensureAuthHotel, hotelController.hotelMiddleware);
api.delete('/deleteHotel/:id', middlewareAuth.ensureAuthHotel, hotelController.deleteHotel);
api.put('/updateHotel/:id', middlewareAuth.ensureAuthHotel, hotelController.updateHotel);

module.exports = api;