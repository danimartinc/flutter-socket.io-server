/*
    path: api/users
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getUsers } = require('../controllers/users');

//Router(), función que permite definir las rutas de la aplicación
const router = Router();


//CONFIGURACIÓN DE RUTAS

//Petición GET para obtener el listado de usuarios
router.get('/', validateJWT, getUsers );

module.exports = router;