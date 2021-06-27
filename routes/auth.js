/* Path en el cual se realiza la llamada al servicio REST
   Rutas de usuarios / Auth
   host + /api/login
*/

const { Router } = require('express');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { checkRegister, checkLogin } = require('../middlewares/check-validation');
const { validateJWT } = require('../middlewares/validate-jwt');

//Router(), función que permite definir las rutas de la aplicación
const router = Router();

//CONFIGURACIÓN DE RUTAS

//POST para realizar la creación de un nuevo usuario, 
//Mediante Express Validator, validamos que la route tiene que recibir obligatoriamente email, name y password 
//Segundo argumento, array que contiene una lista, [], donde puedo implementar varios middlewares, recibiendo cada uno como una función
router.post(
    '/new',
    [ //Middlewares
        checkRegister()      
    ],
    createUser 
);

//Posteo directamente a la ruta principal /auth/login
//Primer argumento, path al que llamo
//Segundo argumento, array de Middlewares propios del path
//Tercer argumento, acción del controller que quiero enviar
//Defino el endpoint, un POST para realizar el login
//Posteo directamente a la ruta principal /auth/login
router.post(
    '/', 
    [
        checkLogin()
    ],
    loginUser 
);

//Para revalidar el Token del usuario cuando está de forma pasiva, verifica el Token actual y devuelve un nuevo JWT
//El cliente recibe el JWT, lo recibe y lo actualiza por el JWT que recibe por esa ruta
router.get('/renew', validateJWT, renewToken );

//Exportamos el modulo
module.exports = router;