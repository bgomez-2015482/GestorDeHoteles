'use strict'

var express = require('express');
var userController = require('../controllers/user.controller');
var api = express();
var middlewareAuth = require('../middlewares/authenticated');

api.post('/saveUser', userController.saveUser);
api.get('/userLogin', userController.userLogin);
api.get('/userMiddleware', middlewareAuth.ensureAuthUser, userController.userMiddleware);
api.get('/adminMiddleware', middlewareAuth.ensureAuthAdmin, userController.userMiddleware);
api.delete('/deleteUser/:id',middlewareAuth.ensureAuthUser , userController.deleteUser);
api.put('/updateUser/:id',middlewareAuth.ensureAuthUser , userController.updateUser);
api.get('/findHotel/:id', middlewareAuth.ensureAuthUser, userController.findHotel);





module.exports = api;