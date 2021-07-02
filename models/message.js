//Modelo para el mensaje del Chat
const { Schema, model } = require('mongoose');

//UsuarioSchema, nos permite para estableces los campos que queremos almacenar
//El equivalente a las columnas de las entidades en una base de datos relacional
const MessageSchema = new Schema({

    from: {
        //Tipo objeto de la database
        type: Schema.Types.ObjectId,
        //Referencia al modelo
        ref: 'User',
        //Indicamos que es un campo obligatorio
        required: true
    },
    for: {
        //Tipo objeto de la database
        type: Schema.Types.ObjectId,
        //Referencia al modelo
        ref: 'User',
        //Indicamos que es un campo obligatorio
        required: true,
    },
    message: {
        type: String,
        //Indicamos que es un campo obligatorio
        required: true
    }

    //Fecha de la base de datos
}, {
        timestamps: true
});

//Método que permite serializar el usuario, ya que lo envio a un Servicio REST, y que este se devuelva en formato JSON
MessageSchema.method('toJSON', function(){
    //Se extraen mediante desestructuración, los parámetros del objeto User
    //__v, versión que genera internamente Mongoose
    //id_, ID de la database que genera Mongoose
    //El resto de propiedades las almaceno en un objeto llamado Object
    const { __v, _id, ...object } = this.toObject();
    return object;
});

//Exportamos el modelo
//Segundo argumento, esquema que hemos definido
module.exports = model('Message', MessageSchema );
