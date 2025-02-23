export class Calificacion {
    constructor(
        public cotizacion: string,
        public calificacionPlat: number,
        public comentarios: string,
        public productos: object,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: any,
        public lastEdited: any,
        public uid?: string
    ) { }
}