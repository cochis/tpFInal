export class TipoCantidad {
    constructor(
        public nombre: string,
        public clave: string,
        public value: number,
        public costo: number,
        public descripcion: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}