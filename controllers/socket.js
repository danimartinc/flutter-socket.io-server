const User = require('../models/User');
const Message = require('../models/message');

//Función que se dispara cuando el cliente realiza la conexión
const authenticatedUser = async ( uid = '' ) => {

    //Realizamos la búsqueda del usuario mediante el UID recibido, y obtenemos su información
    const user  = await User.findById( uid );
    //Establecemos al usuario en estado online en true
    user.online = true;
    //Guardamos el usuario en la database
    await user.save();
    return user;
}

//Función que se dispara cuando el cliente realiza la desconexión
const disconnectedUser = async ( uid = '' ) => {
  //Realizamos la búsqueda del usuario mediante el UID recibido, y obtenemos su información
  const user  = await User.findById( uid );
  //Establecemos al usuario en estado online en true, indicando que está offline
  user.online = false;
  //Guardamos el usuario en la database
  await user.save();
  return user;
}

//Método para guardar el mensaje en la database de Mongoose
//Recibo como argumento el payload que contiene la informaciñon del mensaje
const saveMessage = async( payload ) => {

  /* Formato del payload
      payload: {
          from: '',
          for: '',
          text: ''
      }
  */

  try {
      const message = new Message( payload );
      //Guardamos el mensaje en la base de datos
      await message.save();

      return true;
  } catch (error) {
    //En caso de que no se guarde el mensaje correctamente
    return false;
  }

}


module.exports = {
    authenticatedUser,
    disconnectedUser,
    saveMessage
}
