export class Cotizacion {
    constructor(
        public nombreEvento: string,
        public nombreAnf: string,
        public apellidoPatAnf: string,
        public apellidoMatAnf: string,
        public emailAnf: string,
        public telfonoAnf: string,
        public direccion: string,
        public ubicacion: string,
        public fechaEvento: number,
        public lat: number,
        public lng: number,
        public isAnfitironFestejado: boolean,
        public nombreFes: string,
        public apellidoMatFes: string,
        public apellidoPatFes: string,
        public proveedor: string,
        public productos: object,
        public estatusCotizacion: any,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,


        public uid?: string
    ) { }
}



