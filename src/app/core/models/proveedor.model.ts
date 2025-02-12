
export class Proveedor {
    constructor(
        public nombre: string,
        public clave: string,
        public bannerImg: string,
        public img: any,
        public calificacion: [Object],
        public descripcion: string,
        public contactos: [Object],
        public colores: [Object],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string,
    ) { }
}

