//Configuracion para realizar la conexión con la base de datos
const mongoose = require('mongoose');

//Función asincrona que nos permite realziar la cadena de conexión con la databases
const dbConnection = async() => {

    try {
       //Realizo la conexión con la database mediante una promesa, la cual retorna un Future ya que es un proceso asícrono
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });
        //Indico que la conexion se ha realizado con exito
        console.log('DB Online');
        
    } catch (error) {
        console.log(error);
        //Evitamos que continue la ejecucion de la aplicación
        throw new Error('Error a la hora de inicializar DB') 
    }

}

module.exports = {
    dbConnection
}