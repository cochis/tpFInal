export class Contacto {
    constructor(
        public nombre: string,
        public email: string,
        public subject: string,
        public message: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}