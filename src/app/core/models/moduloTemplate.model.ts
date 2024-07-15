export class ModuloTemplate {
    constructor(
        public nombre: string,
        public tipoModulo: string,
        public values: [object],
        public diseno: string,
        public css: string,
        public usuarioCreated: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}

