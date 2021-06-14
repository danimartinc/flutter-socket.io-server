//Importación express
const express     = require('express');
//Importamos el path en Express
const path        = require('path');
//Implementamos el dotenv mediante config(), que permite leer las variables de entorno
require('dotenv').config();
//App de Express
const app         = express();

//Definición del Node Server para Sockets
const server      = require('http').createServer(app);
//Configuracion del servidor de Sockets
module.exports.io = require('socket.io')(server);

require('./sockets/socket');


//Carpeta pública
//__dirname, apunta hacia el path donde está montado el servidor, en este caso el directorio public
const publicPath = path.resolve( __dirname, 'public' );

//Indicamos el server Express que implemente el publicPath cuando se realice la petición
app.use( express.static( publicPath ) );

//Escuchar peticiones del Servidor Express mediante el listen()
//Primer argumento, indicamos el puerto donde escuchamos la petición
//Segundo argumento, callback() que devuelve un error si este sucede
server.listen( process.env.PORT, ( error ) => {
    //Comprobamos si tenemos un error, si es así lo enviamos
    if( error ) throw new Error( error );

    console.log(`Servidor corriendo en puerto`, process.env.PORT );
});