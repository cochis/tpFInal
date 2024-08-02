export class Compra {
    constructor(
        public compra: object,
        public session: object,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}