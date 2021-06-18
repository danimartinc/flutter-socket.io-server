//Clase que mantiene un array de bandas, en el cual podemos desplegar el CRUD
//JS basado en clases

const Band = require("./band");

class BandList {

    constructor() {
        //Array de bandas
        this.bands = [];
    }

    //Metodo para añadir una nueva banda
    addBand( band = new Band() ) {
        this.bands.push( band );
    }

    //Metodo para eliminar las bandas
    deleteBand( id = '' ) {
        //Mediante filter() realizo el filtrado con la condición especificada
        //Devuelvo todas las bandas cuyo ID sea distinto al que recibo por argumento, al devolver un ture realiza el filtrado
        this.bands = this.bands.filter( band => band.id !== id );
        return this.bands;
    }

    //Devolvemos el contenido del array de bandas
    getBands() {
        return this.bands;
    }

    //Metodo para incrementar el voto de cada banda
    voteBand( id = '' ) {
        //Recorro el array mediante map(), busco la banda por el ID y le incremento un voto a esa banda
        //map() recorre un array y devuelve el array modificado
        this.bands = this.bands.map( band => {
            //Si el ID del array es exactamente el mismo al que recibo por argumento
            if( band.id === id ){
                band.votes += 1;
                return band;
            }else{
                return band;
            }
        });

    }

    //Metodo para modificar le nombre de la banda
    changeBandName( id, newName) {
        //Recorro el array mediante map(), busco la banda por el ID y le incremento un voto a esa banda
        //map() recorre un array y devuelve el array modificado
        this.bands = this.bands.map( band => {
            //Si el array es exactamente el mismo
            if( band.id === id ){
                band.name = newName;
            }

            return band;
        });
    }
}

module.exports = BandList;