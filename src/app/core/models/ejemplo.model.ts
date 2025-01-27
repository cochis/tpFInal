export class Ejemplo {
    constructor(
        public nombre: string,
        public urlFiestaBoleto: string,
        public fiesta: string,
        public tipo: string,
        public recomendacion: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}