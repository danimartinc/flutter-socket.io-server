const Message = require('../models/message');
const { response }    = require('express');


//Función que nos permite obtener los mensajes de cada chat
const getChat = async(req, res = response ) => {
    
    //Obtengo mi UID, al pasarlo por el validateJWT ya obtengo mi UID desde la request
    const myID = req.uid;
    //Obtengo de quién es casa mensaje
    const messagesFrom = req.params.from;

    //Cargamos el historial de los últimos 30 mensajes del chat
    const last30 = await Message.find({
        //Realizamos la busqueda bajo estas dos condiciones
        //Primera condición, el usuario autenticado recibe todos los mensajes del usuario con ese UID
        //Segunda condición, recuperar todos los mensajes qué el usuario autenticado ha enviado a ese UID
        $or: [{ from: myID, for: messagesFrom }, { from: messagesFrom, for: myID } ]
    })
    //Ordenados de manera descendente
    .sort({ createdAt: 'desc' })
    .limit(30);

    //Respuesta del servidor
    res.json({
        ok: true,
        messages: last30
    })

}



module.exports = {
    getChat
}