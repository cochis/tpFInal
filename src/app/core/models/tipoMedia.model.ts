export class TipoMedia {
    constructor(
        public nombre: string,
        public clave: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}