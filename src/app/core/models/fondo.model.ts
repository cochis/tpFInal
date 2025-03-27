export class Fondo {
    constructor(
        public nombre: string,
        public tipo: string,
        public value: string,
        public img: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}