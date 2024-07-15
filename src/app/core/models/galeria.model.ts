export class Galeria {
    constructor(
        public fiesta: string,
        public boleto: string,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public img?: string,
        public uid?: string
    ) { }
}