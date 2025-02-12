export class ImgItem {
    constructor(
        public nombre: string,
        public isPrincipal: boolean,
        public tipoMedio: string,
        public item: string,
        public img: string,
        public descripcion: string,
        public idx: number,
        public type: number,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}