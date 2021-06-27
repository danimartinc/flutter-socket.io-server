//Clase para manejar la instancia de la band

//Extraemos la version 4 de uuid que permite generar ID automaticos
const { v4: uuidV4 } = require('uuid');

class Band {

    //'no-name', valor por defecto si no hay un nombre establecido
    constructor( name = 'no-name' ) {
        //Cada vez que se crea una instancia de Band, se genera un ID único
        this.id   = uuidV4(); 
        this.name = name;
        //Inicializo el nuúmero de votos a 0
        this.votes = 0
    }
}

//Exportamos la clase
module.exports = Band;

