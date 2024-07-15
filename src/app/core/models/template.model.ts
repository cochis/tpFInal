import { ModuloTemplate } from "./moduloTemplate.model";

export class Template {
    constructor(
        public nombre: string,
        public evento: string,
        public modulos: [ModuloTemplate],
        public usuarioCreated: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}

