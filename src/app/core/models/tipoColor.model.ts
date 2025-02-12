export class TipoColor {
    constructor(
        public nombre: string,
        public clave: string,
        public value: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}