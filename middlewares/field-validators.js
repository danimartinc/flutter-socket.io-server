//CustomMiddleware, encargado de validar los campos

//Extraigo response de express
const { response } = require('express');
const { validationResult } = require('express-validator');

//Middleware, misma sintaxis que un Controller de una accion
//next, callback()
const validateFields = ( req, res = response, next ) => {

    //Nos permite visualizar el control de errores
    //ValidationResult, obtiene los errores del request y 
    const errors = validationResult( req );

    //Si hay errores, es decir el array de errors no está vacio, hay un campo que es requerido
    if( !errors.isEmpty()){
        return res.status(400).json({
            ok: false,
            errors: errors.mapped()
        });
    }

    //Next(), callback el cual llamamos de manera condicional, cuando no existe ningun error
    //Indica que continue con el siguiente middleware o dispare el conroller
    next();

}

module.exports = {
    validateFields
}