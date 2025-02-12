export class TipoContacto {
    constructor(
        public nombre: string,
        public icon: string,
        public value: string,
        public descripcion: string,
        public activated: boolean,
        public usuarioCreated: any,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}