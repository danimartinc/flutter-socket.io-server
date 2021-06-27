///Función encargada de generar el JSON Web Token, para aceder a nuestra aplicación
//JWT trabaja con callbacks y no con promesas
const jwt = require('jsonwebtoken');

//Función que permite generar un JWT para cada usuario
//Recibo por argumento el uid y name, que se coloca en el payload del Token
const generateJWT = ( uid, name ) => {

    //Si el Token es manipulado desde su creación ya no es valido

    //Devuelvo una promesa, similar al Future en Dart
    return new Promise( ( resolve, reject ) => {
        //Payload del JWT, que inserto en el JWT
        const payload = { uid, name };

        //Generamos el JWT
        //sign(), nos permite firmar el Token
        //PRIVATE_KEY, palabra unica que defino como variable de entorno, SECRET_JWT_SEED
        //Tercer argumento, objeto con caractersticas del Token, permite firmar o alterar la duracion del Token
        jwt.sign( payload, process.env.JWT_KEY, {
            //Tiempo en el que se mantiene el Token activo
            expiresIn: '2h'
        }, ( error, token ) =>{
            //Callback que se dispara en caso de error

            //Comprobamos que exista un error
            if( error ){
                console.log( error );
                //reject, el cual dispara el catch
                reject('No se pudo generar el JWT');
            }else{  
                resolve( token );
            }

        });

    });
}

//Funcíón que nos permite verificar el JWT, obteniendo el uid del payload, mediante el uid en MongoDB puedo obtener quién es el usuario que se conecta/desconecta del Socket
const checkJWT = ( token = '' ) => {

    try {
        //Extraemos el UID del payload del JWT
        //Segundo argumento, Secret Private Key
        //Si no hace match(), se dispara el catch
        const { uid } = jwt.verify( token, process.env.JWT_KEY );

        //Si hace match, se retorna en la primera posición del array, un ture, todo esta correcto.
        //En la segunda posición, devolvemos el UID
        return [ true, uid ];
        
    } catch (error) {
        //Devolvemos el UID en null
        return [ false, null ];
        
    }
    
}

module.exports = {
    //checkJWT,
    generateJWT,
}