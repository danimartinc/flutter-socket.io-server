//Checks de login y registro
//Check(), Middleware que se encarga de validar un campo en particular
const { check, validationResult } = require('express-validator')
 
const { validateFields } = require('./field-validators');

// Auth validation middlewares
const checkRegister = () => {
    return [ // route: /register
        //Middlewares
        //Primer argumento, campo que deseo validar
        //Segundo argumento, mensaje de error
        //.not().isEmpty(), indico que es obligatorio y no este vacio
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        //Comprueba que tenga el patrón de un email
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
        //Implemento el customMiddleware
        validateFields
    ]
}

const checkLogin = () => {
    return [ // route: /
        //Comprueba que tenga el patron de un email
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe contener al menos 6 caracteres').isLength({ min: 6 }),
        //Implemento el customMiddleware
        validateFields
    ]
}

module.exports = {
    checkRegister,
    checkLogin
}