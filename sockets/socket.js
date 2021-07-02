//Importamos io desde el index.js
const { io } = require('../index');
const { checkJWT } = require('../helpers/jwt');
const { authenticatedUser, disconnectedUser, saveMessage } = require('../controllers/socket');


//Mensajes de Sockets
//Mediante io, emito el mensaje a los clientes conectados al Server
//client, dispositivo que se conecta al Socket Server donde se realiza la conexis¡ón
io.on('connection', (client) => {

    console.log('Cliente conectado');

    //Obtener el cliente con JWT a través del Socket Server, verificamos el Header de la petición del Server Socket en el metodo connect()
    //client.handshake.headers, mediante el handshake obtenemos los paylaod con los datos de la comunicación entre Cliente-Servidor
    //En headers obtenemos la cabecera de las peticiones, en este caso obtenemos el valor del JWT
    const [ valid, uid ] = checkJWT( client.handshake.headers['x-token'] );

    //Comprobamos si la autenticación es correcta
    if ( !valid ) { return client.disconnect(); }

    //Cliente autenticado  
    authenticatedUser( uid );

    
    //Sala global, donde se encuentran todos los dispositivos conectados, , 5f298534ad4169714548b785
    
    //client.id, ID del cliente conectado que genera el SocketServer, permite enviar un mensaje de forma individual a un usuario
    //Mediante join(), conectar al usuario a una sala en particular al uusuario que perteneza el UID
    client.join( uid );

    //Para enviar un mensaje a un usuario concreto, es decir a un canal concreto
    //cliente.to( uid ).emit('NOMBRE EVENTO');

    //Mediante on(), escucho cuando el cliente emite el evento personal-message
    client.on( 'personal-message', async ( payload ) => {
        //Grabamos el mensaje enviado en la base de datos
        await saveMessage( payload )
        //Emitir un mensaje a un cliente
        //to(), emitir un mensaje a un canal concreto, en este caso al for del payload que contiene el UID del receptor
        io.to( payload.for ).emit('personal-message', payload );
    });

 

 
    //Event que emite al cliente conectado las bandas que se encuentran registradas actualmente
    //Si el cliente se conecta o recarga el navegador, emitimos el event. Recibe como se encuentra la instancia de la bandList
    //Retornamos el contenido del array de Bands
    //client.emit('active-bands', bands.getBands() );

    //callback() que se dispara cuando se desconecta el cliente al server Socket
    client.on('disconnect', () => {
        disconnectedUser( uid );
    });

    //on(), permite escuchar lo que emite el cliente desde el Server Socket
    //Primer argumento, nombre del evento que queremos emitir
    //Segundo argumento, payload que contiene la información del mensaje que se envía al recpetor mediante el evento
   /* client.on( 'message', ( payload ) => {
        console.log('Mensaje', payload );
        //Mediante io() emito el mensaje a todos los clientes conectados al Socket Server
        //Primer argumento, nombre del evento que queremos emitir
        io.emit( 'message', { admin: 'Nuevo mensaje' });
    });*/

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
