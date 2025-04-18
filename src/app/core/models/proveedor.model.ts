
export class Proveedor {
    constructor(
        public nombre: string,
        public clave: string,
        public bannerImg: string,
        public img: any,
        public calificacion: [Object],
        public descripcion: string,
        public redes: [Object],
        public contactos: [Object],
        public colores: [Object],
        public ubicacion: string,
        public lng: string,
        public lat: string,
        public enviosOk: boolean,
        public envios: string,
        public descripcionEnvios: string,
        public ubicaciones: [string],
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string,
    ) { }
}

