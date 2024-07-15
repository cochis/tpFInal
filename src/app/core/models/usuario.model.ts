export class Usuario {
    constructor(
        public nombre: string,
        public apellidoPaterno: string,
        public apellidoMaterno: string,
        public email: string,
        public password: string,
        public img: string,
        public role: string,
        public salon: [string],
        public cantidadFiestas: number,
        public paqueteActual: string,
        public google: boolean,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid: string
    ) { }
}