export class EmailTemplate {
    constructor(
        public nombre: string,
        public clave: string,
        public descripcion: string,
        public template: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}