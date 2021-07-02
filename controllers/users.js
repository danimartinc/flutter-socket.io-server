const { response } = require('express');
const User = require('../models/User');

//Petición GET, implemetamos el async-await ya que es una petición asíncrona, lo realizamos de esta manera ya que la petición a la database se realiza de manera asícnrona
const getUsers = async ( req, res = response ) => {

    //TODO: Paginacion para ordenar

    //Establecemos un punto inicial para el listado, lo pasamos por un Number() ya que lo recibimos como un String y tenemos que enviarlo a Mongoose como un Number()
    //Leemos el from desde los QueryParams
    const from = Number( req.query.from ) || 0;

    //Mediante find(), extraemos la información relacionada al listado de usuarios
    const users = await User
    //Mediante el filtro en find() evitamos que aparezca en el listado, el usuario autenticado actualmente, retornamos todos los usuarios con ID distinto al autenticado
        .find({ _id: { $ne: req.uid } })
        //Ordenamos de forma que aparezcan en primer lugar los usuarios conectados
        .sort('-online')
        //Paginación desde el desde
        .skip(from)
        .limit(20)

    //Respuesta del Servidor
    res.json({
        ok: true,
        users,
    })
}



module.exports = {
    getUsers
}