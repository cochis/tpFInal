export class Ticket {

    constructor(
        public nombre: string,
        public fiesta: string,
        public tipoEvento: string,
        public tipoGrupo: string,
        public grupoNombre: string,
        public mesa: string,
        public img: string,
        public cantidad: number,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}