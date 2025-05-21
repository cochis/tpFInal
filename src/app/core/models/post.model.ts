export class Post {
    constructor(
        public titulo: string,
        public contenido: string,
        public autor: string,
        public img: string,
        public usuarioCreated: any,
        public activated: boolean,
        public dateCreated: number,
        public lastEdited: number,
        public uid?: string
    ) { }
}