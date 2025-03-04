export class Salon {
    constructor(
        public nombre: string,
        public direccion: string,
        public calle: string,
        public numeroExt: string,
        public numeroInt: string,
        public municipioDelegacion: string,
        public coloniaBarrio: string,
        public cp: string,
        public estado: string,
        public pais: string,
        public comoLlegar: string,
        public lat: Float32Array,
        public long: Float32Array,
        public telefono: number,
        public email: string,
        public ubicacionGoogle: string,
        public img: string,

        public tipoUbicacion: string,

        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid: string
    ) { }
}