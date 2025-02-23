export class EstatusCotizacion {
    constructor(
        public nombre: string,
        public clave: string,
        public step: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}