//Modelo de usuario
const { Schema, model } = require('mongoose');

//UsuarioSchema, nos permite para estableces los campos que queremos almacenar
//El equivalente a las columnas de las entidades en una base de datos relacional
const UserSchema = new Schema({

    name: {
        type: String,
        //Indicamos que es un campo obligatorio
        required: true
    },
    email: {
        type: String,
        //Indicamos que es un campo obligatorio
        required: true,
        //Indicamos que tiene que tener un valor único
        unique: true
    },
    password: {
        type: String,
        //Indicamos que es un campo obligatorio
        required: true
    },
    //Si online está en true o false, indica si el usuario está online/offline
    online: {
        type: Boolean,
        //Por defecto, cuando creo el usuario es false, cuando se conecta el usuario es true
        default: false
    }

});

//Método que permite serializar el usuario, ya que lo envio a un Servicio REST, y que este se devuelva en formato JSON
UserSchema.method('toJSON', function(){
    //Se extraen mediante desestructuración, los parámetros del objeto User
    //__v, versión que genera internamente Mongoose
    //id_, ID de la database que genera Mongoose
    //El resto de propiedades las almaceno en un objeto llamado Object
    const { __v, _id, password, ...object } = this.toObject();
    //Le asigno al Object la propiedad UID, renombrando al _id
    object.uid = _id;

    return object;
});

//Exportamos el modelo
//Segundo argumento, esquema que hemos definido
module.exports = model('User', UserSchema );
