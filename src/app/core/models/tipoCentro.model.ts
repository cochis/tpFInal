export class TipoCentro {
    constructor(
        public nombre: string,
        public clave: string,
        public descripcion: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}