//Importamos io
const { io } = require('../index');


//Mensajes de Sockets
//Mediante io, emito el mensaje a los clientes conectados al Server
//client, dispositivo que se conecta al Socket Server donde se realiza la conexis¡ón
io.on('connection', client => {

    console.log('Cliente conectado');
    //callback() que se dispara cuando se conecta el cliente al server Socket
    client.on('disconnect', () => {
        console.log('Cliente desconectado');
    });

    //on(), permite escuchar lo que emite el cliente desde el Server Socket
    //Primer argumento, nombre del evento que queremos emitir
    //Segundo argumento, payload que contiene la información del mensaje que se envía al recpetor mediante el evento
    client.on( 'message', ( payload ) => {
        console.log('Mensaje', payload );
        //Mediante io() emito el mensaje a todos los clientes conectados al Socket Server
        //Primer argumento, nombre del evento que queremos emitir
        io.emit( 'message', { admin: 'Nuevo mensaje' });
    });

  });
