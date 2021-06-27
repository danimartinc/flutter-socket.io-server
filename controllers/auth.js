//Controllers, funciones que tengo definidas en las peticiones de mis rutas

const { response }   = require('express');
const User           = require('../models/User');
const bcrypt         = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');


//Primer argumento, especificamos la ruta
//Segundo argumento, callback
//Request, peticion que solicita el usuario
//Response, respuesta que da el servidor al usuario

//Petición GET, implemetamos el async-await ya que es una petición asíncrona, lo realizamos de esta manera ya que la petición a la database se realiza de manera asícnrona
const createUser = async ( req, res = response ) => {

    //Desectructuramos el body para obtener el email y password del req.body
    const { email, password } = req.body;
    
    try {
        
        //Indico que es el email que recibo en el req.body
        //findOne() devuelve una promesa, busco el elemento a través de la condición que le paso por argumento, en este caso por email
        let user = await User.findOne({ email });

        ////Compruebo si el email introducido ya pertenece a un usuario registrado en la app, si es así muestro un error al usuario
        if( user ){
            //Status 400: Bad Request
            return res.status(400).json({
                ok: false,
                msg: 'Ya existe un usuario asociado a ese email'
            });
        }
        
        //Creamos una nueva instancia del modelo User
        //Envio como argumento el contenido del body, al pasarlo como arrgumento filtar el contenido innecesario. Se envia name, email, password
        user = new User( req.body );

        //Encriptar contraseña, mediante el metodo hashing de una sola vía
        //Segmento de numeros aleatorio generado para realizar la encriptación
        //Salt, cantidad de vueltas que podemos ejecutar para hashear el password, generadas de forma aleatoria
        //Mediante genSaltSync(), realizamos el proceso de manera síncrona para evitar hacer un callback()
        const salt = bcrypt.genSaltSync();
        //Realizamos el encriptado de la contraseña
        user.password = bcrypt.hashSync( password, salt );

        //Una vez que realizamos el hasheo, queremos autenticar al usuario mediante un Json Web Token

        //Para almacenar el User en la database
        //Tarea asíncrona que devuelve una promesa, Future, por lo que podemos trabajar con async-await. Se espera a que se guarde el user.
        await user.save();

        //Generamos el JSON Web Token, async-await dado que hay que esperar a que se genere la respuesta
        const token = await generateJWT( user.id, user.name );
        
        //Muestro la respuesta al cliente
        //No hace falta indicar el return porque es la parte final del codigo
        //Status 201, indica que el usuario ha sido creado correctamente
        res.json({
            ok: true,
            //Cuando envío la instancia de user, lo serializo a JSON
            user,
            token
        });
        
    } catch (error) {
        console.log(error);
        //Si se muestra el error por problema interno del servidor
        //Status 500: Internal Server Error
        res.status(500).json({
            ok: false,
            msg: 'Por favor, contacte con el administrador'
        });
        
    }
}

//PETICIÓN GET
const loginUser = async( req, res = response ) => {

    //Desectructuramos el body para obtener email y password
    const { email, password } = req.body;

    try {
        //Comprobamos si tenemos un user con ese email
        //Indico que es el email que recibo en el req.body
        //findOne() devuelve una promesa
        const user = await User.findOne({ email });
        //Compruebo que si el usuario existe, muestro un error al usuario en el caso de que
        if( !user ){
            return res.status(400).json({
                ok: false,
                msg: 'No existe ningún usuario con ese email'
            });
        }
    
        //Validar los password
        //Comparo el password que acaba de introducir el usuario con el password que esta almacenado en la base de datos
        //compareSync(), si hace el match devuleve true, en caso contrario false
        const validPassword = bcrypt.compareSync( password, user.password );

        if( !validPassword ){
            //Mostramos el error
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            });
        }

        //Generamos el JSON Web Token, nos permite controlar el estado de la sesión del usuario de forma pasiva
        const token = await generateJWT( user.id, user.name );

        //Muestro la respuesta al cliente
        //No hace falta indicar el return porque es la parte final del codigo
        //Status 201, indica que el usuario ha sido creado correctamente
        res.json({
            ok: true,
            //Cuando envío la instancia de user, lo serializo a JSON
            user,
            token
        });
      
    } catch (error) {
        //Manejo la excepcion
        console.log(error);
        //Si no se muestra el error status 500
        res.status(500).json({
            ok: false,
            msg: 'Por favor, contacte con el administrador'
        }); 
    }
}

//PETICION POST
//Nos permite revalidar el Token cada 2 horas, mientras el usuario permanezca activo
const renewToken = async( req, res= response ) => {

    //Obtengo el uid, name de la request mediante desestruturacion de la request
    const uid  = req.uid;

    //Generamos el JSON Web Token, nos permite controlar el estado de la sesion del usuario de forma pasiva
    const token = await generateJWT( uid );

    //Obtenemos el usuario por UID
    const user = await User.findById( uid );

    //Necesito dar respuesta al cliente
    //Doy respuesta al cliente
    res.json({
        ok: true,
        user,
        token
    });
}

//Exportamos las funciones
module.exports = {
    createUser,
    loginUser,
    renewToken
}


//CustomMiddleware, funcion que quiero implementar en el array de errors de las validaciones