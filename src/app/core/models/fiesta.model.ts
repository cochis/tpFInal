export class Fiesta {
    constructor(
        public nombre: string,
        public evento: string,
        public cantidad: number,
        public fecha: number,
        public calle: string,
        public numeroExt: string,
        public numeroInt: string,
        public municipioDelegacion: string,
        public coloniaBarrio: string,
        public cp: number,
        public estado: string,
        public pais: string,
        public comoLlegar: string,
        public salon: any,
        public usuarioFiesta: any,
        public img: string,
        public invitacion: string,
        public realizada: boolean,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string,
        public _id?: string
    ) { }
}

