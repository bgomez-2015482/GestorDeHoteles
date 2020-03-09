'use strict'

var Hotel = requiere('../models/hotel.model');
var bcrypt = requiere('bycript-nodejs');
var jwt = requiere('../services/jwt');

function saveHotel(req, res){
    var adminId = req.params.id;
    var params = req.body;
    var hotel = new Hotel();
    if(adminId != req.user.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});
    }else{
        if(params.name && 
            params.username &&
            params.password && 
            params.location &&
            params.phone &&
            params.calification){
                Hotel.findOne({$or: [{username: params.username}, {name: params.name}]}, (err, hotelFind)=>{
                    if(err){
                        res.status(500).send({message: 'Error en el servidor'});
    
                    }else if(hotelFind){
                        res.send({message: 'usuario o nombre ya usado'});
    
                    }else{
                        hotel.name = params.name;
                        hotel.username = params.username;
                        hotel.phone = params.phone;
                        hotel.password = params.password;
                        hotel.location = params.location;
                        hotel.calification = params.calification;
                        hotel.price = params.price;
    
                        bcrypt.hash(params.password, null, null, (err, hashPassword)=>{
                            if(err){
                                res.status(500).send({message: 'Error de encriptación'});
                            }else{ 
    
                                hotel.password = hashPassword;
                                hotel.save((err, hotelSaved)=>{
                                    if(err){
                                        res.status(500).send({message: 'Error en el servidor'});
                                    }else if(hotelSaved){
                                        res.send({hotel: hotelSaved});
                                    }else{
                                        res.status(418).send({message: 'Hotel no guardado'});
            
                                    }
                                });  
                            }
                        });
                    }});
            }else{
                res.send({message: 'ingrese todos los datos'});
            }
    }
}

function deleteHotel(req, res){
    var hotelId = req.params.id;

    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logeado'});

    }else{
        Hotel.findByIdAndDelete(hotelId, (err, hotelDeleted)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
    
            }else{
                if(hotelDeleted){
                    res.status(200).send({message: 'Registro Eliminado'});
    
                }else{
                    res.status(404).send({message: 'Error al encontrar el registro'});
                }
            }
    
        });
    }   
}

function updateHotel(req, res){
    var hotelId = req.params.id;
    var update = req.body;
    
    if(hotelId != req.hotel.sub){
        res.status(403).send({message: 'Error de permisos, usuario no logueado'});

    }else{
        Hotel.findByIdAndUpdate(hotelId, update, {new: true}, (err, hotelIdUpdated)=>{
            if(err){
                res.status(500).send({message: 'Error en el servidor'});
            }else if(hotelIdUpdated){
                res.send({hotel: hotelIdUpdated});
            }else{
                res.status(404).send({message: 'Error al encontrar el usuario'});
            }
        })
        }
}

function hotelLogin(req, res) {
    var params = req.body;

    if(params.username || params.name){
        if(params.password){
            Hotel.findOne({$or:[{username: params.username},{name: params.name}]} , (err, hotelFind)=>{
                if(err){
                    res.status(500).send({message: 'Error en el servidor'});

                }else if(hotelFind){
                    bcrypt.compare(params.password, hotelFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al comparar las contraseñas'});

                        }else if(checkPassword){
                            if(params.gettoken){
                               res.send({token: jwt.createHotelToken(hotelFind)});
                            }
                            else{
                                res.send({hotel: hotelFind});
                            }

                        }else{
                            res.status(401).send({message: '¡Contraseña incorrecta!'});
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

function hotelMiddleware(req, res) {
    var hotel = req.hotel;
    res.send({message: 'Middleware funcionando', req: hotel})
}

module.exports= {
    saveHotel,
    hotelLogin,
    hotelMiddleware,
    deleteHotel,
    updateHotel,
}   