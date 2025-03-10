export class MailTemplate {
    constructor(
        public nombre: string,
        public clave: string,
        public email: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}