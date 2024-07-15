export class Compra {
    constructor(
        public usuario: string,
        public status: string,
        public paquete: string,
        public cantidadFiestas: number,
        public costo: number,
        public iva: number,
        public paypalData: object,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}