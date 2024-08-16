export class Parametro {
    constructor(
        public nombre: string,
        public type: string,
        public value: string,
        public clave: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}