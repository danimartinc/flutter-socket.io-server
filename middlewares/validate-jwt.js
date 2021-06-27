//Middleware en Express, funciones puras

const { response } = require('express');
const jwt = require('jsonwebtoken');

//Función que permite renovar el JWT
const validateJWT = ( req, res = response, next) => {

    // x-token headers
    //Leemos el Token desde el Header de la Petición
    const token = req.header('x-token');

    //Compruebo si se recibe el Token
    if( !token ){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    //Validamos el Token
    try {
        //Extraemos el payload, para obtener el UID del usuario, mediante un proceso sincrono
        //Desestructuramos el payload y obtenemos el UID y el name
        const { uid, name } = jwt.verify(
            token,
            //Secret Public Key
            process.env.JWT_KEY
        );
        //Dado que si paso el Middleware, en cualquier ruta tengo esta información del usuario
        req.uid = uid,
        req.name = name;
 
    } catch (error) {
        //Si la validacion del Token falla
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        });
        
    }

     //Next(), callback el cual llamamos de manera condicional, cuando no existe ningun error
    //Indica que continue con el siguiente middleware o dispare el conroller
    next();

}

module.exports = {
    validateJWT
}