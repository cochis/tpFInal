export class Invitacion {
    constructor(
        public fiesta: string,
        public data: object,
        public tipoTemplate: string,
        public usuarioFiesta: string,
        public templateActivate: boolean,
        public usuarioCreated: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid: string
    ) { }
}