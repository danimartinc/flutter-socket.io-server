//Importamos io desde el index.js
const { io } = require('../index');

const Band = require('../models/band');
const BandList = require('../models/band-list');;
//const Band = require('../models/band');

//Nueva instancia de Bands que mantiene la información de manera persistente
const bands = new BandList();

bands.addBand( new Band( 'Breaking Benjamin' ) );
bands.addBand( new Band( 'Bon Jovi' ) );
bands.addBand( new Band( 'Héroes del Silencio' ) );
bands.addBand( new Band( 'Metallica' ) );



//Mensajes de Sockets
//Mediante io, emito el mensaje a los clientes conectados al Server
//client, dispositivo que se conecta al Socket Server donde se realiza la conexis¡ón
io.on('connection', client => {

    console.log('Cliente conectado');

    //Event que emite al cliente conectado las bandas que se encuentran registradas actualmente
    //Si el cliente se conecta o recarga el navegador, emitimos el event. Recibe como se encuentra la instancia de la bandList
    //Retornamos el contenido del array de Bands
    client.emit('active-bands', bands.getBands() );

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

     //Escuchar cuando un cliente emite el evento
     client.on('emit-message', ( payload ) => {
        //El servidor emite el evento new-message que escuchan todos los clientes conectados
        //client.broadcast, emite a todos los clientes excepto al que emitió en primer lugar
        client.broadcast.emit('new-message', payload );
    });

    //Escuchar cuando un cliente emite el evento vote-band
    client.on('vote-band', (payload) => {
        //Incremento un voto a la banda que corresponde al ID
        bands.voteBand( payload.id );
        //Emito a todos los clientes conectados el nuevo array de active-bands
        io.emit('active-bands', bands.getBands() );
    });

    //Escuchar cuando un cliente emite el evento add-band
    client.on('add-band', (payload) => {
        //Inicializamos una nueva banda
        const newBand = new Band( payload.name );
        //Añadimos la nueva banda al array de bands
        bands.addBand( newBand );
        //Se emite a todos los clientes la newBand
        io.emit('active-bands', bands.getBands() );
    });

    //Escuchar cuando un cliente emite el evento delete-band
    client.on('delete-band', (payload) => {

        bands.deleteBand( payload.id );
        io.emit('active-bands', bands.getBands() );
    });

    /*//Escuchar cuando un cliente emite el evento
    client.on('emit-message', ( payload ) => {
        //El servidor emite el evento new-message que escuchan todos los clientes conectados
        //client.broadcast, emite a todos los clientes excepto al que emitió en primer lugar
        client.broadcast.emit('new-message', payload );
    });*/

  });
