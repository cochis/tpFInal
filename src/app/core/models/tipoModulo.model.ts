export class TipoModulo {
    constructor(
        public nombre: string,
        public clave: string,
        public values: object,
        public usuarioCreated: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}



