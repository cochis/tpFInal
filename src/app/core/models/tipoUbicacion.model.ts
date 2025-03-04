export class TipoUbicacion {
    constructor(
        public nombre: string,
        public clave: string,
        public roles: [string],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}