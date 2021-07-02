/* Path en el cual se realiza la llamada al servicio REST
   Rutas de messages / Auth
   host + /api/messages
*/

const { Router } = require('express');
const { validateJWT } = require('../middlewares/validate-jwt');

const { getChat } = require('../controllers/messages');

const router = Router();

//CONFIGURACIÓN DE RUTAS

//Ruta para renderizar el chat, en la cual debo validar el Token ya que el JWT nos permite realizar las acciones
//Para revalidar el Token del usuario cuando está de forma pasiva, verifica el Token actual y devuelve un nuevo JWT
//El cliente recibe el JWT, lo recibe y lo actualiza por el JWT que recibe por esa ruta
router.get('/:from', validateJWT, getChat );

module.exports = router;