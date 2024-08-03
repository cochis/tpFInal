export class Paquete {
    constructor(
        public nombre: string,
        public tipo: string,
        public tipoCosto: string,
        public tipoPaquete: string,
        public tipoVigencia: string,
        public typeOfVigencia: string,
        public vigencia: string,
        public clave: string,
        public value: number,
        public costo: number,
        public img: string,
        public descripciones: [descripcion],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}

class descripcion {
    constructor(
        public info: string
    ) { }
}