export class StatusCompra {
    constructor(
        public nombre: string,
        public clave: string,
        public step: number,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}