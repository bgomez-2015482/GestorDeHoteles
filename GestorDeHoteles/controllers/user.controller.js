'use strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Hotel = require('../models/hotel.model');

function saveUser(req, res){
    var params = req.body;
    var user = new User();

    if(params.name && 
        params.username &&
        params.password && 
        params.address &&
        params.phone){
            User.findOne({$or: [{username: params.username}, {name: params.name}]}, (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});

                }else if(userFind){
                    res.send({message: 'usuario o nombre ya usado'});

                }else{
                    user.name = params.name;
                    user.username = params.username;
                    user.phone = params.phone;
                    user.password = params.password;
                    user.address = params.address;
                    user.role = 'USER'

                    bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error de encriptación'});
                        }else{ 

                            user.password = hashPassword;
                            user.save((err, userSaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error en el servidor'});
                                }else if(userSaved){
                                    res.send({user: userSaved});
                                }else{
                                    res.status(418).send({message: 'Usuario no guardado'});
        
                                }
                            });  
                        }
                    });
                }});
        }else{
            res.send({message: 'ingrese todos los datos'});
        }
}

function deleteUser(req, res){
    var userId = req.params.id;

    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});

    }else{
        User.findByIdAndDelete(userId, (err, userDeleted)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
    
            }else{
                if(userDeleted){
                    res.status(200).send({message: 'Registro Eliminado'});
    
                }else{
                    res.status(404).send({message: 'Error al encontrar el registro'});
                }
            }
    
        });
    }   
}

function updateUser(req, res){
    var userId = req.params.id;
    var update = req.body;
    
    if(userId != req.user.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});

    }else{
        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
            if(err){
                res.status(500).send({message: 'error en el servidor'});
            }else if(userUpdated){
                res.send({user: userUpdated});
            }else{
                res.status(404).send({message: 'Error al encontrar el usuario'});
            }
        })
        }
}


function userLogin(req, res) {
    var params = req.body;

    if(params.username || params.name){
        if(params.password){
            User.findOne({$or:[{username: params.username},{name: params.name}]} , (err, userFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});

                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: ' error al comparar las contraseñas'});

                        }else if(checkPassword){
                            if(params.gettoken){
                               res.send({token: jwt.createUserToken(userFind)});
                            }
                            else{
                                res.send({user: userFind});
                            }

                        }else{
                            res.status(401).send({message: 'Contraseña incorrecta'});
                        }
                    })
                }else{
                    res.send({message: 'No se encontró el usuario'})
                }
            })
        }else{
            res.send({message: 'Por favor ingrese la contraseña'})
        }
    }else{
        res.send({message:'Ingrese el nombre de usuario o correo'});  
    }
}

function userMiddleware(req, res) {
    var user = req.user;
    res.send({message: 'Middleware funcionando', req: user})
}

function adminMiddleware(req, res) {
    var user = req.user;
    res.send({message: 'Middleware funcionando', req: user})
}

function findHotel (req, res){
    var userId = req.params.id;
    var params = req.body;

    if(userId != req.user.sub){
        res.status(403).send({message:'Debe de iniciar sesión'});
    }else{
        Hotel.find({$or:[{calification:params.calification}]}, (err,hotels)=>{
                        if(err){
                            res.status(500).send({message:'Error en el servidor'});
                        }else if(hotels){
                            res.send(hotels);
                        }
                    }).sort({name:+1,price:-1});
    }
}

module.exports = {
    saveUser,
    userLogin,
    userMiddleware,
    adminMiddleware,
    deleteUser,
    updateUser,
    findHotel
}